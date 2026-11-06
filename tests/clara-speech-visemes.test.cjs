'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const functionPath = path.join(__dirname, '..', 'netlify', 'functions', 'clara-speech-visemes.js');
const previewOrigin = 'https://deploy-preview-10--clara-travel-ai.netlify.app';
let lastSpeechConfig = null;

function loadHandler({ key = 'test-only-placeholder', region = 'germanywestcentral', visemes = [] } = {}) {
  const source = fs.readFileSync(functionPath, 'utf8');
  class FakeSpeechSynthesizer {
    constructor(config) {
      this.config = config;
      lastSpeechConfig = config;
      this.visemeReceived = null;
    }
    speakTextAsync(text, onSuccess) {
      assert.equal(text, 'Hallo Clara');
      for (const event of visemes) this.visemeReceived?.(this, event);
      onSuccess({ reason: 1, audioData: Buffer.from([1, 2, 3]) });
    }
    close() {}
  }

  const speechSdk = {
    SpeechConfig: {
      fromSubscription(receivedKey, receivedRegion) {
        return { receivedKey, receivedRegion };
      }
    },
    SpeechSynthesizer: FakeSpeechSynthesizer,
    SpeechSynthesisOutputFormat: { Riff24Khz16BitMonoPcm: 7 },
    ResultReason: { SynthesizingAudioCompleted: 1 }
  };
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require(name) {
      if (name === 'microsoft-cognitiveservices-speech-sdk') return speechSdk;
      throw new Error('Unexpected module: ' + name);
    },
    process: { env: { AZURE_SPEECH_KEY: key, AZURE_SPEECH_REGION: region } },
    Buffer,
    setTimeout,
    clearTimeout,
    console: { error() {} }
  };
  vm.runInNewContext(source, sandbox, { filename: functionPath });
  return module.exports.handler;
}

test('returns sorted, timestamped German Azure visemes for the allowed preview origin', async () => {
  const handler = loadHandler({
    visemes: [
      { audioOffset: 20000000, visemeId: 3 },
      { audioOffset: 10000000, visemeId: 1 }
    ]
  });
  const response = await handler({
    httpMethod: 'POST',
    headers: { origin: previewOrigin },
    body: JSON.stringify({ text: 'Hallo Clara', language: 'de' })
  });
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.voice, 'de-DE-SeraphinaMultilingualNeural');
  assert.equal(body.visemeTimebase, '100ns');
  assert.equal(body.contentType, 'audio/wav');
  assert.equal(body.audio, Buffer.from([1, 2, 3]).toString('base64'));
  assert.equal(JSON.stringify(body.visemes), JSON.stringify([
    { audioOffset: 10000000, visemeId: 1 },
    { audioOffset: 20000000, visemeId: 3 }
  ]));
  assert.equal(lastSpeechConfig.receivedRegion, 'germanywestcentral');
});

test('rejects origins outside production and Preview 10', async () => {
  const handler = loadHandler();
  const response = await handler({
    httpMethod: 'POST',
    headers: { origin: 'https://example.com' },
    body: JSON.stringify({ text: 'Hallo Clara', language: 'de' })
  });
  assert.equal(response.statusCode, 403);
  const otherPreview = await handler({
    httpMethod: 'POST',
    headers: { origin: 'https://deploy-preview-11--clara-travel-ai.netlify.app' },
    body: JSON.stringify({ text: 'Hallo Clara', language: 'de' })
  });
  assert.equal(otherPreview.statusCode, 403);
});

test('allows the Preview 10 CORS preflight', async () => {
  const handler = loadHandler();
  const response = await handler({
    httpMethod: 'OPTIONS',
    headers: { origin: previewOrigin },
    body: ''
  });
  assert.equal(response.statusCode, 204);
  assert.equal(response.headers['Access-Control-Allow-Origin'], previewOrigin);
});

test('reports a missing Azure key without exposing any credential', async () => {
  const handler = loadHandler({ key: '' });
  const response = await handler({
    httpMethod: 'POST',
    headers: { origin: previewOrigin },
    body: JSON.stringify({ text: 'Hallo Clara', language: 'de' })
  });
  assert.equal(response.statusCode, 503);
  assert.match(response.body, /Azure Speech ist auf dem Preview-Deployment nicht konfiguriert/);
  assert.doesNotMatch(response.body, /test-only-placeholder/);
});

test('rejects malformed, empty and overlong speech requests', async () => {
  const handler = loadHandler();
  const malformed = await handler({ httpMethod: 'POST', headers: { origin: previewOrigin }, body: '{' });
  const empty = await handler({ httpMethod: 'POST', headers: { origin: previewOrigin }, body: JSON.stringify({ text: '  ' }) });
  const long = await handler({ httpMethod: 'POST', headers: { origin: previewOrigin }, body: JSON.stringify({ text: 'x'.repeat(1801) }) });
  assert.equal(malformed.statusCode, 400);
  assert.equal(empty.statusCode, 400);
  assert.equal(long.statusCode, 413);
});
