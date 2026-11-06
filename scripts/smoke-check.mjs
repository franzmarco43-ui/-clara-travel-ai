import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const read = path => readFileSync(path, 'utf8');
const html = read('index.html');
const app = read('assets/js/clara-app.js');
const sw = read('sw.js');
const manifest = JSON.parse(read('manifest.webmanifest'));
const destinations = JSON.parse(read('netlify/functions/data/danube-destinations.json'));
const locks = JSON.parse(read('netlify/functions/data/danube-locks.json'));

for (const path of ['assets/js/clara-app.js', 'sw.js']) execFileSync(process.execPath, ['--check', path], { stdio: 'pipe' });
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

assert.equal(manifest.display, 'standalone', 'PWA must support standalone app display');
assert.equal(manifest.scope, '/', 'PWA scope must cover the site');
assert.ok(manifest.icons?.length, 'PWA manifest must define an icon');
assert.ok(manifest.icons.every(icon => existsSync('.' + icon.src)), 'Every PWA icon path must exist');
assert.ok(html.includes('href="/manifest.webmanifest"'), 'HTML must link the PWA manifest');
assert.ok(html.includes("navigator.serviceWorker.register('/sw.js'"), 'HTML must register the service worker');
assert.ok(html.includes('id="pwaInstallButton"'), 'Install action must be present');
assert.ok(sw.includes("url.pathname.startsWith('/.netlify/functions/')"), 'Dynamic Netlify functions must be excluded from offline caching');
assert.ok(sw.includes("request.mode === 'navigate'"), 'Offline navigation fallback must be present');

console.log('Clara Preview 10 smoke checks passed: 13 destinations, 18 locks, JavaScript syntax, PWA manifest, install action, and safe service-worker exclusions.');
