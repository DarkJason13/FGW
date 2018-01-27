define(['angularAMD', 'uxfwk'
        , 'uxfwk.require.lang!fgw.wifi.common'
        , 'uxfwk.fgw.wifi.macmodal'
        , 'uxfwk.fgw.warningmodal.deleteEntry'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/**
* @ngdoc controller
*/
return ['$scope', 'appUtilities', '$filter', 'uxfwk.fgw.wifi.macmodal', 'uxfwk.fgw.warningmodal.deleteEntry', function controller ($scope, appUtilities, $filter, modal, modalDeleteEntry){
   var key           = 'fgwWifiMacFilter';
   var solution      = 'fgw';
   var myscope = {}, zpriv = {};
   var common = {}, dao = {};
   var fnTranslate = $filter('translate');
   
   common.mode = {
         disabled:      0,
         allowed:       1,
         denied:        2,
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
      isInEdition:          false,
      data: [], backups: [],
      ssids:                { wl0: {}, wl1: {} },
      mode:                 {},
      macWl0IsInEdition:    false,
      macWl1IsInEdition:    false,
      dataReady:            false,  // state flag for main data
      common:               common,
   p:null});// just for padding

   //[#1.1] - Groups attributes based on template view.

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !$scope[key].criticalError ){
      var $injector = angular.element(document).injector();
      var deps = [];

      $scope[key].loadInProgress = true;
      //[#2.1] - Request javascript dependencies
      deps.push('modules/{0}.wifi/{0}.wifi.dao'.sprintf(solution));
      require(deps, function(){
         // Inject dependencies
         dao  = $injector.get('uxfwk.{0}.wifi.dao'.sprintf(solution));
         //[#2.2] - Request language files
         appUtilities.$translate.refresh()
         .then(function(){
            zpriv.validators();
            //[#2.3] - Finally, sets resolution as concluded
            $scope[key].dependenciesResolved = true;
            $scope[key].loadInProgress = false;
            $scope[key].actionGetData();
         })
         .catch(function(){
         });
      }, function(response){
         $scope[key].loadInProgress = false;
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

myscope.actionCancelMacFilterData = function (){
   var defer = appUtilities.$q.defer();
   myscope.data = uxfwk.merge(myscope.data, myscope.data.$$$init);
   zpriv.extendsData(myscope.data);
   defer.resolve({});
   return defer.promise;
};// ::actionCancelMacFilterData

myscope.actionConfigMacFilterData = function (){
   var fn_promises = [], fn_args = [];
   var configData = {};

   myscope.loadInProgress = true;
   $console.warn("myscope.mode", myscope.mode);
   if ( !$U(myscope.mode) ){
      configData = uxfwk.clean(uxfwk.merge({}, myscope.mode), myscope.mode.$$$init);
   }
   $console.warn("configData", configData);
   if ( !$U(configData.wl0PrimaryValue) ) { fn_promises.push(dao.macfilter.config); fn_args.push({ iface: 0, network: 'primary', value: configData.wl0PrimaryValue*1 }); }
   if ( !$U(configData.wl0GuestValue) )   { fn_promises.push(dao.macfilter.config); fn_args.push({ iface: 0, network: 'guest', value: configData.wl0GuestValue*1 }); }
   if ( !$U(configData.wl1PrimaryValue) ) { fn_promises.push(dao.macfilter.config); fn_args.push({ iface: 1, network: 'primary', value: configData.wl1PrimaryValue*1 }); }
   if ( !$U(configData.wl1GuestValue) )   { fn_promises.push(dao.macfilter.config); fn_args.push({ iface: 1, network: 'guest', value: configData.wl1GuestValue*1 }); }

   return uxfwk.promiseChain(fn_promises, fn_args, true)
   .then(function(response){
      $console.warn("response", response);
      var errors = [];

      for ( var i = 0, leni = response.length; i < leni; ++i ){
         if ( true === response[i].success ){
            if ( (0 === response[i].data.iface) && ('primary' === response[i].data.network) ){ myscope.mode.wl0PrimaryValue = response[i].data.value; }
            if ( (0 === response[i].data.iface) && ('guest' === response[i].data.network) )  { myscope.mode.wl0GuestValue = response[i].data.value; }
            if ( (1 === response[i].data.iface) && ('primary' === response[i].data.network) ){ myscope.mode.wl1PrimaryValue = response[i].data.value; }
            if ( (1 === response[i].data.iface) && ('guest' === response[i].data.network) )  { myscope.mode.wl1GuestValue = response[i].data.value; }
            
         }else{ errors.push(response[i].errors); }
      }
      if ( errors.length > 0 ){ return false; $scope.$root.notifications.alerts.open('error', null, errors); }
      zpriv.extendsData(myscope.mode);
      return true;
   })
   .finally(function(){
      myscope.loadInProgress = false;
   })
};// endof ::actionConfigMacFilterData

myscope.deleteMacFilterEntry = function (entry, iface, isGuest){
   $console.warn("entry", entry);
   
   switch(iface){
      case 'wl0': entry.iface = 0; break;
      case 'wl1': entry.iface = 1; break;
   }
   entry.isGuest = (!!isGuest) ? (true) : (false);
   return modalDeleteEntry({ msg: appUtilities.$filter('translate')('TEXT.FGW.WIFI.MACFILTER.MODAL.REMOVE.MESSAGE') })
   .then(function(response){
      myscope.loadInProgress = true;
      return dao.macfilter.remove(entry)
   })
   .then(function(response){
      var aux = null;

      if ( (true === response.success) && !$U(response.data) ){
         
         if ( ('wl0' === iface) && !isGuest ){
            if ( !$U(aux = uxfwk.findInArray(myscope.data.wl0.primary, 'mac', entry.mac)) ){
               myscope.data.wl0.primary.splice(myscope.data.wl0.primary.indexOf(entry), 1);
            }
         }
         if ( ('wl0' === iface) && !!isGuest ){
            if ( !$U(aux = uxfwk.findInArray(myscope.data.wl0.guest, 'mac', entry.mac)) ){
               myscope.data.wl0.guest.splice(myscope.data.wl0.guest.indexOf(entry), 1);
            }
         }
         
         if ( ('wl1' === iface) && !isGuest ){
            if ( !$U(aux = uxfwk.findInArray(myscope.data.wl1.primary, 'mac', entry.mac)) ){
               myscope.data.wl1.primary.splice(myscope.data.wl1.primary.indexOf(entry), 1);
            }
         }
         if ( ('wl1' === iface) && !!isGuest ){
            if ( !$U(aux = uxfwk.findInArray(myscope.data.wl1.guest, 'mac', entry.mac)) ){
               myscope.data.wl1.guest.splice(myscope.data.wl1.guest.indexOf(entry), 1);
            }
         }
         zpriv.extendsData(myscope.data);
         return true;
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return false;
   })
   .finally(function(){ myscope.loadInProgress = false; });
}; // ::deleteMacFilterEntry


myscope.newMacFilter = function (iface){
   var defer   = appUtilities.$q.defer();
   var context = {};
   context.iface = iface;
   context.ssids = myscope.ssids;
   modal(context)
   .then(function(newMacFilter){
      $console.warn("newMacFilter", newMacFilter);
      myscope.loadInProgress = true;
      return dao.macfilter.create(newMacFilter);
   })
   .then(function(response){
      $console.warn("aaaaaaa:::resposta", response);
      if ( (true === response.success) && !$U(response.data) ){
         var aux        = null;
         var macfilter  = {};
         
         if ( (0 == response.data.networkInterface) && ('primary' === response.data.ssid) ){
            myscope.data.wl0.primary.push(response.data);
         }
         if ( (0 == response.data.networkInterface) && ('guest' === response.data.ssid) ){
            myscope.data.wl0.guest.push(response.data);
         }
         if ( (1 == response.data.networkInterface) && ('primary' === response.data.ssid) ){
            myscope.data.wl1.primary.push(response.data);
         }
         if ( (1 == response.data.networkInterface) && ('guest' === response.data.ssid) ){
            myscope.data.wl1.guest.push(response.data);
         }
         zpriv.extendsData(myscope.data);
         defer.resolve(myscope.data);
         return true;
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return false;
   })
   .catch(function(response){
      return;
      $scope.$root.notifications.alerts.open('error', null, response.errors);
   })
   .finally(function(){
      $console.warn("newUser::myscope", myscope);
      myscope.loadInProgress = false;
   })
   return defer.promise;
};// ::newMacFilter

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
   dao.macfilter.get()
   .then(function(args){
      $console.warn("args: ", args);
      if ( (true === args.success) && !$U(args.data) ){
         myscope.data = angular.copy(args.data);
         zpriv.extendsData(myscope.data);
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
   })
   return defer.promise;
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
      var obj = null;
      data.$$$init = uxfwk.merge({}, data);
      if ( !$U(data.wl0) ){
         if ( !$U(data.wl0.primary) && !$U(data.wl0.primary[0]) ) {
            if ( $U(myscope.mode.wl0PrimaryValue) ) { myscope.mode.wl0PrimaryValue = data.wl0.primary[0].mode*1; }
            obj = { key: 'primary', value: data.wl0.primary[0].ssid};
            if ( $U(myscope.ssids.wl0.primary) ){ myscope.ssids.wl0[obj.key] = obj.value; }
            if ( $U(data.wl0.primary[0].mac) ){ data.wl0.primary = []; }
         }
         if ( !$U(data.wl0.guest) && !$U(data.wl0.guest[0]) )     { 
            if ( $U(myscope.mode.wl0GuestValue) ) { myscope.mode.wl0GuestValue = data.wl0.guest[0].mode*1; }
            obj = { key: 'guest', value: data.wl0.guest[0].ssid };
            if ( $U(myscope.ssids.wl0.guest) ){ myscope.ssids.wl0[obj.key] = obj.value; }
            if ( $U(data.wl0.guest[0].mac) ){ data.wl0.guest = []; }
         }
      }
      if ( !$U(data.wl1) && (2 === myscope.data.wlanIfCount*1) ){
         if ( !$U(data.wl1.primary) && !$U(data.wl1.primary[0]) ) { 
            if ( $U(myscope.mode.wl1PrimaryValue) ) { myscope.mode.wl1PrimaryValue = data.wl1.primary[0].mode*1; }
            obj = { key: 'primary', value: data.wl1.primary[0].ssid};
            if ( $U(myscope.ssids.wl1.primary) ){ myscope.ssids.wl1[obj.key] = obj.value; }
            if ( $U(data.wl1.primary[0].mac) ){ data.wl1.primary = []; }
         }
         if ( !$U(data.wl1.guest) && !$U(data.wl1.guest[0]) )     { 
            if ( $U(myscope.mode.wl1GuestValue) ) { myscope.mode.wl1GuestValue = data.wl1.guest[0].mode*1; }
            obj = { key: 'guest', value: data.wl1.guest[0].ssid};
            if ( $U(myscope.ssids.wl1.guest) ){ myscope.ssids.wl1[obj.key] = obj.value; }
            if ( $U(data.wl1.guest[0].mac) ){ data.wl1.guest = []; }
         }
      }
   }
   return data;
};// ::@extendsData

zpriv.formatDate = function formatDate(dt) {
   return dt.getFullYear() + "/" + dt.getMonth() + "/" + dt.getDay() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
};// ::@formatDate

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

zpriv.validators = function (){
   myscope.validators = { mode: {} };

   myscope.validators.mode.options = function (data){
      var options = uxfwk.map2array(uxfwk.mapFilter(myscope.common.mode, ['disabled', 'allowed', 'denied']), 'key', 'value', function(obj){
         obj.text = fnTranslate('TEXT.FGW.WIFI.MACFILTER.COMMON.MODE.OPTION.' + angular.uppercase(obj.key))
         return obj;
      });
      return uxfwk.cache(data, '$$$mode', options);
   };// ::@mode::options
};// ::@validators

}];
});



