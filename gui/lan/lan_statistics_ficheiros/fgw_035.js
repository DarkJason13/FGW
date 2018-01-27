define('uxfwk.fgw.tools.warningmodal', ['angularAMD', 'uxfwk'
   , 'uxfwk.require.lang!fgw.contents.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.tools.warningmodal', ['$uibModal', function ($uibModal){
   
   var ctrl = ['$scope', 'warningData', function($scope, warningData){
      var that = this;
      
      that.message = warningData;
      
      that.ok = function () {
         $scope.$close({ success: true, data: null });
      };

      that.cancel = function () {
         $scope.$dismiss('cancel');
      };
   }];
   
   return function (warningData){
      return $uibModal.open({
         ariaLabelledBy: 'modal-title',
         ariaDescribedBy: 'modal-body',
         templateUrl: 'modules/fgw.tools/fgw.tools.warningmodal.html',
         controller: ctrl,
         controllerAs: 'fgwToolsWarnModal',
         resolve: {
            warningData: function () {
               return warningData;
            }
         }
      }).result;
   }
}]);

});



