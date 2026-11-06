import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(path, 'utf8');
const html = read('index.html');
const app = read('assets/js/clara-app.js');
const sw = read('sw.js');
const manifest = JSON.parse(read('manifest.webmanifest'));
const destinations = JSON.parse(read('netlify/functions/data/danube-destinations.json'));
const locks = JSON.parse(read('netlify/functions/data/danube-locks.json'));

new vm.Script(app, { filename: 'assets/js/clara-app.js' });
new vm.Script(sw, { filename: 'sw.js' });
for (const [index, match] of [...html.matchAll(/<script\\b([^>]*)>([\\s\\S]*?)<\\/script>/gi)].entries()) {
  if (!/\\bsrc\\s*=/.test(match[1])) new vm.Script(match[2], { filename: 'index.html:inline-script-' + index });
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
const appPlaces = [...placeBlock.matchAll(/\\{name:'([^']+)'[\\s\\S]*?lat:([-0-9.]+),lon:([-0-9.]+)/g)];
assert.equal(appPlaces.length, 13, 'App must define all 13 destinations with coordinates');
assert.ok(appPlaces.every(match => Number.isFinite(Number(match[2])) && Number.isFinite(Number(match[3]))), 'App destination coordinates must be numeric');

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
