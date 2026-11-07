'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const functionPath = path.join(__dirname, '..', 'netlify', 'functions', 'chat.js');
const previewOrigin = 'https://deploy-preview-10--clara-travel-ai.netlify.app';

function loadHandler() {
  const calls = { require: 0, fetch: 0 };
  const sandbox = {
    exports: {},
    process: { env: {} },
    Map,
    URL,
    Date,
    AbortController,
    setTimeout,
    clearTimeout,
    require() {
      calls.require++;
      throw new Error('A blocked request must not load backend modules.');
    },
    fetch() {
      calls.fetch++;
      throw new Error('A blocked request must not call external services.');
    },
    console: { error() {}, warn() {} }
  };
  vm.runInNewContext(fs.readFileSync(functionPath, 'utf8'), sandbox, { filename: functionPath });
  return { handler: sandbox.exports.handler, calls };
}

test('allows Clara chat preflight from the numbered Preview 10 origin', async () => {
  const { handler } = loadHandler();
  const response = await handler({
    httpMethod: 'OPTIONS',
    headers: { origin: previewOrigin },
    body: ''
  });
  assert.equal(response.statusCode, 204);
  assert.equal(response.headers['Access-Control-Allow-Origin'], previewOrigin);
  assert.equal(response.headers['Access-Control-Allow-Headers'], 'Content-Type, Authorization');
});

test('rejects untrusted chat preflight requests', async () => {
  const { handler } = loadHandler();
  const response = await handler({
    httpMethod: 'OPTIONS',
    headers: { origin: 'https://example.com' },
    body: ''
  });
  assert.equal(response.statusCode, 403);
  assert.equal(response.headers['Access-Control-Allow-Origin'], undefined);
});

test('rejects other numbered deploy previews', async () => {
  const { handler } = loadHandler();
  const response = await handler({
    httpMethod: 'OPTIONS',
    headers: { origin: 'https://deploy-preview-11--clara-travel-ai.netlify.app' },
    body: ''
  });
  assert.equal(response.statusCode, 403);
  assert.equal(response.headers['Access-Control-Allow-Origin'], undefined);
});

test('rejects untrusted chat POST before loading modules or calling external services', async () => {
  const { handler, calls } = loadHandler();
  const response = await handler({
    httpMethod: 'POST',
    headers: { origin: 'https://example.com', 'content-type': 'text/plain' },
    body: JSON.stringify({ message: 'Hallo Clara' })
  });
  assert.equal(response.statusCode, 403);
  assert.match(response.body, /Ursprung nicht freigegeben/);
  assert.deepEqual(calls, { require: 0, fetch: 0 });
});

test('keeps originless server-to-server preflight compatible without a CORS grant', async () => {
  const { handler } = loadHandler();
  const response = await handler({ httpMethod: 'OPTIONS', headers: {}, body: '' });
  assert.equal(response.statusCode, 204);
  assert.equal(response.headers['Access-Control-Allow-Origin'], undefined);
});
