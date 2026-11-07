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
const publicLocks = JSON.parse(read('assets/data/danube-locks.json'));

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
assert.ok(locks.records.every(item => item.name && Number.isFinite(item.latitude) && Number.isFinite(item.longitude) && item.latitude >= -90 && item.latitude <= 90 && item.longitude >= -180 && item.longitude <= 180), 'Every lock needs valid geographic coordinates');
assert.equal(new Set(locks.records.map(item => item.name)).size, 18, 'Lock names must be unique');
assert.deepEqual(publicLocks, locks, 'Public lock data and the chat knowledge-base copy must stay identical');
const validatorStart = app.indexOf('function validateDanubeLockData(data)');
const validatorEnd = app.indexOf('\nasync function loadDanubeLocks()', validatorStart);
assert.notEqual(validatorStart, -1, 'Runtime lock-data validator must exist');
assert.ok(validatorEnd > validatorStart, 'Runtime lock-data validator must be isolated for tests');
const validateDanubeLockData = vm.runInNewContext('(' + app.slice(validatorStart, validatorEnd).trim() + ')');
assert.equal(validateDanubeLockData(locks).length, 18, 'Runtime validator must accept the verified 18-lock dataset');
const shortLockData = structuredClone(locks);
shortLockData.records.pop();
shortLockData.count = 17;
assert.throws(() => validateDanubeLockData(shortLockData), /genau 18/, 'Runtime validator must reject incomplete lock data');
const duplicateLockData = structuredClone(locks);
duplicateLockData.records[1].name = duplicateLockData.records[0].name;
assert.throws(() => validateDanubeLockData(duplicateLockData), /doppelte Schleusennamen/, 'Runtime validator must reject duplicate lock names');
const invalidLockData = structuredClone(locks);
invalidLockData.records[0].latitude = 91;
assert.throws(() => validateDanubeLockData(invalidLockData), /ungültige geografische Koordinaten/, 'Runtime validator must reject out-of-range coordinates');

const placesStart = app.indexOf('const places=[');
assert.notEqual(placesStart, -1, 'App destination list must exist');
const placesEnd = app.indexOf('];', placesStart);
assert.ok(placesEnd > placesStart, 'App destination list must close');
const placeBlock = app.slice(placesStart, placesEnd);
const appPlaces = placeBlock.split("name:'").slice(1).map(part => part.split("'")[0]);
const appPlaceRecords = vm.runInNewContext(app.slice(app.indexOf('=', placesStart) + 1, placesEnd + 1));
assert.equal(appPlaceRecords.length, 13, 'App must define all 13 destination records');
assert.ok(appPlaceRecords.every(item => Number.isFinite(item.lat) && Number.isFinite(item.lon) && item.lat >= -90 && item.lat <= 90 && item.lon >= -180 && item.lon <= 180), 'Every destination must have valid weather/map coordinates');
assert.equal(appPlaceRecords.filter(item => item.routeType === 'river').length, 12, 'Exactly 12 destinations must belong to the Danube route');
assert.equal(appPlaceRecords.filter(item => item.routeType === 'excursion').length, 1, 'Puszta must remain a separate land excursion');
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
const htmlLanguageMigration = html.match(/var migration=["']([^"']+)["']/)?.[1];
const appLanguageMigration = app.match(/const defaultLanguageMigration=["']([^"']+)["']/)?.[1];
assert.ok(htmlLanguageMigration && appLanguageMigration, 'Homepage and app must both declare the German-default migration');
assert.equal(appLanguageMigration, htmlLanguageMigration, 'Homepage and app must share one language migration key');
const claraLangStart = app.indexOf('function claraLang(){');
const claraLangEnd = app.indexOf('\nfunction claraCardText', claraLangStart);
assert.notEqual(claraLangStart, -1, 'Clara language preference resolver must exist');
assert.ok(claraLangEnd > claraLangStart, 'Clara language resolver must be isolated for preference tests');
const claraLangSource = app.slice(claraLangStart, claraLangEnd).trim();
function runLanguagePreference(initialValues) {
  const values = new Map(Object.entries(initialValues));
  const storage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); }
  };
  const documentMock = { documentElement: { lang: 'de' }, querySelectorAll: () => [] };
  const resolveLanguage = vm.runInNewContext('(' + claraLangSource + ')', {
    localStorage: storage,
    document: documentMock
  });
  return { language: resolveLanguage(), values, documentLanguage: documentMock.documentElement.lang };
}
assert.equal(runLanguagePreference({}).language, 'de', 'A first visit must default to German');
assert.equal(runLanguagePreference({ 'clara.language': 'fr' }).language, 'de', 'A legacy French default must migrate to German once');
const explicitFrench = runLanguagePreference({
  [htmlLanguageMigration]: '1',
  'clara.language': 'fr'
});
assert.equal(explicitFrench.language, 'fr', 'An explicit language choice after migration must remain persistent');
assert.equal(explicitFrench.documentLanguage, 'fr', 'The document language must follow the saved explicit choice');
assert.ok(html.includes('assets/clara-welcome.mp4'), 'The welcome video source must be wired into the homepage');
assert.ok(existsSync('assets/clara-welcome.mp4'), 'The configured welcome video file must exist');
assert.doesNotMatch(html + app, /(?:SUPABASE_SERVICE_ROLE_KEY|service_role)\s*[:=]\s*['"][^'"]{8,}['"]/i, 'Browser code must never contain a Supabase service-role credential');
assert.doesNotMatch(html + app, /AZURE_SPEECH_KEY|AZURE_SPEECH_REGION/i, 'Azure Speech credentials and server configuration must stay out of browser code');

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

// Keep the binary-asset gate last so every independent code/data/PWA check still runs.
const expectedWelcomeVideoBlobSha = '742d5da95c9945449866d30438e0b8b215010449';
const welcomeVideoBlobSha = execFileSync('git', ['hash-object', 'assets/clara-welcome.mp4'], { encoding: 'utf8' }).trim();
assert.equal(
  welcomeVideoBlobSha,
  expectedWelcomeVideoBlobSha,
  'The verified optimized welcome video must replace assets/clara-welcome.mp4 before Preview 10 is considered ready'
);

console.log('Clara Preview 10 smoke checks passed: 13 destinations and valid IANA time zones, Open-Meteo integration/refresh wiring (no live API call), 18 locks, German default, mobile preview syntax/layout, verified optimized welcome video, credential boundary, JavaScript syntax, and PWA shell.');
console.log('Verified optimized welcome video is integrated (Git blob ' + welcomeVideoBlobSha + ').');
