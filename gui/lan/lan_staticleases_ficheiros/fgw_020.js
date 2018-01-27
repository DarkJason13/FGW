define('uxfwk.fgw.security.portactivationmodal', ['angularAMD', 'uxfwk'
   , 'uxfwk.require.lang!fgw.security.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
   var common = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

common.app = {
      custom:     -1,
  p:null};// app

common.protocol = {
      tcpudp:    0,
      tcp:       1,
      udp:       2,
  p:null};// app

angularAMD.factory('uxfwk.fgw.security.portactivationmodal', ['$uibModal', '$filter', function ($uibModal, $filter){
   var fnTranslate = $filter('translate');

   var ctrl = ['$scope', 'appData', function($scope, appData){
      $console.warn("$scope, appData", $scope, appData);
      var that = this;
      var internalId    = 0;
      that.common       = common;
      that.triggerrule  = {};
      that.estriesRem      = appData.entriesRem;
      that.appList      = [];
      that.appList      = angular.copy(appData.catalog);
      for ( var i = 0, leni = that.appList.length; i < leni; ++i ){
         angular.extend(that.appList[i], { key: i });
      }
      
      that.reservedList          = [];
      that.reservedList.push({ appName: fnTranslate('TEXT.FGW.SECURITY.NAT.MODAL.COMMON.SERVICETYPE.CUSTOM'), key: -1 });
      that.portList              = [];
      that.triggerrule.appType   = that.common.app.select;

      that.ok = function () {
         var aux = null;
         if ( that.common.app.custom === that.triggerrule.appValue*1 ){
            that.triggerrule.aplicationName = that.triggerrule.customApp;
         } else if ( !$U(aux = uxfwk.findInArray(that.appList, 'key', that.triggerrule.appValue*1)) ){
            that.triggerrule.aplicationName = aux.appName;
         }
         that.triggerrule.portList = angular.copy(that.portList);
         $scope.$close(that.triggerrule);
      };

      that.cancel = function () {
         $scope.$dismiss(null);
      };
      
      that.isFormValid = function (){
         var output = false, diff = null;
         if ( !$U(that.formData) ){ output = that.formData.$valid; }
         if ( !$U(that.portList) && (0 === that.portList.length) ){ output = false; }
         if ( !$U(that.estriesRem) && !$U(that.portList) ){ 
            diff = that.estriesRem - that.portList.length;
            if (diff < 0) { output = false; }
         }
         return output;
      };// ::isFormValid
      
      that.addEntry = function () { that.portList.push({ id: internalId++ }); };
      that.deleteEntry = function (data) { 
         var aux = null;
         if ( that.portList.length > 1 ){
            if ( !$U(aux = uxfwk.findInArray(that.portList, 'id', data.id*1)) ){
               that.portList.splice(that.portList.indexOf(aux), 1);
            }
         }
      };
      that.apps = {};
      that.apps.options = function (data) {
         var options = [];
         options = [
                      { key: 'reservedValues', value: fnTranslate('TEXT.FGW.SECURITY.NAT.MODAL.COMMON.SERVICETYPE.OPTION.CUSTOM'),
                         children: that.reservedList
                      },
                      { key: 'allowedValues', value: fnTranslate('TEXT.FGW.SECURITY.NAT.MODAL.COMMON.SERVICETYPE.OPTION.SELECT'),
                         children: that.appList
                      }
                   ];
         return uxfwk.cache(data, '$$$apps', options);
      };
      
      that.protocols = {};
      that.protocols.options = function (data){
         var options = uxfwk.map2array(uxfwk.mapFilter(that.common.protocol, ['tcpudp', 'tcp', 'udp']), 'key', 'value', function(obj){
            obj.text = fnTranslate('TEXT.FGW.SECURITY.NAT.COMMON.PROTICOL.OPTION.' + angular.uppercase(obj.key))
            return obj;
         });
         return uxfwk.cache(data, '$$$protocol', options);
      };// ::@protocol::options
      
      that.ruleHasPorts = function(value){
         $console.warn("that", that);
         var result = false;
         result = ( !$U(value.appValue) ) ? (true) : (false);
         return result;
      };
      that.isCustomApp = function(value){
         var result = false;
         result = (that.common.app.custom === value*1) ? (true) : (false);
         return result;
      };

      $scope.$watch(function (){ return that.triggerrule.appValue; }, function (value){
         var aux = null;
         $console.warn("that.triggerrule.appValue", angular.toJson(that.triggerrule.appValue));
         if ( !$U(that.triggerrule.appValue) ){
            if ( that.common.app.custom === that.triggerrule.appValue*1 ){
               that.portList = [];
               that.portList.push({ id: internalId++ });
            } else {
               if ( !$U(aux = uxfwk.findInArray(that.appList, 'key', that.triggerrule.appValue*1)) ){
                  that.portList = [];
                  that.portList = angular.copy(aux.portList);
                  for ( var i = 0, leni = that.portList.length; i < leni; ++i ){ angular.extend(that.portList[i], { id: internalId++ }); }
               }
            }
         }
      });//endof listener
   }];
   
   return function (appData){
      return $uibModal.open({
         ariaLabelledBy: 'modal-title',
         ariaDescribedBy: 'modal-body',
         templateUrl: 'modules/fgw.security/fgw.security.portactivationmodal.html',
         controller: ctrl,
         size: 'lg',
         windowTopClass: 'fgw-modal-app-xl',
         controllerAs: 'fgwSecurityPortActivationModal',
         resolve: {
            appData: function () {
               return appData;
            }
         }
      }).result;
   }
}]);

});



