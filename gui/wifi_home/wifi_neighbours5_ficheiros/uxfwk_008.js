/**
 * 
 */
define('uxfwk.validate.directive.hints', ['angularAMD', 'uxfwk'], function module (angularAMD, uxfwk){
   var $console = uxfwk.$console, $U = uxfwk.$U, lkey = 'uxfwk.validate.directive.hints::';
   var debug = $console.debug.bind($console, lkey), error = $console.error.bind($console, lkey);
   var info = $console.info.bind($console, lkey), warn = $console.warn.bind($console, lkey);
   var log = $console.log.bind($console, lkey);
   var DIRECTIVE = 'uxfwkFormValidationHints';
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.directive(DIRECTIVE, ['$parse', '$compile', '$interpolate', 'appUtilities',
/**
 * @ngdoc 
 * @description 
 * This directive augments form controls with a set of tooltips that shows warnings 
 * about future would be errors. All warnings are shown as info level warnings and 
 * texts are bound to translation namespace 'TEXT.COMMON.RULES'.
 */
function uxfwkFormValidationHints ($parse, $compile, $interpolate, appUtilities){
   var $console = appUtilities.$console, $w = appUtilities.$w;
   var uxfwkFormValidationHints = { i:{}, d:{ scope:{} } };
   var startSym = $interpolate.startSymbol();
   var endSym = $interpolate.endSymbol();
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

function _myscope ($scope){ return $scope; };

//[#1.0] - Defines the base template for warnings
uxfwkFormValidationHints.i.template = (''+
'<div>'+
   '<div data-ng-repeat="(key, value) in $$$$legacyData" class="alert alert-info">'+
      '<div class="fx-alert-icon"><i class="icon fgw-info"></i></div>'+
      '<div class="fx-alert-desc"><p data-translate="'+startSym+' (\'TEXT.COMMON.RULES.\' + (key | uppercase)) '+endSym+'" translate-values="'+startSym+'$$$$rulesData'+endSym+'"></p></div>'+
   '</div>'+
   '<div data-ng-repeat="(key, value) in $$$$textualizeData" class="alert alert-info">'+
      '<div class="fx-alert-icon"><i class="fuxicons fuxicons-info"></i></div>'+
      '<div class="fx-alert-desc"><p>{{ value }}</p></div>'+
   '</div>'+
'</div>');
// endof ::@template

//[#2.0] - Updates internal data to be passed to translate service for building up warning texts
uxfwkFormValidationHints.i.updateRulesData = function (newValue, oldValue, $scope){
   var myscope = _myscope($scope);
   var ngModel = myscope.$$$$ngModel;
   var validators = null;

   myscope.$$$$legacyData = {};
   myscope.$$$$textualizeData = {};
   myscope.$$$$rulesData = angular.extend({}, myscope.$$$$standardRules);
   myscope.$$$$rulesData.currentLength = (myscope.$$$$ngModel.$viewValue || '').length;
   if ( ngModel && angular.isObject(validators = ngModel.$validators) ){
      for ( var p in newValue ){
         if ( newValue.hasOwnProperty(p) ){
            if (0){}
            //[#] Checks for texts defined in validators build through the service of validate.collection
            else if ( validators[p] && angular.isFunction(validators[p].textualize) ){ myscope.$$$$textualizeData[p] = validators[p].textualize(); }
            else if ( validators[p] && angular.isString(validators[p].textualize) ){ myscope.$$$$textualizeData[p] = validators[p].textualize(); }
            //[#] Now the lines for legacy code
            else{
               if ( !$U(myscope.$parent['$$$' + p]) ){ myscope.$$$$rulesData = angular.extend(myscope.$$$$rulesData, myscope.$parent['$$$' + p]); }
               if ( !$U(myscope.$$$$ngModel['$$$' + p]) ){ myscope.$$$$rulesData = angular.extend(myscope.$$$$rulesData, myscope.$$$$ngModel['$$$' + p]); }
               myscope.$$$$legacyData[p] = true;
            }
         }
      }
   }

};// endof ::@updateRulesData

uxfwkFormValidationHints.i.updateLength = function (newValue, oldValue, $scope){
   if ( !$U(newValue) ){ _myscope($scope).$$$$rulesData.currentLength = newValue.length; }
};// endof ::@updateLength

uxfwkFormValidationHints.i.updateStyles = function (newValue, oldValue, $scope){
   if ( !$U(newValue) && (true === newValue) ){ _myscope($scope).$$$$element.addClass(''); }
   else{ _myscope($scope).$$$$element.removeClass(''); }
};// endof ::@updateStyles

uxfwkFormValidationHints.i.updateTooltip = function ($scope){
   var myscope = _myscope($scope);
   if ( !$U(myscope) && !$U(myscope.tooltip) ){
      myscope.$$$$element.attr('title', myscope.tooltip.sprintf(myscope.$$$$standardRules.min, myscope.$$$$standardRules.max));
   }
};// endof ::@updateTooltip

function updatePrecision (value, precision, scale, offset){
   var factor = Math.pow(10, precision);
   return ((value/(factor*scale)) + offset).toFixed(precision);
};// ::@updatePrecision

uxfwkFormValidationHints.d.compile = function ($element, $attrs){
   var compiledContents = $compile(uxfwkFormValidationHints.i.template);
   var fnScale = null;
   
   if ( !$U($attrs.scale) ){ fnScale = $parse($attrs.scale); }
   return function link ($scope, $element, $attrs, $ctrls){
      var options = $ctrls[0].$options || {};
      var myscope = _myscope($scope);
      var ngModel = $ctrls[0];
      var tplElem = null;

      $element = $w($element);

      //[#1.0] - Instanciates a new clone of template (compiled template will be
      // shared across many instances of this directive, so it MUST be cloned for
      // each instance). Also, on scope destruction, clone MUST be manually removed
      // from (since it was manually inserted on DOM as well).
      compiledContents($scope, function(clone, scope){ $element.parent().append(tplElem = clone); });
      $scope.$on('$destroy', function(){ tplElem.remove(); });

      myscope.$$$$ngModel = $ctrls[0];
      myscope.$$$$ngForm  = $ctrls[1] || $ctrls[2];
      myscope.$$$$standardRules = {};
      myscope.$$$$rulesData = {};
      myscope.$$$$element = $element;
      myscope.tooltip = null;
      myscope.precision = ($attrs.precision*1) || 0;
      myscope.scale     = 1
      myscope.offset    = 0;
      if ( !$U(fnScale) ){ myscope.scale = fnScale($scope); }
      if ( !$U($attrs.offset) && !isNaN($attrs.offset*1) ){ myscope.offset = $attrs.offset*1; }

      //[#2.0] - sets some watchers for standard angular validators
      if ( !$U($attrs.ngMin) ){
         myscope.$$$$standardRules.min = $attrs.ngMin;
         $attrs.$observe('ngMin', function(newValue){ myscope.$$$$standardRules.min = updatePrecision(newValue, myscope.precision, myscope.scale, myscope.offset); uxfwkFormValidationHints.i.updateTooltip($scope); });
      }
      if ( !$U($attrs.ngMax) ){
         myscope.$$$$standardRules.max = $attrs.ngMax;
         $attrs.$observe('ngMax', function(newValue){ myscope.$$$$standardRules.max = updatePrecision(newValue, myscope.precision, myscope.scale, myscope.offset); uxfwkFormValidationHints.i.updateTooltip($scope); });
      }
      if ( !$U($attrs.ngMinlength) ){
         myscope.$$$$standardRules.minLength = $attrs.ngMinlength;
         $attrs.$observe('ngMinlength', function(newValue){ console.warn("minlen", newValue); myscope.$$$$standardRules.minLength = newValue; });
      }
      if ( !$U($attrs.ngMaxlength) ){
         myscope.$$$$standardRules.maxLength = $attrs.ngMaxlength;
         $attrs.$observe('ngMaxlength', function(newValue){ myscope.$$$$standardRules.maxLength = newValue; });
      }
      if ( !$U(myscope.$$$$standardRules.min) && !$U(myscope.$$$$standardRules.max) && $U($attrs['title']) ){
         myscope.tooltip = '[{0}..{1}]';//.sprintf(myscope.$$$$standardRules.min, myscope.$$$$standardRules.max);
         uxfwkFormValidationHints.i.updateTooltip($scope);
      }


      options.allowInvalid = true;
      options.updateOnDefault = true;
      myscope.$$$$ngModel.$$setOptions(options);

      ngModel.$viewChangeListeners.push(function(){ return uxfwkFormValidationHints.i.updateRulesData(ngModel.$error, ngModel.$error, $scope); });

      //[#3.0] - sets an watcher over angular $error object and viewValue as it is required to built the translate variables
      $scope.$watchCollection(function(){ return ngModel.$error; }, uxfwkFormValidationHints.i.updateRulesData);
      $scope.$watch(function(){ return ngModel.$viewValue; }, uxfwkFormValidationHints.i.updateLength);

      //[#4.0] - another watch to change CSS class to notify when a control is invalid
      $scope.$watch(function(){ return ngModel.$invalid }, uxfwkFormValidationHints.i.updateStyles);

      $scope.$on('$destroy', function(){
         //$console.warn('im singing in the rain', $element.parent().html());
         //newelements.remove();
         //$console.info('im singing oppsss', newelements);
         //$console.warn('im singing in the sun', $element.parent().html());
      });
      //$console.debug('uxfwkFormValidationHints::link done', $scope, $element, $attrs);
   };// endof link
};// ::compile
uxfwkFormValidationHints.d.require = ['ngModel', '?^^form', '?^^ngForm'];
uxfwkFormValidationHints.d.restrict = 'A';
return uxfwkFormValidationHints.d;
}]);// endof uxfwkFormValidationHints

});// endof module
