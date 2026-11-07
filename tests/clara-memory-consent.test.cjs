'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const appPath = path.join(__dirname, '..', 'assets', 'js', 'clara-app.js');
const app = fs.readFileSync(appPath, 'utf8');
const start = app.indexOf('async function saveClaraProfile(){');
const end = app.indexOf(String.fromCharCode(10) + 'async function loadClaraProfile()', start);

assert.notEqual(start, -1, 'The Clara profile save handler must exist');
assert.ok(end > start, 'The profile save handler must be isolated for consent tests');
const handlerSource = app.slice(start, end).trim();

function createHarness(consent, { profileExists = true } = {}) {
  const calls = [];
  const insertedMemories = [];
  const profileUpdates = [];
  const profileInserts = [];
  const profileUpserts = [];
  const statuses = [];
  const controls = {
    memoryConsent: { checked: consent },
    memoryName: { value: 'Reisegast' },
    memoryInterests: { value: 'Kultur, Natur' },
    memoryPace: { value: 'Entspannt' },
    memoryBudget: { value: 'Mittel' }
  };
  const supabase = {
    from(table) {
      calls.push(table);
      if (table === 'clara_profiles') {
        return {
          select() {
            const query = {
              eq() { return query; },
              maybeSingle() {
                return Promise.resolve({
                  data: profileExists ? { user_id: 'test-user-1' } : null,
                  error: null
                });
              }
            };
            return query;
          },
          update(payload) {
            profileUpdates.push(payload);
            const query = { eq() { return Promise.resolve({ error: null }); } };
            return query;
          },
          insert(payload) {
            profileInserts.push(payload);
            return Promise.resolve({ error: null });
          },
          upsert(payload) {
            profileUpserts.push(payload);
            return Promise.resolve({ error: null });
          }
        };
      }
      if (table === 'clara_memories') {
        const query = {
          select() { return query; },
          eq() { return query; },
          order() { return query; },
          limit() { return query; },
          maybeSingle() { return Promise.resolve({ data: null, error: null }); },
          insert(payload) {
            insertedMemories.push(payload);
            return Promise.resolve({ error: null });
          }
        };
        return query;
      }
      throw new Error('Unexpected Supabase table: ' + table);
    }
  };
  const save = new Function(
    'window', 'claraUser', 'document', 'memoryStatus', 'renderClaraTripPlans',
    'return (' + handlerSource + ');'
  )(
    { claraSupabase: supabase },
    { id: 'test-user-1' },
    { getElementById: id => controls[id] || null },
    (id, message, isError) => statuses.push({ id, message, isError: !!isError }),
    async () => {}
  );
  return {
    save, calls, profileUpdates, profileInserts, profileUpserts,
    insertedMemories, statuses
  };
}

test('does not read or write Clara memories or persist preference fields when consent is withdrawn', async () => {
  const harness = createHarness(false);
  await harness.save();

  assert.deepEqual(harness.calls, ['clara_profiles', 'clara_profiles']);
  assert.deepEqual(harness.profileUpdates, [{
    consent_memory: false,
    updated_at: harness.profileUpdates[0].updated_at
  }]);
  assert.equal(harness.profileInserts.length, 0);
  assert.equal(harness.profileUpserts.length, 0);
  assert.equal(harness.insertedMemories.length, 0);
  assert.equal(harness.statuses.at(-1).id, 'memoryStatus');
  assert.match(harness.statuses.at(-1).message, /Neue Reisevorlieben werden nicht gespeichert/);
  assert.match(harness.statuses.at(-1).message, /Memory-Zustimmung ist deaktiviert/);
});

test('creates only a consent-status row when a user withdraws consent before saving a profile', async () => {
  const harness = createHarness(false, { profileExists: false });
  await harness.save();

  assert.deepEqual(harness.calls, ['clara_profiles', 'clara_profiles']);
  assert.equal(harness.profileUpdates.length, 0);
  assert.equal(harness.profileUpserts.length, 0);
  assert.equal(harness.profileInserts.length, 1);
  assert.deepEqual(Object.keys(harness.profileInserts[0]).sort(), ['consent_memory', 'updated_at', 'user_id']);
  assert.equal(harness.profileInserts[0].user_id, 'test-user-1');
  assert.equal(harness.profileInserts[0].consent_memory, false);
  assert.equal(harness.insertedMemories.length, 0);
});

test('writes a travel-profile memory only after explicit consent', async () => {
  const harness = createHarness(true);
  await harness.save();

  assert.deepEqual(harness.calls, ['clara_profiles', 'clara_memories', 'clara_memories']);
  assert.equal(harness.profileUpserts.length, 1);
  assert.equal(harness.profileUpserts[0].consent_memory, true);
  assert.equal(harness.profileUpserts[0].display_name, 'Reisegast');
  assert.deepEqual(harness.profileUpserts[0].interests, ['Kultur', 'Natur']);
  assert.equal(harness.profileUpdates.length, 0);
  assert.equal(harness.profileInserts.length, 0);
  assert.equal(harness.insertedMemories.length, 1);
  assert.equal(harness.insertedMemories[0].user_id, 'test-user-1');
  assert.equal(harness.insertedMemories[0].memory_type, 'travel_profile');
  assert.deepEqual(harness.insertedMemories[0].content.interests, ['Kultur', 'Natur']);
  assert.equal(harness.statuses.at(-1).id, 'memoryStatus');
  assert.match(harness.statuses.at(-1).message, /mit deiner Zustimmung gespeichert/);
});


const loadStart = app.indexOf('async function loadClaraProfile(){');
const loadEnd = app.indexOf(String.fromCharCode(10) + 'async function deleteClaraMemory()', loadStart);
assert.notEqual(loadStart, -1, 'The Clara profile load handler must exist');
assert.ok(loadEnd > loadStart, 'The profile load handler must be isolated for consent tests');
const loadHandlerSource = app.slice(loadStart, loadEnd).trim();

function createLoadHarness({ consent = false, profile = null, hasProfile = true } = {}) {
  const calls = [];
  const statuses = [];
  const controls = {
    memoryConsent: { checked: true },
    memoryName: { value: 'Alter Name' },
    memoryInterests: { value: 'Alte Interessen' },
    memoryPace: { value: 'Viel entdecken' },
    memoryBudget: { value: 'Luxus' }
  };
  const supabase = {
    from(table) {
      assert.equal(table, 'clara_profiles');
      return {
        select(columns) {
          calls.push({ table, columns });
          const query = {
            eq(column, value) {
              assert.equal(column, 'user_id');
              assert.equal(value, 'test-user-1');
              return query;
            },
            maybeSingle() {
              if (columns === 'consent_memory') {
                return Promise.resolve({
                  data: hasProfile ? { consent_memory: consent } : null,
                  error: null
                });
              }
              return Promise.resolve({ data: profile, error: null });
            }
          };
          return query;
        }
      };
    }
  };
  const load = new Function(
    'window', 'claraUser', 'document', 'memoryStatus',
    'return (' + loadHandlerSource + ');'
  )(
    { claraSupabase: supabase },
    { id: 'test-user-1' },
    { getElementById: id => controls[id] || null },
    (id, message, isError) => statuses.push({ id, message, isError: !!isError })
  );
  return { load, calls, statuses, controls };
}

test('does not select or expose personal profile fields after Memory consent is withdrawn', async () => {
  const harness = createLoadHarness({
    consent: false,
    profile: {
      display_name: 'Privater Name',
      interests: ['Privates Interesse'],
      travel_pace: 'Entspannt',
      budget_level: 'Komfort'
    }
  });

  await harness.load();

  assert.deepEqual(harness.calls, [
    { table: 'clara_profiles', columns: 'consent_memory' }
  ]);
  assert.equal(harness.controls.memoryConsent.checked, false);
  assert.equal(harness.controls.memoryName.value, '');
  assert.equal(harness.controls.memoryInterests.value, '');
  assert.equal(harness.controls.memoryPace.value, '');
  assert.equal(harness.controls.memoryBudget.value, '');
  assert.match(harness.statuses.at(-1).message, /Zustimmung ist deaktiviert/);
  assert.match(harness.statuses.at(-1).message, /werden nicht geladen/);
});

test('loads personal profile fields only after explicit Memory consent is confirmed', async () => {
  const harness = createLoadHarness({
    consent: true,
    profile: {
      display_name: 'Reisegast',
      interests: ['Kultur', 'Natur'],
      travel_pace: 'Ausgewogen',
      budget_level: 'Mittel'
    }
  });

  await harness.load();

  assert.deepEqual(harness.calls, [
    { table: 'clara_profiles', columns: 'consent_memory' },
    { table: 'clara_profiles', columns: 'display_name,interests,travel_pace,budget_level' }
  ]);
  assert.equal(harness.controls.memoryConsent.checked, true);
  assert.equal(harness.controls.memoryName.value, 'Reisegast');
  assert.equal(harness.controls.memoryInterests.value, 'Kultur, Natur');
  assert.equal(harness.controls.memoryPace.value, 'Ausgewogen');
  assert.equal(harness.controls.memoryBudget.value, 'Mittel');
  assert.match(harness.statuses.at(-1).message, /mit aktiver Zustimmung geladen/);
});

test('clears stale form values when no consent record exists', async () => {
  const harness = createLoadHarness({ hasProfile: false });

  await harness.load();

  assert.deepEqual(harness.calls, [
    { table: 'clara_profiles', columns: 'consent_memory' }
  ]);
  assert.equal(harness.controls.memoryConsent.checked, false);
  assert.equal(harness.controls.memoryName.value, '');
  assert.equal(harness.controls.memoryInterests.value, '');
  assert.equal(harness.controls.memoryPace.value, '');
  assert.equal(harness.controls.memoryBudget.value, '');
  assert.match(harness.statuses.at(-1).message, /Zustimmung ist deaktiviert/);
});
