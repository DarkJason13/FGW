define('uxfwk.fgw.security.portforwardmodal', ['angularAMD', 'uxfwk'
   , 'uxfwk.require.lang!fgw.security.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
   var common = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

common.service = {
      custom:     -1,
  p:null};// service

common.protocol = {
      tcpudp:    0,
      tcp:       1,
      udp:       2,
  p:null};// app

angularAMD.factory('uxfwk.fgw.security.portforwardmodal', ['$uibModal', '$filter', function ($uibModal, $filter){
   var fnTranslate = $filter('translate');

   var ctrl = ['$scope', 'serviceData', function($scope, serviceData){
      var that = this;
      var internalId    = 0;
      that.common          = common;
      that.forwardrule     = {};
      that.estriesRem      = serviceData.entriesRem;
      that.serviceList     = [];
      that.serviceList     = angular.copy(serviceData.catalog);
      for ( var i = 0, leni = that.serviceList.length; i < leni; ++i ){
         angular.extend(that.serviceList[i], { key: i });
      }
      
      that.reservedList    = [];
      that.reservedList.push({ serviceName: fnTranslate('TEXT.FGW.SECURITY.NAT.MODAL.COMMON.SERVICETYPE.CUSTOM'), key: -1 });
      that.portList        = [];
      that.forwardrule.serviceType = that.common.service.select;

      that.ok = function () {
         var aux = null;
         if ( that.common.service.custom === that.forwardrule.serviceValue*1 ){
            that.forwardrule.service = that.forwardrule.customService;
         } else if ( !$U(aux = uxfwk.findInArray(that.serviceList, 'key', that.forwardrule.serviceValue*1)) ){
            that.forwardrule.service = aux.serviceName;
         }
         that.forwardrule.portList = angular.copy(that.portList);
         $scope.$close(that.forwardrule);
      };

      that.cancel = function () {
         $console.warn("CANCEL");
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
      
      
      $console.warn("that", that);
      that.addEntry = function () { that.portList.push({ id: internalId++ }); };
      that.deleteEntry = function (data) { 
         var aux = null;
         if ( that.portList.length > 1 ){
            if ( !$U(aux = uxfwk.findInArray(that.portList, 'id', data.id*1)) ){
               that.portList.splice(that.portList.indexOf(aux), 1);
            }
         }
      };
      that.services = {};
      that.services.options = function (data) {
         var options = [];
         options = [
                      { key: 'reservedValues', value: fnTranslate('TEXT.FGW.SECURITY.NAT.MODAL.COMMON.SERVICETYPE.OPTION.CUSTOM'),
                         children: that.reservedList
                      },
                      { key: 'allowedValues', value: fnTranslate('TEXT.FGW.SECURITY.NAT.MODAL.COMMON.SERVICETYPE.OPTION.SELECT'),
                         children: that.serviceList
                      }
                   ];
         return uxfwk.cache(data, '$$$services', options);
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
         var result = false;
         result = ( !$U(value.serviceValue) ) ? (true) : (false);
         $console.warn("ruleHasPorts", result);
         return result;
      };
      
      that.isCustomService = function(value){
         var result = false;
         result = (that.common.service.custom === value*1) ? (true) : (false);
         
         return result;
      };
      
      that.range = { externalStart: {}, externalEnd: {}, internalStart: {}, internalEnd: {} };
      that.range.externalStart.spec = function(data, ngModel){
         return {
            uxfwkFgwNatExternalStart: function (value, modelValue){
               var externalDelta = null, internalDelta = null;
               if ( $U(value) ) { return true; }
               if ( !$U(data.externalPortEnd) && ("" !== data.externalPortEnd) ){
                  if ( data.externalPortStart*1 <= data.externalPortEnd*1 ){
                     externalDelta = data.externalPortEnd*1 - data.externalPortStart*1;
                     if ( !$U(data.internalPortStart) && !$U(data.internalPortEnd) ){
                        internalDelta = data.internalPortEnd*1 - data.internalPortStart*1;
                        if (externalDelta === internalDelta){
                           return true;
                        } else { return false; }
                     }
                  } else { return false; }
               }
               return true;
            },// endof uxfwkFgwNatExternalStart
         }
      };
      that.range.externalEnd.spec = function(data, ngModel){
         return {
            uxfwkFgwNatExternalEnd: function (value, modelValue){
               var externalDelta = null, internalDelta = null;
               if ( $U(value) || ("" === value) ) { return true; }
               if ( !$U(data.externalPortStart) ){
                  if ( data.externalPortEnd*1 >= data.externalPortStart*1 ){
                     externalDelta = data.externalPortEnd*1 - data.externalPortStart*1;
                     if ( !$U(data.internalPortStart) && !$U(data.internalPortEnd) ){
                        internalDelta = data.internalPortEnd*1 - data.internalPortStart*1;
                        if (externalDelta === internalDelta){
                           return true;
                        } else { return false; }
                     }
                  } else { return false; }
               }
               return true;
            },// endof uxfwkFgwNatExternalEnd
         }
      };
      that.range.internalStart.spec = function(data, ngModel){
         return {
            uxfwkFgwNatInternalStart: function (value, modelValue){
               var externalDelta = null, internalDelta = null;
               if ( $U(value) ) { return true; }
               if ( !$U(data.internalPortEnd) && ("" !== data.internalPortEnd) ){
                  if ( data.internalPortStart*1 <= data.internalPortEnd*1 ){
                     internalDelta = data.internalPortEnd*1 - data.internalPortStart*1;
                     if ( !$U(data.externalPortStart) && !$U(data.externalPortEnd) ){
                        externalDelta = data.externalPortEnd*1 - data.externalPortStart*1;
                        if (externalDelta === internalDelta){
                           return true;
                        } else { return false; }
                     }
                  } else { return false; }
               }
               return true;
            },// endof uxfwkFgwNatInternalStart
         }
      };
      that.range.internalEnd.spec = function(data, ngModel){
         return {
            uxfwkFgwNatInternalEnd: function (value, modelValue){
               var externalDelta = null, internalDelta = null;
               if ( $U(value) || ("" === value) ) { return true; }
               if ( !$U(data.internalPortStart) ){
                  if ( data.internalPortEnd*1 >= data.internalPortStart*1 ){
                     internalDelta = data.internalPortEnd*1 - data.internalPortStart*1;
                     if ( !$U(data.externalPortStart) && !$U(data.externalPortEnd) ){
                        externalDelta = data.externalPortEnd*1 - data.externalPortStart*1;
                        if (externalDelta === internalDelta){
                           return true;
                        } else { return false; }
                     }
                  } else { return false; }
               }
               return true;
            },// endof uxfwkFgwNatInternalEnd
         }
      };
      
      $scope.$watch(function (){ return that.forwardrule.serviceValue; }, function (value){
         var aux = null;
         if ( !$U(that.forwardrule.serviceValue) ){
            if ( that.common.service.custom === that.forwardrule.serviceValue*1 ){
               that.portList = [];
               that.portList.push({ id: internalId++ });
            } else {
               if ( !$U(aux = uxfwk.findInArray(that.serviceList, 'key', that.forwardrule.serviceValue*1)) ){
                  that.portList = [];
                  that.portList = angular.copy(aux.portList);
                  for ( var i = 0, leni = that.portList.length; i < leni; ++i ){ angular.extend(that.portList[i], { id: internalId++ }); }
               }
            }
         }
      });//endof listener
   }];
   
   return function (serviceData){
      return $uibModal.open({
         ariaLabelledBy: 'modal-title',
         ariaDescribedBy: 'modal-body',
         templateUrl: 'modules/fgw.security/fgw.security.portforwardmodal.html',
         controller: ctrl,
         size: 'lg',
         windowTopClass: 'fgw-modal-forward-xl',
         controllerAs: 'fgwSecurityPortForwardModal',
         resolve: {
            serviceData: function () {
               return serviceData;
            }
         }
      }).result;
   }
}]);

});



