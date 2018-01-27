/**
 * @ngdoc directive 
 * @description 
 * This directive replaces ui-validate since its prototype is not a very good one. 
 * Angular native prototype validator is a better choice and works well with some 
 * customizations performed in order to augment native validators with a custom cross
 * validation required in many contexts.
 *  
 * @author nuno-r-farinha
 */
define('uxfwk.directive.validate', ['angularAMD', 'uxfwk'], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U, lkey = 'uxfwk.directive.validate::';
   var debug = $console.debug.bind($console, lkey), error = $console.error.bind($console, lkey);
   var info = $console.info.bind($console, lkey), warn = $console.warn.bind($console, lkey);
   var log = $console.log.bind($console, lkey);
   var DIRECTIVE = 'uxfwkValidate';
angularAMD.directive(DIRECTIVE, ['$parse', '$timeout', 'appUtilities', function directive ($parse, $timeout, appUtilities){
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

   function updateFormsValidators (selfName, forms){
      for ( var f in forms ){
         if ( forms.hasOwnProperty(f) && angular.isObject(forms[f]) ){
            for ( var control in forms[f] ){
               if ( control === selfName ){ continue; }// bypass self control
               if ( forms[f].hasOwnProperty(control) && angular.isObject(forms[f][control]) && angular.isFunction(forms[f][control].$validate) ){
                  forms[f][control].$validate();
               }
            }
         }
      }
   };// @updateFormsValidators

   return{
      restrict: 'A',
      require: ['ngModel', '?^uxfwkTableDataRow', '?^^form', '?^^ngForm'],
      compile: function ($element, $attrs){
         var fnValidators = $parse($attrs[DIRECTIVE]);

         return function postLink ($scope, $element, $attrs, $controllers){
            var frmCtrl = $controllers[2] || $controllers[3];
            var ngModelCtrl = $controllers[0];
            var tblCtrl = $controllers[1];
            var timeoutP = null;

            //[#1.0] Sets some options on ngModel and adds list of validators
            ngModelCtrl.$$setOptions(angular.extend({}, ngModelCtrl.$options || {}, { allowInvalid:true, updateOnDefault:true }));
            angular.extend(ngModelCtrl.$validators, fnValidators($scope, {
               ngModel:  ngModelCtrl,
               injector: appUtilities.$injector,
            'p':null}));

            //[#2.0] Adds a listener to model changes
            ngModelCtrl.$viewChangeListeners.push(function (){
               timeoutP = $timeout(function(){
                  if ( tblCtrl ){
                     updateFormsValidators(ngModelCtrl.$name, tblCtrl.getAllForms());
                  }else{
                     updateFormsValidators(ngModelCtrl.$name, { mine: frmCtrl });
                  }
               }, 0);
            });

            $scope.$on('$destroy', function(){
               if ( timeoutP ){ $timeout.cancel(timeoutP); }
            });// endof ::$destroy

         };//endof postLink
      }// endof compile
   };// endof object
}]);// endof directive
});// endof module
