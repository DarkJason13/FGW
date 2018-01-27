define('uxfwk.fgw.warningmodal.deleteEntry', ['angularAMD', 'uxfwk'
   , 'uxfwk.require.lang!fgw.contents.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.warningmodal.deleteEntry', ['$uibModal', '$filter', function ($uibModal, $filter){
   
   var fnTranslate = $filter('translate');
   var ctrl = ['$scope', 'warningData', function($scope, warningData){
      var that = this;
      var defaultTitle = fnTranslate('TEXT.COMMON.WARNINGMODAL.DELETEENTRY.TITLE');
      var defaultButton = fnTranslate('TEXT.COMMON.BUTTON.APPLY');
      $console.warn("warningData", warningData);
      that.title = ( $U(warningData.title) ) ? (defaultTitle) : (warningData.title);
      that.button = ( $U(warningData.button) ) ? (defaultButton) : (warningData.button);
      that.msg = warningData.msg;

      $console.warn("that.data", that.data);
      that.ok = function () {
         $scope.$close({ success: true, data: null });
      };

      that.cancel = function () {
         $scope.$dismiss('cancel');
      };
   }];
   
   return function (deleteData){
      return $uibModal.open({
         ariaLabelledBy: 'modal-title',
         ariaDescribedBy: 'modal-body',
         templateUrl: 'widgets/common/warningmodal.deleteEntry.html',
         controller: ctrl,
         controllerAs: 'fgwCommonWarnModalDel',
         resolve: {
            warningData: function () {
               return deleteData;
            }
         }
      }).result;
   }
}]);

});



