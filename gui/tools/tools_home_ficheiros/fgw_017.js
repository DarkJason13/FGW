define('uxfwk.fgw.security.deleteModal', ['angularAMD', 'uxfwk'
   , 'uxfwk.require.css!modules/fgw.security/fgw.security.nat'
   , 'uxfwk.require.lang!fgw.contents.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
   var common = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

common.protocol = {
      tcpudp:    0,
      tcp:       1,
      udp:       2,
  p:null};// protocol

angularAMD.factory('uxfwk.fgw.security.deleteModal', ['$uibModal', '$filter', function ($uibModal, $filter){
   var fnTranslate = $filter('translate');
   var ctrl = ['$scope', 'warningData', function($scope, warningData){
      var that = this;
      
      that.common    = common;
      that.msg       = warningData.msg;
      that.tableNum  = 0;
      that.data      = [];
      that.entity    = warningData.entity;
      var rowMap     = {};
      
      if ( !$U(warningData.rules) && (warningData.rules.length > 1) ){
         that.tableNum = warningData.rules.length;
         that.data = angular.copy(warningData.rules);
      }
      that.ok = function () {
         that.removeData = [];
         if (that.data.length > 0 ){
            for ( var i = 0, leni = that.data.length; i < leni; ++i ){
               var aux = null;
               if ( !$U(aux = that.data[i].selected) && (true === aux) ){
                  that.removeData.push(that.data[i]);
               }
            }
         } else {
            that.removeData = angular.copy(warningData.rules);
         }
         $scope.$close({ success: true, data: that.removeData });
      };

      that.cancel = function () {
         $scope.$dismiss('cancel');
      };
      
      that.isFormValid = function (){
         var output = false, diff = null;
         if ( that.tableNum > 1 ){ 
            for ( var i = 0, leni = that.data.length; i < leni; ++i ){
               var aux = null;
               if ( !$U(aux = that.data[i].selected) && (true === aux) ){
                  output = true; break;
               }
            }
         } else { output = true; }
         return output;
      };// ::isFormValid

      that.tableForwardIsVisible = function () {
         var result = false;
         result = ( ('portForwarding' === that.entity) && (that.tableNum > 1) ) ? (true) : (false);
         return result;
      };
      that.tableAppIsVisible = function () {
         var result = false;
         result = ( ('portActivation' === that.entity) && (that.tableNum > 1) ) ? (true) : (false);
         return result;
      };
      
      that.name = {
         texter: function(expression){return{
            textualize: function (value){
               var output = null;
               if ( $U(expression) ){ return $filter('uxfwkNullHider')(); }
               output = expression;
               return output;
            },// ::
         expression: expression}},
      p:null};
      
      that.protocol = {
            texter: function (expression){return{
               textualize: function (value){
                  var output = null, aux = null, key = null;
                  if ( $U(expression) ){ return $filter('uxfwkNullHider')(); }
                  
                  output = '';
                  key = uxfwk.getKeyByValue(expression, that.common.protocol);
                  output += '<span>' + fnTranslate('TEXT.FGW.SECURITY.NAT.COMMON.PROTICOL.OPTION.' + angular.uppercase(key)) + '</span>';
                  return output;
               },// ::textualize
               expression: expression}},
         p:null};
   }];
   
   return function (deleteData){
      return $uibModal.open({
         ariaLabelledBy: 'modal-title',
         ariaDescribedBy: 'modal-body',
         templateUrl: 'modules/fgw.security/fgw.security.deleteModal.html',
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



