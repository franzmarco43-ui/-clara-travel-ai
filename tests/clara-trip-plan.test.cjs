'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const appPath = path.join(__dirname, '..', 'assets', 'js', 'clara-app.js');
const app = fs.readFileSync(appPath, 'utf8');
const start = app.indexOf('function currentClaraTripPlan(){');
const end = app.indexOf('\nasync function saveClaraTripPlan()', start);

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
  const blockEnd = app.indexOf('\nfunction loadClaraVoices()', blockStart);
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
    'let claraUser = null;\n' + persistenceSource +
    '\nglobalThis.__tripPlanApi = { saveClaraTripPlan, loadClaraTripPlan, deleteClaraTripPlan };',
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


function createCloudHarness({ consent = true, selectedId = '', memories = [] } = {}) {
  const storage = new Map();
  const rows = memories.map(row => ({ ...row }));
  const profileReads = [];
  const memoryOperations = [];
  const toastMessages = [];
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
    value: selectedId,
    _innerHTML: '',
    options: [],
    set innerHTML(value) { this._innerHTML = value; this.options = []; },
    get innerHTML() { return this._innerHTML; },
    appendChild(option) { this.options.push(option); }
  };
  const matches = (row, filters) => filters.every(([key, value]) => row[key] === value);
  const supabase = {
    from(table) {
      if (table === 'clara_profiles') {
        return {
          select() {
            const query = {
              eq() { return query; },
              maybeSingle() {
                profileReads.push(true);
                return Promise.resolve({ data: { consent_memory: consent }, error: null });
              }
            };
            return query;
          }
        };
      }
      if (table === 'clara_memories') {
        let operation = 'select';
        let filters = [];
        const query = {
          select(columns) {
            if (operation === 'delete') {
              const deleted = rows.filter(row => matches(row, filters));
              deleted.forEach(row => rows.splice(rows.indexOf(row), 1));
              memoryOperations.push({ operation: 'delete', filters });
              return Promise.resolve({ data: deleted.map(row => ({ id: row.id })), error: null });
            }
            memoryOperations.push({ operation: 'select', columns, filters });
            return query;
          },
          eq(key, value) { filters.push([key, value]); return query; },
          order() { return query; },
          limit() {
            return Promise.resolve({ data: rows.filter(row => matches(row, filters)).slice(), error: null });
          },
          maybeSingle() {
            const row = rows.find(item => matches(item, filters));
            return Promise.resolve({ data: row ? { content: row.content } : null, error: null });
          },
          insert(payload) {
            const row = {
              id: 'cloud-' + (rows.length + 1),
              user_id: payload.user_id,
              memory_type: payload.memory_type,
              content: payload.content,
              created_at: '2026-11-07T00:00:00.000Z'
            };
            rows.push(row);
            memoryOperations.push({ operation: 'insert', payload });
            return Promise.resolve({ error: null });
          },
          delete() { operation = 'delete'; filters = []; return query; }
        };
        return query;
      }
      throw new Error('Unexpected Supabase table: ' + table);
    }
  };
  const blockStart = app.indexOf('const CLARA_TRIP_STORAGE_KEY=');
  const blockEnd = app.indexOf(String.fromCharCode(10) + 'function loadClaraVoices()', blockStart);
  assert.notEqual(blockStart, -1, 'Local and cloud trip-plan persistence must exist');
  assert.ok(blockEnd > blockStart, 'Trip-plan persistence block must be isolated for cloud tests');
  const persistenceSource = app.slice(blockStart, blockEnd);
  const sandbox = {
    document: {
      getElementById(id) { return id === 'savedTripPlans' ? select : controls[id] || null; },
      createElement() { return { value: '', textContent: '' }; }
    },
    localStorage: {
      getItem(key) { return storage.has(key) ? storage.get(key) : null; },
      setItem(key, value) { storage.set(key, String(value)); }
    },
    window: { claraSupabase: supabase },
    confirm: () => true,
    toast(message) { toastMessages.push(message); },
    makePlan() { controls.planResult.innerHTML = '<div>Aktueller Reiseplan</div>'; },
    console: { warn() {}, error() {} }
  };
  vm.runInNewContext(
    'let claraUser = { id: "user-1" };' + String.fromCharCode(10) + persistenceSource +
    String.fromCharCode(10) + 'globalThis.__tripPlanApi = { saveClaraTripPlan, renderClaraTripPlans, loadClaraTripPlan, deleteClaraTripPlan };',
    sandbox
  );
  return { api: sandbox.__tripPlanApi, storage, rows, controls, select, profileReads, memoryOperations, toastMessages };
}

test('saves a trip plan to the signed-in account only with explicit Memory consent', async () => {
  const harness = createCloudHarness({ consent: true });
  await harness.api.saveClaraTripPlan();

  assert.equal(harness.rows.length, 1);
  assert.equal(harness.rows[0].user_id, 'user-1');
  assert.equal(harness.rows[0].memory_type, 'saved_trip_plan');
  assert.equal(harness.rows[0].content.destination, 'Wien');
  assert.equal(harness.rows[0].content.duration, '3 Tage');
  assert.equal(JSON.parse(harness.storage.get('clara.travel.savedTrips.v1.user-1')).length, 1);
  assert.match(harness.controls.planSaveStatus.textContent, /auf diesem Gerät und in deinem Clara-Konto gespeichert/);
  assert.ok(harness.select.options.some(option => option.value === 'cloud:cloud-1'));
});

test('keeps a trip plan local and does not write cloud memories without consent', async () => {
  const harness = createCloudHarness({ consent: false });
  await harness.api.saveClaraTripPlan();

  assert.equal(harness.rows.length, 0);
  assert.equal(JSON.parse(harness.storage.get('clara.travel.savedTrips.v1.user-1')).length, 1);
  assert.match(harness.controls.planSaveStatus.textContent, /Memory freigeben/);
  assert.equal(harness.memoryOperations.some(item => item.operation === 'insert'), false);
});

test('loads a saved trip plan from the signed-in account', async () => {
  const plan = {
    id: 'trip-cloud-42',
    destination: 'Budapest',
    duration: '7 Tage',
    interest: 'Kulinarik & Märkte',
    pace: 'Entspannt',
    mobility: 'Rollator',
    savedAt: '2026-11-07T00:00:00.000Z'
  };
  const harness = createCloudHarness({
    memories: [{ id: 'cloud-42', user_id: 'user-1', memory_type: 'saved_trip_plan', content: plan, created_at: plan.savedAt }],
    selectedId: 'cloud:cloud-42'
  });
  await harness.api.loadClaraTripPlan();

  assert.equal(harness.controls.destination.value, 'Budapest');
  assert.equal(harness.controls.duration.value, '7 Tage');
  assert.equal(harness.controls.interest.value, 'Kulinarik & Märkte');
  assert.equal(harness.controls.pace.value, 'Entspannt');
  assert.equal(harness.controls.mobility.value, 'Rollator');
  assert.match(harness.controls.planSaveStatus.textContent, /wurde geladen/);
});

test('deletes a selected cloud trip plan using its user and memory-type filters', async () => {
  const harness = createCloudHarness({
    memories: [{
      id: 'cloud-42',
      user_id: 'user-1',
      memory_type: 'saved_trip_plan',
      content: { destination: 'Budapest', duration: '7 Tage' },
      created_at: '2026-11-07T00:00:00.000Z'
    }],
    selectedId: 'cloud:cloud-42'
  });
  await harness.api.deleteClaraTripPlan();

  assert.equal(harness.rows.length, 0);
  const deletion = harness.memoryOperations.find(item => item.operation === 'delete');
  assert.ok(deletion, 'Cloud plan deletion must execute');
  assert.deepEqual(deletion.filters, [
    ['id', 'cloud-42'],
    ['user_id', 'user-1'],
    ['memory_type', 'saved_trip_plan']
  ]);
  assert.match(harness.controls.planSaveStatus.textContent, /aus deinem Clara-Konto gelöscht/);
});


test('does not load cloud trip plans after Memory consent is withdrawn', async () => {
  const harness = createCloudHarness({
    consent: false,
    memories: [{
      id: 'cloud-42',
      user_id: 'user-1',
      memory_type: 'saved_trip_plan',
      content: { destination: 'Budapest', duration: '7 Tage' },
      created_at: '2026-11-07T00:00:00.000Z'
    }],
    selectedId: 'cloud:cloud-42'
  });

  await harness.api.loadClaraTripPlan();

  assert.equal(harness.profileReads.length, 1, 'The consent flag must be checked first');
  assert.equal(harness.memoryOperations.length, 0, 'Cloud memories must not be read after consent is withdrawn');
  assert.equal(harness.controls.destination.value, 'Wien', 'The planner must remain unchanged');
  assert.equal(harness.controls.duration.value, '3 Tage');
  assert.match(harness.toastMessages.at(-1), /Memory ist deaktiviert/);
});
