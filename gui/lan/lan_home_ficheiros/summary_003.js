/**
 * 
 */
define('uxfwk.fgw.summary.switch', ['angularAMD', 'uxfwk'
   , 'uxfwk.require.lang!fgw.widgets.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
angularAMD.directive('uxfwkFgwSummarySwitch', ['$filter', '$parse', '$compile', '$translate'
, function uxfwkFgwSummarySwitch ($filter, $parse, $compile, $translate
){
   
   function template(){
      return ('<div class="" fgw-toggle data-ng-model="element.value"  data-size="xmini" data-on="on" data-off="off" data-readonly data-disabled></div>');
   };// template

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

return{
   scope: true,
   restrict: 'A',
   require: ['ngModel'],
   template: template(),
   compile: function ($element, $attrs){

      return function link ($scope, $element, $attrs, $controllers){
         var currentText = null, textOn = null, textOff = null;
         var ngModelCtrl = $controllers[0];

         $console.warn("$modelValue", textOn, textOff, $translate);
         $translate("TEXT.COMMON.LABEL.ON")
         .then(function(response){
            textOn = response;
            $console.warn("$modelValue", textOn, textOff, response);
            return $translate("TEXT.COMMON.LABEL.OFF");
         })
         .then(function(response){
            textOff = response;
            $console.warn("$modelValue", textOn, textOff, response);
         })
         .catch(function(error){
            console.warn('Error', error);
         })
         
         ngModelCtrl.$formatters.push(function($modelValue){
            $scope.element = {};

            if ( !$U($modelValue) ){
               $scope.element.value = $modelValue*1;
               
               $scope.element.text = (1 === $modelValue*1) ? textOn : textOff;
               $scope.element.text = 'on';
            }
            return 1;
         })
         
      };
   }
}}]);
});//endof module
