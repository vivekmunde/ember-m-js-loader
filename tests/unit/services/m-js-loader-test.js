import { moduleFor, test } from 'ember-qunit';
import sinonTest from 'ember-sinon-qunit/test-support/test';
import Ember from 'ember';

moduleFor('service:m-js-loader', 'Unit | Service | m js loader', {
  unit: true,

  beforeEach() {
    let service = this.subject();
    service.set('_cache', Ember.A());
  }
});

// ------------------------------------------------------------------------------------------------------

test('should have cache initialized', function (assert) {
  assert.expect(1);

  let service = this.subject();

  assert.deepEqual(service.get('_cache'), [], 'cache was initialized to []');
});

// ------------------------------------------------------------------------------------------------------

test('should check if the src already cached', function (assert) {
  assert.expect(2);

  let service = this.subject();

  const src = '../script.js';
  service.get('_cache').push(src);

  assert.deepEqual(service._isCached(src), true, 'src was cached');
  assert.deepEqual(service._isCached('http://non-cached-script.js'), false, 'src was not cached');
});

// --------------------------------------------------------------------------------------------------

test('should update cache', function (assert) {
  assert.expect(1);

  let service = this.subject();

  const src = '../script.js';

  service._updateCache(src);
  assert.deepEqual(
    service.get('_cache'),
    [
      src
    ]
  );
});

// --------------------------------------------------------------------------------------------------

test('should check validity of attr', function (assert) {
  assert.expect(6);

  let service = this.subject();

  let attr = null;
  assert.equal(service._isValidAttr(attr), false, 'attr = null');

  attr = {};
  assert.equal(service._isValidAttr(attr), false, 'attr = {}');

  attr = {
    crossorigin: 'anonymous'
  };
  assert.equal(service._isValidAttr(attr), false, 'attr = undefined');

  attr = {
    src: null
  };
  assert.equal(service._isValidAttr(attr), false, 'attr = {src: null}');

  attr = {
    src: ''
  };
  assert.equal(service._isValidAttr(attr), false, 'attr = {src: ""}');

  attr = {
    src: '../script.js'
  };
  assert.equal(service._isValidAttr(attr), true, 'attr = {src: "../script.js"}');
});

// --------------------------------------------------------------------------------------------------

test('should compute script attr', function (assert) {
  assert.expect(1);

  let service = this.subject();

  const attr = {
    src: '../script.js',
    crossorigin: 'anonymous'
  };

  assert.deepEqual(
    service._getScriptAttr(attr),
    {
      type: 'text/javascript',
      src: '../script.js',
      crossorigin: 'anonymous'
    }
  );
});

// --------------------------------------------------------------------------------------------------

sinonTest('should load js in a <script> tag in document <body>', function (assert) {
  assert.expect(4);

  let service = this.subject();

  const attr = {
    src: '../script.js',
    crossorigin: 'anonymous'
  };

  const getScriptAttrStub = this.stub(service, '_getScriptAttr').returns({
    type: 'text/javascript',
    src: '../script.js',
    crossorigin: 'anonymous'
  });

  return service._loadJs(attr).then(() => {
    assert.ok(getScriptAttrStub.calledWith(attr), '_getScriptAttr was called');
    const $script = Ember.$('body script').last();
    assert.equal($script.attr('type'), 'text/javascript', '<script> had type');
    assert.equal($script.attr('src'), '../script.js', '<script> had src');
    assert.equal($script.attr('crossorigin'), 'anonymous', '<script> had crossorigin');
  });
});

// --------------------------------------------------------------------------------------------------

sinonTest('should handle error during js loading in a <script> tag in document <body>', function (assert) {
  assert.expect(1);

  let service = this.subject();

  const attr = {
    src: '/assets/404-script.js',
    crossorigin: 'anonymous'
  };

  this.stub(service, '_getScriptAttr').returns({
    type: 'text/javascript',
    src: '/assets/404-script.js',
    crossorigin: 'anonymous'
  });

  return service._loadJs(attr).then(() => { }, () => {
    !assert.equal(Ember.$('body script').last().attr('src'), '/assets/404-script.js');
  });
});

// --------------------------------------------------------------------------------------------------

sinonTest('should not load js for missing attr', function (assert) {
  assert.expect(2);

  let service = this.subject();

  const attr = { crossorigin: 'anonymous' },
    _isValidAttrStub = this.stub(service, '_isValidAttr').returns(false),
    _isCachedSpy = this.spy(service, '_isCached');

  return service.load(attr).then(() => {
    assert.ok(_isValidAttrStub.calledWith(attr), 'attr validity was checked');
    assert.ok(_isCachedSpy.notCalled, 'js was not laoded');
  });
});

// --------------------------------------------------------------------------------------------------

sinonTest('should not load already loaded js', function (assert) {
  assert.expect(3);

  let service = this.subject();

  const attr = {
    src: '../script.js',
    crossorigin: 'anonymous'
  },
    _isValidAttrStub = this.stub(service, '_isValidAttr').returns(true),
    _isCachedStub = this.stub(service, '_isCached').returns(true),
    _loadJsSpy = this.spy(service, '_loadJs');

  return service.load(attr).then(() => {
    assert.ok(_isValidAttrStub.calledOnce, 'attr validity was checked');
    assert.ok(_isCachedStub.calledWith(attr.src), 'src caching was checked');
    assert.ok(_loadJsSpy.notCalled, 'js was not loaded');
  });
});

// --------------------------------------------------------------------------------------------------

sinonTest('should load js', function (assert) {
  assert.expect(4);

  let service = this.subject();

  const attr = {
    src: '../script.js',
    crossorigin: 'anonymous'
  },
    _isValidAttrStub = this.stub(service, '_isValidAttr').returns(true),
    _isCachedStub = this.stub(service, '_isCached').returns(false),
    _loadJsStub = this.stub(service, '_loadJs').returns(
      new Ember.RSVP.Promise((resolve) => {
        resolve();
      })
    ),
    _updateCacheStub = this.stub(service, '_updateCache').returns();

  return service.load(attr).then(() => {
    assert.ok(_isValidAttrStub.calledOnce, 'attr validity was checked');
    assert.ok(_isCachedStub.calledOnce, 'src caching was checked');
    assert.ok(_loadJsStub.calledWith(attr), 'js was loaded');
    assert.ok(_updateCacheStub.calledWith(attr.src), 'src was updated in cache');
  });
});

// --------------------------------------------------------------------------------------------------

sinonTest('should handle error dusing js load', function (assert) {
  assert.expect(4);

  let service = this.subject();

  const attr = {
    src: '../script.js',
    crossorigin: 'anonymous'
  },
    _isValidAttrStub = this.stub(service, '_isValidAttr').returns(true),
    _isCachedStub = this.stub(service, '_isCached').returns(false),
    _loadJsStub = this.stub(service, '_loadJs').returns(
      new Ember.RSVP.Promise((resolve, reject) => {
        reject();
      })
    ),
    _updateCacheStub = this.stub(service, '_updateCache').returns();

  return service.load(attr).catch(() => {
    assert.ok(_isValidAttrStub.calledOnce, 'attr validity was checked');
    assert.ok(_isCachedStub.calledOnce, 'src caching was checked');
    assert.ok(_loadJsStub.calledWith(attr), 'js load was initiated');
    assert.ok(_updateCacheStub.notCalled, 'src was not updated in cache');
  });
});
