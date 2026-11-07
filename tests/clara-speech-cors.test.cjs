'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const functionPath = path.join(__dirname, '..', 'netlify', 'functions', 'clara-speech.js');
const previewOrigin = 'https://deploy-preview-10--clara-travel-ai.netlify.app';
const productionOrigin = 'https://clara-travel-ai.netlify.app';

function loadHandler({ originFetch } = {}) {
  let azureCalls = 0;
  const fakeFetch = async (url, options) => {
    azureCalls++;
    assert.match(url, /^https:\/\/germanywestcentral\.tts\.speech\.microsoft\.com\//);
    assert.equal(options.headers['Ocp-Apim-Subscription-Key'], 'test-only-placeholder');
    const bytes = Uint8Array.from([1, 2, 3]);
    return {
      ok: true,
      status: 200,
      arrayBuffer: async () => bytes.buffer,
      text: async () => ''
    };
  };
  const moduleExports = {};
  const sandbox = {
    exports: moduleExports,
    process: { env: { AZURE_SPEECH_KEY: 'test-only-placeholder', AZURE_SPEECH_REGION: 'germanywestcentral' } },
    Buffer,
    AbortController,
    setTimeout,
    clearTimeout,
    fetch: originFetch || fakeFetch,
    console: { error() {} }
  };
  vm.runInNewContext(fs.readFileSync(functionPath, 'utf8'), sandbox, { filename: functionPath });
  return { handler: moduleExports.handler, getAzureCalls: () => azureCalls };
}

test('allows preflight only for production and Preview 10', async () => {
  const { handler } = loadHandler();
  for (const origin of [productionOrigin, previewOrigin]) {
    const response = await handler({ httpMethod: 'OPTIONS', headers: { origin }, body: '' });
    assert.equal(response.statusCode, 204);
    assert.equal(response.headers['Access-Control-Allow-Origin'], origin);
    assert.equal(response.headers['Access-Control-Allow-Methods'], 'GET, POST, OPTIONS');
  }
  const rejected = await handler({
    httpMethod: 'OPTIONS',
    headers: { origin: 'https://example.com' },
    body: ''
  });
  assert.equal(rejected.statusCode, 403);
  assert.equal(rejected.headers['Access-Control-Allow-Origin'], undefined);
  const otherPreview = await handler({
    httpMethod: 'OPTIONS',
    headers: { origin: 'https://deploy-preview-11--clara-travel-ai.netlify.app' },
    body: ''
  });
  assert.equal(otherPreview.statusCode, 403);
  assert.equal(otherPreview.headers['Access-Control-Allow-Origin'], undefined);
});

test('rejects an untrusted browser origin before contacting Azure', async () => {
  const { handler, getAzureCalls } = loadHandler();
  const response = await handler({
    httpMethod: 'POST',
    headers: { origin: 'https://example.com' },
    body: JSON.stringify({ text: 'Hallo Clara', language: 'de' })
  });
  assert.equal(response.statusCode, 403);
  assert.equal(getAzureCalls(), 0);
  assert.match(response.body, /Ursprung nicht freigegeben/);
});

test('returns audio and matching CORS headers to the Clara Preview 10 origin', async () => {
  const { handler, getAzureCalls } = loadHandler();
  const response = await handler({
    httpMethod: 'POST',
    headers: { origin: previewOrigin },
    body: JSON.stringify({ text: 'Hallo Clara', language: 'de' })
  });
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['Access-Control-Allow-Origin'], previewOrigin);
  assert.equal(response.headers['Content-Type'], 'audio/wav');
  assert.equal(response.isBase64Encoded, true);
  assert.equal(response.body, Buffer.from([1, 2, 3]).toString('base64'));
  assert.equal(getAzureCalls(), 1);
});

test('keeps originless server-to-server requests compatible without adding a CORS grant', async () => {
  const { handler } = loadHandler();
  const response = await handler({
    httpMethod: 'POST',
    headers: {},
    body: JSON.stringify({ text: 'Hallo Clara', language: 'de' })
  });
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['Access-Control-Allow-Origin'], undefined);
});
