'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const app = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'clara-app.js'), 'utf8');
const start = app.indexOf('async function loadCityWeather(){');
const end = app.indexOf(String.fromCharCode(10) + 'function placeCard(', start);

test('loads current Open-Meteo weather for all visible destinations with their own time zones', async () => {
  assert.notEqual(start, -1, 'Open-Meteo weather loader must exist');
  assert.ok(end > start, 'Open-Meteo weather loader must be isolated for testing');

  const placesStart = app.indexOf('const places=[');
  const placesEnd = app.indexOf('];', placesStart);
  assert.notEqual(placesStart, -1, 'Destination coordinates must exist');
  const places = vm.runInNewContext(app.slice(app.indexOf('=', placesStart) + 1, placesEnd + 1));
  const timezoneStart = app.indexOf('const cityTimeZones=');
  const timezoneEnd = app.indexOf('};', timezoneStart);
  assert.notEqual(timezoneStart, -1, 'Destination time zones must exist');
  const cityTimeZones = vm.runInNewContext(app.slice(app.indexOf('=', timezoneStart) + 1, timezoneEnd + 1));

  const cards = places.map(place => {
    const weather = { textContent: 'Wird geladen …' };
    const updated = { textContent: '' };
    return {
      dataset: { cityLive: place.name },
      getClientRects: () => [{}],
      querySelector: selector => selector === '[data-live-weather]' ? weather : selector === '[data-live-updated]' ? updated : null,
      weather,
      updated
    };
  });
  const requests = [];
  const sandbox = {
    document: { querySelectorAll: () => cards },
    places,
    cityTimeZones,
    claraLang: () => 'de',
    currentClaraLocale: () => 'de-DE',
    liveLabels: { de: { weather: 'Wetterstand', weatherUnavailable: 'Aktuell nicht verfügbar', weatherError: 'Wetterdaten konnten nicht geladen werden.', clock: 'Uhr', retrieved: 'Abruf' } },
    weatherLabels: { de: { 0: 'Klar' } },
    fetch: async (url, options) => {
      requests.push({ url, options });
      return { ok: true, json: async () => ({ current: { temperature_2m: 12.4, weather_code: 0, time: '2026-11-07T13:00' } }) };
    },
    AbortController,
    setTimeout,
    clearTimeout,
    Intl,
    Date,
    encodeURIComponent
  };
  vm.runInNewContext(app.slice(start, end) + String.fromCharCode(10) + 'globalThis.__loadCityWeather = loadCityWeather;', sandbox);
  await sandbox.__loadCityWeather();

  assert.equal(requests.length, 13, 'Every visible destination must receive a weather request');
  for (const [index, request] of requests.entries()) {
    const place = places[index];
    const url = new URL(request.url);
    assert.equal(url.searchParams.get('latitude'), String(place.lat));
    assert.equal(url.searchParams.get('longitude'), String(place.lon));
    assert.equal(url.searchParams.get('timezone'), cityTimeZones[place.name]);
    assert.equal(request.options.cache, 'no-store');
    assert.ok(request.options.signal instanceof AbortSignal, 'Every request must be abortable');
  }
  for (const card of cards) {
    assert.equal(card.weather.textContent, 'Klar · 12 °C');
    assert.match(card.updated.textContent, /13:00/);
    assert.match(card.updated.textContent, /Open-Meteo/);
    assert.match(card.updated.textContent, /Abruf/);
  }
});

test('aborts a stalled Open-Meteo request and displays a useful unavailable state', async () => {
  assert.notEqual(start, -1, 'Open-Meteo weather loader must exist');
  assert.ok(end > start, 'Open-Meteo weather loader must be isolated for testing');
  const source = app.slice(start, end).replace('15000', '10');
  assert.ok(source.includes('new AbortController()'), 'Weather requests must use AbortController');
  assert.ok(source.includes('clearTimeout(timeout)'), 'Weather timeout must always be cleared');

  const card = {
    dataset: { cityLive: 'Passau' },
    getClientRects: () => [{}],
    weather: { textContent: 'Wird geladen …' },
    updated: { textContent: '' },
    querySelector(selector) { return selector === '[data-live-weather]' ? this.weather : selector === '[data-live-updated]' ? this.updated : null; }
  };
  let aborted = false;
  const sandbox = {
    document: { querySelectorAll: () => [card] },
    places: [{ name: 'Passau', lat: 48.57, lon: 13.46 }],
    cityTimeZones: { Passau: 'Europe/Berlin' },
    claraLang: () => 'de',
    currentClaraLocale: () => 'de-DE',
    liveLabels: { de: { weather: 'Wetterstand', weatherUnavailable: 'Aktuell nicht verfügbar', weatherError: 'Wetterdaten konnten nicht geladen werden.', clock: 'Uhr', retrieved: 'Abruf' } },
    weatherLabels: { de: { 0: 'Klar' } },
    fetch: (_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => {
        aborted = true;
        const error = new Error('Open-Meteo request aborted');
        error.name = 'AbortError';
        reject(error);
      }, { once: true });
    }),
    AbortController,
    setTimeout,
    clearTimeout,
    Intl,
    Date,
    encodeURIComponent
  };
  vm.runInNewContext(source + String.fromCharCode(10) + 'globalThis.__loadCityWeather = loadCityWeather;', sandbox);
  await sandbox.__loadCityWeather();

  assert.equal(aborted, true, 'A stalled request must be aborted after the deadline');
  assert.equal(card.weather.textContent, 'Aktuell nicht verfügbar');
  assert.equal(card.updated.textContent, 'Wetterdaten konnten nicht geladen werden.');
});

test('reports an Open-Meteo HTTP error instead of leaving a destination in loading state', async () => {
  const source = app.slice(start, end);
  const card = {
    dataset: { cityLive: 'Passau' },
    getClientRects: () => [{}],
    weather: { textContent: 'Wird geladen …' },
    updated: { textContent: '' },
    querySelector(selector) { return selector === '[data-live-weather]' ? this.weather : selector === '[data-live-updated]' ? this.updated : null; }
  };
  const sandbox = {
    document: { querySelectorAll: () => [card] },
    places: [{ name: 'Passau', lat: 48.57, lon: 13.46 }],
    cityTimeZones: { Passau: 'Europe/Berlin' },
    claraLang: () => 'de',
    currentClaraLocale: () => 'de-DE',
    liveLabels: { de: { weather: 'Wetterstand', weatherUnavailable: 'Aktuell nicht verfügbar', weatherError: 'Wetterdaten konnten nicht geladen werden.', clock: 'Uhr', retrieved: 'Abruf' } },
    weatherLabels: { de: { 0: 'Klar' } },
    fetch: async () => ({ ok: false, status: 503 }),
    AbortController,
    setTimeout,
    clearTimeout,
    Intl,
    Date,
    encodeURIComponent
  };
  vm.runInNewContext(source + String.fromCharCode(10) + 'globalThis.__loadCityWeather = loadCityWeather;', sandbox);
  await sandbox.__loadCityWeather();

  assert.equal(card.weather.textContent, 'Aktuell nicht verfügbar');
  assert.equal(card.updated.textContent, 'Wetterdaten konnten nicht geladen werden.');
});
