/**
 * 
 */
define(['angularAMD', 'uxfwk', 'uxfwk.table'
        , 'uxfwk.require.lang!fgw.wifi.common'
        , 'uxfwk.fgw.wifi.rules'
], function _module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
   function debug(){ var args = uxfwk.toArray(arguments); args.unshift('FGW::WIFI::NEIGHBOURS'); $console.debug.apply($console, args); }
   function info(){ var args = uxfwk.toArray(arguments); args.unshift('FGW::WIFI::NEIGHBOURS'); $console.info.apply($console, args); }
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!
   
/**
* @ngdoc controller
*/
return  ['$scope', 'appUtilities'
         , 'stateContext'
         , 'uxfwk.fgw.wifi.rules'
         , function _controller ($scope, appUtilities
         , stateContext
         , wifiRules
         ){
   var dao = {}, common = {}, rules = { wifi: {} }, zpriv = {}, myscope = {};
   var key = 'fgwWifiNeighbours';
   var solution = 'fgw';
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/******************************************************************************
 * @name INITIALIZER BLOCK
 * @description
 * The following blocks initialize controller internal states and trigger startup
 * loading process.
 ******************************************************************************/

(function _initialize (){
   //[#1.0] - Creates object scope
   myscope = $scope[key] = {
      criticalError:        null,
      loadInProgress:       true,
      scanLoading:          true,
      dependenciesResolved: false,  // rendering will only happen after all module dependencies are resolved
      data: [], extraData:{ availableResouces:null },// meta -> object with all column information, data -> array with all data, page -> array with visible data,
      cardList: [],
      availableDstMap:   [],
      availableDstCards: [],
      interfaceList:     [],
      pagination: { data: [], page: 1, size: 10 },
      currentPage: 0,
      pageSize: 50,
      //cacheStore: { ethernetProfileQoSDscp2Tc:{}, ethernetProfileQoSPbit2Tc:{}, ethernetProfileQoSIpp2Tc:{}, profileService:{}, table:{} },
      tableSettings:{
         inlineEdition:  { allow: true },
         inlineCreation: { allow: false },
         inlineDeletion: { allow: true },
         inlineCancel:   { allow: true },
         formCreation:   { allow: false, btnText: '', tooltip: ''}
      },
      common: common,
      stateContext: stateContext,
   p:null};// just for padding

   //[1.1] - Set new properties for the validation object

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !myscope.criticalError ){
      var $injector = appUtilities.$injector;
      var deps = [];

      //[#2.1] - Request javascript dependencies
      deps.push('modules/{0}.wifi/{0}.wifi.dao'.sprintf(solution));
      require(deps, function(){
         dao          = $injector.get('uxfwk.{0}.wifi.dao'.sprintf(solution));
         rules.wifi = wifiRules;

         //[#2.2] - Request language files
         //appUtilities.$translatePartialLoader.addPart('{0}.lan.common'.sprintf(solution));
         appUtilities.$translate.refresh()
         .then(function(){
            //[#2.3] - Finally, sets resolution as concluded
            myscope.dependenciesResolved = true;
            myscope.loadInProgress = false;
            myscope.actionGetData();
            zpriv.validators();
         })
      }, function(error){
      });
   }//[END#2.0]

   info('SCOPE initialized', myscope);
})();// endof _initialize

/******************************************************************************
 * @name ACTION METHODS
 * @description
 * The following methods shall be used whenever user trigger some kind of action
 ******************************************************************************/
myscope.numberOfPages = function (len) {
   var output = 1;
   if (len > 0){ output = Math.ceil(len / myscope.pageSize); }
   return output;
};

/**
 * @ngdoc function
 * @name uxfwk.conf.models#actionGetData
 * @methodOf uxfwk.conf.models.controller
 *
 * @description
 * Action to be triggered whenever a request for refresh data is done.
 *
 * @returns void
 */
myscope.actionGetData = function (){
   var defer = appUtilities.$q.defer();
   var ifType = null;

   myscope.scanLoading = true;   
   ifType = ("wifi5" === myscope.stateContext.context) ? (1) : (0);
   return dao.neighbours.get({ ifType: ifType })
   .then(function(response){
      $console.warn("response", response);
      if ( response.data instanceof AbortHttpRequestError ){
         // request aborted, abort process
      } else if ( (true === response.success) && !$U(response.data) && !$U(response.data.neighborhood) ){
         angular.extend(myscope.data, response.data.neighborhood);
         //[#] - forces a known sorting
         zpriv.extendsData(myscope.data);
         _dataSort('ssid', true);
         zpriv.createNewDataPage();
         defer.resolve(myscope.data);
      } else { $scope.$root.notifications.alerts.open('error', null, response.errors); }
   })
   .catch(function(response){
      if ( response instanceof Error ){
         appUtilities.$rootScope.notifications.alerts.open('error', null, [response.message]);
      }else{
         appUtilities.$rootScope.notifications.alerts.open('error', null, response);
      }
   })
   .finally(function(){
      info('SCOPE refreshed', myscope);
      myscope.scanLoading = false;
   })
   return defer.promise;
};// actionGetData

/******************************************************************************
 * @name PRIVATE METHODS
 * @description
 * The following methods shall be used internally by this controller
 ******************************************************************************/

/**
 * @ngdoc function
 * @name uxfwk.conf.gpon.profile.dba.list.controller#_createNewDataPage
 * @methodOf uxfwk.conf.gpon.profile.dba.list.controller
 *
 * @description
 * This method generates the visible section of data. It is an array where
 * each element is a link to true data stored in $scope.data. This method write
 * to $scope.pagination.data and is dependent of: page index, page size, sorting,
 * and filtering.
 * Due to dependencies above, there must exist the following watchers: page
 * size, page index;
 *
 * @returns void
 */
zpriv.createNewDataPage = function(){
   var json = myscope.pagination;
   var promises = [];

   json.data = myscope.data.slice((json.page - 1)*json.size, json.page * json.size);

   return appUtilities.$q.all(promises);
};// createNewDataPage

$scope.$watch(function _onPaginationSizeChange (){
   return myscope.pagination.size;
}, function(newValue, oldValue){
   zpriv.createNewDataPage();
});// _onPaginationSizeChange

$scope.$watch(function _onPaginationPageChange (){
   return myscope.pagination.page;
}, function(newValue, oldValue){
   zpriv.createNewDataPage();
});// _onPaginationPageChange

/**
 * @ngdoc function
 * @name uxfwk.conf.gpon.profile.dba.list.controller#_dataSort
 * @methodOf uxfwk.conf.gpon.profile.dba.list.controller
 *
 * @description
 * This method sorts all available data by one attribute in ascend or descend
 * direction.
 *
 * @param {string}attribute it must be a valid attribute
 * @param {boolean} ascend if true sorting is ascending
 * @returns void
 */
function _dataSort (attribute, ascend){
   var fnSort = null;

   switch ( attribute ){
      case 'sssid':{
         if ( ascend ){ fnSort = function(a, b){ return (angular.lowercase(a.ssid) > angular.lowercase(b.ssid)); } }
         else{ fnSort = function(a, b){ return (angular.lowercase(b.ssid) > angular.lowercase(a.ssid)); } }
      }break;
   }

   if ( fnSort ){ myscope.data.sort(fnSort); }
};// _dataSort

/**
 * @ngdoc function
 * @name uxfwk.inco.serviceBundle.list.controller#_extendsData
 * @methodOf uxfwk.inco.serviceBundle.list.controller
 *
 * @description
 * This method extends data with some useful members for easy manipulation
 * of data.
 *
 * @param {object[]}data shall be all data retrieved
 * @returns void
 */
zpriv.extendsData = function (data){
   if ( angular.isArray(data) ){
      for ( var i = 0, leni = data.length; i < leni; ++i ){
         zpriv.extendsData(data[i]);
      }
   }else{
      data.actions = ['eye', 'trash', 'lock'];
      data.$$$init   = uxfwk.merge({}, data);
   }
   return data;
};// extendsData

/******************************************************************************
 * @name VALIDATION METHODS
 * @description
 * The following methods shall be used as validators for each attribute
 ******************************************************************************/
zpriv.validators = function (){ var locals = {};
myscope.validators = {};

locals = {};

uxfwk.map2api(rules.wifi.field, myscope.validators, locals, ['ssid', 'bssid', 'rssi', 'snr', 'type', 'bandwidth0', 'channel0', 'netAuth', 'encrypt']);
};// @validators

}];// endof _controller
});// endof _module

