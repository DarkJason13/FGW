define('uxfwk.fgw.contents.modal', ['angularAMD', 'uxfwk'
   , 'modules/fgw.contents/fgw.contents.dao'
   , 'uxfwk.require.lang!fgw.contents.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.contents.modal', ['$uibModal', 'uxfwk.fgw.contents.dao', function ($uibModal, daoContents){
   
   var ctrl = ['$scope', 'storageData', function($scope, storageData){
      var that = this;
      
      that.user = {};
      that.user.volumeName = storageData.volumeName;
      
      that.ok = function () {
         that.loadInProgress = true;
         return daoContents.user.create(that.user)
            .then(function (response) {
               if ( true === response.success ){
                  return $scope.$close(response);
               }else{  $scope.$root.notifications.alerts.open('error', null, response.errors); }
               return false;
            }).finally(function(response){ that.loadInProgress = false; });
         // $scope.$close(that.user);
      };

      that.cancel = function () {
         $scope.$dismiss('cancel');
      };
      
      that.cconfpwd = (function(){
         var field = {}, result = true;
         field.spec = function(data, ngModel){
            var allrules = {};
            allrules.uxfwkFgwPasswordMatchConfirmPassword = function($modelValue){
               if ( !ngModel.$isEmpty($modelValue) ) { 
                  return !!($modelValue == that.user.password);
               }
               return true;
            };// ::uxfwkFgwPasswordMatchConfirmPassword
            return allrules;
         };
         return field;
      })();// ::cconfpwd
      
      that.spec = function (data, ngModel){
         return {
            uxfwkFgwValidateWindowsFolderReservedChars: function (value, modelValue){
               if ( $U(value) ) { return true; }// empty values are not considered as invalid
               return $U(value.match(/[\\<>:"\/|\?\*]/g));
            }, // ::uxfwkFgwValidateWindowsFolderReservedChars
         pad:uxfwk.$true};
      };// ::spec
   }];
   
   return function (storageData){
      return $uibModal.open({
         //animation: $ctrl.animationsEnabled,
         ariaLabelledBy: 'modal-title',
         ariaDescribedBy: 'modal-body',
         templateUrl: 'modules/fgw.contents/fgw.contents.modal.html',
         controller: ctrl,
         controllerAs: 'fgwContentsModal',
         resolve: {
            storageData: function () {
               return storageData;
            },
            daoContents: function(){ return daoContents; }
         }
      }).result;
   }
}]);

});



