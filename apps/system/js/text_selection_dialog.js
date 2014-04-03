'use strict';

(function(window) {
  var _ = navigator.mozL10n.get;
  var _id = 0;

  /**
   * Text Selection Dialog of the AppWindow
   */
  window.TextSelectionDialog = function TextSelectionDialog(app) {
    this.app = app;
    this.containerElement = app.element;
    this.event = null;
    // One to one mapping
    this.instanceID = _id++;
    this._injected = false;
    try {
      app.element.addEventListener('mozbrowserselectionchange', this);
    } catch (e) {
      app._dump();
    }
    return this;
  };

  TextSelectionDialog.prototype.__proto__ = window.BaseUI.prototype;

  TextSelectionDialog.prototype.CLASS_NAME = 'TextSelectionDialog';

  TextSelectionDialog.prototype.ELEMENT_PREFIX = 'textselection-dialog-';

  TextSelectionDialog.prototype.customID = function tsd_customID() {
    if (this.app) {
      return '[' + this.app.origin + ']';
    } else {
      return '';
    }
  };

  TextSelectionDialog.prototype.handleEvent = function tsd_handleEvent(evt) {
    this.event = evt;
    if (!this._injected) {
      this.render();
    }
    this.show();
    this._injected = true;
  };

  TextSelectionDialog.prototype._fetchElements = function tsd__fetchElements() {
    this.element = document.getElementById(this.CLASS_NAME + this.instanceID);
    this.elements = {};

    var toCamelCase = function toCamelCase(str) {
      return str.replace(/\-(.)/g, function replacer(str, p1) {
        return p1.toUpperCase();
      });
    };

    this.elementClasses = ['copy', 'cut', 'paste', 'selectall'];

    // Loop and add element with camel style name to Modal Dialog attribute.
    this.elementClasses.forEach(function createElementRef(name) {
      this.elements[toCamelCase(name)] =
        this.element.querySelector('.' + this.ELEMENT_PREFIX + name);
    }, this);
  };

  TextSelectionDialog.prototype._registerEvents =
    function tsd__registerEvents() {
      var elements = this.elements;
      elements.copy.addEventListener('click', this.copyHandler.bind(this));
      elements.cut.addEventListener('click', this.cutHandler.bind(this));
      elements.paste.addEventListener('click', this.pasteHandler.bind(this));
      elements.selectall.addEventListener('click', this.selectallHandler.bind(this));
  };

  TextSelectionDialog.prototype.copyHandler =
    function tsd_copyHandler(evt) {
      this.CopyedText = this.event.detail.text;
      this.hide();
      evt.preventDefault();
  };

  TextSelectionDialog.prototype.cutHandler =
    function tsd_cutHandler(evt) {
      this.CopyedText = this.event.detail.text;
      this.event.detail.cutToClipboard();
      this.hide();
      evt.preventDefault();
  };

  TextSelectionDialog.prototype.pasteHandler =
    function tsd_pasteHandler(evt) {
      if (this.CopyedText) {
        this.event.detail.pasteFromClipboard(this.CopyedText);
      }
      this.hide();
      evt.preventDefault();
  };

  TextSelectionDialog.prototype.selectallHandler =
    function tsd_selectallHandler(evt) {
      this.event.detail.selectall();
      this.hide();
      evt.preventDefault();
  };

  TextSelectionDialog.prototype.view = function tsd_view() {
    var temp = '<div class="textselection-dialog"' +
            ' id="' + this.CLASS_NAME + this.instanceID + '">' +
              '<div class="textselection-dialog-copy">copy</div>' +
              '<div class="textselection-dialog-cut">cut</div>' +
              '<div class="textselection-dialog-paste">paste</div>' +
              '<div class="textselection-dialog-selectall">selectall</div>' +
            '</div>';
    return temp;
  };

  TextSelectionDialog.prototype.kill = function tsd_kill() {
    this.containerElement.removeChild(this.element);
  };

  TextSelectionDialog.prototype.show = function tsd_show() {
    if (!this.event) {
      return;
    }
    var evt = this.event;
    var detail = evt.detail;
    this.element.classList.add('visible');
    this.element.style.top = (detail.top + 40) + "px";
    this.element.style.left = detail.left + "px";
    evt.preventDefault();
  };

  TextSelectionDialog.prototype.hide = function tsd_hide() {
    this.element.blur();
    this.element.classList.remove('visible');
    if (this.app) {
      this.app.focus();
    }
  };
}(this));
