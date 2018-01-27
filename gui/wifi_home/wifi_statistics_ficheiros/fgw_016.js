define(['angularAMD', 'uxfwk'
        , 'uxfwk.require.lang!fgw.wifi.common'
        , 'uxfwk.fgw.lan.staticleasesmodal'
        , 'uxfwk.fgw.warningmodal.deleteEntry'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/**
* @ngdoc controller
*/
return ['$scope', 'appUtilities', '$filter', 'uxfwk.fgw.lan.staticleasesmodal', 'uxfwk.fgw.warningmodal.deleteEntry', function controller ($scope, appUtilities, $filter, modal, modalDeleteEntry){
   var key           = 'fgwLanStaticLeases';
   var solution      = 'fgw';
   var myscope = {}, zpriv = {};
   var common = {}, dao = {};
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
      isInEdition:          false,
      data: [], backups: [],
      bridges:                [],
      mode:                 {},
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
      deps.push('modules/{0}.lan/{0}.lan.dao'.sprintf(solution));
      require(deps, function(){
         // Inject dependencies
         dao  = $injector.get('uxfwk.{0}.lan.dao'.sprintf(solution));
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

myscope.deleteStaticLeaseEntry = function (entry, bridge){
   $console.warn("entry", entry);
   
   return modalDeleteEntry({ msg: appUtilities.$filter('translate')('TEXT.FGW.LAN.STATICLEASE.MODAL.REMOVE.MESSAGE') })
   .then(function(response){
      myscope.loadInProgress = true;
      return dao.staticlease.remove(entry, bridge);
   })
   .then(function(response){
      $console.warn("deleteStaticLeaseEntry::response", entry, bridge);
      var aux = null;

      if ( (true === response.success) && !$U(response.data) ){
         if ( !$U(aux = uxfwk.findInArray(myscope.data, 'groupName', bridge)) ){
            aux.leases.splice(aux.leases.indexOf(entry), 1);
         }
         zpriv.extendsData(myscope.data);
         return true;
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return false;
   })
   .catch(function(response){
      $console.warn("catch::deleteStaticLeaseEntry::response", response);
      if ( angular.isObject(response) ){ $scope.$root.notifications.alerts.open('error', null, response.errors); }
   })
   .finally(function(){ myscope.loadInProgress = false; });
}; // ::deleteStaticLeaseEntry


myscope.newStaticLease = function (){
   var defer   = appUtilities.$q.defer();
   var context = {}, aux = null;
   context.bridges = myscope.bridges;
   modal(context)
   .then(function(newStaticLease){
      $console.warn("newStaticLease", newStaticLease);
      return dao.staticlease.create(newStaticLease);
   })
   .then(function(response){
      $console.warn("newStaticLease::response", response);
      if ( (true === response.success) && !$U(response.data) ){
         if ( !$U(aux = uxfwk.findInArray(myscope.data, 'groupName', response.data.groupname)) ){
            aux.leases.push(response.data.lease);
         }
         zpriv.extendsData(myscope.data);
         defer.resolve(myscope.data);
         return true;
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return false;
   })
   .catch(function(response){
      if ( angular.isObject(response) ){ $scope.$root.notifications.alerts.open('error', null, response.errors); }
   })
   .finally(function(){
      $console.warn("newStaticLease::myscope", myscope);
      myscope.loadInProgress = false;
   })
   return defer.promise;
};// ::newStaticLease

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
   dao.staticlease.get()
   .then(function(args){
      $console.warn("args: ", args);
      if ( (true === args.success) && !$U(args.data) && !$U(args.data.data) && !!angular.isArray(args.data.data.staticLeases) ){
         myscope.data = angular.copy(args.data.data.staticLeases);
         if ( !!angular.isArray(args.data.groups.groupNames) ){
            myscope.bridges = angular.copy(args.data.groups.groupNames);
         }
         zpriv.extendsData(myscope.data);
         defer.resolve(myscope.data);
      }else{ appUtilities.$rootScope.notifications.alerts.open('error', null, args.errors); }
   })
   .catch(function(response){
      if ( response instanceof Error ){
         appUtilities.$rootScope.notifications.alerts.open('error', null, [response.message]);
      }else{
         appUtilities.$rootScope.notifications.alerts.open('error', null, response);
      }
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

zpriv.validators = function (){
   myscope.validators = {};
};// ::@validators

}];
});



