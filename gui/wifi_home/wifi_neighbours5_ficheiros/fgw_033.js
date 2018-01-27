define('uxfwk.fgw.wifi.macmodal', ['angularAMD', 'uxfwk'
   , 'uxfwk.require.lang!fgw.wifi.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
   var common = {};
   common.interfaceNetwork = {
         b24ghz:        0,
         b5ghz:         1,
      p:null};// interfaceNetwork
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.wifi.macmodal', ['$uibModal', function ($uibModal){
   
   var ctrl = ['$scope', 'macFilterData', function($scope, macFilterData){
      $console.warn("$scope", $scope, macFilterData);
      var that = this;
      
      that.common = common;
      
      that.macfilter = {};
      that.macfilter.networkInterface = ('wl0' === macFilterData.iface) ? (that.common.interfaceNetwork.b24ghz) : (that.common.interfaceNetwork.b5ghz);
      
      that.ok = function () {
         $scope.$close(that.macfilter);
      };

      that.cancel = function () {
         $scope.$dismiss('cancel');
      };
      
      that.ssids = {};
      that.ssids.options = function (){
         var options = [];
         if ( !$U(macFilterData.ssids) && ( !$U(macFilterData.ssids.wl0) || !$U(macFilterData.ssids.wl1) ) ){
            if ( 'wl0' === macFilterData.iface ){
               for ( var lkey in macFilterData.ssids.wl0 ){ options.push({ key: lkey, value: macFilterData.ssids.wl0[lkey] }); }
            }  else {
               for ( var lkey in macFilterData.ssids.wl1 ){ options.push({ key: lkey, value: macFilterData.ssids.wl1[lkey] }); }
            }
         }
         return uxfwk.cache(that.macfilter, '$$$ssids', options);;
      };// ::@ssids::options
   }];
   
   return function (macFilterData){
      return $uibModal.open({
         ariaLabelledBy: 'modal-title',
         ariaDescribedBy: 'modal-body',
         templateUrl: 'modules/fgw.wifi/fgw.wifi.macmodal.html',
         controller: ctrl,
         controllerAs: 'fgwWifiMacModal',
         resolve: {
            macFilterData: function () {
               return macFilterData;
            }
         }
      }).result;
   }
}]);

});



