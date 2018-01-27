define(['angularAMD', 'uxfwk', 'uxfwk.table'
   , 'uxfwk.require.lang!fgw.security.common'
   , 'uxfwk.require.css!modules/fgw.security/fgw.security.home'
   , 'uxfwk.fgw.security.parentalmodal'
   , 'uxfwk.fgw.security.urlmodal'
   , 'uxfwk.fgw.warningmodal.deleteEntry'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/**
* @ngdoc controller
*/
return ['$scope'
   , 'appUtilities'
   , '$filter'
   , 'uxfwk.fgw.security.parentalmodal'
   , 'uxfwk.fgw.security.urlmodal'
   , 'uxfwk.fgw.warningmodal.deleteEntry'
, function controller ($scope
   , appUtilities
   , $filter
   , modal
   , urlModal
   , modalDeleteEntry){
   var key           = 'fgwSecurityHome';
   var solution      = 'fgw';
   var myscope = {}, zpriv = {};
   var common = {}, dao = {}, devicesDao = {}, devices2Dao = {};
   var fnTranslate = $filter('translate'), $q = appUtilities.$q;;
   
   common.mode = {
         allowed:       0,
         denied:        1,
     p:null};// mode

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
      criticalError:        null,
      loadInProgress:       true,
      dependenciesResolved: false,
      firewallIsInEdition:  false,
      dmzIsInEdition:       false,
      urlIsInEdition:       false,
      data:                 {},
      mode:                 {},
      devices:              [],
      dataReady:            false,  // state flag for main data
      common:               common,
      callback: {},
   p:null});// just for padding

   //[#1.1] - Groups attributes based on template view.

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !$scope[key].criticalError ){
      var $injector = angular.element(document).injector();
      var deps = [];

      //[#2.1] - Request javascript dependencies
      deps.push('modules/{0}.security/{0}.security.dao'.sprintf(solution));
      deps.push('modules/{0}.lan/{0}.lan.dao'.sprintf(solution));
      deps.push('modules/{0}.wifi/{0}.wifi.dao'.sprintf(solution));
      require(deps, function(){

         // Inject dependencies
         dao         = $injector.get('uxfwk.{0}.security.dao'.sprintf(solution));
         devicesDao  = $injector.get('uxfwk.{0}.lan.dao'.sprintf(solution));
         devices2Dao = $injector.get('uxfwk.{0}.wifi.dao'.sprintf(solution));

         //[#2.2] - Request language files
         appUtilities.$translate.refresh()
         .then(function(){ return devicesDao.devices.get().then(function(response){ $console.warn("response1", response);  myscope.devices = angular.copy(response.data); return response; }); })
         .then(function(){ return devices2Dao.devices.get().then(function(response){ $console.warn("response2", response);   myscope.devices.push.apply(myscope.devices, angular.copy(response.data)); return response; }); })
         .then(function(){
            zpriv.validators();
            //[#2.3] - Finally, sets resolution as concluded
            $scope[key].dependenciesResolved = true;
            $scope[key].actionGetData();
         })
         .catch(function(){
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

myscope.newParentalRule = function (){
   var defer   = appUtilities.$q.defer();

   $console.warn("Criar: ", angular.toJson(myscope.devices));
   modal(myscope.devices)
   .then(function(response){
      $console.warn("then::newParentalRule::response", response);
      if ( (true === response.success) && !$U(response.data) ){
         return myscope.actionGetData(); // Trigger a new refresh in order to get the parental rules Ids for the removal action
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return false;
   })
   .catch(function(response){
      $console.warn("catch::newParentalRule::response", response);
      if ( angular.isObject(response) ){ $scope.$root.notifications.alerts.open('error', null, response.errors); }
   })
   .finally(function(){
      $console.warn("newUser::myscope", myscope);
      myscope.loadInProgress = false;
   });
   return defer.promise;
};// ::newParentalRule

myscope.deleteParentalRule = function (rule){
   return modalDeleteEntry({ msg: appUtilities.$filter('translate')('TEXT.FGW.SECURITY.PARENTAL.RULES.REMOVE.MESSAGE') })
      .then(function(response){
         myscope.loadInProgress = true;
         return dao.parentalrule.remove(rule)
      })
      .then(function(response){
         var aux = null;

         if ( (true === response.success) && !$U(response.data) ){
            if ( !$U(aux = uxfwk.findInArray(myscope.data.parentalList, 'mac', response.data.mac)) ){
               myscope.data.parentalList.splice(myscope.data.parentalList.indexOf(rule), 1);
            }
            zpriv.extendsData(myscope.data);
            return true;
         }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
         return false;
      })
      .finally(function(){ myscope.loadInProgress = false; });
};// ::deleteParentalRule

myscope.actionCancelUrlFilterData = function (){
   var defer = appUtilities.$q.defer();
   myscope.mode = uxfwk.merge(myscope.mode, myscope.mode.$$$init);
   zpriv.extendsData(myscope.mode);
   defer.resolve({});
   return defer.promise;
};// ::actionCancelUrlFilterData

myscope.actionConfigUrlFilterData = function (){
   var fn_promises = [], fn_args = [];
   var configData = {};

   var configData = {};
   myscope.loadInProgress = true;
   if ( !$U(myscope.mode) ){
      configData = uxfwk.clean(uxfwk.merge({}, myscope.mode), myscope.mode.$$$init);
   }
   $console.warn("configData", configData);
   return dao.urlrule.config(configData)
   .then(function(response){
      if ( true === response.success ){
         myscope.mode = angular.copy(response.data);
         zpriv.extendsData(myscope.mode);
         return true;
      }else{ return false; $scope.$root.notifications.alerts.open('error', null, response.errors);  }
      //return false;
   })
   .catch(function(response){
      $console.warn("erro", angular.toJson(response));
      $scope.$root.notifications.alerts.open('error', null, response.errors);
   })
   .finally(function(){
      myscope.loadInProgress = false;
   })
};// endof ::actionConfigUrlFilterData

myscope.newUrlRule = function (){
   return urlModal(myscope.devices)
   .then(function(response){
      $console.warn("response", response);
      if ( (true === response.success) && !$U(response.data) ){
         return myscope.actionGetData();
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return false;
   })
   .catch(function(response){
      if ( angular.isObject(response) ){ return $scope.$root.notifications.alerts.open('error', null, response.errors); }
   })
   .finally(function(){});
};// ::newUrlRule

myscope.deleteUrlRule = function (rule){
   myscope.loadInProgress = true;
   return modalDeleteEntry({ msg: $filter('translate')('TEXT.FGW.SECURITY.PARENTAL.RULES.REMOVE.MESSAGE') })
      .then(function(response){
         return dao.urlrule.remove(rule);
      })
      .then(function(response){
         var aux = null;
         if ( (true === response.success) && !$U(response.data) ){
            if ( !$U(aux = uxfwk.findInArray(myscope.data.urlList, 'address', response.data.address)) ){
               myscope.data.urlList.splice(myscope.data.urlList.indexOf(rule), 1);
            }
            zpriv.extendsData(myscope.data);
         }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
         return myscope.data;
      })
      .finally(function (){ myscope.loadInProgress = false; });
};// ::deleteUrlRule

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
   var defer = appUtilities.$q.defer();

   $scope[key].loadInProgress = true;
   dao.get()
   .then(function(args){
      $console.warn("args: ", args);
      if ( (true === args.success) && !$U(args.data) ){
         myscope.data = angular.copy(args.data);
         zpriv.extendsData(myscope.data);
         zpriv.extendsParentalRuleListData(myscope.data.parentalList);
         zpriv.extendsData(myscope.mode);
         defer.resolve(myscope.data);
      }else{ appUtilities.$rootScope.notifications.alerts.open('error', null, args.errors); }
   })
   .catch(function(error){
      defer.reject();
   })
   .finally(function(){
      myscope.loadInProgress = false;
      $console.warn("GET::MYSCOPE: ", myscope);
   });

   return defer.promise;
};// actionGetData

myscope.actionConfigFirewallAndDmzData = function actionConfigFirewallAndDmzData (){
   var fn_promises = [], fn_args = [];
   var defer = $q.defer();
   var configData = {};

   myscope.loadInProgress = true;
   // Toggle
   if ( !$U(configData.firewall = uxfwk.clean(uxfwk.merge({}, myscope.data.firewall), myscope.data.$$$init.firewall, null, ['wanIf'])) && !uxfwk.isEmpty(configData.firewall, ['wanIf']) ){
      fn_promises.push(dao.firewall.config);
      fn_args.push(configData);
   }
   // Toggle
   $console.warn("uxfwk.clean(uxfwk.merge({}, myscope.data.dmz), myscope.data.$$$init.dmz)", uxfwk.clean(uxfwk.merge({}, myscope.data.dmz), myscope.data.$$$init.dmz));
   if ( !$U(configData.dmz = uxfwk.clean(uxfwk.merge({}, myscope.data.dmz), myscope.data.$$$init.dmz)) && !uxfwk.isEmpty(configData.dmz) ){
      configData.dmz.host = ( !!myscope.data.dmz.enable ) ? (myscope.data.dmz.host) : ("");
      $console.warn("configData.dmz", angular.toJson(configData.dmz));
      fn_promises.push(dao.dmz.config);
      fn_args.push(configData);
   }
   $console.warn("fn_promises", fn_promises);
   $console.warn("fn_args", fn_args);
   return uxfwk.promiseChain(fn_promises, fn_args, true)
   .then(function(response){
      $console.warn("responseDMZ", response);
      var errors = [];
      for ( var i = 0, leni = response.length; i < leni; ++i ){
         if ( true === response[i].success ){
            myscope.data = uxfwk.merge(myscope.data, response[i].data);
            zpriv.extendsData(myscope.data);
         }else{ errors.push(response[i].errors); }
      }
      if ( errors.length > 0 ){ return false; }
      else { return true; }
   })
   .catch(function(response){
      $scope.$root.notifications.alerts.open('error', null, response.errors);
   })
   .finally(function(){
      myscope.loadInProgress = false;
   })
};// actionConfigFirewallAndDmzData

myscope.actionCancelFirewallAndDmzData = function (data){
   var defer = appUtilities.$q.defer();
   if ( !$U(myscope.data.firewall) && !$U(myscope.data.$$$init.firewall) ){
      myscope.data.firewall = uxfwk.merge(myscope.data.firewall, myscope.data.$$$init.firewall);
   }
   if ( !$U(myscope.data.dmz) && !$U(myscope.data.$$$init.dmz) ){
      myscope.data.dmz = uxfwk.merge(myscope.data.dmz, myscope.data.$$$init.dmz);
   }
   zpriv.extendsData(myscope.data);
   defer.resolve({});
   return defer.promise;
};// ::actionCancelFirewallAndDmzData


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
$scope[key].actionRefresh = function actionRefresh (){
   $scope[key].actionGetData(); // check if ng-click could be attach to getData function.. check the future imnplications
};// actionGetData

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
      if ( !$U(data.urlmode) ){
         myscope.mode.value = data.urlmode*1;
      }
   }
   return data;
};// ::@extendsData

zpriv.extendsParentalRuleListData = function (data){ var device = null;

$console.warn("data", data);
//   function parseTime (data){
//      return "{0}:{1}".sprintf(data.getHours(), data.getMinutes());
//   };

   if ( angular.isArray(data) ){
      for ( var i = 0, leni = data.length; i < leni; ++i ){
         zpriv.extendsParentalRuleListData(data[i]);
      }
   }else{
//      data.ruleName     = data.username;
      data.deviceName   = angular.isObject(device = uxfwk.findInArray(myscope.devices, 'mac', data.mac || 0)) ? device.hostName || null : null;
//      data.weekDays     = data.days;
//      data.blockingTime = "{0} - {1}".sprintf(parseTime(data.start_time), parseTime(data.end_time));
   }
   return data;
};

/******************************************************************************
 * @name VALIDATION METHODS 
 * @description
 * The following methods shall be used as validators for each attribute. They 
 * are called directly from template. 
 ******************************************************************************/
myscope.isFormValid = function (){
   var result = false;
   if ( !$U(myscope.formData) ){ return myscope.formData.$valid; }
   return result;
};// ::isFormValid

zpriv.validators = function (){
   myscope.validators = { weekDays: {}, time: {}, dmz: {}, mode: {} };

   myscope.validators.mode.options = function (data){
      var options = uxfwk.map2array(uxfwk.mapFilter(myscope.common.mode, ['allowed', 'denied']), 'key', 'value', function(obj){
         obj.text = fnTranslate('TEXT.FGW.SECURITY.HOME.COMMON.MODE.OPTION.' + angular.uppercase(obj.key))
         return obj;
      });
      return uxfwk.cache(data, '$$$mode', options);
   };// ::@mode::options
   
   myscope.validators.weekDays = {
         texter: function (expression){return{
            textualize: function (value){
               var output = null;
               if ( $U(expression) ){ return $filter('uxfwkNullHider')(); }
               if ( $U(expression.weekDays) ){ return $filter('uxfwkNullHider')(); }
               
               output = '';
               output += ( 0x01 & expression.weekDays ) ? (fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.MON') + ', ') : (''); // Mon
               output += ( 0x02 & expression.weekDays ) ? (fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.TUE') + ', ') : (''); // Tue
               output += ( 0x04 & expression.weekDays ) ? (fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.WED') + ', ') : (''); // Wed
               output += ( 0x08 & expression.weekDays ) ? (fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.THU') + ', ') : (''); // Thu
               output += ( 0x10 & expression.weekDays ) ? (fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.FRI') + ', ') : (''); // Fri
               output += ( 0x20 & expression.weekDays ) ? (fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.SAT') + ', ') : (''); // Sat
               output += ( 0x40 & expression.weekDays ) ? (fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.SUN') + ', ') : (''); // Sun
               if ('' === output){ output = $filter('uxfwkNullHider')(); }
               return output;
            },// ::textualize
            expression: expression}},
      p:null};
   
   myscope.validators.time = {
         texter: function (expression){return{
            textualize: function (value){
               if ( $U(value) ){ return null; }
               return $filter('date')(value, 'yyyy-MM-dd', 'UTC');
            },// ::textualize
            expression: expression}},
      p:null};
   
   myscope.validators.dmz.isVisible = function (data){
      var value = false;
      if ( !$U(data.dmz) && !$U(data.dmz.enable) && !!data.dmz.enable){
         value = true;
      }
      return value;
   };// ::@dmz::isVisible
   
};// ::@validators

}];
});



