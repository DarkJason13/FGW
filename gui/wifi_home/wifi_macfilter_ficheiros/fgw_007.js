define(['angularAMD', 'uxfwk'
   , 'uxfwk.require.lang!fgw.tools.common'
   , 'uxfwk.fgw.tools.restore.modal'
   , 'uxfwk.fgw.tools.warningmodal'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/**
* @ngdoc controller
*/
return ['$scope'
   , '$filter'
   , 'appUtilities'
   , 'uxfwk.fgw.tools.restore.modal'
   , 'uxfwk.fgw.tools.warningmodal'
, function controller ($scope
   , $filter
   , appUtilities
   , restoreBackupModal
   , warningModal){
   var key           = 'fgwToolsHome';
   var solution      = 'fgw';
   var myscope = {}, zpriv = {};
   var common = {
      LOGLEVEL: {
         EMERGENCY:        0,
         ALERT:            1,
         CRITICAL:         2,
         ERROR:            3,
         WARNING:          4,
         NOTICE:           5,
         INFORMATIONAL:    6,
         DEBBUGGING:       7,
      p:null},
      DISPLAYLEVEL:{
         EMERGENCY:        0,
         ALERT:            1,
         CRITICAL:         2,
         ERROR:            3,
         WARNING:          4,
         NOTICE:           5,
         INFORMATIONAL:    6,
         DEBBUGGING:       7,
      p:null},
      MODE: {
         LOCAL:   1,
         REMOTE:  2,
         BOTH:    3,
      p:null}
   }, dao = {};
   var fnTranslate = $filter('translate');
   var fnUppercase = $filter('uppercase');
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/******************************************************************************
 * @name INITIALIZER BLOCK
 * @description
 * The following blocks initialize controller internal states and trigger startup
 * loading process.
 ******************************************************************************/

(function _initialize (){
   var myattrs = null, mygroup = null;

   //[#1.0] - Creates object scope
   myscope = ($scope[key] = {
      criticalError:          null,
      loadInProgress:         true,
      dependenciesResolved:   false,
      isInEdition:            false,
      systemLogsIsInEdition:  false,
      pageSize:               10,
      data:                   {},
      backups:                [],
      systemLogs:             [],
      systemLogsParams:       {},
      dataReady:              false,  // state flag for main data
      common:                 common,
      showLogMsg:             false,
   p:null});// just for padding

   //[#1.1] - Groups attributes based on template view.

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !$scope[key].criticalError ){
      var $injector = angular.element(document).injector();
      var deps = [];

      $scope[key].loadInProgress = true;
      //[#2.1] - Request javascript dependencies
      deps.push('modules/{0}.tools/{0}.tools.dao'.sprintf(solution));
      //deps.push('modules/{0}.home/{0}.home.common'.sprintf(solution));
      require(deps, function(){

         // Inject dependencies
         dao.tools  = $injector.get('uxfwk.{0}.tools.dao'.sprintf(solution));

         //[#2.2] - Request language files
         appUtilities.$translatePartialLoader.addPart('{0}.tools.common'.sprintf(solution));
         appUtilities.$translate.refresh()
         .then(function(){
            //[#2.3] - Finally, sets resolution as concluded
            $scope[key].dependenciesResolved = true;
            $scope[key].loadInProgress = false;
            $scope[key].actionGetData();
            zpriv.validators();
         })
         .catch(function(){
            myscope.criticalError = new Error('Undefined behaviour');
         });
      }, function(response){
         $console.warn(response);
         myscope.criticalError = response;
      });
   }//[END#2.0]
   $console.info('SCOPE _initialize', myscope);
})();// endof _initialize 

/******************************************************************************
 * @name ACTION METHODS
 * @description
 * The following methods shall be used whenever user trigger some kind of action
 ******************************************************************************/


/**
 * @ngdoc function
 * @name  actionGetData
 * @methodOf
 *
 * @description
 * Action to be triggered whenever a request for refresh data is done.
 *
 * @returns void
 */
myscope.actionGetData = function actionGetData (){
   myscope.loadInProgress = true;
   return dao.tools.get()
      .then(function(response){
         if ( response instanceof AbortHttpRequestError ){}
         else if ( true === response.success ){ 
            myscope.data = angular.copy(response.data);
            myscope.systemLogsParams = myscope.data;
            zpriv.extendsData(myscope.data);
            myscope.showLogMsg = false;
         }
         else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      }).catch(function(){}).finally(function(){ myscope.loadInProgress = false; })
};// actionGetData

/**
 * @ngdoc function
 * @name  actionRefresh
 * @methodOf
 *
 * @description
 * Action to be triggered whenever a request for refresh data is done.
 *
 * @returns void
 */
myscope.actionRefresh = function actionRefresh (){
   $scope[key].actionGetData(); // check if ng-click could be attach to getData function.. check the future implications
};// actionGetData

/**
 * @ngdoc function
 * @name  actionGenerateLogs
 * @methodOf
 *
 * @description
 * Generates logs
 *
 * @returns void
*/
myscope.actionGenerateLogs = function actionGenerateLogs (){ var defer = appUtilities.$q.defer();
   myscope.loadInProgress = true;
   return dao.tools.logs.get(myscope.systemLogsParams)
      .then(function(response){
         if ( response instanceof AbortHttpRequestError ){}
         else if ( (true === response.success) && !$U(response.data)  ){ 
            $console.warn("actionGenerateLogs::myscope.systemLogs.length", myscope.systemLogs.length);
            myscope.systemLogs = response.data;
            myscope.showLogMsg = ( 0 === myscope.systemLogs.length ) ? (true) : (false);
         }
         else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      })
      .finally(function(){ myscope.loadInProgress = false; });
};// ::actionGenerateLogs

myscope.reboot = function(){
   var defer   = appUtilities.$q.defer();
   var msg = fnTranslate('TEXT.FGW.TOOLS.HOME.COMMON.WARNINGMODAL.REBOOTMESSAGE');
   warningModal(msg)
   .then(function(response){
      if ( true === response.success ){ myscope.loadInProgress = true; return dao.tools.cmds.reboot(); }
      return;
   })
   .then(function(response){
      if ( response instanceof AbortHttpRequestError ){}
      else if ( (true === response.success) ){
         // Do something!!!
      }
      else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
   })
   .catch(function(){}).finally(function(){ myscope.loadInProgress = false; });
   return defer.promise;
};// ::reboot

myscope.restoreDefaults = function(){
   var defer   = appUtilities.$q.defer();
   var msg = fnTranslate('TEXT.FGW.TOOLS.HOME.COMMON.WARNINGMODAL.RESTOREDEFAULTMESSAGE');
   warningModal(msg)
   .then(function(response){
      if ( true === response.success ){ myscope.loadInProgress = true; return dao.tools.cmds.restoreDefaults(); }
      return;
   })
   .then(function(response){
      if ( response instanceof AbortHttpRequestError ){}
      else if ( (true === response.success) ){
         // Do something!!!
      }
      else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
   })
   .catch(function(){}).finally(function(){ myscope.loadInProgress = false; });
   return defer.promise;
};// ::restoreDefaults

myscope.createBackup = function(){
   myscope.loadInProgress = true;
   return dao.tools.cmds.backup()
   .then(function(response){
      if ( response instanceof AbortHttpRequestError ){}
      else if ( (true === response.success) ){
         // Do something!!!
      }
      else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
   })
   .catch(function(){}).finally(function(){  myscope.loadInProgress = false; });
};// ::createBackup


myscope.actionCancelSystemLogsData = function (){
   var defer = appUtilities.$q.defer();
   myscope.data.systemLogs = uxfwk.merge(myscope.data.systemLogs, myscope.data.$$$init.systemLogs);
   zpriv.extendsData(myscope.data);
   defer.resolve({});
   return defer.promise;
};// ::actionCancelSystemLogsData

myscope.actionConfigSystemLogsData = function (){
   var defer = appUtilities.$q.defer();
   var configData = {};

   $console.warn("myscope.data.systemLogs", myscope.data.systemLogs, angular.toJson(myscope.data.systemLogs));
   var configData = {};
   if ( !$U(myscope.data.systemLogs) ){
      configData = angular.copy(myscope.data.systemLogs);
   }
   $console.warn("configData", configData);

   myscope.loadInProgress = true;
   dao.tools.logs.config(configData)
   .then(function(response){
      $console.warn("response", response);
      if ( true === response.success ){
         myscope.data.systemLogs = angular.copy(response.data);
         zpriv.extendsData(myscope.data);
         defer.resolve(true);
         //return true;
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); defer.resolve(false); }
      //return false;
   })
   .catch(function(response){
      $console.warn("erro", angular.toJson(response));
      $scope.$root.notifications.alerts.open('error', null, response.errors);
   })
   .finally(function(){
      myscope.loadInProgress = false;
   });
   return defer.promise;
};// endof ::actionConfigSystemLogsData

/**
 * @ngdoc function
 * @name  actionRestoreBackup
 * @methodOf fgw.tools.home#controller
 *
 * @description
 * Trigger modal to restore with backup
 *
 * @returns promise
 */
myscope.actionRestoreBackup = function(){
   var defer   = appUtilities.$q.defer();
   restoreBackupModal()
   .then(function(response){})
   .catch(function(){}).finally(function(){});
   return defer.promise;
};// ::actionRestoreBackupModal


/******************************************************************************
 * @name PRIVATE METHODS
 * @description
 * The following methods shall be used internally by this controller
 ******************************************************************************/
zpriv.extendsData = function (data){
   if ( angular.isArray(data) ){
      for ( var i = 0, leni = data.length; i < leni; ++i ){
         zpriv.extendsData(data[i]);
      }
   }else{
      data.$$$init = uxfwk.merge({}, data);
   }
   return data;
};// ::@extendsData


/******************************************************************************
 * @name VALIDATION METHODS 
 * @description
 * The following methods shall be used as validators for each attribute. They 
 * are called directly from template. 
 ******************************************************************************/
myscope.isFormValid = function (){
   if ( !$U(myscope.formData) ){ return myscope.formData.$valid; }
   return false;
};// ::isFormValid

zpriv.validators = function (){ var cache = { logLevel: { list: null }, displayLevel: { list: null }, mode: { list: null } };
   myscope.validators = { logLevel: {}, restoresettings: {} };

   myscope.validators.restoresettings = (function(){ var field = {}
      field.isDisabled = uxfwk.$false;// ::isDisabled
      return field;
   })();// ::validators::restoresettings

   myscope.validators.logLevel = (function(){ var field = {};
      field.isAttrVisible = function (data){ var output = false;
         $console.warn("myscope.validators.logLevel::data", angular.toJson(data));
         if ( !angular.isObject(data) ){}
         else if ( !angular.isObject(data.systemLogs) ){}
         else if ( angular.isDefined(data.systemLogs.enable) && true === data.systemLogs.enable ){ output = true; }
         return output;
      };// ::isAttrVisible
      field.isVisible = uxfwk.$true;// ::isVisible
      field.isRequired = uxfwk.$false;// ::isRequired
      field.isDisabled = uxfwk.$false;// ::isDisabled
      field.options = function(data){
         if ( !angular.isArray(cache.logLevel.list) ) {
            cache.logLevel.list = uxfwk.map2array(common.LOGLEVEL, 'key', 'value', function (obj) {
               obj.text = fnTranslate('TEXT.FGW.TOOLS.HOME.COMMON.SYSTEMLOGS.LOG.LEVEL.' + obj.key);
               return obj;
            });
         }
         return cache.logLevel.list;
      };// ::options
      field.texter = function (data, expression){return{
         textualize: function (value, data){ var key = null;
            if ( $U(value) ){ return null; }
            else if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.LOGLEVEL)) ){ return null; }
            else { return fnTranslate('TEXT.FGW.TOOLS.HOME.COMMON.SYSTEMLOGS.LOG.LEVEL.'+fnUppercase(key)); }
         },// @textualize
         expression: expression}};// @texter
      return field;
   })();// ::validators::logLevel

   myscope.validators.displayLevel = (function(){ var field = {};
      field.isAttrVisible = function (data){ var output = false;
         if ( !angular.isObject(data) ){}
         else if ( !angular.isObject(data.systemLogs) ){}
         else if ( angular.isDefined(data.systemLogs.enable) && true === data.systemLogs.enable ){ output = true; }
         return output;
      };// ::isAttrVisible
      field.isVisible = uxfwk.$true;// ::isVisible
      field.isRequired = uxfwk.$false;// ::isRequired
      field.isDisabled = uxfwk.$false;// ::isDisabled
      field.options = function(data){
         if ( !angular.isArray(cache.displayLevel.list) ) {
            cache.displayLevel.list = uxfwk.map2array(common.DISPLAYLEVEL, 'key', 'value', function (obj) {
               obj.text = fnTranslate('TEXT.FGW.TOOLS.HOME.COMMON.SYSTEMLOGS.DISPLAY.LEVEL.' + obj.key);
               return obj;
            });
         }
         return cache.displayLevel.list;
      };// ::options
      field.texter = function (data, expression){return{
         textualize: function (value, data){ var key = null;
            if ( $U(value) ){ return null; }
            else if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.DISPLAYLEVEL)) ){ return null; }
            else { return fnTranslate('TEXT.FGW.TOOLS.HOME.COMMON.SYSTEMLOGS.DISPLAY.LEVEL.'+fnUppercase(key)); }
         },// @textualize
         expression: expression}};// @texter
      return field;
   })();// ::validators::displayLevel

   myscope.validators.mode = (function(){ var field = {};
      field.isAttrVisible = function (data){ var output = false;
         if ( !angular.isObject(data) ){}
         else if ( !angular.isObject(data.systemLogs) ){}
         else if ( angular.isDefined(data.systemLogs.enable) && true === data.systemLogs.enable ){ output = true; }
         return output;
      };// ::isAttrVisible
      field.isVisible = uxfwk.$true;// ::isVisible
      field.isRequired = uxfwk.$false;// ::isRequired
      field.isDisabled = uxfwk.$false;// ::isDisabled
      field.options = function(data){
         if ( !angular.isArray(cache.mode.list) ) {
            cache.mode.list = uxfwk.map2array(common.MODE, 'key', 'value', function (obj) {
               obj.text = fnTranslate('TEXT.FGW.TOOLS.HOME.COMMON.SYSTEMLOGS.MODE.' + obj.key);
               return obj;
            });
         }
         return cache.mode.list;
      };// ::options
      field.texter = function (data, expression){return{
         textualize: function (value, data){ var key = null;
            if ( $U(value) ){ return null; }
            else if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.MODE)) ){ return null; }
            else { return fnTranslate('TEXT.FGW.TOOLS.HOME.COMMON.SYSTEMLOGS.MODE.'+fnUppercase(key)); }
         },// @textualize
         expression: expression}};// @texter
      return field;
   })();// ::validators::mode

   myscope.validators.applySettings = (function(){ var field = {};
      field.isAttrVisible = function (data){ var output = false;
         if ( !angular.isObject(data) ){}
         else if ( !angular.isObject(data.systemLogs) ){}
         else if ( angular.isDefined(data.systemLogs.enable) && true === data.systemLogs.enable ){ output = true; }
         return output;
      };// ::isAttrVisible
      field.isVisible = uxfwk.$true;// ::isVisible
      field.isDisabled = uxfwk.$false;// ::isDisabled
      return field;
   })();// ::validators::applySettings

   myscope.validators.systemLogsTable = (function(){ var field = {};
      field.isAttrVisible = function (data){ return myscope.systemLogs.length > 0 ; };// ::isAttrVisible
      field.isVisible = uxfwk.$true;// ::isVisible
      return field;
   })();// ::validators::systemLogsTable

   myscope.validators.serverIp = (function(){ var field = {};
      field.isAttrVisible = function (data){ var output = false;
         if ( !angular.isObject(data) ){}
         else if ( !angular.isObject(data.systemLogs) ){}
         else if ( angular.isDefined(data.systemLogs.enable) && (true === data.systemLogs.enable) && angular.isDefined(data.systemLogs.mode) && ( data.systemLogs.mode == common.MODE.REMOTE || data.systemLogs.mode == common.MODE.BOTH) ){ output = true; }
         return output;
      };// ::isAttrVisible
      field.isVisible = uxfwk.$true;// ::isVisible
      field.isRequired = function (data) {
         return (myscope.systemLogsParams.systemLogs.mode == common.MODE.REMOTE);
      };// ::isRequired
      field.isDisabled = uxfwk.$false;// ::isDisabled
      field.texter = function (data, expression){return{
         textualize: function (value, data){ var key = null;
            if ( $U(value) ){ return null; }
            return value;
         },// @textualize
      expression: expression}};// @texter
      return field;
   })();// ::validators::serverIp

   myscope.validators.serverUdp = (function(){ var field = {};
      field.isAttrVisible = function (data){ var output = false;
         if ( !angular.isObject(data) ){}
         else if ( !angular.isObject(data.systemLogs) ){}
         else if ( angular.isDefined(data.systemLogs.enable) && (true === data.systemLogs.enable) && angular.isDefined(data.systemLogs.mode) && ( data.systemLogs.mode == common.MODE.REMOTE || data.systemLogs.mode == common.MODE.BOTH) ){ output = true; }
         return output;
      };// ::isAttrVisible
      field.isVisible = uxfwk.$true;// ::isVisible
      field.isRequired = function(data){
         return (myscope.systemLogsParams.systemLogs.mode == common.MODE.REMOTE);
      };// ::isRequired
      field.isDisabled = uxfwk.$false;// ::isDisabled
      field.texter = function (data, expression){return{
         textualize: function (value, data){ var key = null;
            if ( $U(value) ){ return null; }
            return value;
         },// @textualize
      expression: expression}};// @texter
      return field;
   })();// ::validators::serverUdp
};// ::@validators

}];
});



