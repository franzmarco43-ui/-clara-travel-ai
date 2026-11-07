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
