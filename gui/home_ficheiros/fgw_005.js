define(['angularAMD', 'uxfwk'
        , 'uxfwk.require.lang!fgw.home.common' 
        , 'uxfwk.fgw.home.diagram'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/**
* @ngdoc controller
*/
return ['$scope', 'appUtilities', function controller ($scope, appUtilities){
   var key           = 'fgwHome';
   var solution      = 'fgw';
   var myscope = {}, zpriv = {};
   var common = {}, dao = {};
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
      diagramLoading:       true,
      dependenciesResolved: false,
      isInEdition:          false,
      data: [],
      dataReady:            false,  // state flag for main data
      common:               common,
   p:null});// just for padding

   //[#1.1] - Groups attributes based on template view.

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !$scope[key].criticalError ){
      var $injector = angular.element(document).injector();
      var deps = [];

      //[#2.1] - Request javascript dependencies
      require(deps, function(){

         // Inject dependencies
         zpriv.validators();

         //[#2.2] - Request language files
         appUtilities.$translate.refresh()
         .then(function(){
            //[#2.3] - Finally, sets resolution as concluded
            $scope[key].dependenciesResolved = true;
            //$scope[key].actionGetData();
            $scope[key].loadInProgress = false; // To be removed!
         })
         .catch(function(){
         });
      }, function(response){
         $console.warn(response);
         myscope.criticalError = response;
      });
   }//[END#2.0]
   $console.info('SCOPE _initialize', myscope, $scope);
})();// endof _initialize 


$scope.$on('loadingComplete', function(){
   $console.warn("loadingComplete");
   myscope.diagramLoading = false;
});// @on.loadingComplete
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
      if ( true === args.success ){
         myscope.data = args.data;
         zpriv.extendsData(args.data);
         defer.resolve(myscope.data);
      }else{}
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
   if ( !$U(myscope.formData) ){ return myscope.formData.$valid; }
   return false;
};// ::isFormValid

zpriv.validators = function (){
   myscope.validators = {};

};// ::@validators

}];
});



