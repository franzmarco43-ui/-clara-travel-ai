'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const app = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'clara-app.js'), 'utf8');
const start = app.indexOf('async function fetchClaraSpeechChunkWithVisemes');
const end = app.indexOf('\\nfunction clearClaraVisemeTimers()', start);

test('keeps the Azure viseme timeout active while the response body is being read', async () => {
  assert.notEqual(start, -1, 'Viseme speech client must exist');
  assert.ok(end > start, 'Viseme speech client must be isolated for testing');

  const source = app.slice(start, end).replace('20000', '10');
  let bodyAborted = false;
  let fallbackCalled = false;

  const sandbox = {
    AbortController,
    Blob,
    atob,
    setTimeout,
    clearTimeout,
    console: { warn() {} },
    fetch: async (_url, options) => ({
      ok: true,
      json: () => new Promise((resolve, reject) => {
        const bodyTimer = setTimeout(() => resolve({
          audio: 'AQ==',
          contentType: 'audio/wav',
          visemes: [{ audioOffset: 0, visemeId: 1 }]
        }), 60);
        options.signal.addEventListener('abort', () => {
          bodyAborted = true;
          clearTimeout(bodyTimer);
          const error = new Error('aborted while reading response body');
          error.name = 'AbortError';
          reject(error);
        }, { once: true });
      })
    }),
    fetchClaraSpeechChunk: async () => {
      fallbackCalled = true;
      return new Blob([Uint8Array.of(1)], { type: 'audio/wav' });
    }
  };

  const fetchSpeech = vm.runInNewContext('(' + source + ')', sandbox);
  const result = await fetchSpeech('Hallo Clara', 'de');

  assert.equal(bodyAborted, true, 'The request must remain abortable after response headers arrive');
  assert.equal(fallbackCalled, true, 'A timed-out viseme request must use the normal speech fallback');
  assert.equal(result.synchronized, false);
  assert.equal(result.visemes.length, 0);
});
