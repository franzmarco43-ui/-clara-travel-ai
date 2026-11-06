import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const read = path => readFileSync(path, 'utf8');
const html = read('index.html');
const app = read('assets/js/clara-app.js');
const sw = read('sw.js');
const mobile = read('mobile-preview.html');
const css = read('assets/css/clara.css');
const manifest = JSON.parse(read('manifest.webmanifest'));
const destinations = JSON.parse(read('netlify/functions/data/danube-destinations.json'));
const locks = JSON.parse(read('netlify/functions/data/danube-locks.json'));

for (const path of [
  'assets/js/clara-app.js',
  'sw.js',
  'netlify/functions/clara-speech.js',
  'netlify/functions/clara-speech-visemes.js',
  'netlify/functions/chat.js'
]) {
  execFileSync(process.execPath, ['--check', path], { stdio: 'pipe' });
}

for (const [index, part] of html.split('<script').slice(1).entries()) {
  const openingEnd = part.indexOf('>');
  if (openingEnd < 0 || part.slice(0, openingEnd).includes('src=')) continue;
  const closing = part.indexOf('</script>');
  if (closing >= 0) new vm.Script(part.slice(openingEnd + 1, closing), { filename: 'index.html:inline-' + index });
}

assert.equal(destinations.records.length, 13, 'Destination knowledge base must contain 13 records');
assert.equal(locks.records.length, 18, 'Lock knowledge base must contain 18 records');
assert.equal(locks.count, 18, 'Declared lock count must match');
assert.ok(destinations.records.every(item => item.name && item.country && Array.isArray(item.sources) && item.sources.length), 'Every destination needs a name, country, and sources');
assert.ok(locks.records.every(item => item.name && Number.isFinite(item.latitude) && Number.isFinite(item.longitude)), 'Every lock needs valid coordinates');
assert.equal(new Set(locks.records.map(item => item.name)).size, 18, 'Lock names must be unique');

const placesStart = app.indexOf('const places=[');
assert.notEqual(placesStart, -1, 'App destination list must exist');
const placesEnd = app.indexOf('];', placesStart);
assert.ok(placesEnd > placesStart, 'App destination list must close');
const placeBlock = app.slice(placesStart, placesEnd);
const appPlaces = placeBlock.split("name:'").slice(1).map(part => part.split("'")[0]);
assert.equal(appPlaces.length, 13, 'App must define all 13 destinations');
assert.equal(new Set(appPlaces).size, 13, 'App destination names must be unique');

assert.deepEqual(
  [...appPlaces].sort(),
  destinations.records.map(item => item.name).sort(),
  'App cards and the destination knowledge base must describe the same 13 places'
);

const timezoneMatch = app.match(/const cityTimeZones\s*=\s*\{([\s\S]*?)\};/);
assert.ok(timezoneMatch, 'Every destination must have a local time-zone map');
const cityTimeZones = vm.runInNewContext('({' + timezoneMatch[1] + '})');
const timezoneEntries = Object.entries(cityTimeZones);
assert.equal(timezoneEntries.length, 13, 'All 13 destinations need a time-zone entry');
assert.equal(new Set(timezoneEntries.map(([city]) => city)).size, 13, 'Time-zone city keys must be unique');
assert.ok(appPlaces.every(name => Object.hasOwn(cityTimeZones, name)), 'Every destination must have a local time zone');
for (const [city, timeZone] of timezoneEntries) {
  assert.ok(appPlaces.includes(city), 'Unexpected time-zone entry: ' + city);
  assert.doesNotThrow(
    () => new Intl.DateTimeFormat('de-DE', { timeZone }).format(new Date('2026-01-01T12:00:00Z')),
    'Invalid IANA time zone for ' + city + ': ' + timeZone
  );
}

assert.ok(app.includes('api.open-meteo.com/v1/forecast'), 'Open-Meteo integration must be present');
assert.ok(app.includes("cache:'no-store'"), 'Weather requests must bypass stale browser cache');
assert.ok(app.includes('15*60*1000'), 'Weather must have a periodic refresh interval');
assert.ok(app.includes("document.addEventListener('visibilitychange'"), 'Weather must refresh when the tab becomes visible');
assert.ok(/function showPage\(page\)/.test(app) && app.includes("if(typeof loadCityWeather==='function')loadCityWeather();"), 'Opening an app page must refresh its visible weather cards');
assert.ok(/function updateCityClocks\s*\(/.test(app), 'Local clocks must be updated by the app');
assert.ok(/async function loadCityWeather\s*\(/.test(app), 'Current weather must be loaded asynchronously');

assert.match(html, /<html lang="de">/, 'German must be the initial document language');
assert.ok(app.includes('clara.language-default-de'), 'The app must migrate first-visit language to German');
assert.ok(html.includes('assets/clara-welcome.mp4'), 'The welcome video source must be wired into the homepage');
assert.ok(existsSync('assets/clara-welcome.mp4'), 'The configured welcome video file must exist');
assert.doesNotMatch(html + app, /(?:SUPABASE_SERVICE_ROLE_KEY|service_role)\s*[:=]\s*['"][^'"]{8,}['"]/i, 'Browser code must never contain a Supabase service-role credential');
assert.doesNotMatch(html + app, /AZURE_SPEECH_KEY|AZURE_SPEECH_REGION/i, 'Azure Speech credentials and server configuration must stay out of browser code');

const expectedWelcomeVideoBlobSha = '742d5da95c9945449866d30438e0b8b215010449';
const welcomeVideoBlobSha = execFileSync('git', ['hash-object', 'assets/clara-welcome.mp4'], { encoding: 'utf8' }).trim();
assert.equal(
  welcomeVideoBlobSha,
  expectedWelcomeVideoBlobSha,
  'The verified optimized welcome video must replace assets/clara-welcome.mp4 before Preview 10 is considered ready'
);

assert.match(mobile, /<meta[^>]+name="viewport"/i, 'Mobile preview must declare a device viewport');
assert.match(mobile, /<iframe[^>]+src="\.\/index\.html"/i, 'Mobile preview must load the shared app');
assert.ok(
  mobile.includes("setOrientation('portrait')") && mobile.includes("setOrientation('landscape')"),
  'Mobile preview must expose portrait and landscape controls'
);
const mobileScripts = [...mobile.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
assert.ok(mobileScripts.length > 0, 'Mobile preview must contain its orientation controller');
mobileScripts.forEach((match, index) => {
  new vm.Script(match[1], { filename: 'mobile-preview.html:inline-' + index });
});
assert.ok(/@media\s*\(\s*max-width:\s*760px\s*\)/.test(css), 'The shared app styles must include a phone breakpoint');
assert.ok(/@media\s*\(\s*max-width:\s*520px\s*\)/.test(css), 'The shared app styles must include a narrow-phone breakpoint');

assert.equal(manifest.display, 'standalone', 'PWA must support standalone app display');
assert.equal(manifest.scope, '/', 'PWA scope must cover the site');
assert.ok(manifest.icons?.length, 'PWA manifest must define an icon');
assert.ok(manifest.icons.every(icon => existsSync('.' + icon.src)), 'Every PWA icon path must exist');
assert.ok(html.includes('href="/manifest.webmanifest"'), 'HTML must link the PWA manifest');
assert.ok(html.includes("navigator.serviceWorker.register('/sw.js'"), 'HTML must register the service worker');
assert.ok(html.includes('id="pwaInstallButton"'), 'Install action must be present');
assert.ok(sw.includes("url.pathname.startsWith('/.netlify/functions/')"), 'Dynamic Netlify functions must be excluded from offline caching');
assert.ok(sw.includes("request.mode === 'navigate'"), 'Offline navigation fallback must be present');

console.log('Clara Preview 10 smoke checks passed: 13 destinations and valid IANA time zones, Open-Meteo integration/refresh wiring (no live API call), 18 locks, German default, mobile preview syntax/layout, verified optimized welcome video, credential boundary, JavaScript syntax, and PWA shell.');
console.log('Verified optimized welcome video is integrated (Git blob ' + welcomeVideoBlobSha + ').');
