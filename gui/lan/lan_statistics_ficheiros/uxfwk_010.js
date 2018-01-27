/**
 * 
 */
define('uxfwk.ui.button.refresh', ['uxfwk', 'angularAMD'], function (uxfwk, angularAMD){
angularAMD.directive('uxfwkUiButtonRefresh', ['$interpolate', '$parse', '$timeout', function directive ($interpolate, $parse, $timeout){
   var $console = uxfwk.$console, $U = uxfwk.$U, key = 'uxfwk.ui.button.refresh';
   function debug(){ var args = uxfwk.toArray(arguments); args.unshift(key); $console.debug.apply($console, args); }
   function error(){ var args = uxfwk.toArray(arguments); args.unshift(key); $console.error.apply($console, args); }
   function info(){ var args = uxfwk.toArray(arguments); args.unshift(key); $console.info.apply($console, args); }
   function warn(){ var args = uxfwk.toArray(arguments); args.unshift(key); $console.warn.apply($console, args); }
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

function _interpolate(exp){ return ('{0} {1} {2}').sprintf($interpolate.startSymbol(), exp, $interpolate.endSymbol()); }

var TIMEOUTVALUE = 10*1000;
var TEMPLATEHTML = (''+
'<div class="btn-group">'+
 '<div class="btn-group fx-icon-with-caption">'+
  '<div class="fx-icon-with-caption-inner">'+
   '<button title="refresh" class="btn btn-default btn-{0} uxfwk-ui-button-refresh-icon" type="button" data-ng-click="myController.doManual(myController)" data-ng-disabled="myController.isDisabled">'+
    '<i class="glyphicon glyphicon-refresh"></i>'+
    '<span class="sr-only">atualizar</span>'+
    '<div class="fx-icon-caption-container" data-ng-if="(\'automatic\' == myController.mode)">'+
     '<span class="fx-icon-caption-bottom-layer"></span>'+
     '<span class="fx-icon-caption-top-layer" data-translate="TEXT.COMMON.AUTOREFRESH.ICONLETTER"></span>'+
    '</div>'+
   '</button>'+
  '</div>'+
 '</div>'+
 '<div class="btn-group uxfwk-ui-button-refresh-caret" data-uib-dropdown dropdown-append-to-body auto-close="outsideClick">'+
  '<button class="btn btn-default dropdown-toggle fx-dropdown-toggle btn-{0}" aria-expanded="false" type="button" data-uib-dropdown-toggle data-ng-disabled="myController.isDisabled">'+
   '<span class="caret"></span>'+
   '<span class="sr-only">toggle menu (esta mensagem é apenas interpretada por screen readers)</span>'+
  '</button>'+
  '<div class="dropdown-menu fx-dropdown fx-dropdown-open-to-left uxfwk-ui-button-refresh-menu {1}-menu" data-uib-dropdown-menu>'+
   '<div class="fx-dropdown-body">'+
    '<ul class="list-unstyled">'+
     '<li class="checkbox">'+
      '<label>'+
       '<input type="radio" data-ng-model="myController.mode" value="manual"/>'+
       '(<i class="glyphicon glyphicon-refresh uxfwk-ui-button-refresh-menu-entry-icon"></i>)'+
       '<span class="uxfwk-ui-button-refresh-menu-entry-text" data-translate="TEXT.COMMON.AUTOREFRESH.MANUALTEXT"></span>'+
      '</label>'+
     '</li>'+
     '<li class="checkbox">'+
      '<label>'+
       '<input type="radio" data-ng-model="myController.mode" value="automatic">'+
       '(<span class="btn btn-xs uxfwk-ui-button-refresh-menu-entry-icon">'+
        '<i class="glyphicon glyphicon-refresh"></i>'+
         '<span class="sr-only">atualizar</span>'+
         '<div class="fx-icon-caption-container">'+
          '<span class="fx-icon-caption-bottom-layer"></span>'+
          '<span class="fx-icon-caption-top-layer" data-translate="TEXT.COMMON.AUTOREFRESH.ICONLETTER"></span>'+
         '</div>'+
       '</span>)'+
       '<span class="uxfwk-ui-button-refresh-menu-entry-text" data-translate="TEXT.COMMON.AUTOREFRESH.AUTOMATICTEXT"></span>'+
      '</label>'+
     '</li>'+
     '<ul >'+
        '<li class="checkbox">'+
         '<label>'+
          '<input type="radio" data-ng-model="myController.timeout" value="2">'+
          '<span class="uxfwk-ui-button-refresh-menu-entry-text" data-translate="TEXT.COMMON.AUTOREFRESH.SECONDS2"></span>'+
         '</label>'+
        '</li>'+
        '<li class="checkbox">'+
         '<label>'+
          '<input type="radio" data-ng-model="myController.timeout" value="5">'+
          '<span class="uxfwk-ui-button-refresh-menu-entry-text" data-translate="TEXT.COMMON.AUTOREFRESH.SECONDS5"></span>'+
         '</label>'+
        '</li>'+
        '<li class="checkbox">'+
         '<label>'+
          '<input type="radio" data-ng-model="myController.timeout" value="10">'+
          '<span class="uxfwk-ui-button-refresh-menu-entry-text" data-translate="TEXT.COMMON.AUTOREFRESH.SECONDS10"></span>'+
         '</label>'+
        '</li>'+
     '</ul>'+
    '</ul>'+
   '</div>'+
  '</div>'+
 '</div>'+
'</div>'+
'').sprintf(
   _interpolate('myController.size'),
   _interpolate('myController.prefix'),
null);

function refreshManual (ctrl){
   if ( angular.isFunction(ctrl.callback.manual) ){
      var promise = null;

      //[#1.0] If, automatic counter is already counting, cancel it before starting the new manual refresh
      if ( uxfwk.isPromise(ctrl.timer) ){ $timeout.cancel(ctrl.timer); }

      //[#2.0] Begins new manual refresh
      promise = ctrl.callback.manual();

      //[#3.0] If manual refresh returns a promise, schedules automatic refresh (only if mode is automatic)
      if ( uxfwk.isPromise(promise) ){
         if ( 'automatic' === ctrl.mode ){
            promise.then(function(response){
               ctrl.timer = $timeout(function(){ refreshAutomatic(ctrl); }, (ctrl.timeout*1000) );
               return response;
            });
         }
      }else{ warn('Manual refresh did not return a valid promise!!!', ctrl); }
   }else{ warn('Manual refresh did not have a valid callback!!!', ctrl); }
};// @refreshManual

function refreshAutomatic (ctrl){
   if ( angular.isFunction(ctrl.callback.automatic) ){
      var promise = null;

      //[#1.0] Calls for automatic refresh
      promise = ctrl.callback.automatic();

      //[#2.0] If automatic refresh returns a promise, schedules another refresh after current one is done
      if ( uxfwk.isPromise(promise) ){
         if ( 'automatic' === ctrl.mode ){
            promise.then(function(response){
               ctrl.timer = $timeout(function(){ refreshAutomatic(ctrl); }, (ctrl.timeout*1000) );
               return response;
            });
         }
      }else{ warn('Automatic refresh did not return a valid promise!!!', ctrl); }
   }else{ warn('Automatic refresh did not have valid callback!!!', ctrl); }
};// @refreshAutomatic

var controller = [function(){
   var that = this;

   that.size       = null;
   that.prefix     = null;
   that.mode       = 'manual';
   that.callback   = { manual:null, automatic:null };
   that.isDisabled = false;
   that.timer      = null;
   that.doManual   = refreshManual;
   that.timeout    = null;
}];// controller

return{
   scope: true,
   restrict: 'A',
   template: TEMPLATEHTML,
   controller: controller,
   controllerAs: 'myController',
   require: ['uxfwkUiButtonRefresh'],
   compile: function (tElement, tAttrs){
      var fnSettings = $parse(tAttrs.uxfwkUiButtonRefresh);
      var fnPrefix = function(){ return 'prefix'; };
      var fnIsDisabled = $parse(tAttrs.ngDisabled);
      var fnSize = function(){ return 'sm'; };

      return function link (tScope, tElement, tAttrs, tControllers){
         var settings = fnSettings(tScope);
         var myCtrl = tControllers[0];

         tElement.addClass('uxfwk-ui-button-refresh');

         if ( !$U(tAttrs.prefix) ){ fnPrefix = $parse(tAttrs.prefix); }
         if ( !$U(tAttrs.size) ){ fnSize = $parse(tAttrs.size); }
         myCtrl.prefix = fnPrefix(tScope);
         myCtrl.size = fnSize(tScope);
         myCtrl.callback.automatic = settings.automatic;
         myCtrl.callback.manual    = settings.manual;

         tScope.$watch(function(){
            return myCtrl.mode;
         }, function(value){
            if ( 'manual' === value ){
               info('Changed to manual refresh, destroy any counter in progress', myCtrl);
               if ( uxfwk.isPromise(myCtrl.timer) ){ $timeout.cancel(myCtrl.timer); }
            }else if ( 'automatic' === value ){
               info('Changed to automatic refresh, begins a new automatic refresh', myCtrl);
               myCtrl.timeout = myCtrl.timeout || 10;
               refreshAutomatic(myCtrl);
            }
         });
         tScope.$watch(function(){
            return myCtrl.timeout;
         }, function(value){
            if ( 2 == value || 5 == value || 10 == value ){
               myCtrl.mode = 'automatic';
            }
         });
         if ( !$U(tAttrs.ngDisabled) ){ tScope.$watch(function(){
            warn('isDisabled', fnIsDisabled(tScope), tAttrs.ngDisabled, tScope);
            return fnIsDisabled(tScope);
         }, function(value){
            if ( true === !!value ){
               info('Changed to disabled state, destroy any counter in progress', myCtrl);
               if ( uxfwk.isPromise(myCtrl.timer) ){ $timeout.cancel(myCtrl.timer); }
            }
            myCtrl.isDisabled = !!value;
         })};
         tScope.$on('$destroy', function(){ if ( uxfwk.isPromise(myCtrl.timer) ){ $timeout.cancel(myCtrl.timer); } });

         info(myCtrl);
      };//endof link
   }//endof compile
};//endof object
}]);//endof directive
});//endof module
