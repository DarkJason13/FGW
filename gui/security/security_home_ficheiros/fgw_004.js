define(['angularAMD', 'uxfwk'
        , 'uxfwk.require.css!modules/fgw.wifi/fgw.wifi.home'
        , 'uxfwk.require.lang!fgw.wifi.common'
        , 'uxfwk.fgw.wifi.common'
        , 'uxfwk.fgw.wifi.rules'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/**
* @ngdoc controller
*/
return ['$scope', 'appUtilities', '$filter', '$timeout'
        , 'uxfwk.fgw.wifi.common'
        , 'uxfwk.fgw.wifi.rules'
        , function controller ($scope, appUtilities, $filter, $timeout
        , common
        , wifiRules
        ){
   var key           = 'fgwWifiHome';
   var solution      = 'fgw';
   var myscope = {}, zpriv = {};
   var dao = {}, rules = { wifi: {} };
   var promiseStatus = null;
   var fnTranslate = $filter('translate');
   

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
      wl0IsInEdition:       false,
      wl1IsInEdition:       false,
      data: {},
      status:               {},
      capabilities:         {},
      wl0BwKeys:            [],
      wl1BwKeys:            [],
      dataReady:            false,  // state flag for main data
      common:               common,
   p:null});// just for padding

   //[#1.1] - Groups attributes based on template view.

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !$scope[key].criticalError ){
      var $injector = angular.element(document).injector();
      var deps = [];

      //[#2.1] - Request javascript dependencies
      deps.push('modules/{0}.wifi/{0}.wifi.dao'.sprintf(solution));
      require(deps, function(){

         // Inject dependencies
         dao  = $injector.get('uxfwk.{0}.wifi.dao'.sprintf(solution));
         rules.wifi = wifiRules;
         //[#2.2] - Request language files
         appUtilities.$translate.refresh()
         .then(function(){ return dao.caps.get().then(function(response){ myscope.capabilities = angular.copy(response.data); return response; }); })
         .then(function(){
            //[#2.3] - Finally, sets resolution as concluded
            $scope[key].dependenciesResolved = true;
            $scope[key].actionGetData();
            zpriv.validators();
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
         myscope.data = args.data;
         zpriv.extendsData(myscope.data);
         myscope.actionGetStatus();
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

myscope.actionGetStatus = function actionGetStatus(){
   var defer = appUtilities.$q.defer();

   $scope[key].loadInProgress = true;
   dao.status()
   .then(function(args){
      $console.warn("args: ", args);
      if ( (true === args.success) && !$U(args.data) ){
         myscope.status = angular.copy(args.data);
         defer.resolve(myscope.status);
      }else{ appUtilities.$rootScope.notifications.alerts.open('error', null, args.errors); }
   })
   .catch(function(error){
      defer.reject();
   })
   .finally(function(){
      myscope.loadInProgress = false;
      $console.warn("GET::MYSCOPE::STATUS: ", myscope);
   });

   return defer.promise;
}; // actionGetStatus

/**
 * @ngdoc function
 * @name  actionConfigWl0
 * @methodOf
 *
 * @description
 * Action to be triggered whenever a request for config data is done.
 *
 * @returns void
 */
myscope.actionConfigWl0 = function(){
   myscope.loadInProgress = true;
   var configData = {};
   if ( !$U(myscope.data.wl0) ){
      configData = uxfwk.clean(uxfwk.merge({}, myscope.data.wl0), myscope.data.$$$init.wl0);
   }
   $console.warn("configData", configData);
   return dao.config(configData, 'wl0')
      .then(function(response){
         $console.warn("response", response);
         if( response instanceof AbortHttpRequestError){}
         else if ( true == response.success ){
            if ( promiseStatus ){ $timeout.cancel(promiseStatus); }
            uxfwk.merge(myscope.data.wl0, response.data);
            zpriv.extendsData(myscope.data);
            promiseStatus = $timeout(myscope.actionGetStatus, 10000).then(function(){
               promiseStatus = null;
            })
            return true;
            //myscope.data = angular.merge(myscope.data, response);
         }
         else{ appUtilities.$rootScope.notifications.alerts.open('error', null, response.errors); }
      }).finally(function(response){ appUtilities.$rootScope.$broadcast('hide'); myscope.loadInProgress = false; })
};// ::actionConfigWl0

/**
 * @ngdoc function
 * @name  actionConfigWl1
 * @methodOf
 *
 * @description
 * Action to be triggered whenever a request for config data is done.
 *
 * @returns void
 */
myscope.actionConfigWl1 = function(){
   myscope.loadInProgress = true;
   var configData = {};
   if ( !$U(myscope.data.wl1) ){
      configData = uxfwk.clean(uxfwk.merge({}, myscope.data.wl1), myscope.data.$$$init.wl1);
   }
   return dao.config(configData, 'wl1')
      .then(function(response){
         if( response instanceof AbortHttpRequestError){}
         else if ( true == response.success ){
            if ( promiseStatus ){ $timeout.cancel(promiseStatus); }
            uxfwk.merge(myscope.data.wl1, response.data);
            zpriv.extendsData(myscope.data);
            promiseStatus = $timeout(myscope.actionGetStatus, 10000).then(function(){
               promiseStatus = null;
            })
            return true;
            //myscope.data = angular.merge(myscope.data, response);
         }
         else{ appUtilities.$rootScope.notifications.alerts.open('error', null, response.errors); }
      }).finally(function(response){ appUtilities.$rootScope.$broadcast('hide'); myscope.loadInProgress = false; })
};// ::actionConfigWl1

/**
 * @ngdoc function
 * @name  actionCancelDataWl0
 * @methodOf
 *
 * @description
 * Action to be triggered whenever a request for cancel data is done.
 *
 * @returns void
 */
myscope.actionCancelDataWl0 = function (){
   var defer = appUtilities.$q.defer();
   myscope.data = uxfwk.merge(myscope.data, myscope.data.$$$init);
   zpriv.extendsData(myscope.data);
   appUtilities.$rootScope.$broadcast('hide');
   myscope.wl0IsInEdition = false;
   defer.resolve({});
   return defer.promise;
};// ::actionCancelDataWl0

/**
 * @ngdoc function
 * @name  actionCancelDataWl1
 * @methodOf
 *
 * @description
 * Action to be triggered whenever a request for cancel data is done.
 *
 * @returns void
 */
myscope.actionCancelDataWl1 = function (){
   var defer = appUtilities.$q.defer();
   myscope.data = uxfwk.merge(myscope.data, myscope.data.$$$init);
   zpriv.extendsData(myscope.data);
   appUtilities.$rootScope.$broadcast('hide');
   myscope.wl1IsInEdition = false;
   defer.resolve({});
   return defer.promise;
};// ::actionCancelDataWl1

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
      var aux = null;
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

myscope.isFormValid0 = function (){
   var result = false;
   if ( !$U(myscope.formData0) ){ return myscope.formData0.$valid; }
   return result;
};// ::isFormValid0

myscope.isFormValid1 = function (){
   var result = false;
   if ( !$U(myscope.formData1) ){ return myscope.formData1.$valid; }
   return result;
};// ::isFormValid1

zpriv.validators = function (){ var locals = {};
   myscope.validators = {};

   locals = {
      capabilities:{
         bandwidthwl0:           myscope.capabilities.bandwidth.wl0,
         bandwidthwl1:           myscope.capabilities.bandwidth.wl1,
         channelwl0:             myscope.capabilities.channel.wl0,
         channelwl1:             myscope.capabilities.channel.wl1,
         p:null},// capabilities
      p:null};
   
   uxfwk.map2api(rules.wifi.field, myscope.validators, locals, ['network', 'bandwidth0', 'bandwidth1', 'channel0', 'channel1', 'transmitPower0', 'transmitPower1', 
                                                                'netAuth', 'encrypt', 'encryptStr', 'currentNetKey', 'password', 'wps', 'wpsmsg', 'wep', 'preAuthWpa2', 'reAuthInterval',
                                                                'intervalWpaKeyChange', 'radiusIp', 'radiusPort', 'radiusKey', 'netKey1', 'netKey2', 'netKey3', 'netKey4']);
};// ::@validators

}];
});



