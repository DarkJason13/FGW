define(['angularAMD', 'uxfwk'
        , 'uxfwk.require.lang!fgw.myaccount.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/**
* @ngdoc controller
*/
return ['$scope', 'appUtilities', '$window', '$cookies', '$filter', function controller ($scope, appUtilities, $window, $cookies, $filter){
   var key           = 'fgwMyaccountHome';
   var solution      = 'fgw';
   var myscope = {}, zpriv = {};
   var common = {}, dao = {};
   var fnTranslate = $filter('translate');
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

common.profile = {
      user:       1,
      support:    2,
      admin:      10,
   p:null};// profile

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
      passIsInEdition:      false,
      data: {},
      formData: {},
      dataReady:            false,  // state flag for main data
      common:               common,
   p:null});// just for padding

   //[#1.1] - Groups attributes based on template view.

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !$scope[key].criticalError ){
      var $injector = angular.element(document).injector();
      var deps = [];

      //[#2.1] - Request javascript dependencies
      deps.push('modules/{0}.myaccount/{0}.myaccount.dao'.sprintf(solution));
      require(deps, function(){

         // Inject dependencies
         dao  = $injector.get('uxfwk.{0}.myaccount.dao'.sprintf(solution));
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

myscope.actionCancelData = function (){
   var defer = appUtilities.$q.defer();
   
   myscope.data = uxfwk.merge(myscope.data, myscope.data.$$$init);
   myscope.data.oldpassword      = null;
   myscope.data.newpassword      = null;
   myscope.data.confirmpassword  = null;
   zpriv.extendsData(myscope.data);
   defer.resolve(myscope.data);
   return defer.promise;
};// ::actionCancelData

myscope.actionConfigData = function (){
   var configData = myscope.data;
   $scope[key].loadInProgress = true;
   
   return dao.config(configData)
   .then(function(response){
      $console.warn("response", response);
      if ( true === response.success ){
         uxfwk.merge(myscope.data, response.data);
         zpriv.extendsData(myscope.data);
         myscope.passIsInEdition = false;
         return true;
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return false;
   })
   .catch(function(response){
      $scope.$root.notifications.alerts.open('error', null, response.errors);
   })
   .finally(function(){
      myscope.loadInProgress = false;
   })
};// endof ::actionConfigData

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

myscope.isFormValid = function (){
   var result = false;
   $console.warn("myscope.formData", myscope.formData);
   if ( !$U(myscope.formData) ){ return myscope.formData.$valid; }
   return result;
};// ::isFormValid

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
      data.oldUser = data.currentUser;
   }
   return data;
};// ::@extendsData

/******************************************************************************
 * @name VALIDATION METHODS 
 * @description
 * The following methods shall be used as validators for each attribute. They 
 * are called directly from template. 
 ******************************************************************************/

zpriv.validators = function (){
   myscope.validators = { profile: {} };
   
   myscope.validators.profile = {
         texter: function (expression){ return{
            textualize: function (value){
               if ( $U(value) ){ return $filter('uxfwkNullHider')(); }
               return $filter('translate')($filter('uppercase')($filter('uxfwkNullHider')('TEXT.FGW.MYACCOUNT.HOME.COMMON.PROFILE.'+$filter('uxfwkKeyByValue')(value, myscope.common.profile))));
            },// ::textualize
            expression: expression}},
      p:null};
   
   myscope.validators.watchers = (function(){
      $scope.$watch(function(){ return myscope.data.oldpassword }, function(){
         if ( angular.isObject(myscope.formData.oldpassword) ){ myscope.formData.oldpassword.$validate() }
         if ( angular.isObject(myscope.formData.confirmpassword) ){ myscope.formData.confirmpassword.$validate() }
         if ( angular.isObject(myscope.formData.newpassword) ){ myscope.formData.newpassword.$validate(); }
      });

      $scope.$watch(function(){ return myscope.data.newpassword }, function(){
         if ( angular.isObject(myscope.formData.confirmpassword) ){ myscope.formData.confirmpassword.$validate() }
      });

      $scope.$watch(function(){ return myscope.data.confirmpassword }, function(){
         if ( angular.isObject(myscope.formData.newpassword) ){ myscope.formData.newpassword.$validate(); }
      });
   })();// ::validators::watchers

   /**
    * @name validatePasswordMatch
    * @param elem
    * @param modelValue
    * @desc Validates if both passwords match
    * @return {boolean}
    */
   myscope.validators.validatePasswordMatch = function(elem, modelValue){
      var output = false, attr = (elem == 'newpassword') ? 'confirmpassword' : 'newpassword';
      if ( !angular.isObject(myscope.data) ){ return true; }
      else if ( !angular.isString(myscope.data.newpassword) && !angular.isString(myscope.data.confirmpassword) ){ return true; }
      else if ( angular.isString(modelValue) && modelValue.length > 0 && modelValue == myscope.data[attr] ){ return true; }
      return output;
   };// ::validators::validatePasswordMatch

   /**
    * @name validatePasswordRequired
    * @desc
    * @return {*|boolean}
    */
   myscope.validators.validatePasswordRequired = function(){
      return (angular.isString(myscope.data.oldpassword) && myscope.data.oldpassword.length > 0);
   };// ::validators::validatePasswordRequired

   myscope.validators.oldpassword = (function(){
      var field = {};
      field.spec = function(data, ngModel){
         var allrules = {};
         allrules.fgwMyAccountHomeOldPasswordRequired = function(){ var output = true;
            if ( (angular.isString(myscope.data.confirmpassword) || angular.isString(myscope.data.newpassword)) && (!angular.isString(myscope.data.oldpassword) || myscope.data.oldpassword.length == 0) ){ return false; }
            return output;
         };
         return allrules;
      };
      return field;
   })();// ::validators::oldpassword

   myscope.validators.newpassword = (function(){
      var field = {};
      field.spec = function(data, ngModel){
         var allrules = {};
         allrules.fgwMyAccountHomeOldPasswordRequiredNewPassword = function($modelValue){ var output = true;
            if ( !myscope.validators.validatePasswordRequired() ){ return output; }
            else if ( !angular.isString(myscope.data.newpassword) ){ return false; }
            else if ( !angular.isString(myscope.data.newpassword) && myscope.data.newpassword.length == 0 ){ return false; }
            return output;
         };
         allrules.fgwMyAccountHomePasswordMatchNewPassword = function($modelValue){
            return myscope.validators.validatePasswordMatch('newpassword', $modelValue);
         };// ::fgwMyAccountHomeOldPasswordValidator
         return allrules;
      };
      return field;
   })();// ::validators::newpassword

   myscope.validators.confirmpassword = (function(){
      var field = {};
      field.spec = function(data, ngModel){
         var allrules = {};
         allrules.fgwMyAccountHomeOldPasswordRequiredConfirmPassword = function($modelValue){ var output = true;
            if ( !myscope.validators.validatePasswordRequired() ){ return output; }
            else if ( !angular.isString(myscope.data.confirmpassword) ){ return false; }
            else if ( !angular.isString(myscope.data.confirmpassword) && myscope.data.confirmpassword.length == 0 ){ return false; }
            return output;
         };
         allrules.fgwMyAccountHomePasswordMatchConfirmPassword = function($modelValue){
            return myscope.validators.validatePasswordMatch('confirmpassword', $modelValue);
         };// ::fgwMyAccountHomeOldPasswordValidator
         return allrules;
      };
      return field;
   })();// ::validators::confirmpassword

};// ::@validators

}];
});



