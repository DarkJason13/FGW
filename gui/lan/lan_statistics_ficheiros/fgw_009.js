define('uxfwk.fgw.security.parentalmodal', ['angularAMD', 'uxfwk'
   , 'modules/fgw.security/fgw.security.dao'
   , 'uxfwk.require.lang!fgw.security.common'
   , 'ngload!ui.mask'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
   var common = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.security.parentalmodal', ['$uibModal', '$filter', 'uxfwk.fgw.security.dao', function ($uibModal, $filter, daoSecurity){
   var fnTranslate = $filter('translate');

   var ctrl = ['$scope', 'devicesData', 'dao', function($scope, devicesData, dao){
      $console.warn("$scope, devicesData", $scope, devicesData);
      var that = this;
      
      that.parentalrule = {};
      that.days         = [{ id:0x01, text: fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.MON') },{ id:0x02, text: fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.TUE') },{ id:0x04, text: fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.WED') },{ id:0x08, text: fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.THU') },
                           { id:0x10, text: fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.FRI') },{ id:0x20, text: fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.SAT') },{ id:0x40, text: fnTranslate('TEXT.FGW.SECURITY.HOME.MODAL.COMMON.WEEKDAYS.SUN') }];
      that.devices      = [];
      that.devices      = devicesData;
      that.data         = { start_time: new Date(), end_time: new Date() };

      that.weekDay = function (day){
         day.getterSetter = day.getterSetter || {
            getterSetter: function (value){
               if ( arguments.length > 0 ){
                  if ( !!value ){
                     that.data.days = (that.data.days || 0) | day.id;
                  }else{
                     that.data.days = (that.data.days || 0) & ~day.id;
                  }
               }
               $console.warn("that.data.days", that.data.days);
               return !!((that.data.days || 0) & day.id);
            }
         };
         return day.getterSetter;
      };// weekDay
      
      that.ok = function () {
         that.loadInProgress = true;
         $console.warn("that.data", that.data);
         return dao.parentalrule.create(that.data)
         .then(function(response){
            $console.warn("response", response, $scope);
            if ( true === response.success ){
               return $scope.$close(response);
            }else{ $console.warn("error", response); $scope.$root.notifications.alerts.open('error', null, response.errors); }
            return false;
         }).finally(function(){ that.loadInProgress = false; });
      };

      that.cancel = function () {
         $scope.$dismiss('cancel');
      };
      
      that.atLeastOneSelected = function (){
         return !(!$U(that.data.days) && (that.data.days > 0));
      };// ::atLeastOneSelected
      
      that.spec = function (data, ngModel){
         return {
            uxfwkFgwValidateRuleReservedChars: function (value, modelValue){
               if ( $U(value) ) { return true; }// empty values are not considered as invalid
               //return $U(value.match(/[^0-9a-zA-Z-._~:\/\?#\[\]@!$&'\(\)\*\+;=`]/g));
               return $U(value.match(/[^0-9a-zA-Z]/g));
               //return false;
            }, // ::validateURIReservedChars
         pad:uxfwk.$true};
      };// ::spec
      
      that.options = function (data) {
         var options = [];
         options = that.devices;
         return uxfwk.cache(data, '$$$devices', options);
      };

      $scope.$watch(
         function(){ return that.parentalrule.deviceName },
         function(newValue, oldValue){ var list = that.options(that.parentalrule);
            if ( !angular.isArray(list) ){ return false; }
            for ( var i = 0, leni = list.length; i < leni; i++ ){ if ( list[i].hostName == newValue ){ that.data.mac = list[i].mac; that.data.hostName = list[i].hostName; break; } }
         });

   }];
   
   return function (devicesData){
      return $uibModal.open({
         ariaLabelledBy: 'modal-title',
         ariaDescribedBy: 'modal-body',
         templateUrl: 'modules/fgw.security/fgw.security.parentalmodal.html',
         controller: ctrl,
         controllerAs: 'fgwSecurityParentalModal',
         windowClass: 'fgw-security-parentalmodal',
         resolve: {
            dao: function(){ return daoSecurity; },
            devicesData: function () { return devicesData; }
         }
      }).result;
   }
}]);

});



