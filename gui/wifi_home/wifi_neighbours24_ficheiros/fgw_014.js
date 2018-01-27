'use strict';
/**
 * @ngdoc object 
 * @name uxfwk.pon.interface.gpon.counters
 *  
 * @description 
 * This module defines the pon counters that may be read from a pon interface on GPON solution.
 * This controller should be generic enough so that it can be reusable across many different contexts. 
 * It is up to its dependencies to restrict and further specializing the context required.
 * Since this module is defined using angularAMD and controller is loaded by ui-router states, 
 * this module MUST return an annotated function controller.
 */
define(['angularAMD', 'uxfwk', 'uxfwk.table'
        , 'uxfwk.require.lang!fgw.wifi.common'
], function uxfwk_pon_interface_gpon_counters_controller (angularAMD, uxfwk){
   var $console = uxfwk.$console, $U = uxfwk.$U;
   function debug(){ var args = uxfwk.toArray(arguments); args.unshift('FGW::WIFI::STATISTICS'); $console.debug.apply($console, args); }
   function info(){ var args = uxfwk.toArray(arguments); args.unshift('FGW::WIFI::STATISTICS'); $console.info.apply($console, args); }
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!
/**
 * @ngdoc controller
 * @name uxfwk.pon.interface.list#ctrl
 */
return   ['$scope', 'appUtilities', function ($scope, appUtilities){
   var key        = 'fgwWifiStatistics', myscope = null; // defines the name of the object where this table should put all its variable (to avoid $scope pollution)
   var $U         = appUtilities.$u.$U;
   var common     = {}, dao = {}, rules = {}, readers = {};
   var solution   = 'fgw';
   var zpriv      = { field: {} };

/******************************************************************************
 * @name INITIALIZER BLOCK
 * @description
 * The following blocks initialize controller internal states and trigger startup 
 * loading process. 
 ******************************************************************************/

   (function _initialize (){
      //[#1.0] - Creates object scope
      myscope = {
         criticalError:          null,
         loadInProgress:         false,   // controls loading panel visibility
         validatorsLoaded:       false,   // For some reason the ng-repeat interface options was getting an error on init
         dependenciesResolved:   false,   // rendering will only happen after all module dependencies are resolved
         showWarningMessage:     false,
         data:                   [],// meta -> object with all column information, data -> array with all data, page -> array with visible data
         actionSearch: { expanded: true },
         cacheStore:             { readers: {} },
         promises:               uxfwk.promiseList(),
         extraData:              { search: {}, service: {} },
         simpleSearch:{
            cardId:              null,
            cardList:            [],
            cardListOriginal:    [],
            cardListReady:       false,
            cardListLoading:     false,
            portsMap:            {},
            ifId:                null,
            expanded:            true,
         p:null},
      p:null}; // $scope

      //[#2.0] - Request additional dependencies
      if ( !myscope.criticalError ){
         var $injector = angular.element(document).injector();
         var deps = [];
         
         //[#2.1] - Request javascript dependencies
         deps.push('modules/{0}.wifi/{0}.wifi.dao'.sprintf(solution));
         require(deps, function(){
            dao             = $injector.get('uxfwk.{0}.wifi.dao'.sprintf(solution));
            zpriv.validators();

            //[#2.2] - Request language files
            //appUtilities.$translatePartialLoader.addPart('{0}.lan.common'.sprintf(solution));
            appUtilities.$translate.refresh()
            .then(function(){
               //[#2.3] - Finally, sets resolution as concluded
               myscope.dependenciesResolved = true;
               myscope.actionGetData();

            })
            .catch(function(){
               myscope.criticalError = new Error('Undefined behaviour');
            })
         }, function(){

         });
      }//[END#2.0]

      $scope[key] = myscope;
   })();// _initialize

/******************************************************************************
 * @name EVENTS LISTENER
 * @description
 * Listeners to angular events (those normally emited or broadcasted)
 ******************************************************************************/

   $scope.$on('refresh', function($event, area){
      if ( 'body-view' == area ){ $scope[key].actionGetData(); }
   });// @on.refresh['body-view']

/******************************************************************************
 * @name ACTION METHODS 
 * @description
 * The following methods shall be used whenever user trigger some kind of action. 
 * Normally they are attached to template attributes (one major consumer is table 
 * directive). 
 ******************************************************************************/

   $scope[key].actionResetData = function actionResetData (){
      myscope.loadInProgress = true;
      var aux = {};
      return dao.statistics.reset()
         .then(function(response){
            if( response instanceof AbortHttpRequestError){}
            else if ( true == response.success ){
               for ( var i = 0, leni = myscope.data.length; i < leni; ++i ){
                  myscope.data[i].rx = uxfwk.clean({}, myscope.data[i].rx);
                  myscope.data[i].tx = uxfwk.clean({}, myscope.data[i].tx);
               }
               $scope[key].actionGetData();
               myscope.loadInProgress = false;
               return true;
            }
            else{ return false; appUtilities.$rootScope.notifications.alerts.open('error', null, response.errors); }
         })
         .catch(function(response){
            if ( response instanceof Error ){
               appUtilities.$rootScope.notifications.alerts.open('error', null, response.message);
            }else{
               appUtilities.$rootScope.notifications.alerts.open('error', null, response);
            }
         })
         .finally(function(response){ myscope.loadInProgress = false; })
};// actionResetData
   
   /**
    * @ngdoc function
    * @name uxfwk.pon.interface.gpon.counters.controller#actionGetData
    * @methodOf uxfwk.pon.interface.gpon.counters.controller
    *  
    * @description 
    * Action to be triggered whenever a request for refresh data is done.
    *  
    * @returns {promise}
    */
   $scope[key].actionGetData = function actionGetData (){
      $scope[key].loadInProgress = true;
      var defer = appUtilities.$q.defer();
      var data = [], args = {}, requestId = null;


      return dao.statistics.get()
      .then(function(response){
         $console.warn("CTRL::response", response);
         if ( response.data instanceof AbortHttpRequestError ){
            // request aborted, abort process
         } else if ( (true === response.success) && !$U(response.data) ){
            angular.extend($scope[key].data, response.data);
            defer.resolve(myscope.data);
         } else { $scope.$root.notifications.alerts.open('error', null, response.errors); }
      })
      .catch(function(response){
         if ( response instanceof Error ){
            appUtilities.$rootScope.notifications.alerts.open('error', null, response.message);
         }else{
            appUtilities.$rootScope.notifications.alerts.open('error', null, response);
         }
      })
      .finally(function(){
         $scope[key].loadInProgress = false;
      });
      return defer.promise;
   };// actionGetData

   /**
    * @ngdoc function
    * @name uxfwk.service.network.config.controller#_dataSort
    * @methodOf uxfwk.service.network.config.controller
    *
    * @description
    * This method sorts all available data by one attribute in ascend or descend
    * direction.
    *
    * @param {string}attribute it must be a valid attribute
    * @param {boolean} ascend if true sorting is ascending
    * @returns void
    */
   function _dataSort (attribute, ascend, dataToSort){
      var fnSort = null;

      switch ( attribute ){
         case 'name':{
            if ( ascend ){ fnSort = function(a, b){ return (angular.lowercase(a.name) > angular.lowercase(b.name)); } }
            else{ fnSort = function(a, b){ return (angular.lowercase(b.name) > angular.lowercase(a.name)); } }
         }break;

         case 'slot': {
            if ( ascend ){ fnSort = function(a, b){ return (a.aid.card - b.aid.card); } }
            else{ fnSort = function(a, b){ return (b.aid.card - a.aid.card); } }
         }
      }
      if ( fnSort && attribute == 'slot'){
         dataToSort.sort(fnSort);
      }
   };// _dataSort
   
   /******************************************************************************
    * @name VALIDATION METHODS
    * @description
    * The following methods shall be used as validators for each attribute 
    * Initialization must be inside a function since there are dependencies on 
    * services that will be loaded latter.
    ******************************************************************************/
   zpriv.validators = function (){ var locals = null;
      myscope.validators = { form:{}, dhcpCounters:{  } };


      myscope.validators.form.isFormValid = function (){
         return true;
         //return !(myscope.searchForm.$valid && $U(myscope.validators.dhcpCounters.message(myscope.extraData.service)));
      };// ::@form::isFormValid

      locals = {
         getStore:            function(){ return myscope.cacheStore; },
         getInitData:         function(data){ return data.$$$init; },
         common:  common,
         p:null};
//      uxfwk.map2api(rules.service.field, myscope.validators, locals, ['dhcpCounters', 'dhcpCountersEx']);

      myscope.validatorsLoaded = true;
      //myscope.hasError = myscope.validators.dhcpCounters.message(myscope.extraData.service) ? false : true;

   };// ::@validators
   

}];


});
