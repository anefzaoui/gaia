'use strict';

requireApp('system/test/unit/mock_l10n.js');
requireApp('system/shared/test/unit/mocks/mock_icc_helper.js');

if (!window['SystemDialog'])
  window['SystemDialog'] = null;
if (!window['SimPinDialog'])
  window['SimPinDialog'] = null;
if (!window['IccHelper'])
  window['IccHelper'] = null;

suite('simcard dialog', function() {
  var realL10n = window.navigator.mozL10n;
  var realMobileConnection = window.navigator.mozMobileConnection;
  var realIccHelper = window.IccHelper;
  var mockUI;

  var MockMobileConnection = (function() {
    return {
      addEventListener: function(event, handler) {}
    };
  })();

  var MockSystemDialog = function(id, options) {
    return {
      show: function() {},
      hide: function() {}
    };
  };

  suiteSetup(function() {
    window.navigator.mozL10n = MockL10n;
    window.navigator.mozMobileConnection = MockMobileConnection;
    window['SystemDialog'] = MockSystemDialog;
    window['IccHelper'] = MockIccHelper;

    var mockUIMarkup = [
      '<header>',
        '<button type="reset">',
          '<span data-l10n-id="close" class="icon icon-close">Close</span>',
        '</button>',
        '<menu type="toolbar">',
          '<button data-l10n-id="ok" type="submit">Done</button>',
        '</menu>',
        '<h1></h1>',
      '</header>',
      '<div id="errorMsg" class="error" hidden>',
        '<div id="messageHeader">The PIN was incorrect.</div>',
        '<span id="messageBody">3 tries left.</span>',
      '</div>',
      '<div id="triesLeft" hidden>3 tries left</div>',
      '<div id="pinArea" hidden>',
        '<div data-l10n-id="simPin">SIM PIN</div>',
        '<div class="input-wrapper">',
          '<input name="simpin" type="number" size="8" maxlength="8" />',
          '<input name="simpinVis" type="text" size="8" maxlength="8" />',
        '</div>',
      '</div>',
      '<div id="pukArea" hidden>',
        '<div data-l10n-id="pukCode">PUK Code</div>',
        '<div class="input-wrapper">',
          '<input name="simpuk" type="number" size="8" maxlength="8" />',
          '<input name="simpukVis" type="text" size="8" maxlength="8" />',
        '</div>',
      '</div>',
      '<div id="xckArea" hidden>',
        '<div name="xckDesc" data-l10n-id="nckCode">NCK Code</div>',
        '<div class="input-wrapper">',
          '<input name="xckpin" type="number" size="16" maxlength="16" />',
          '<input name="xckpinVis" type="text" size="16" maxlength="16" />',
        '</div>',
      '</div>',
      '<div id="newPinArea" hidden>',
        '<div data-l10n-id="newSimPinMsg">',
          'Create PIN (must contain 4 to 8 digits)',
        '</div>',
        '<div class="input-wrapper">',
          '<input name="newSimpin" type="number" size="8" maxlength="8" />',
          '<input name="newSimpinVis" type="text" size="8" maxlength="8" />',
        '</div>',
      '</div>',
      '<div id="confirmPinArea" hidden>',
        '<div>Confirm New PIN</div>',
        '<div class="input-wrapper">',
          '<input name="confirmNewSimpin"',
            'type="number" size="8" maxlength="8" />',
          '<input name="confirmNewSimpinVis"',
            'type="text" size="8" maxlength="8" />',
        '</div>',
      '</div>'].join('');

    mockUI = document.createElement('div');
    mockUI.id = 'simpin-dialog';
    mockUI.innerHTML = mockUIMarkup;
    document.body.appendChild(mockUI);
  });

  suiteTeardown(function() {
    window.navigator.mozL10n = realL10n;
    window.navigator.mozMobileConnection = realMobileConnection;
    window['SystemDialog'] = null;
    window['IccHelper'] = null;

    mockUI.innerHTML = '';
    document.body.removeChild(mockUI);
  });

  setup(function(callback) {
    requireApp('system/js/simcard_dialog.js', callback);
  });

  teardown(function() {
  });

  suite('handle card state', function() {
    teardown(function() {
    });

    test('null', function() {
      MockIccHelper.setProperty('cardState', null);
      SimPinDialog.handleCardState();

      assert.isTrue(SimPinDialog.triesLeftMsg.hidden);
      assert.isTrue(SimPinDialog.pinArea.hidden);
      assert.isTrue(SimPinDialog.pukArea.hidden);
      assert.isTrue(SimPinDialog.xckArea.hidden);
      assert.isTrue(SimPinDialog.newPinArea.hidden);
      assert.isTrue(SimPinDialog.confirmPinArea.hidden);
    });

    test('unknown', function() {
      MockIccHelper.setProperty('cardState', 'unknown');
      SimPinDialog.handleCardState();

      assert.isTrue(SimPinDialog.triesLeftMsg.hidden);
      assert.isTrue(SimPinDialog.pinArea.hidden);
      assert.isTrue(SimPinDialog.pukArea.hidden);
      assert.isTrue(SimPinDialog.xckArea.hidden);
      assert.isTrue(SimPinDialog.newPinArea.hidden);
      assert.isTrue(SimPinDialog.confirmPinArea.hidden);
    });

    test('ready', function() {
      MockIccHelper.setProperty('cardState', 'ready');
      SimPinDialog.handleCardState();

      assert.isTrue(SimPinDialog.triesLeftMsg.hidden);
      assert.isTrue(SimPinDialog.pinArea.hidden);
      assert.isTrue(SimPinDialog.pukArea.hidden);
      assert.isTrue(SimPinDialog.xckArea.hidden);
      assert.isTrue(SimPinDialog.newPinArea.hidden);
      assert.isTrue(SimPinDialog.confirmPinArea.hidden);
    });

    test('pin required', function() {
      MockIccHelper.setProperty('cardState', 'pinRequired');
      SimPinDialog.handleCardState();

      assert.isTrue(SimPinDialog.triesLeftMsg.hidden);
      assert.isFalse(SimPinDialog.pinArea.hidden);
      assert.isTrue(SimPinDialog.pukArea.hidden);
      assert.isTrue(SimPinDialog.xckArea.hidden);
      assert.isTrue(SimPinDialog.newPinArea.hidden);
      assert.isTrue(SimPinDialog.confirmPinArea.hidden);
    });

    test('puk required', function() {
      MockIccHelper.setProperty('cardState', 'pukRequired');
      SimPinDialog.handleCardState();

      assert.isTrue(SimPinDialog.triesLeftMsg.hidden);
      assert.isTrue(SimPinDialog.pinArea.hidden);
      assert.isFalse(SimPinDialog.pukArea.hidden);
      assert.isTrue(SimPinDialog.xckArea.hidden);
      assert.isFalse(SimPinDialog.newPinArea.hidden);
      assert.isFalse(SimPinDialog.confirmPinArea.hidden);
    });

    test('network locked', function() {
      MockIccHelper.setProperty('cardState', 'networkLocked');
      SimPinDialog.handleCardState();

      assert.isTrue(SimPinDialog.triesLeftMsg.hidden);
      assert.isTrue(SimPinDialog.pinArea.hidden);
      assert.isTrue(SimPinDialog.pukArea.hidden);
      assert.isFalse(SimPinDialog.xckArea.hidden);
      assert.isTrue(SimPinDialog.newPinArea.hidden);
      assert.isTrue(SimPinDialog.confirmPinArea.hidden);
    });

    test('corporate locked', function() {
      MockIccHelper.setProperty('cardState', 'corporateLocked');
      SimPinDialog.handleCardState();

      assert.isTrue(SimPinDialog.triesLeftMsg.hidden);
      assert.isTrue(SimPinDialog.pinArea.hidden);
      assert.isTrue(SimPinDialog.pukArea.hidden);
      assert.isFalse(SimPinDialog.xckArea.hidden);
      assert.isTrue(SimPinDialog.newPinArea.hidden);
      assert.isTrue(SimPinDialog.confirmPinArea.hidden);
    });

    test('service provider locked', function() {
      MockIccHelper.setProperty('cardState', 'serviceProviderLocked');
      SimPinDialog.handleCardState();

      assert.isTrue(SimPinDialog.triesLeftMsg.hidden);
      assert.isTrue(SimPinDialog.pinArea.hidden);
      assert.isTrue(SimPinDialog.pukArea.hidden);
      assert.isFalse(SimPinDialog.xckArea.hidden);
      assert.isTrue(SimPinDialog.newPinArea.hidden);
      assert.isTrue(SimPinDialog.confirmPinArea.hidden);
    });
  });
});
