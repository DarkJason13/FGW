define(['angularAMD', 'uxfwk', 'uxfwk.table'
        , 'uxfwk.require.css!modules/fgw.lan/fgw.lan.devices'
        , 'uxfwk.require.lang!fgw.lan.common'
], function _module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
   function debug(){ var args = uxfwk.toArray(arguments); args.unshift('FGW::LAN::DEVICES'); $console.debug.apply($console, args); }
   function info(){ var args = uxfwk.toArray(arguments); args.unshift('FGW::LAN::DEVICES'); $console.info.apply($console, args); }
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!
   
/**
* @ngdoc controller
*/
return  ['$scope', 'appUtilities'
         , '$filter'
         , function _controller ($scope, appUtilities
         , $filter
         ){
   var dao = {portmirror:{}}, readers = {}, common = {}, rules = {}, zpriv = {}, myscope = null;
   var key = 'fgwLanDevices';
   var solution = 'fgw';
   var fnTranslate = $filter('translate');
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
         formCreation:   { allow: true, btnText: 'TEXT.EQUIPMENT.GPON.APPLICATION.PORTMIRROR.COMMON.CREATE.NEW.MIRROR', tooltip: 'TEXT.EQUIPMENT.GPON.APPLICATION.PORTMIRROR.COMMON.CREATE.NEW.MIRROR'}
      },
      common: common,
      search:{
         expression: null
      },
   p:null};// just for padding

   //[1.1] - Set new properties for the validation object

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !myscope.criticalError ){
      var $injector = appUtilities.$injector;
      var deps = [];

      //[#2.1] - Request javascript dependencies
      deps.push('modules/{0}.lan/{0}.lan.dao'.sprintf(solution));
      require(deps, function(){
         dao          = $injector.get('uxfwk.{0}.lan.dao'.sprintf(solution));
         zpriv.validators();

         //[#2.2] - Request language files
         appUtilities.$translate.refresh()
         .then(function(){
            //[#2.3] - Finally, sets resolution as concluded
            myscope.dependenciesResolved = true;
            myscope.actionGetData();
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

myscope.actionCancelData = function (data){
   for ( var i = 0, leni = data.length; i < leni; ++i ){
      if ( $U(data[i].id) ){
         myscope.data.splice(myscope.data.indexOf(data[i]), 1);
      } else {
         angular.extend(data[i], data[i].$$$init);
      }
   }
   zpriv.createNewDataPage();
   return data;
};// ::actionCancelData
myscope.tableSettings.inlineCancel.callback = myscope.actionCancelData;

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

   myscope.loadInProgress = true;   
   return dao.devices.get()
   .then(function(response){
      $console.warn("response", response);
      if ( response.data instanceof AbortHttpRequestError ){
         // request aborted, abort process
      } else if ( (true === response.success) && !$U(response.data) ){
         angular.extend(myscope.data, response.data);
         //[#] - forces a known sorting
         zpriv.extendsData(myscope.data);
         zpriv.createNewDataPage();
         myscope.actionFilterData(false);
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
      $console.warn('SCOPE refreshed', myscope);
      myscope.loadInProgress = false;
   })
   return defer.promise;
};// actionGetData

myscope.actionFilterData = function (bApply){
   var matchExpression = null;
   var defer = appUtilities.$q.defer();

   myscope.loadInProgress = true;
   
   if ( false === bApply ){ myscope.search.expression = null; }
   if ( !$U(myscope.search.expression) ){ matchExpression= uxfwk.regExpEscapeChars(myscope.search.expression);  }
   if ( arguments.length > 0 ){ myscope.pagination.page = 1; }// if filter changed, reset to first page

   myscope.filteredData = [];
   for ( var i = 0, leni = myscope.data.length; i < leni; ++i ){
      for ( var key in myscope.data[i] ){
         if (0){}
         else if ( $U(myscope.data[i][key]) ) { continue; }
         else if ( ('$' === key.charAt(0)) ){ continue; }// bypass any attribute which name begins with '$'
         else if ( ('status' ===  key) && !!myscope.data[i][key] && !fnTranslate('TEXT.COMMON.LABEL.ON').match(matchExpression) ){ continue; }
         else if ( ('status' ===  key) && !myscope.data[i][key] && !fnTranslate('TEXT.COMMON.LABEL.OFF').match(matchExpression) ){ continue; }
         else if ( !$U(matchExpression) && angular.isString(myscope.data[i][key]) && !myscope.data[i][key].match(matchExpression) ){ continue; }
         myscope.filteredData.push(myscope.data[i]);
         break;
      }
   }
   defer.resolve(null);
   myscope.loadInProgress = false;
   return defer.promise;
};// ::actionFilterData

/**
 * @ngdoc function
 * @name uxfwk.conf.models.controller#actionCreateData
 * @methodOf uxfwk.conf.models.controller
 *
 * @description
 * Action to be triggered whenever a request for inline data creation.
 *
 * @returns void
 */
//myscope.actionCreateData = function actionCreateData (data){
//   var myStateContext = uxfwk.merge({}, stateContext);
//   var modalInstance = null;
//
//   myStateContext.parent = 'modal';
//   modalInstance = $modal.open({
//      //templateUrl: 'pack-rm-{0}/modules/{0}.protection.groups/{0}.protection.groups.typeb.home.tpl.html'.sprintf(solution),
//      template: myscope.modalMods.html,
//      backdrop: true,
//      resolve: { stateContext: function(){ return myStateContext; }, capabilities: function(){ return capabilities; } },
//      controller: myscope.modalMods.ctrl,
//      size: 'lg'
//   }).result.then(function(newSession){
//      zpriv.extendsData(newSession);
//      myscope.data.unshift(newSession);
//      zpriv.createNewDataPage();
//   });
//   return data;
//};// actionCreateData
//myscope.tableSettings.formCreation.callback = myscope.actionCreateData;


/**
 * @ngdoc function
 * @name uxfwk.conf.models.controller#actionConfigData
 * @methodOf uxfwk.conf.models.controller
 *
 * @description
 * Action to be triggered whenever a request for inline data creation.
 *
 * @returns void
 */
myscope.actionConfigData = function actionConfigData (data){
   var fn_promises = [], fn_args = [];

   for ( var i = 0, leni = data.length; i < leni; ++i ){
      var config = {};
      fn_promises.push(dao.config);

      //config = uxfwk.clean(uxfwk.merge({}, data[i]), data[i].$$$init);
      config = uxfwk.merge({}, data[i]);
      $console.warn("config", angular.toJson(config));
      fn_args.push(config);
   }
   myscope.loadInProgress = true;
   return uxfwk.promiseChain(fn_promises, fn_args, true)
   .then(function(response){
      var errors = [];

      for ( var i = 0, leni = response.length; i < leni; ++i ){
         if ( true === response[i].success ){
            data[i] = uxfwk.merge(data[i], response[i].data);
            data[i].$$uxtbl = {};
            zpriv.extendsData(data[i]);
         }else{ errors.push(response[i].errors); }
      }

      if ( errors.length > 0 ){ $scope.$root.notifications.alerts.open('error', null, errors); }
      zpriv.createNewDataPage();
      return response;
   })
   .finally(function (){
      myscope.loadInProgress = false;
   });
};// actionConfigData
myscope.tableSettings.inlineEdition.callback = myscope.actionConfigData;

/**
 * @ngdoc function
 * @name uxfwk.conf.models.controller#actionRemoveData
 * @methodOf uxfwk.conf.models.controller
 *
 * @description
 * Action to be triggered whenever a config request is made by uxfwk-table
 * directive.
 *
 * @param {object[]}data array of objects to be configured by controller
 * @returns void
 */
$scope[key].actionRemoveData = function actionRemoveData (data){
   var fn_promises = [], fn_args = [];

   for ( var i = 0, leni = data.length; i < leni; ++i ){
      if ( !$U(data[i].id) ){
         fn_promises.push(dao.remove);
         fn_args.push(data[i]);
      }
   }
   myscope.loadInProgress = true;
   return uxfwk.promiseChain(fn_promises, fn_args, true)
   .then(function(response){
      var errors = [];

      for ( var i = 0, leni = response.length; i < leni; ++i ){
         if ( true === response[i].success ){
            myscope.data.splice(myscope.data.indexOf(data[i]), 1);
         }else{ errors.push(response[i].errors); }
      }

      if ( errors.length > 0 ){ $scope.$root.notifications.alerts.open('error', null, errors); }
      zpriv.createNewDataPage();
      return response;
   })
   .finally(function (){
      myscope.loadInProgress = false;
   });
};// actionRemoveData

myscope.actionSortData = function (columnId, bAsc){
   var fnSort = null, attr = null;

   $console.warn("columnId", columnId);
   switch ( columnId ){
      case 'hostName':        attr = attr || 'hostName';
      case 'portName':        attr = attr || 'portName';
      case 'mac':             attr = attr || 'mac';
      case 'ip':              attr = attr || 'ip';
      case 'leaseTime':       attr = attr || 'leaseTime';
      case 'ipv6':            attr = attr || 'ipv6';
      case 'linkLocalIpv6':   attr = attr || 'linkLocalIpv6';
      case 'string':{// sort strings
         if ( bAsc ){ fnSort = function(a, b){ return uxfwk.$sortString(a[attr] || '', b[attr] || ''); } }
         else{ fnSort = function(a, b){ return uxfwk.$sortString(b[attr] || '', a[attr] || ''); } }
      }break;
      case 'status':        attr = attr || 'status';
      case 'boolean':{// sort boolean
         if ( bAsc ){ fnSort = function(a, b){ return ( (((a||{})[attr] || false) === ((b||{})[attr] || false) ) ? (0) : (((a||{})[attr] ? -1 : 1))); } }
         else{ fnSort = function(a, b){ return ( (((b||{})[attr] || false) === ((a||{})[attr] || false) ) ? (0) : (((b||{})[attr] ? -1 : 1))); } }
      }
      break;
   }
   if ( fnSort && myscope.filteredData ){ myscope.filteredData.sort(fnSort); }
   zpriv.createNewDataPage();
};// endof ::actionSortData

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
      //data.actions = ['eye', 'reboot', 'ellipsis-h'];
      //data.actions = ['eye', 'trash', 'lock'];
      data.$$$init   = uxfwk.merge({}, data);
   }
   return data;
};// extendsData

/******************************************************************************
 * @name VALIDATION METHODS
 * @description
 * The following methods shall be used as validators for each attribute
 ******************************************************************************/
zpriv.validators = function (){
   myscope.validators = {};
};// @validators

}];// endof _controller
});// endof _module

