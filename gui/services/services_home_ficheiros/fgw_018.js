define(['angularAMD', 'uxfwk'
   , 'uxfwk.require.lang!fgw.voice.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/**
* @ngdoc controller
*/
return ['$scope', 'appUtilities', '$filter', function controller ($scope, appUtilities, $filter){
   var key           = 'fgwVoiceHome';
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
      criticalError:          null,
      loadInProgress:         true,
      dependenciesResolved:   false,
      sipIsInEdition:         false,
      accountIsInEdition:     false,
      data: [],
      dataReady:              false,  // state flag for main data
      common:               common,
   p:null});// just for padding

   //[#1.1] - Groups attributes based on template view.

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !$scope[key].criticalError ){
      var $injector = angular.element(document).injector();
      var deps = [];

      //[#2.1] - Request javascript dependencies
      deps.push('modules/{0}.voice/{0}.voice.dao'.sprintf(solution));
      //deps.push('modules/{0}.home/{0}.home.common'.sprintf(solution));
      require(deps, function(){

         // Inject dependencies
         dao  = $injector.get('uxfwk.{0}.voice.dao'.sprintf(solution));
//         myscope.common.rfoverlay = common  = dataCommon = $injector.get('uxfwk.{0}.home.common'.sprintf(solution));

         

         //[#2.2] - Request language files
         //appUtilities.$translatePartialLoader.addPart('{0}.home.common'.sprintf(solution));
         appUtilities.$translate.refresh()
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

/**
 * @ngdoc function
 * @name uxfwk.gpon.rfoverlay.home#actionGetState
 * @methodOf uxfwk.gpon.rfoverlay.home.controller
 *
 * @description
 * Change current state
 *
 * @returns void
 */
myscope.actionToggleEdition = function actionToggleEdition (state){
   if(state == 'detail'){
      myscope.isInEdition = false;
      myscope.data = myscope.data.$$$init;
      zpriv.extendsData(myscope.data);
      zpriv.actionGetStatus();
   }else{
      myscope.isInEdition = true;
   }
   $scope.$root.notifications.alerts.closeAll();
   myscope.state = state;
};// actionToggleEdition

//myscope.actionConfigData = function (){
//
//   myscope.loadInProgress = true;
//
//   return dao.rfoverlay.config(uxfwk.clean(uxfwk.merge({}, myscope.data), myscope.data.$$$init))
//   .then(function(response){
//      if ( true === response.success ){
//         myscope.data = uxfwk.merge(myscope.data, response.data);
//         zpriv.extendsData(myscope.data);
//         zpriv.actionGetStatus();
//         myscope.isInEdition = false;
//         return response.data;
//      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
//   })
//   .catch(function(response){
//      $scope.$root.notifications.alerts.open('error', null, response.errors);
//   })
//   .finally(function(){
//      myscope.loadInProgress = false;
//   })
//};// endof ::actionConfigData

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
         zpriv.extendsData(args.data);
         defer.resolve(myscope.data);
      }else{ appUtilities.$rootScope.notifications.alerts.open('error', null, args.errors); }
   })
   .catch(function(response){
      if ( response instanceof Error ){
         appUtilities.$rootScope.notifications.alerts.open('error', null, response.message);
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
      var aux = null;
      if ( !$U(data.sipAccounts.sipAccount1) && !$U(aux = data.sipAccounts.sipAccount1.password) ) { data.sipAccounts.sipAccount1.password = aux.replace(aux, "****************"); }
      if ( !$U(data.sipAccounts.sipAccount2) && !$U(aux = data.sipAccounts.sipAccount2.password) ) { data.sipAccounts.sipAccount2.password = aux.replace(aux, "****************"); }
      if ( !$U(data.sipAccounts.sipAccount1) ){ data.sipAccounts.sipAccount1.$$$password = "****************"; }
      if ( !$U(data.sipAccounts.sipAccount2) ){ data.sipAccounts.sipAccount2.$$$password = "****************"; }
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
   myscope.validators = { account1: {}, account2: {}, physicalInterface: {} };

   myscope.validators.account1.isVisible = function (data){
      var value = false;
      if ( !$U(data.sipAccounts) && !$U(data.sipAccounts.sipAccount1) && !$U(data.sipAccounts.sipAccount1.enable) && !!data.sipAccounts.sipAccount1.enable ){
         value = true;
      }
      return value;
   };// ::@account1::isVisible
   
   myscope.validators.account2.isVisible = function (data){
      var value = false;
      if ( !$U(data.sipAccounts) && !$U(data.sipAccounts.sipAccount2) && !$U(data.sipAccounts.sipAccount2.enable) && !!data.sipAccounts.sipAccount2.enable ){
         value = true;
      }
      return value;
   };// ::@account2::isVisible
   
   myscope.validators.physicalInterface = {
         texter: function (expression){return{
            textualize: function (value){
               var output = null;
               $console.warn("expression", expression);
               if ( $U(expression) ){ return $filter('uxfwkNullHider')(); }
               
               output = '';
               output += ( 0x01 & expression ) ? (fnTranslate('TEXT.FGW.VOICE.HOME.COMMON.PHYTERMINAL.OPTION.FXS0')) : (''); // FXS0
               output += ( 0x02 & expression ) ? (fnTranslate('TEXT.FGW.VOICE.HOME.COMMON.PHYTERMINAL.OPTION.FXS1')) : (''); // FXS1
               output += ( 0x04 & expression ) ? (fnTranslate('TEXT.FGW.VOICE.HOME.COMMON.PHYTERMINAL.OPTION.FXS0FXS1')) : (''); // FXS0, FXS1
               if ('' === output){ output = $filter('uxfwkNullHider')(); }
               return output;
            },// ::textualize
            expression: expression}},
      p:null};
};// ::@validators

}];
});



