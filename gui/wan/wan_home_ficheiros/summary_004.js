/**
 * 
 */
define('uxfwk.fgw.summary.portTermination', ['angularAMD', 'uxfwk'
   , 'widgets/summary/summary.dao'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
angularAMD.directive('uxfwkFgwSummaryPortTermination', ['$parse', '$compile'
   , 'uxfwk.summary.dao'
, function uxfwkFgwSummaryPortTermination ($parse, $compile
   , dao
){

   function template(){
      return ('<div class="fgw-port-status-wrap">'+
                 '<i data-ng-repeat="portUp in currentPortStatus" class="icon fgw-termination-point-alt" data-ng-class=" (!!portUp.status) ? '+"'fgw-text-success'"+' : '+"''"+' "></i>'+
            '</div>');
   };// template

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

return{
   scope: true,
   restrict: 'A',
   require: ['ngModel'],
   template: template(),
   compile: function ($element, $attrs){

      return function link ($scope, $element, $attrs, $controllers){
         var ngModelCtrl = $controllers[0];
         
         ngModelCtrl.$formatters.push(function($modelValue){
            $scope.currentPortStatus = [];
            if ( !$U($modelValue) ){
               if ( isFinite($modelValue.number) ){
                  for ( var i = 0, leni = $modelValue.number; i < leni; ++i ){ $scope.currentPortStatus.push({ status:false }); }
               }
               if ( isFinite($modelValue.status) ){
                  for ( var i = 0, leni = $modelValue.number; i < leni; ++i ){
                     if ( $modelValue.status & Math.pow(2, i) ){ $scope.currentPortStatus[i].status = true; }
                  }
               }
            }
            return $scope.currentPortStatus;
         })
         
      };
   }
}}]);// ::uxfwkXdslLineConfigProfileLimitPsdMask
});//endof module
