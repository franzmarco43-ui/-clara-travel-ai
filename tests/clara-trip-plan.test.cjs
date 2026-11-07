'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const appPath = path.join(__dirname, '..', 'assets', 'js', 'clara-app.js');
const app = fs.readFileSync(appPath, 'utf8');
const start = app.indexOf('function currentClaraTripPlan(){');
const end = app.indexOf('\\nasync function saveClaraTripPlan()', start);

assert.notEqual(start, -1, 'The current trip-plan builder must exist');
assert.ok(end > start, 'The trip-plan builder must be isolated from cloud persistence');
const builderSource = app.slice(start, end).trim();

function createHarness(values = {}) {
  const controls = {
    destination: { value: values.destination ?? 'Wien' },
    duration: { value: values.duration ?? '3 Tage' },
    interest: { value: values.interest ?? 'Kultur & Geschichte' },
    pace: { value: values.pace ?? 'Ausgewogen' },
    mobility: { value: values.mobility ?? 'Keine besondere Angabe' },
    planResult: { innerHTML: values.existingHtml ?? '<div>Alter Reiseplan</div>' }
  };
  let renderCount = 0;
  let renderedValues = null;
  let toastMessage = '';
  const builder = vm.runInNewContext('(' + builderSource + ')', {
    document: { getElementById: id => controls[id] || null },
    makePlan() {
      renderCount += 1;
      renderedValues = {
        destination: controls.destination.value,
        duration: controls.duration.value,
        interest: controls.interest.value,
        pace: controls.pace.value,
        mobility: controls.mobility.value
      };
    },
    toast(message) { toastMessage = message; }
  });
  return {
    controls,
    builder,
    get renderCount() { return renderCount; },
    get renderedValues() { return renderedValues; },
    get toastMessage() { return toastMessage; }
  };
}

test('rebuilds a previously rendered itinerary from the current planner controls before saving', () => {
  const harness = createHarness({
    destination: 'Wien',
    duration: '7 Tage',
    interest: 'Kulinarik & Märkte',
    pace: 'Entspannt',
    mobility: 'Rollator',
    existingHtml: '<div>Veralteter Reiseplan für Passau</div>'
  });

  const plan = harness.builder();

  assert.equal(harness.renderCount, 1);
  assert.deepEqual(harness.renderedValues, {
    destination: 'Wien',
    duration: '7 Tage',
    interest: 'Kulinarik & Märkte',
    pace: 'Entspannt',
    mobility: 'Rollator'
  });
  assert.equal(plan.destination, 'Wien');
  assert.equal(plan.duration, '7 Tage');
  assert.equal(plan.interest, 'Kulinarik & Märkte');
  assert.equal(plan.pace, 'Entspannt');
  assert.equal(plan.mobility, 'Rollator');
  assert.ok(plan.id.startsWith('trip-'));
  assert.doesNotThrow(() => new Date(plan.savedAt).toISOString());
  assert.equal(harness.toastMessage, '');
});

test('does not create or render a plan when no destination is selected', () => {
  const harness = createHarness({ destination: '' });

  assert.equal(harness.builder(), null);
  assert.equal(harness.renderCount, 0);
  assert.match(harness.toastMessage, /Bitte wähle zuerst ein Reiseziel/);
});

test('supports local trip-plan save, load, and delete without a signed-in account', async () => {
  const storage = new Map();
  const controls = {
    destination: { value: 'Wien' },
    duration: { value: '3 Tage' },
    interest: { value: 'Kultur & Geschichte' },
    pace: { value: 'Ausgewogen' },
    mobility: { value: 'Keine besondere Angabe' },
    planResult: { innerHTML: '' },
    planSaveStatus: { textContent: '' }
  };
  const select = {
    value: '',
    innerHTML: '',
    options: [],
    appendChild(option) { this.options.push(option); }
  };
  const documentMock = {
    getElementById(id) { return id === 'savedTripPlans' ? select : controls[id] || null; },
    createElement(tag) { return { tag, value: '', textContent: '' }; }
  };
  const localStorageMock = {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); }
  };
  const blockStart = app.indexOf('const CLARA_TRIP_STORAGE_KEY=');
  const blockEnd = app.indexOf('\\nfunction loadClaraVoices()', blockStart);
  assert.notEqual(blockStart, -1, 'Local and cloud trip-plan persistence must exist');
  assert.ok(blockEnd > blockStart, 'Trip-plan persistence block must be isolated for testing');
  const persistenceSource = app.slice(blockStart, blockEnd);
  const sandbox = {
    document: documentMock,
    localStorage: localStorageMock,
    window: {},
    confirm: () => true,
    toast() {},
    makePlan() {},
    console: { warn() {}, error() {} }
  };
  vm.runInNewContext(
    'let claraUser = null;\\n' + persistenceSource +
    '\\nglobalThis.__tripPlanApi = { saveClaraTripPlan, loadClaraTripPlan, deleteClaraTripPlan };',
    sandbox
  );
  const api = sandbox.__tripPlanApi;

  await api.saveClaraTripPlan();
  const key = 'clara.travel.savedTrips.v1.guest';
  const saved = JSON.parse(storage.get(key));
  assert.equal(saved.length, 1);
  assert.equal(saved[0].destination, 'Wien');
  assert.equal(saved[0].duration, '3 Tage');
  assert.match(controls.planSaveStatus.textContent, /lokal gespeichert/);

  select.value = saved[0].id;
  await api.loadClaraTripPlan();
  assert.equal(controls.destination.value, 'Wien');
  assert.equal(controls.duration.value, '3 Tage');
  assert.equal(controls.interest.value, 'Kultur & Geschichte');
  assert.equal(controls.pace.value, 'Ausgewogen');

  select.value = saved[0].id;
  await api.deleteClaraTripPlan();
  assert.deepEqual(JSON.parse(storage.get(key)), []);
  assert.match(controls.planSaveStatus.textContent, /gelöscht/);
});
