/** 
 * @description 
 */
define('uxfwk.rm.ui.data.view', ['angularAMD', 'uxfwk'], function (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U, lkey = 'uxfwk.rm.ui.data.view::';
   var debug = $console.debug.bind($console, lkey), error = $console.error.bind($console, lkey);
   var info = $console.info.bind($console, lkey), warn = $console.warn.bind($console, lkey);
   var log = $console.log.bind($console, lkey);
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.ui.data.view', [
/** 
 * @module uxfwk.ui
 * @name uxfwk.ui.data.view
 * @description 
 * Service that allows the registering of new buttons/actions in a data view. 
 * This service allows further customization and modularity of data view 
 * without changing the core code.
 */
function uxfwkUiDataViewFactory (){
/**
 * Creates base service interface api (IUiDataViewFactory) and private service 
 * data (MyData).
 */
var IUiDataViewFactory = {}, data = (function(){function MyData (){
   var views = {};

   this.action = function (view, name, icon, classes, text){
      if ( arguments.length > 2 ){
         if ( !angular.isObject(views[view]) ){ views[view] = { actions:{} }; }
         views[view].actions[name] = { icon:icon, classes:classes, text:text };
         return views[view].actions[name];
      }else if ( angular.isDefined(views[view]) ){
         return views[view].actions[name];
      }else{ return null; }
   };// @action

   this.view = function (view, icon){
      if ( arguments.length > 1 ){ if ( !angular.isObject(views[view]) ){ views[view] = { icon:icon, actions:{} }; } }
      return views[view];
   };// @view


};return new MyData();vshack.catch();})();
data.view('table',     'fa fa-table');
data.view('tablediff', 'glyphicon glyphicon-retweet');
data.view('topology',  'fuxicons fuxicons-topology');
data.view('linechart', 'fuxicons fuxicons-line-chart');

data.action('table',    'inline-creation',  'fuxicons fuxicons-add-in-table', 'btn btn-primary btn-xs', 'add new entry');
data.action('table',    'inline-removal',   'fuxicons fuxicons-rejected',     'btn btn-link btn-link-in-table chk-action-row-remove', null);

data.action('refresh',  'refresh',          'glyphicon glyphicon-refresh',    'btn btn-default btn-xs', null);

IUiDataViewFactory.action = function (view, name, icon, classes, text){
   return data.action.apply(data.action, arguments);
};// ::action


/**
 * @module uxfwk.ui.data.view
 * @service uxfwk.ui.data.view
 * @method uxfwk.ui.data.view::view
 * @description 
 * As a getter, retrieves the view identified by {view} parameter. 
 * As a setter, creates a new view identified by {view} parameter and defined by 
 * all other parameters.
 *  
 * @param view {string} view name
 * @param icon {string} classes which defines the icon to be displayed
 * @returns { icon:{string} }
 */
IUiDataViewFactory.view = function (view, icon){
   return data.view(view, icon);
};// ::view

return IUiDataViewFactory;}]);// endof uxfwkUiDataViewFactory


angularAMD.directive('uxfwkUiDataView', ['$parse',
function uxfwkUiDataView ($parse
){
   var IUiDataView = {}, NS = 'uxfwkUiDataView';
   var mydebug = debug.bind(debug, NS+'::'), myerror = error.bind(error, NS+'::');
   var myinfo = info.bind(info, NS+'::'), mywarn = warn.bind(warn, NS+'::');
   var mylog = log.bind(log, NS+'::');

   function Private ($scope, $element, $attrs, settings, myCtrl, ngCtrl){
      var currentModelValue = null, currentViewValue = null;
      var that = this;

      //[#1.0] If ngModel is defined, add some model transformations to pipeline
      if ( ngCtrl ){
         ngCtrl.$formatters.push(function($modelValue){
            var output = {};

            currentModelValue = $modelValue || {};
            output.view = currentModelValue.view;

            currentViewValue = output;
            mywarn('FORMATTER', $modelValue, '=>', output);
            return output;
         });// @$formatter

         ngCtrl.$parsers.push(function($viewValue){
            var output = angular.copy(currentModelValue || {});

            output.view = $viewValue.view;

            mywarn('PARSER', $viewValue, '=>', output);
            return output;
         });// @$parser
      }

      that.updateView = function (view){
         mydebug('Update view', view);
         if ( ngCtrl ){
            currentViewValue.view = view;
            ngCtrl.$setViewValue(angular.copy(currentViewValue), 'custom');
         }
      };// @updateView

      that.getView = function (){
         if ( angular.isObject(currentViewValue) ){ return currentViewValue.view; }
         return null;
      };// @getView

      myCtrl.settings = function (){ return (settings || {}); }

      myCtrl._private(that);
      return;vshack.catch();
   };// @Private

   IUiDataView.restrict = 'A';
   IUiDataView.controller = (function(){return['$scope', '$element', '$attrs', function($scope, $element, $attrs){
      var that = this, priv = null;

      that.toggleView = function (view){
         if ( priv ){ return priv.updateView(view); }
      };// ::toggleView

      that.getView = function (){
         if ( priv ){ return priv.getView(); }
      };// ::getView

      that._private = function (p){ priv = p; delete that._private; };// temporary method to link private and controller
   }]})();// ::controller
   IUiDataView.require = ['uxfwkUiDataView', '?ngModel'];
   IUiDataView.compile = function ($element, $attrs){
      var fnSettings = $parse($attrs[NS]);

      return function postLink ($scope, $element, $attrs, $controllers){
         var myCtrl = $controllers[0], ngCtrl = $controllers[1], priv = null;
         var settings = fnSettings($scope);

         //[#1.0] Checks required conditions (abort otherwise)
         //myinfo($scope.$id, arguments);

         //[#2.0] Instantiates private data
         priv = new Private($scope, $element, $attrs, settings, myCtrl, ngCtrl);

      };// ::postLink
   };// ::compile

   return IUiDataView;
}]);// endof directive


angularAMD.directive('uxfwkUiDataViewToolbar', ['$compile', '$parse',
function uxfwkUiDataViewToolbar ($compile, $parse){
   var IUiDataViewToolbar = {}, NS = 'uxfwkUiDataViewToolbar';

   function Private ($scope, $element, $attrs, $controllers){



      return;vshack.catch();
   };// @Private


   IUiDataViewToolbar.restrict = 'A';
   IUiDataViewToolbar.transclude = true;
   IUiDataViewToolbar.template = (function(){return(
      '<div class="ffx-bulk-actions clearfix">'+
       '<div class="pull-right btn-group uxfwk-ui-data-view-toolbar-internal" data-ng-transclude data-uxfwk-ui-data-view-toolbar-internal="{ operation:\'refresh\' }"></div>'+
       '<div class="pull-right btn-group uxfwk-ui-data-view-toolbar-internal" data-ng-transclude data-uxfwk-ui-data-view-toolbar-internal="{ operation:\'toggle\' }"></div>'+
       '<div class="pull-right btn-group uxfwk-ui-data-view-toolbar-internal" data-ng-transclude data-uxfwk-ui-data-view-toolbar-internal="{ operation:\'creation\' }"></div>'+
      '</div>'
   ).sprintf(null).sprintf(NS);})();// ::template
   IUiDataViewToolbar.controller = (function(){return[function(){
   }];})();// ::controller
   IUiDataViewToolbar.require = ['uxfwkUiDataViewToolbar'];
   IUiDataViewToolbar.compile = function ($element, $attrs){
      var fnSettings = $parse($attrs[NS]);


      return function postLink ($scope, $element, $attrs, $controllers){

         $element.addClass('uxfwk-ui-data-view-toolbar');

      };// ::postLink
   };// ::compile
   return IUiDataViewToolbar;
}]);// endof directive




angularAMD.directive('uxfwkUiDataViewToolbarInternal', ['$parse',
function uxfwkUiDataViewToolbarInternal ($parse
){
   var IUiDataViewToolbarInternal = {}, NS = 'uxfwkUiDataViewToolbarInternal', cnt = 1;
   var myinfo = info.bind($console, NS+'::'), mywarn = warn.bind($console, NS+'::');

   function Private ($scope, $element, $attrs, settings, myCtrl){
      var buttons = {}, that = this, selectedAction = null;
      var toggleValue = null;

      that.button = function (id, visibility){
         if ( !angular.isObject(buttons[id]) ){
            buttons[id] = {
               visibility: false,
            p:null};
         }
         buttons[id].visibility = visibility;
      };// @button

      that.operation = function (){
         return (settings || {}).operation;
      };// @operation

      that.updateVisibility = function (buttonId, visibility){
         var offset = 0, count = 0;

         if ( 'toggle' == settings.operation ){ offset = 2; }
         else{ offset = 1; }
         that.button(buttonId, visibility);
         for ( var b in buttons ){
            if ( buttons.hasOwnProperty(b) ){
               count += (buttons[b].visibility?1:0);
            }
         }
         if ( count < offset ){ $element.hide(); }
         else{ $element.show(); }

      };// @updateVisibility

      that.updatedSelected = function (buttonId){
         if ( angular.isString(buttonId) ){ selectedAction = buttonId; }
         return selectedAction;
      };// @updatedSelected

      myCtrl._private(that);
      return;vshack.catch();
   };// @Private

   IUiDataViewToolbarInternal.restrict = 'A';
   IUiDataViewToolbarInternal.controller = (function(){return['$scope', '$element', '$attrs', function($scope, $element, $attrs){
      var that = this, priv = null;

      that.operation = function (){
         if ( priv ){ return priv.operation(); }
      };// ::operation

      that.notifyButtonVisibilityChange = function (buttonId, visibility){
         if ( priv ){ return priv.updateVisibility(buttonId, visibility); }
      };// ::notifyButtonVisibilityChange

      that.updatedSelected = function (buttonId){
         if ( priv ){ return priv.updatedSelected(buttonId); }
      };// ::updatedSelected

      that._private = function (p){ priv = p; delete that._private; };// temporary method to link private and controller
   }]})();// ::controller
   IUiDataViewToolbarInternal.require = ['uxfwkUiDataViewToolbarInternal'];
   IUiDataViewToolbarInternal.compile = function ($element, $attrs){
      var fnSettings = $parse($attrs[NS]);

      return function postLink ($scope, $element, $attrs, $controllers){
         var myCtrl = $controllers[0], priv = null;
         var settings = fnSettings($scope);

         //[#1.0] Checks required conditions (abort otherwise)
         //myinfo($scope.$id, arguments);

         //[#2.0] Instantiates private data
         priv = new Private($scope, $element, $attrs, settings, myCtrl);


      };// ::postLink
   };// ::compile

   return IUiDataViewToolbarInternal;
}]);// endof directive

angularAMD.directive('uxfwkUiDataViewToolbarButton', ['$document', '$compile', '$parse',
   'uxfwk.ui.data.view',
function uxfwkUiDataViewToolbarButton ($document, $compile, $parse,
   uxfwkUiDataView
){
   var IUiDataViewToolbarButton = {}, NS = 'uxfwkUiDataViewToolbarButton', cnt = 1;
   var myinfo = info.bind($console, NS+'::'), mywarn = warn.bind($console, NS+'::');

   function Private ($scope, $element, $attrs, settings, toolbarCtrl, dataViewCtrl){
      var isAllowedToBeVisible = true;
      var that = this;

      that.isVisible = function (){
         return (isAllowedToBeVisible && (toolbarCtrl.operation() == settings.operation));
      };// @isVisible

      that.setVisibility = function (bool){
         isAllowedToBeVisible = !!bool;
      };// @setVisibility

      that.toggleView = function (){
         if ( dataViewCtrl && angular.isFunction(dataViewCtrl.toggleView) ){
            dataViewCtrl.toggleView(settings.value);
         }
         if ( toolbarCtrl && angular.isFunction(toolbarCtrl.updatedSelected) ){
            toolbarCtrl.updatedSelected($element[0].id);
         }
      };// @toggleView

      return;vshack.catch();
   };// @Private

   IUiDataViewToolbarButton.scope = true;
   IUiDataViewToolbarButton.restrict = 'A';
   IUiDataViewToolbarButton.require = ['?^^uxfwkUiDataViewToolbarInternal', '?^^uxfwkUiDataView'];
   IUiDataViewToolbarButton.compile = function ($element, $attrs){
      var fnSettings = $parse($attrs[NS]);

      return function postLink ($scope, $element, $attrs, $controllers){
         var toolbarCtrl = null, dataViewCtrl = null;
         var dummy = null, priv = null, aux = null;
         var settings = fnSettings($scope);

         //[#1.0] Checks required conditions (abort otherwise)
         if ( !angular.isObject(toolbarCtrl = $controllers[0]) ){ return; }
         dataViewCtrl = $controllers[1];
         //myinfo('Initialize', $scope.$id, arguments);

         //[#2.0] Instantiates private data
         priv = new Private($scope, $element, $attrs, settings, toolbarCtrl, dataViewCtrl);

         //[#3.0] Customizes button according with registered types in service
         switch ( settings.operation ){
            case 'toggle':{
               if ( ('tablediff' === settings.value) && (!dataViewCtrl || (true != dataViewCtrl.settings().tablediff)) ){
                  priv.setVisibility(false);
               }else if ( angular.isObject(aux = uxfwkUiDataView.view(settings.value)) ){
                  $element.addClass('btn btn-default btn-xs');
                  if ( angular.isString(aux.icon) ){ $element.prepend('<i class="{0}"></i>'.sprintf(aux.icon)); }

                  $element.on('click', function(){
                     $scope.$apply(priv.toggleView);
                  });

                  if ( toolbarCtrl ){
                     $scope.$watch(function(){ return toolbarCtrl.updatedSelected(); }, function(value){
                        if ( value == $element[0].id ){ $element.addClass('selected'); }
                        else{ $element.removeClass('selected'); }
                     });
                  }

                  if ( dataViewCtrl ){
                     $scope.$watch(function(){ return dataViewCtrl.getView(); }, function(value){
                        if ( value == settings.value ){ toolbarCtrl.updatedSelected($element[0].id); }
                     });
                  }

               }else{ priv.setVisibility(false); }
            }break;
            default:{
               if ( angular.isObject(aux = uxfwkUiDataView.action(settings.view, settings.value)) ){
                  if ( angular.isString(aux.classes) ){ $element.addClass(aux.classes); }
                  if ( angular.isString(aux.text) ){ $element.prepend('&nbsp;<span data-translate="{0}">{0}</span>'.sprintf(aux.text)); }
                  if ( angular.isString(aux.icon) ){ $element.prepend('<i class="{0}"></i>'.sprintf(aux.icon)); }
               }else{ priv.setVisibility(false); }
            }break;
         }

         //[#4.0] Implements a custom ngIf
         dummy = angular.element('<!-- isVisible -->');
         $scope.$watch(priv.isVisible, function(value, oldvalue){
            if ( value && !oldvalue ){ dummy.replaceWith($element); }
            else if ( !value && oldvalue ){ $element.replaceWith(dummy); }
            else if ( !value ){ $element.replaceWith(dummy); }
            toolbarCtrl.notifyButtonVisibilityChange($element[0].id, value);
         });

         //[#END] Cleans auxiliar DOM elements on scope destruction
         $scope.$on('$destroy', function(){
            //myinfo('Destroy', $scope.$id, $element, settings, toolbarCtrl.operation(), $scope);
            if ( dummy ){ dummy.remove(); }
         });

      };// ::postLink
   };// ::compile

   return IUiDataViewToolbarButton;
}]);// endof uxfwkRmUiDataViewToolbarButton





angularAMD.directive('uxfwkUiDataViewTableRowToolbar', ['$document', '$compile',
/**
 * @description 
 * Angular directive that instantiates a table row toolbar. This directive may be inserted 
 * in any block element (but usually is placed on a table cell).
 * 
 * @param $document Angular service
 * @param $compile Angular service
 */
function uxfwkUiDataViewTableRowToolbar ($document, $compile){
   var NS = 'uxfwkUiDataViewTableRowToolbar';
   function TableRowToolbar(){}; var myClass = new TableRowToolbar();
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

TableRowToolbar.prototype.isVisible = function(){
   return (this.settings.view == this.toolbarCtrl.view());
};// ::isVisible

TableRowToolbar.prototype.compile = function ($element, $attrs){
   return myClass.postLink;
};// ::compile

TableRowToolbar.prototype.controller = ['$scope', '$element', '$attrs', function($scope, $element, $attrs){


}];// ::controller

TableRowToolbar.prototype.postLink = function ($scope, $element, $attrs, $controllers){
   var tbCtrl = $controllers[0];
   var aux = null;

   /*
   //[#1.0] Bypass any button that is not child of internal toolbar directive
   // Attribute 'uxfwkRmUiDataViewToolbarButtonCompiled' is only used once to block multiple compilations of this element
   if ( !angular.isObject(tbCtrl) ){ return; }
   if ( 'true' == $attrs.uxfwkRmUiDataViewToolbarButtonCompiled ){ return; }

   //[#2.0] Extends button with new attributes, styles and markup
   $element.attr('data-uxfwk-rm-ui-data-view-toolbar-button-compiled', 'true');
   //[#2.1] Add a visibility rule to only render this element when in the right view
   if ( angular.isString(aux = $element.attr('data-ng-if')) ){
      $element.attr('data-ng-if', '({0}.isVisible() && {1})'.sprintf(NS, aux));
   }else{ $element.attr('data-ng-if', '{0}.isVisible()'.sprintf(NS)); }
   //[#2.2] Add new icon and styles
   switch ( $attrs.operation ){
      case 'inline-creation':{
         $element.addClass('btn btn-primary btn-xs');
         $element.prepend('<i class="fuxicons fuxicons-add-in-table"></i> add new entry');
      }break;
   } 
   */ 
   $element.addClass('fx-table-actions');


   /*
   //[#3.0] Initializes new scope and compiles element again
   $document.injector().invoke(myClass.controller, null, { $scope:$scope, $element:$element, $attrs:$attrs, toolbarController:tbCtrl });
   $compile($element)($scope); 
   */ 

};// ::postLink


TableRowToolbar.prototype.template = function (){
   return ('<div class="uxfwk-content-wrapper">'+
    '<div class="uxfwk-content-wrapper" data-ng-transclude data-uxfwk-ui-data-view-table-row-toolbar-internal="{ view:\'plain\' }"></div>'+
    //'<div data-ng-transclude data-uxfwk-rm-ui-data-view-table-row-toolbar-internal="{ view:\'combo\' }"></div>'+
   '</div>');
};// ::template


/**
 * @description 
 * Uses internal class _return method as the one that will return the directive object.
 */
TableRowToolbar.prototype._return = function(){return{
   scope: true,
   restrict: 'A',
   transclude: true,
   template: myClass.template,
   //require: ['?^uxfwkRmUiDataViewToolbarInternal'],
   controller: myClass.controller,
   compile: myClass.compile
}};// ::directive
return myClass._return();
}]);// endof uxfwkRmUiDataViewTableRowToolbar



angularAMD.directive('uxfwkUiDataViewTableRowToolbarInternal', ['$document', '$compile',
/**
 * @description 
 * Angular directive that instantiates a table row toolbar. This directive may be inserted 
 * in any block element (but usually is placed on a table cell).
 * 
 * @param $document Angular service
 * @param $compile Angular service
 */
function uxfwkUiDataViewTableRowToolbarInternal ($document, $compile){
   var NS = 'uxfwkUiDataViewTableRowToolbarInternal';
   function TableRowToolbarInternal(){}; var myClass = new TableRowToolbarInternal();
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

TableRowToolbarInternal.prototype.isVisible = function(){
   return (this.settings.view == this.toolbarCtrl.view());
};// ::isVisible

TableRowToolbarInternal.prototype.compile = function ($element, $attrs){
   return myClass.postLink;
};// ::compile

TableRowToolbarInternal.prototype.controller = function($scope, $element, $attrs){


};// ::controller
TableRowToolbarInternal.prototype.controller.$inject = ['$scope', '$element', '$attrs'];

TableRowToolbarInternal.prototype.postLink = function ($scope, $element, $attrs, $controllers){
   var tbCtrl = $controllers[0];
   var aux = null;

   /*
   //[#1.0] Bypass any button that is not child of internal toolbar directive
   // Attribute 'uxfwkRmUiDataViewToolbarButtonCompiled' is only used once to block multiple compilations of this element
   if ( !angular.isObject(tbCtrl) ){ return; }
   if ( 'true' == $attrs.uxfwkRmUiDataViewToolbarButtonCompiled ){ return; }

   //[#2.0] Extends button with new attributes, styles and markup
   $element.attr('data-uxfwk-rm-ui-data-view-toolbar-button-compiled', 'true');
   //[#2.1] Add a visibility rule to only render this element when in the right view
   if ( angular.isString(aux = $element.attr('data-ng-if')) ){
      $element.attr('data-ng-if', '({0}.isVisible() && {1})'.sprintf(NS, aux));
   }else{ $element.attr('data-ng-if', '{0}.isVisible()'.sprintf(NS)); }
   //[#2.2] Add new icon and styles
   switch ( $attrs.operation ){
      case 'inline-creation':{
         $element.addClass('btn btn-primary btn-xs');
         $element.prepend('<i class="fuxicons fuxicons-add-in-table"></i> add new entry');
      }break;
   }

   //[#3.0] Initializes new scope and compiles element again
   $document.injector().invoke(myClass.controller, null, { $scope:$scope, $element:$element, $attrs:$attrs, toolbarController:tbCtrl });
   $compile($element)($scope); 
   */ 

};// ::postLink


/**
 * @description 
 * Uses internal class _return method as the one that will return the directive object.
 */
TableRowToolbarInternal.prototype._return = function(){return{
   scope: {},
   restrict: 'A',
   template: myClass.template,
   controller: myClass.controller,
   compile: myClass.compile
}};// ::directive
return myClass._return();
}]);// endof uxfwkUiDataViewTableRowToolbarInternal


angularAMD.directive('uxfwkUiDataViewTableRowButton', ['$document', '$compile', '$parse', 'uxfwk.ui.data.view',
/**
 * @description 
 * Angular directive that instantiates a table row action. This directive must be used with 
 * directive uxfwkRmUiDataViewTableRowActions which enables some additional control over 
 * buttons visibility.
 * 
 * @param $document Angular service
 * @param $compile Angular service
 */
function uxfwkUiDataViewTableRowButton ($document, $compile, $parse, uxfwkUiDataView){
   var NS = 'uxfwkUiDataViewTableRowButton';
   function TableRowButton(){}; var myClass = new TableRowButton();
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

TableRowButton.prototype.isVisible = function(){
   return true;
   return (this.settings.view == this.toolbarCtrl.view());
};// ::isVisible

TableRowButton.prototype.controller = ['$scope', '$element', '$attrs', function($scope, $element, $attrs){
   var ns = ($scope[NS] = {});
   var that = this;

   that.isVisible = uxfwk.$true;
   ns.settings  = {
      view: $attrs.view || 'table',
   p:null};

}];// ::controller

TableRowButton.prototype.compile = function ($element, $attrs){
   var fnSettings = $parse($attrs[NS]);

   return function postLink ($scope, $element, $attrs, $controllers){
      var settings = fnSettings($scope);
      var myCtrl = $controllers[0];
      var tbCtrl = $controllers[1];
      var dummy = null;
      var aux = null;

      //[#1.0] Bypass any button that is not child of internal toolbar directive
      // Attribute 'uxfwkRmUiDataViewToolbarButtonCompiled' is only used once to block multiple compilations of this element
      if ( !angular.isObject(tbCtrl) ){ return; }

      //[#2.0] Add new icon and styles
      if ( angular.isObject(aux = uxfwkUiDataView.action(settings.view, settings.value)) ){
         if ( angular.isString(aux.classes) ){ $element.addClass(aux.classes); }
         if ( angular.isString(aux.text) ){ $element.prepend('&nbsp;<span data-translate="{0}">{0}</span>'.sprintf(aux.text)); }
         if ( angular.isString(aux.icon) ){ $element.prepend('<i class="{0}"></i>'.sprintf(aux.icon)); }
      }

      //[#3.0]
      dummy = angular.element('<!-- isVisible -->');
      $scope.$watch(myCtrl.isVisible, function(value, oldvalue){
         if ( value && !oldvalue ){ dummy.replaceWith($element); }
         else if ( !value && oldvalue ){ $element.replaceWith(dummy); }
         else if ( !value ){ $element.replaceWith(dummy); }
      });

      //[#4.0] Initializes new scope and compiles element again
      //$document.injector().invoke(myClass.controller, null, { $scope:$scope, $element:$element, $attrs:$attrs });
   };// ::postLink
};// ::compile

/**
 * @description 
 * Uses internal class _return method as the one that will return the directive object.
 */
TableRowButton.prototype._return = function(){return{
   scope: true,
   restrict: 'A',
   controller: myClass.controller,
   require: ['uxfwkUiDataViewTableRowButton', '?^uxfwkUiDataViewTableRowToolbarInternal'],
   compile: myClass.compile
}};// ::directive
return myClass._return();
}]);// endof uxfwkRmUiDataViewTableRowButton




});// endof module



