define(['angularAMD', 'uxfwk'
   , 'uxfwk.require.css!modules/fgw.contents/fgw.contents.home'
   , 'uxfwk.require.lang!fgw.contents.common'
   , 'uxfwk.fgw.contents.modal'
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
   , '$timeout'
   , 'uxfwk.fgw.contents.modal'
   , 'uxfwk.fgw.warningmodal.deleteEntry'
   , function controller ($scope, appUtilities, $filter, $timeout, modal, modalDeleteEntry){
   var key           = 'fgwContentsHome';
   var solution      = 'fgw';
   var myscope = {}, zpriv = {};
   var common = {}, dao = {};
   var promiseStatus = null;
   var fnTranslate = $filter('translate');
   
   common.provider = {
         tzo:        0,
         dyndns:     1,
         noip:       2,
     p:null};// provider
   common.ddnsstatus = {
      msg0:    0,
      msg1:    1,
      msg2:    2,
      msg3:    3,
      msg4:    4,
      msg5:    5,
      msg6:    6,
      msg7:    7,
      msg8:    8,
      msg9:    9,
      msg10:   10,
      msg11:   11,
   p:null};// ddnsstatus

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
      dynDnsIsInEdition:    false,
      upnpIsInEdition:      false,
      storageIsInEdition:   false,
      data: [],
      dataReady:            false,  // state flag for main data
      common:               common,
      passwordSettings:     {
         required:          false,
         class:             'form-control input-sm fgw-input-sm-width',
         input:             'password'
      },
   p:null});// just for padding

   //[#1.1] - Groups attributes based on template view.

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !$scope[key].criticalError ){
      var $injector = angular.element(document).injector();
      var deps = [];

      //[#2.1] - Request javascript dependencies
      deps.push('modules/{0}.contents/{0}.contents.dao'.sprintf(solution));
      require(deps, function(){
         
         // Inject dependencies
         dao  = $injector.get('uxfwk.{0}.contents.dao'.sprintf(solution));
         //[#2.2] - Request language files
         appUtilities.$translate.refresh()
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
myscope.actionConfigDnsData = function (){
   var defer = appUtilities.$q.defer();
   var fn_promises = [], fn_args = [];
   
   myscope.loadInProgress = true;
   if ( !$U(myscope.data.dyn) && !$U(myscope.data.dyn.enable) ){
      var checkData = uxfwk.clean(uxfwk.merge({}, myscope.data.dyn), myscope.data.$$$init.dyn, null, null, ['id']);
      if ( angular.equals({}, checkData) ){
         // [#1.0.0] - If data does not change, do nothing!
         defer.resolve(true);
         return defer.promise;
      } else {
         // [#2.0.0] - If data changed analyse data and act upon its results!
         if ( !$U(checkData.enable) ){
            // [#2.1.0] - If enable changed analyse its new value
            if ( !!checkData.enable ){
               // [#2.1.1] - If new value is true, add Dynamic DNS entry
               fn_promises.push(dao.dns.add);
               fn_args.push(myscope.data.dyn);
            } else {
               // [#2.1.2] - If new value is false, remove Dynamic DNS entry
               fn_promises.push(dao.dns.remove);
               fn_args.push(myscope.data.dyn);
            }
         } else {
            // [#2.2.0] - If enable did not changed but other data did, we want to replace Dynamic DNS (remove old and add new)
            fn_promises.push(dao.dns.remove);
            fn_args.push(myscope.data.dyn);
            fn_promises.push(dao.dns.add);
            fn_args.push(myscope.data.dyn);
         }
      }
   }
   return uxfwk.promiseChain(fn_promises, fn_args, true)
   .then(function(response){
      $console.warn("response", response);
      var errors = [];
      for ( var i = 0, leni = response.length; i < leni; ++i ){
         if ( true === response[i].success ){
            if ( promiseStatus ){ $timeout.cancel(promiseStatus); }
            myscope.data.dyn = angular.copy(response[i].data);
            zpriv.extendsData(myscope.data);
            promiseStatus = $timeout(myscope.actionGetData, 5000).then(function(){
               promiseStatus = null;
            })
         }else{ errors.push(response[i].errors); }
      }
      if ( errors.length > 0 ){ defer.resolve(false); }
      else { defer.resolve(true); return defer.promise; }
   })
   .catch(function(response){
      $scope.$root.notifications.alerts.open('error', null, response.errors);
   })
   .finally(function(){
      appUtilities.$rootScope.$broadcast('hide'); myscope.loadInProgress = false;
   })
   return defer.promise;
};// endof ::actionConfigDnsData

myscope.actionCancelDnsData = function (){
   var defer = appUtilities.$q.defer();
   if ( !$U(myscope.data.dyn) && !$U(myscope.data.$$$init.dyn) ){
      myscope.data.dyn = uxfwk.merge(myscope.data.dyn, myscope.data.$$$init.dyn);
   }
   zpriv.extendsData(myscope.data);
   defer.resolve({});
   return defer.promise;
};// ::actionCancelDnsData

myscope.actionConfigStorageData = function (){
   var configData = {};
   // Toggle
   if ( !$U(myscope.data.upnp) ){
      configData.upnp = ( !!myscope.data.upnp ) ? (true) : (false);
   }
   myscope.loadInProgress = true;
   return dao.upnp.config(configData)
   .then(function(response){
      if ( true === response.success ){
         myscope.data = uxfwk.merge(myscope.data, response.data);
         zpriv.extendsData(myscope.data);
         return true;
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return false;
   })
   .finally(function(){ myscope.loadInProgress = false; });
};// endof ::actionConfigStorageData

myscope.newUser = function (device){
   return modal(device)
   .then(function(response){
      if ( (true === response.success) && !$U(response.data) ){
         return myscope.actionGetData();
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return false;
   })
   .catch(function(response){ if ( angular.isObject(response) ){ $scope.$root.notifications.alerts.open('error', null, response.errors); } })
   .finally(function(){});
};// ::newUser

myscope.deleteUser = function (user){
   return modalDeleteEntry({ msg: appUtilities.$filter('translate')('TEXT.FGW.CONTENTS.HOME.STORAGE.REMOVE.USER') })
      .then(function(response){
         myscope.loadInProgress = true;
         return dao.user.remove(user);
      })
      .then(function(response){
         var aux = null;

         if ( (true === response.success) && !$U(response.data) ){
            if ( !$U(aux = uxfwk.findInArray(myscope.data.storageDevices, 'volumeName', response.data.volumeName)) ){
               aux.storageUsers.splice(aux.storageUsers.indexOf(user), 1);
            }
            zpriv.extendsData(myscope.data);
            defer.resolve(myscope.data);
            return true;
         }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
         return false;
      })
      .catch(function(response){ if ( angular.isObject(response) ){ $scope.$root.notifications.alerts.open('error', null, response.errors); } })
      .finally(function (){ myscope.loadInProgress = false; });
};// ::deleteUser

myscope.actionCancelStorageData = function (){
   var defer = appUtilities.$q.defer();
   myscope.data = uxfwk.merge(myscope.data, myscope.data.$$$init);
   zpriv.extendsData(myscope.data);
   defer.resolve({});
   return defer.promise;
};// ::actionCancelStorageData

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
   var result = false;
   if ( !$U(myscope.formData) ){ return myscope.formData.$valid; }
   return result;
};// ::isFormValid

zpriv.validators = function (){
   myscope.validators = { hostname: {}, provider: {}, dnsField: {}, status: {} };
   
   myscope.validators.provider.options = function (data){
      var options = uxfwk.map2array(uxfwk.mapFilter(myscope.common.provider, ['dyndns', 'tzo', 'noip']), 'key', 'value');
      return uxfwk.cache(data, '$$$provider', options);
   };// ::@provider::options

   myscope.validators.status.hasInfo = function (data){
      var result = false;
      result = ( !$U(data) && !$U(data.value) && (0 === data.value*1) ) ? (true) : (false);
      return result;
   };// ::@status::hasInfo
   
   myscope.validators.status.hasAlert = function (data){
      var result = false;
      result = ( !$U(data) && !$U(data.value) && (0 !== data.value*1) ) ? (true) : (false);
      return result;
   };// ::@status::hasAlert
   
   myscope.validators.status.texter = function (expression){return{
      textualize: function (value){
         var output = null, aux = null, key = null;
         if ( $U(expression) ){ return; }
         
         output = '';
         key = uxfwk.getKeyByValue(expression.value, myscope.common.ddnsstatus);
         output = fnTranslate('TEXT.FGW.CONTENTS.HOME.COMMON.DYNAMICDNS.WARNING.' + angular.uppercase(key));
         return output;
      },// ::textualize
      expression: expression}
   };// ::@status::texter
   
   myscope.validators.dnsField.isVisible = function (data){
      var result = false;
      result = ( !$U(data) && !$U(data.provider) ) ? (true) : (false);
      return result;
   };// ::@dnsField::isVisible
   
   myscope.validators.hostname.spec = function (data, ngModel){
      return {
         uxfwkFgwValidateHostnameReservedChars: function (value, modelValue){
            var labels = null, output = true;
            if ( $U(value) ) { return true; }// empty values are not considered as invalid
            labels = value.split('.');
            for ( var i = 0, leni = labels.length; i < leni; ++i ){
               if ('' === labels[i]){ output = false; break; }
               else if ('-' === labels[i].charAt(0)){ output = false; break; }
               else if ('-' === labels[i].charAt(labels[i].length-1)){ output = false; break; }
               else { 
                  output = $U(labels[i].match(/[^0-9a-zA-Z-]/g)); 
                  if ( false === output ){ break; }
               }
            }
            return output;
         }, // ::uxfwkFgwValidateHostnameReservedChars
      pad:uxfwk.$true};
   };// ::@hostname::spec
};// ::@validators

}];
});



