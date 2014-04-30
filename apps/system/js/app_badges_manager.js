'use strict';

  /*
   * 
   * Manifest structure
   * 
   * "badge": 
   * {
   *  "onStartup": "hidden",
   *  "initialValue": null
   * },
   * 
   * 
   */

var appBadgeManager = {
  
  container: null,
  _mgmt: null,
  
  /*
   * 
   * badges should return such structure which then
   * could be called by Homescreen to add them to each
   * one of the apps
   * 
   * 
   * [
   *    {
   *      "name": "AppName1",
   *      "manifestURL": "url_for_manifest",
   *      "initialValue" :"1"
   *    },
   *    {
   *      "name": "AppName2",
   *      "manifestURL": "url_for_manifest",
   *      "initialValue" :"2"
   *    },
   *    {
   *      "name": "AppName3",
   *      "manifestURL": "url_for_manifest",
   *      "initialValue" :"3"
   *    },
   *    {
   *      "name": "AppName4",
   *      "manifestURL": "url_for_manifest",
   *      "initialValue" :"-"
   *    }
   * ]
   * 
   */
  badges: [],
  
  init: function _init(){
    if (!this._mgmt) {
      this._mgmt = navigator.mozApps.mgmt;
    }

    this._mgmt.getAll().onsuccess = (function gotAll(evt) {
      for (var i = 0; i < evt.target.result.lengh; i++) {
        this.sendBadgeInfo(event.target.result[i]);
      }
    }).bind(this);
  }
	
  getValue: function _getValue(){
    
  },
  
  setValue: function _setValue(value){
    
  },
  
  showBadge: function _showBadge(){
    
  },
  
  hideBadge: function _hideBadge(){
    
  },
	
	
  sendBadgeInfo: function _sendBadgeInfo(_app){
    var manifest = _app.manifest || _app.updateManifest;
    if (app.HIDDEN_ROLES.indexOf(manifest.role) !== -1) {
        return;
    }
    if(manifest.badge && manifest.badge.onStartup == "shown"){
      this.badges.push({"name": manifest.name,"manifestURL": _app.manifestURL,"initialValue": manifest.badge.initialValue});
    }
    
  }
	
	
};

window.addEventListener('localized', function startup(evt) {
  window.removeEventListener('localized', startup);
  appBadgeManager.init();
});

