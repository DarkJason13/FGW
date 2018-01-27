define('uxfwk.fgw.lan.staticleasesmodal', ['angularAMD', 'uxfwk'
   , 'uxfwk.ipv4'
   , 'uxfwk.require.lang!fgw.lan.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
   var common = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.lan.staticleasesmodal', ['$uibModal', '$filter', 'uxfwk.ipv4', function ($uibModal, $filter, ipv4){
   var fnTranslate = $filter('translate');
   var ctrl = ['$scope', 'staticLeaseData', function($scope, staticLeaseData){
      $console.warn("$scope", $scope, staticLeaseData);
      var that = this;
      
      that.common = common;
      that.options = {};
      that.bridgemsg = null;
      that.staticlease = {};
      that.staticlease.lease = {};
      that.ok = function () {
         $scope.$close(that.staticlease);
      };

      that.cancel = function () {
         $scope.$dismiss('cancel');
      };
      
      that.bridge = {};
      that.bridge.options = function (){
         var options = [];
         if ( !!angular.isArray(staticLeaseData.bridges) ){
            for ( var i = 0, leni = staticLeaseData.bridges.length; i < leni; ++i ){ 
               options.push({ key: i, value: staticLeaseData.bridges[i].name, ip: staticLeaseData.bridges[i].ipAddr, mask: staticLeaseData.bridges[i].mask }); 
            }
         }
         return uxfwk.cache(that.options, '$$$bridge', options);
      };// ::@bridge::options
      
      that.ip = {};
      that.ip.spec = function (data, ngModel){
         return {
            uxfwkFgwValidateIpInSubnet: function (value, modelValue){ var aux = null, output = true;
               if ( $U(value) || ('' === value) ) { return true; }// empty values are not considered as invalid
               if ( !$U(aux = uxfwk.findInArray(staticLeaseData.bridges, 'name', data.groupname)) ){
                  var ip = ipv4.convertIpAddr2Bin(aux.ipAddr);
                  var mk = ipv4.convertIpAddr2Bin(aux.mask);
                  var vl = ipv4.convertIpAddr2Bin(value);
                  if ( ((ip & mk) == (vl & mk)) ){
                     output = true;
                  } else { output = false; }
               }
               return output;
            }, // ::uxfwkFgwValidateIpInSubnet
            uxfwkFgwValidateIpDifferentThanBridge: function (value, modelValue){ var aux = null, output = true;
               if ( $U(value) ) { return true; }// empty values are not considered as invalid
               if ( !$U(aux = uxfwk.findInArray(staticLeaseData.bridges, 'name', data.groupname)) ){
                  if ( (value != aux.ipAddr) ){
                     output = true;
                  } else { output = false; }
               }
               return output;
            }, // ::uxfwkFgwValidateIpDifferentThanBridge
            uxfwkFgwValidateIpDifferentThan0: function (value, modelValue){ var aux = null, parts = [], output = true;
               if ( $U(value) ) { return true; }// empty values are not considered as invalid
               if ( "0" === value.split(".")[3] ){
                  output = false;
               }
            return output;
         }, // ::uxfwkFgwValidateIpDifferentThan0
         uxfwkFgwValidateIpDifferentThan255: function (value, modelValue){ var aux = null, auxPart= "", parts = [], output = true;
            if ( $U(value) ) { return true; }// empty values are not considered as invalid
            if ( "255" == value.split(".")[3] ){
               output = false;}
            return output;
         }, // ::uxfwkFgwValidateIpDifferentThan255
         pad:uxfwk.$true};
      };// ::spec
      
      $scope.$watch(
            function(){ return that.staticlease.groupname },
            function(newValue, oldValue){ var aux = null, maskValue = null;
               if ( !$U(newValue) && !$U(aux = uxfwk.findInArray(staticLeaseData.bridges, 'name', newValue)) ){
                  that.bridgemsg = '';
                  maskValue = ipv4.compactMaskAddr(aux.mask);
                  that.bridgemsg += '{0}/{1}'.sprintf(aux.ipAddr, maskValue);
               }
            });
   }];
   
   return function (staticLeaseData){
      return $uibModal.open({
         ariaLabelledBy: 'modal-title',
         ariaDescribedBy: 'modal-body',
         templateUrl: 'modules/fgw.lan/fgw.lan.staticleasesmodal.html',
         controller: ctrl,
         controllerAs: 'fgwLanStaticLeaseModal',
         resolve: {
            staticLeaseData: function () {
               return staticLeaseData;
            }
         }
      }).result;
   }
}]);

});



