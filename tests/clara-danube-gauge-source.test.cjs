'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('id="page-map"');
const end = html.indexOf('<section id="page-locks"', start);
const mapSection = html.slice(start, end);

test('offers a clearly attributed external Danube gauge map without displaying unverified levels', () => {
  assert.ok(start >= 0 && end > start, 'The Danube map section must exist');
  assert.match(mapSection, /Clara zeigt hier absichtlich noch keine Messzahlen/);
  assert.match(mapSection, /Messstelle eindeutig dem jeweiligen Flussabschnitt zugeordnet/);
  assert.match(mapSection, /Quelle sowie Messzeit geprüft/);
  assert.match(mapSection, /konkrete Station und ihren Zeitstempel prüfen/);
  assert.match(mapSection, /href="https:\/\/danubealert\.arcm\.ro\/de\/map" target="_blank" rel="noopener noreferrer"/);
  assert.match(mapSection, /href="https:\/\/danubealert\.arcm\.ro\/de\/developers" target="_blank" rel="noopener noreferrer"/);
});
