define(['angularAMD'], function module (angularAMD){'use strict';
   var IUiQuickview = {};
   var ITooltip = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.ui.quickview', ['$compile', '$parse', function uxfwkUiQuickview ($compile, $parse){
   IUiQuickview.Factory = {};
   function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

   IUiQuickview.Factory.scope = true;
   IUiQuickview.Factory.restrict = 'A';
   IUiQuickview.Factory.terminal = true;
   IUiQuickview.Factory.compile = function (buttonTemplate, classes, placement, directive){return function ($element, $attrs){
      var fnDummyTemplate = $compile(angular.element('<!-- Hidden quickview button -->'));
      var fnContentsTemplate = $compile($element.contents().remove());
      var fnButtonTemplate = angular.element(buttonTemplate);
      var fnSettings = function(){ return {}; };
      var fnNgIf = function(){ return true; };
      var domElementVisible = null;

      //[#1.0] Adds internal HTML attributes to button template (before compilation is done)
      if ( angular.isString(directive) ){ fnSettings = $parse($attrs[directive] || ''); }
      if ( angular.isString($attrs.ngIf) ){ fnNgIf = $parse($attrs.ngIf); }
      fnButtonTemplate.attr('data-uxfwk-tooltip-internal', 'uxfwk-popup-quickview');
      fnButtonTemplate.attr('data-popover-placement', placement || 'top');
      fnButtonTemplate.attr('data-popover-append-to-body', 'true');
      fnButtonTemplate.attr('data-popover-animation', 'false');
      fnButtonTemplate.addClass($element.attr('class'));
      fnButtonTemplate.addClass('uxfwk-ui-quickview');
      if ( angular.isString($element[0].id) ){ fnButtonTemplate[0].id = $element[0].id; }
      fnButtonTemplate = $compile(fnButtonTemplate);

      //[#2.0] Linkage function for button template
      function createButton ($isolatedScope){
         var context = {};

         fnButtonTemplate($isolatedScope.$new(), function (clone, scope){
            scope.settings = $isolatedScope.settings;
            context.clone = clone;
            context.scope = scope;
         });

         return context;
      };// @createButton

      //[#3.0] Linkage function for dummy template
      function createDummy ($isolatedScope){
         var context = {};

         fnDummyTemplate($isolatedScope.$new(), function (clone, scope){
            context.clone = clone;
            context.scope = scope;
         });

         return context;
      };// @createButton

      //[#4.0] Toggles element visibility
      function toggleVisibility ($element, visible, btn, dmy){
         //[#4.1] First process is to remove the initial element in DOM
         if ( !domElementVisible ){
            $element.replaceWith(dmy.clone);
            domElementVisible = dmy.clone;
         }

         //[#4.2] If visible, but button not in DOM, replaces it
         if ( visible && (domElementVisible != btn.clone) ){
            domElementVisible.replaceWith(btn.clone);
            domElementVisible = btn.clone;
         }
         //[#4.3] If invisible and button in DOM, replaces
         if ( !visible && (domElementVisible == btn.clone) ){
            domElementVisible.replaceWith(dmy.clone);
            domElementVisible = dmy.clone;
         }
      };// @toggleVisibility

      return function postLink ($scope, $element, $attrs, $controllers){
         var btnContents = null, dmyContents = null, popContents = null;// left to right: button, dummy comment and popup contents (each one with its own dom clone and scope)
         var myIsolatedScope = $scope.$new(true);// creates a isolated scope for this plugin so that it does not polute the main scope

         //[#1.0] Initializes some isolated scope variables
         myIsolatedScope.settings = fnSettings($scope);
         myIsolatedScope.classes = classes || '';

         //[#2.0] Creates button and dummy contents
         btnContents = createButton(myIsolatedScope);
         dmyContents = createDummy(myIsolatedScope);

         //[#3.0] Mimics ngIf logic based on ancestor $scope
         toggleVisibility($element, false, btnContents, dmyContents);// begins assuming that visibility is false
         if ( angular.isFunction(fnNgIf) ){
            $scope.$watch(fnNgIf, function(value){ toggleVisibility($element, value, btnContents, dmyContents); });
         }

         //[#4.0] Instantiates some information for use by chain of directives
         myIsolatedScope.uxfwkQuickview = { transcludeContents:{ compiler:fnContentsTemplate, scope:$scope } };
         myIsolatedScope.uxfwkQuickview.closePopup = function (){
            toggleVisibility($element, false, btnContents, dmyContents);// removes button
            if ( angular.isElement(btnContents.clone) ){ btnContents.clone.remove(); }
            if ( angular.isObject(btnContents.scope) ){ btnContents.scope.$destroy(); }
            btnContents = createButton(myIsolatedScope);
            toggleVisibility($element, true, btnContents, dmyContents);// removes button
         };// @closePopup

         //[#5.0] On this scope destruction, removes every internal data
         $scope.$on('$destroy', function(){
            if ( angular.isObject(btnContents) ){
               if ( angular.isElement(btnContents.clone) ){ btnContents.clone.remove(); }
               if ( angular.isObject(btnContents.scope) ){ btnContents.scope.$destroy(); }
            }
            if ( angular.isObject(dmyContents) ){
               if ( angular.isElement(dmyContents.clone) ){ dmyContents.clone.remove(); }
               if ( angular.isObject(dmyContents.scope) ){ dmyContents.scope.$destroy(); }
            }
            if ( angular.isObject(myIsolatedScope) ){
               myIsolatedScope.$destroy();
            }
            domElementVisible = null;
         });
      };
   }};// ::compile template


   IUiQuickview.IFactory = function (buttonTemplate, classes, placement, directive){
      var newDirective = angular.copy(IUiQuickview.Factory);

      newDirective.compile = IUiQuickview.Factory.compile(buttonTemplate, classes, placement, directive);

      return newDirective;
   };// ::IFactory

   return IUiQuickview.IFactory;
}]);// endof uxfwk.ui.quickview


angularAMD.directive('uxfwkQuickview', ['$uibTooltip', '$sce', 'appUtilities', '$compile', '$parse', function uxfwkTooltip ($tooltip, $sce, appUtilities, $compile, $parse){
   var $console = appUtilities.$console, $U = appUtilities.$u.$U, $w = appUtilities.$w;
   var uxfwkQuickview = { scope: {} };
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

uxfwkQuickview.controller = ['$scope', '$element', '$attrs', '$transclude', function ($scope, $element, $attrs, $transclude){


   $scope.placement = $attrs['uxfwkQuickviewPlacement'] || 'top';
   $scope.classes   = $attrs['uxfwkQuickviewClass'] || '';


}];
uxfwkQuickview.terminal = true;
uxfwkQuickview.require = ['uxfwkQuickview'];
uxfwkQuickview.compile = function ($element, $attrs){
   var fnTemplate = angular.element('<button class="uxfwk-quickview" type="button" data-uxfwk-tooltip-internal="uxfwk-popup-quickview" data-popover-append-to-body="true" data-popover-animation="false"><i class="caret fx-open-quickview"></i></button>');
   var fnDummyElement = $compile(angular.element('<!-- Hidden quickview button -->'));
   var fnContents = $compile($element.contents().remove());// directive contents without linkage
   var fnNgIf = function(){ return true; }

   if ( angular.isString($attrs.ngIf) ){ fnNgIf = $parse($attrs.ngIf); }
   fnTemplate.attr('data-popover-placement', $attrs.uxfwkQuickviewPlacement || 'top');
   fnTemplate = $compile(fnTemplate);


   return function postLink ($scope, $element, $attrs, $controllers){
      var dummyElement = null, tplElement = null, newScope = null;
      var elementInDom = null;

      tplElement = fnTemplate(newScope = $scope.$new(), function(clone, scope){});

      //[#1.0] Creates dummy element by compiling it with ancestor scope (the one before isolation)
      dummyElement = fnDummyElement($scope.$parent, function(clone, scope){

         //[#1.1] The directive element is a simple placeholder which should be replaced by template.
         // But since template visibility is dependent of ngIf, a replace by dummy is allways done.
         $element.replaceWith(clone);
         elementInDom = clone;

         //[#1.2] Check ngIf visibility to make appropriate changes
         if ( angular.isFunction(fnNgIf) ){
            scope.$watch(fnNgIf, function (value){
               if ( 0 ){}
               else if ( value && (tplElement != elementInDom) ){ elementInDom.replaceWith(tplElement); elementInDom = tplElement; }
               else if ( !value && (tplElement == elementInDom) ){ tplElement.replaceWith(dummyElement); elementInDom = dummyElement; }
            });
         }

         $scope.uxfwkQuickview = { transcludeContents:{ compiler:fnContents, scope:scope } };
      });// compiled 

      $scope.uxfwkQuickview.closePopup = function (){
         if ( elementInDom == tplElement ){ tplElement.replaceWith(dummyElement); }
         tplElement.remove();
         newScope.$destroy();
         tplElement = fnTemplate(newScope = $scope.$new(), function(clone, scope){});
         dummyElement.replaceWith(tplElement);
         elementInDom = tplElement;
      };// ::closePopup

      $scope.$on('$destroy', function(){
         if ( dummyElement ){ dummyElement.remove(); }
         if ( tplElement ){ tplElement.remove(); }
      });

   };
};
return uxfwkQuickview;
}]);// uxfwkQuickView


angularAMD.directive('uxfwkTooltipInternal', ['$uibTooltip', function uxfwkTooltipInternal ($tooltip){
   var stdDirective = $tooltip('uxfwkTooltipInternal', 'popover', 'click');
   var myDirective = angular.copy(stdDirective);

   myDirective.controller = (function(){return['$scope', '$element', '$attrs', function($scope, $element, $attrs){
      var hello = true;

      $scope.uxfwkTooltipInternal = { $element:$element, $scope:$scope };

   }]})();// ::controller

   return myDirective;
}]);// uxfwkTooltipInternal


angularAMD.directive('uxfwkTooltipInternalPopup', ['$rootScope', '$document', '$compile', 'appUtilities', function uxfwkTooltipInternalPopup ($rootScope, $document, $compile, appUtilities){
   var $console = appUtilities.$console, $U = appUtilities.$u.$U, $w = appUtilities.$w;
   var uxfwkTooltipInternalPopup = {};
   var currentPopupElements = null;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

$rootScope.$watch(function(){ return currentPopupElements; }, function (newPopup, oldPopup){
   if ( !newPopup && oldPopup ){
      oldPopup.uxfwkQuickview.closePopup();
   }else if ( (newPopup != oldPopup) && oldPopup ){
      oldPopup.uxfwkQuickview.closePopup();
   }
   //console.warn('popup', newPopup, oldPopup);
});// ::watcher

function closeCurrentPopup (){
   if ( currentPopupElements ){
      currentPopupElements.uxfwkQuickview.closePopup();
      currentPopupElements = null;
   }
};// closePopups

$document.on('click', function (event){
   var p = null;

   if ( angular.isObject(p = currentPopupElements) ){
      var target = $w(event.target);

      if ( 0 ){}
      else if ( $w(p.uxfwkTooltipInternal.$element).dom() == target.dom() ){
         //console.warn('Clicked popup button, leave it as component will take care of it', p.uxfwkTooltipInternalPopup);
      }else if ( $w(p.uxfwkTooltipInternalPopup.$element).isAncestorOf(target) ){
         //console.warn('Clicked inside popup, leave it open');
      }else{
         //console.warn('Clicked outside popup, closes it');
         closeCurrentPopup();
         $rootScope.$apply();
      }
   }
});// @click
$rootScope.$on('uxfwk-scroll', function(){
   //console.warn('Scroll');
   closeCurrentPopup();
});// @uxfwk-scroll


uxfwkTooltipInternalPopup.replace = true;
uxfwkTooltipInternalPopup.template = ('<div class="popover {{:: $parent.placement }} uxfwk-tooltip-popup {{:: $parent.content }} {{:: origScope.classes }} {{:: origScope.settings.popoverClasses }}" nng-class="{ in: isOpen(), fade: animation() }">'+
   '<div class="arrow"></div>'+
   '<div class="popover-content" data-uxfwk-tooltip-popup></div>'+
'</div>');
uxfwkTooltipInternalPopup.compile = function ($element, $attrs){

   return function postLink ($scope, $element, $attrs, $controllers){
      var myCurrent = null;

      currentPopupElements = myCurrent = {
         uxfwkQuickview:            $scope.origScope.uxfwkQuickview,
         uxfwkTooltipInternal:      $scope.origScope.uxfwkTooltipInternal,
         uxfwkTooltipInternalPopup: { $element:$element, $scope:$scope },
      p:null};
      $scope.$on('$destroy', function(){
         if ( myCurrent == currentPopupElements ){
            currentPopupElements = null;
         }
      });

   };// ::postLink
};// ::compile
return uxfwkTooltipInternalPopup;
}]);// uxfwkTooltipInternalPopup



angularAMD.directive('uxfwkTooltipPopup', ['$compile',
function ($compile)
{
   ITooltip.Popup = {};

   function Private (){

      return;vshack.catch();
   };// @Private

   ITooltip.Popup.controller = (function(){return['$scope', function($scope){
      var that = this;

      that.isOpen = function (){
         return $scope.isOpen;
      };// ::isOpen

   }]})();// ::controller

   ITooltip.Popup.require = ['uxfwkTooltipPopup'];
   ITooltip.Popup.link = function ($scope, $element, $attrs, $controllers){

      //console.info($scope.origScope.uxfwkQuickview);
      if ( angular.isFunction($scope.origScope.uxfwkQuickview.transcludeContents.compiler) ){
         $scope.origScope.uxfwkQuickview.transcludeContents.compiler($scope.origScope.uxfwkQuickview.transcludeContents.scope.$new(), function(clone, scope){
            $element.append(clone);
            $scope.$on('$destroy', function(){
               clone.remove();
               scope.$destroy();
            });
         }, { transcludeControllers:{'uxfwkTooltipPopup':{ instance:$controllers[0] }} });

      }else{ $element.append($scope.origScope.uxfwkQuickview.transcludeContents.compiler.clone()); }


   };// ::link
   ITooltip.Popup.restrict = 'A';
   return ITooltip.Popup;
}]);// endof uxfwkTooltipPopup





angularAMD.directive('uxfwkUiQuickviewHelper', ['uxfwk.ui.quickview', function uxfwkUiQuickviewHelper (quickviewFactory){
   return quickviewFactory('<button type="button" class="fx-alert-button"><i class="fuxicons fuxicons-help"></i></button>', 'uxfwk-ui-quickview-helper', null, 'uxfwkUiQuickviewHelper');
}]);// endof uxfwkUiQuickviewHelper



});// end of define
