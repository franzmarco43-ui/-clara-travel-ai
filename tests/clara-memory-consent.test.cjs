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
