define('uxfwk.fgw.security.urlmodal', ['angularAMD', 'uxfwk'
   , 'modules/fgw.security/fgw.security.dao'
   , 'uxfwk.require.lang!fgw.security.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
   var common = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.security.urlmodal', ['$uibModal', 'uxfwk.fgw.security.dao', function ($uibModal, daoSecurity){

   var ctrl = ['$scope', function($scope){
      $console.warn("$scope", $scope);
      var that = this;
      
      that.urlrule = { port: 80 };
      
      that.ok = function () {
         that.loadInProgress = true;
         return daoSecurity.urlrule.create(that.urlrule)
            .then(function (response) {
               if ( true === response.success ){
                  return $scope.$close(response);
               }else{  $scope.$root.notifications.alerts.open('error', null, response.errors); }
               return false;
            }).finally(function(response){ that.loadInProgress = false; });
      };

      that.cancel = function () {
         $scope.$dismiss('cancel');
      };
      
      that.spec = function (data, ngModel){
         return {
            uxfwkFgwValidateURIReservedChars: function (value, modelValue){
               if ( $U(value) ) { return true; }// empty values are not considered as invalid
               return $U(value.match(/[^0-9a-zA-Z-._~:\/\?#\[\]@!$&'\(\)\*\+,;=`]/g));
               //return false;
            }, // ::validateURIReservedChars
         pad:uxfwk.$true};
      };// ::spec
   }];
   
   return function (){
      return $uibModal.open({
         ariaLabelledBy: 'modal-title',
         ariaDescribedBy: 'modal-body',
         templateUrl: 'modules/fgw.security/fgw.security.urlmodal.html',
         controller: ctrl,
         controllerAs: 'fgwSecurityUrlModal',
         resolve:{
            daoSecurity: function(){ return daoSecurity; }
         }
      }).result;
   }
}]);

});



