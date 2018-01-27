'use strict';
/**
 * 
 */
var SESSIONINFO = {};
define(['angularAMD', 'uxfwk', 'packages', 'app-states', 'uxfwk.session.loader', 'ngAnimate', 'ngCookies', 'ngSanitize', 'ui.utils', 'ui.router', 'pascalprecht.translate', 'ui.bootstrap', 'ui.select2', 'uxfwk.require.html', 'uxfwk.require.lang', 'header', 'uxfwk.fgw.summary'
], function launcher (angularAMD, uxfwk, packages, statesLauncher, sessionLoader){
   var session = {'session.username': 'developper'};
   var app = angular.module('mainModule', ['ngCookies', 'ngSanitize', 'ui.utils', 'ui.router', 'ui.router.state', 'pascalprecht.translate', 'ui.bootstrap', 'ui.select2', 'uxfwk.require.html', 'uxfwk.require.lang']);
   var moduleLanguages = [], moduleInits = [], stateTree = [];
   var $console = uxfwk.$console, $U = uxfwk.$U;
   var authHash = null;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!
var notifications = {}, notificationText = '';

function _loadStates (){
   var modules = [], tree = [];

   $console.warn(packages);
   for ( var i = 0, leni = packages.length; i < leni; ++i ){
      if ( packages[i].name ){
         modules.push(packages[i].name);
         if ( packages[i].bootstrap && packages[i].bootstrap.stateTree ){ tree.push(packages[i].bootstrap.stateTree); }
         if ( packages[i].bootstrap && packages[i].bootstrap.language ){ moduleLanguages.push.apply(moduleLanguages, packages[i].bootstrap.language); }
         if ( packages[i].bootstrap && packages[i].bootstrap.initialize ){ moduleInits.push(packages[i].bootstrap.initialize); }
      }
   }
   $console.warn("tree", tree);
   $console.warn("modules", modules);
   $console.warn("moduleInits", moduleInits);
   $console.debug('The following modules were detected', modules);
   stateTree = statesLauncher(tree);
   _bootstrap();

};// _loadStates

 
/**
 * @name launcher_config 
 * @description 
 * Configures application before bootstrap 
 */
function _bootstrap(){
app.config(['$urlRouterProvider', '$stateProvider', '$translateProvider', '$translatePartialLoaderProvider', '$uibTooltipProvider', '$httpProvider', '$provide', '$sceProvider', '$compileProvider', 'uxfwkSessionProvider',
function launcher_config ($urlRouterProvider, $stateProvider, $translateProvider, $translatePartialLoaderProvider, $tooltipProvider, $httpProvider, $provide, $sceProvider, $compileProvider, uxfwkProvider){
   var languageKey = 'en';

   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|data|blob):/)

   sessionLoader(function(session){
      languageKey = session.language;
   })

   $httpProvider.interceptors.push(['$q', function($q){
      return {
         request: function(config){
            var url = null;
            if ( angular.isArray(config.url) ){
               config.url = config.url.join('/');
            }else{
               //config.url = encodeURI(config.url).replace(/\+/g, '%2B');
               config.url = encodeURI(config.url);
            }
            url = config.url;
            
            if ( authHash ){
               config.headers['Authorization'] = 'Basic '+authHash;
            }
            if ( languageKey ){
               config.headers['Accept-Language'] = languageKey;
            }
            return config; 
         },
         response: function(response){
            console.warn('RESPONSE', response);
            return response;
            //return $q.resolve(response);
         },
         responseError: function (response){
            console.warn('RESPONSE_ERROR', response);
            if ( 401 === response.status ){
               window.location = 'login.html';
            }
            return $q.reject(response);
            //return response;
         }
      }
   }]);

   //$tooltipProvider.options({ popoverMode: 'single'});
   //[#1.0] - Breadcrumb configurations
   if ( 1 ){
      //[#1.1] - Add application states
      $console.warn("stateTree", stateTree);
      for ( var i = 0, leni = stateTree.length; i < leni; i++ ){
         var state = {}, name = stateTree[i].name;

         $stateProvider.state(name, stateTree[i]);
      }
      //[#1.3] - Sets default state
      $urlRouterProvider.otherwise(function($injector, $location){
         /*
         var fallbackRootUrl = null;
         var foundGoodUrl = false;

         console.info('Location not good', $location.path());
         for ( var i = (appStates.length - 1); i >= 0; i-- ){
            if ( true === appStates[i].uxRootDefault ){ fallbackRootUrl = appStates[i].url; }
            //if ( true === appStates[i].uxRootDefault ){ fallbackRootUrl = appStates[i].name; }
            if ( angular.isDefined(appStates[i].uxFallback) && $location.path().match(new RegExp(appStates[i].uxFallback.regexp)) ){
               console.info('redirect 1');
               //$location.replace().path('/rm');
               //$location.replace().path(appStates[i].uxFallback.url);
               foundGoodUrl = true;
               break;
            }
         }
         if ( (null != fallbackRootUrl) && (false === foundGoodUrl) ){
            console.info('redirect 2');
            //console.info($stateProvider.state());
            //$stateProvider.go(fallbackRootUrl);
            //$location.replace().path(fallbackRootUrl);
            //$location.replace().path('/rm');
         } 
         */ 
         $location.replace().path('/gui/home');
      });
   }

   $translateProvider.useLoader('$translatePartialLoader', {
      //urlTemplate: 'widgets/{part}/lang/{lang}/{part}.json'
      urlTemplate: 'lang/{lang}/{part}.json'
   });
   // load 'pt-PT' table on startup

   //[#2.0] - Checks for supported languages and applies a rule of fallbacks for unknown language keys
   if ( 0 ){
      var myLocale = (uxfwkProvider.locale() || 'pt_PT');
      switch ( myLocale.replace(/_/, '-') ){
         case 'en': case 'en-UK': case 'en-US': languageKey = 'en'; break;
         case 'pt':    languageKey = 'pt';    break;
         case 'pt-PT': languageKey = 'pt-PT'; break;
         case 'pt-BR': languageKey = 'pt-BR'; break;
         default: break;
      }
   }
   $translateProvider.preferredLanguage(languageKey);

   //[#3.0] - Loads base language text files
   if ( 1 ){
      //$translatePartialLoaderProvider.addPart('core.equipment.names');
      //$translatePartialLoaderProvider.addPart('common');
      //$translatePartialLoaderProvider.addPart('core.card.names');
      //$translatePartialLoaderProvider.addPart('pack-rm/core.interface.common');
      for ( var i = 0, leni = moduleLanguages.length; i < leni; i++ ){
         $translatePartialLoaderProvider.addPart(moduleLanguages[i]);
      }
      angularAMD.$translatePartialLoaderProvider = function (){ return $translatePartialLoaderProvider; };
   }

   $provide.decorator('$uibModal', ['$rootScope', '$delegate', function ($rootScope, $delegate){
      var internalData = { oldFnOpen:$delegate.open, currentModal:null };

      $rootScope.$on('$stateChangeStart', function(){
         if ( !$U(internalData.currentModal) ){ internalData.currentModal.dismiss('State changed, modal MUST be closed since context is no longer valid!'); internalData.currentModal = null; }
      })
      $delegate.open = function (settings){
         internalData.currentModal = internalData.oldFnOpen(settings);
         return internalData.currentModal;
      };// ::open

      return $delegate;
   }]);// ::$modal

}]);// app.config

app.controller('mainCtrl', ['$scope', '$rootScope', '$cookies', '$http', '$translate', '$stateParams', '$compile', '$timeout', '$window', '$parse', '$filter', '$document', '$uibModal', 'appUtilities', function launcher_controller ($scope, $rootScope, $cookies, $http, $translate, $stateParams, $compile, $timeout, $window, $parse, $filter, $document, $uibModal, appUtilities){

   angular.element($document[0].body).css('display', 'block');
   
   sessionLoader(function(session){
      $rootScope.session2 = session;
   });
   
   authHash = $cookies.get('HASH');

   (function(){
      var http_get = $http.get;
      var http_delete = $http.delete;
      var http_post = $http.post;
      var http_put = $http.put;

      $http.get = function (url, config){
         if ( angular.isArray(url) ){ url = url.join('/'); }
         return http_get(url, config);
      }
      $http.delete = function (url, config){
         if ( angular.isArray(url) ){ url = url.join('/'); }
         return http_delete(url, config);
      }
      $http.post = function (url, data, config){
         if ( angular.isArray(url) ){ url = url.join('/'); }
         return http_post(url, data, config);
      }
      $http.put = function (url, data, config){
         if ( angular.isArray(url) ){ url = url.join('/'); }
         return http_put(url, data, config);
      }

   })();

   $rootScope.notifications = notifications;
   //$scope.notificationAlerts = [{ message: "hello world" }];
   //$scope.notificationClose = function (notification){
   //};// notificationClose

   for ( var i = 0, leni = moduleInits.length; i < leni; ++i ){
      appUtilities.$injector.invoke(moduleInits[i]);
   }

   //[#] - The following two variables are needed to populate data in breadcrumb
   //      'stateParams' is the variable used by ui.router to store the state parameters
   //      'uxStateExtendedParams' is our application state data (additional data obtained based on 'stateParams')
   $scope.stateParams = $stateParams;
   $rootScope.stateParams = $stateParams;
   $rootScope.uxExtendedStateParams = {}; // not the best solution, but it works
   $rootScope.session = session;

   $scope.$on("$routeChangeSuccess", function () {
      $scope.current = $location.path().split('/')[1];
   });
   angularAMD.$translate = function (){ return $translate; };
   appUtilities.$translate.refresh();

   $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      $console.warn('$stateChangeStart', arguments);
      $rootScope.$broadcast('uxfwk.state.view.body.abort');
      if ( !$U(toState.gateway) ){
         var promise = null;

         if ( uxfwk.isAnnotation(toState.gateway) ){
            promise = appUtilities.$injector.invoke(toState.gateway, null, { $stateParams: toParams });
         }
         if ( uxfwk.isPromise(promise) ){
            event.preventDefault();
            promise.then(function(newstate){
               $console.warn('Trigered gateway state: redirect to "{0}"'.sprintf(newstate));
               appUtilities.$state.go(newstate, toParams);
            })
         }else{}
      }else if ( angular.isDefined(toState.redirectTo) ){
         event.preventDefault();
         $console.warn(toState.redirectTo, $parse(toState.redirectTo)($scope));
         appUtilities.$state.go(toState.redirectTo, toParams);
      }else{}
      $rootScope.notifications.alerts.list = [];
   });
   $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
      $console.warn('$stateChangeError', arguments);
   });
   $rootScope.$on('$stateNotFound', function(event, toState, toParams, fromState, fromParams, error){
      //$console.warn('$stateNotFound', arguments);
   });
   $scope.$root.uxfwk = uxfwk;
   notificationText = $filter('translate')('TEXT.COMMON.POPUP.HASERRORS');
   
   $scope.openModal = function (){
      return $uibModal.open({
         templateUrl: "FooterModal.html",
         size: 'md',
         controller: function(){}
      }).result;
      
   }
}]);


angularAMD.factory('uxfwkTranslate', ['$rootScope', '$translate', '$translatePartialLoader', '$q', function uxfwkTranslate ($rootScope, $translate, $translatePartialLoader, $q){
   var internalData = { jobs:[], currentJob: null, currentRefresh: null };
   var uxfwkTranslate = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

function dispatchJob (){
   if ( (!internalData.currentRefresh) && (internalData.jobs.length > 0) ){
      var job = internalData.jobs.shift();

      for ( var i = 0, leni = job.parts.length; i < leni; ++i ){
         //console.debug('Translate add part ', job.parts[i]);
         $translatePartialLoader.addPart(job.parts[i]);
      }
      //console.debug('Translate request refresh');
      (internalData.currentRefresh = $translate.refresh()).then(function(){
         job.defer.resolve();
         internalData.currentRefresh = null;
         dispatchJob();
      });
   }else{}
};// dispatchRefresh

uxfwkTranslate.refresh = function (key){
   var defer = $q.defer();

   if ( internalData.currentJob ){
      //console.debug('Translate append refresh ', key);
      internalData.currentJob.defer = defer;
      internalData.jobs.push(internalData.currentJob);
      internalData.currentJob = null;
      dispatchJob();
   }else{
      defer.resolve(null);
   }
   return defer.promise;
};// uxfwkTranslate::refresh

uxfwkTranslate.addPart = function (partName){
   //console.debug('Translate append part ', partName);
   if ( !internalData.currentJob ){
      internalData.currentJob = { promise: null, parts: [] };
      internalData.currentJob.parts.push(partName);
   }else{ internalData.currentJob.parts.push(partName); }
};// uxfwkTranslate::addPart

return uxfwkTranslate;
}]);// uxfwkTranslate

angularAMD.factory('uxfwkPromiseManager', [function uxfwkPromiseManager (){
   var uxfwkPromiseManager = { s:{}, i:{} };
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

return function (){
   var promises = [];

   return {
      push: function (promise){ promises.push(promise); return promise; },
      cancel: function (){
         for( var i = 0, leni = promises.length; i < leni; ++i ){
            if ( !uxfwk.$U(promises[i].cancel) ){ promises[i].cancel('abort'); }
         }
         promises = [];
      }
   }
};
}]);// uxfwkPromiseManager

angularAMD.factory('uxfwkPromiseWrapper', ['$q', function uxfwkPromiseWrapper ($q){
return function (promise){
   var canceller = $q.defer();
};
}]);// uxfwkPromiseWrapper

angularAMD.factory('uxfwkHttp', ['$http', '$q', function uxfwkHttp ($http, $q){
   var uxfwkHttp = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

function wrap (promise, fnCancel){
   return {
      promise: promise,
      then:    function(fn){ return wrap(promise.then(fn), fnCancel); },
      catch:   function(fn){ return wrap(promise.catch(fn), fnCancel); },
      finally: function(fn){ return wrap(promise.finally(fn), fnCancel); },
      success: function(fn){ return wrap(promise.success(fn), fnCancel); },
      error:   function(fn){ return wrap(promise.error(fn), fnCancel); },
   cancel: fnCancel};
};// wrap

uxfwkHttp.get = function (url, config){
   var firstWrapper = $q.defer();
   var canceller = $q.defer();
   var aborted = null;
   //var promise = null;

   config = config || {}; config.timeout = canceller.promise;
   $http.get(url, config)
   .then(function(response){
      firstWrapper.resolve(response);
   })
   .catch(function(response){
      if ( !uxfwk.$U(aborted) ){ firstWrapper.reject(aborted); }
      firstWrapper.reject(response);
   });
   return wrap(firstWrapper.promise, function(reason){
      aborted = (new AbortHttpRequestError(reason));
      canceller.resolve(aborted);
   });
};// ::get

//uxfwkHttp.get    = $http.get;
uxfwkHttp.put    = $http.put;
uxfwkHttp.post   = $http.post;
uxfwkHttp.delete = $http.delete;
uxfwkHttp.head   = $http.head;
uxfwkHttp.patch  = $http.patch;
uxfwkHttp.jsonp  = $http.jsonp;

return uxfwkHttp;
}]);// uxfwkHttp

/**
 * 
 */
angularAMD.factory('appUtilities', ['$document', '$rootScope', '$state', '$q', '$translatePartialLoader', '$translate', '$filter', 'uxfwk', 'uxfwk.dom.wrapper', 'uxfwk.utils', 'uxfwkTranslate', 'uxfwkHttp', 'uxfwkPromiseManager',
function appUtilities ($document, $rootScope, $state, $q, $translatePartialLoader, $translate, $filter, uxfwk, $w, $u, uxfwkTranslate, uxfwkHttp, uxfwkPromiseManager){
var appctrlpoints = null;

var css = (function fncss (){
   var inliners = {};

return{
   include: function (key, cssText){

      if ( $U(inliners[key]) ){
         var head = $w($document[0].getElementsByTagName('head'));
         var style = angular.element('<style>');

         if ( (head.length > 0) && !$U(style) ){
            style.attr('id', key.camelcase());
            style.attr('type', 'text/css');
            style.text(cssText);
            head.eq(0).append(style);
         }
      }

   },// ::include
p:null};
})();// ::@css

var processRestFgwException = function (response, userdata, options){
   var bTreatRemovalErrorAsOk = $U(options)?(false):(options.bTreatRemovalErrorAsOk || false);
   var bSuccess = false;
   var errors = [];

   $console.warn("processRestFgwException::response", response, typeof(response), response.data);
   if ( $U(response) ){ errors = [(new InvalidJsonDocumentError('Unknown exception: response is NULL'))]; }
   else if ( response instanceof AbortHttpRequestError ){ errors = [response]; userdata = response; }
   else if ( $U(response.data) || (response instanceof Error) ){ }//errors = [(new InvalidJsonDocumentError(response.toString()))]; }
//   else if ( !$U(response.data) && !$U(response.data.message) ) {
//      response.data.toString = function(){
//         var message = this.message;
//         if ( !$U(this.stacktrace) ){
//            var more = this.stacktrace.match(/message=(.*)\./);
//            if ( angular.isArray(more) && (more.length > 1) ){
//               message = message + ' ' + more[1];
//            }
//         }
//         return message;
//      };
//      errors = [response.data];
//   }
   else{ 
      var msg = '';
//      if ( !$U(response.data.Code) ){ msg += response.data.Code; msg += ' - '; }
      //if ( !$U(response.data.Description) ){ msg += response.data.Description;  }
      if ( !$U(response.data) && !$U(response.data.CustomMessage) ){ msg += response.data.CustomMessage; }
      //else{ msg += response.data; }
      
      if ( "" === msg ){ bSuccess = true; errors = []; }
      else { errors = msg; }
      
      //errors = { code: 1111, message: 'Erro FATAL!!! Auto destruição em 5 segundos.' }
      //errors = [(new Error('HTTP ERROR{0} - {1}'.sprintf(response.status, response.message || response.cause || response.data.message || response.data.cause)))];
   }
   if ( (true == bTreatRemovalErrorAsOk) && !$U(response) && (404 == response.status) ){ bSuccess = true; }
   return { success: bSuccess, data: userdata, errors: errors };
};// ::utils::processRestFgwException

var appUtilities = {
   $translatePartialLoader: uxfwkTranslate,
   $translate:              uxfwkTranslate,
   $rootScope:              $rootScope,
   $injector:               $document.injector(),
   $session:                session,
   $filter:                 $filter,
   $state:                  $state,
   $http:                   uxfwkHttp,//$http,
   $promiseManager:         uxfwkPromiseManager,
   $q:                      $q,
   $u:                      $u,
   $w:                      $w,
   $console:                { log: angular.noop, info: angular.noop, debug: angular.noop, warn: angular.noop },
   $css:                    css,
   $processRestException:   processRestFgwException,
uxfwk:uxfwk};

if ( 'developper' == session['session.username'] ){ appUtilities.$console = console; }

(function (ctrlpoints){
   /*
   var i = 0, leni = 0;
   for ( i = 0, leni = ctrlpoints.length; (i < leni) && ('Application14.Module1.ControlPoints' != ctrlpoints[i].key); ++i );
   if ( i < leni ){
      var jsonText = ctrlpoints[i].value.replace(/{key:/g, '{"key":').replace(/value:/g, '"value":').replace(/\\n/g,'');
      appctrlpoints = uxfwk.array2map(angular.fromJson(jsonText), 'key');
      appUtilities.$console.debug('CTRL POINTS: ', appctrlpoints);
   } 
   */ 
})(session['session.ctrlpoints']);
appUtilities.$session.authorize = function (token){
   var tokens = token.split('::');
   if ( '' == tokens[0] ){
      return !uxfwk.$U(appctrlpoints[tokens[1]]);
   }else{
      return false;
   }
};// ::session::authorize

(function (ctrlpoints){
   var appkey = 'Application14', modkey = 'Module1';
   var myctrlpoints = null;
   var map = null;

   if ( !$U(ctrlpoints) && !$U(ctrlpoints.applicationList) ){
      map = uxfwk.array2map(ctrlpoints.applicationList, 'key');
      if ( !$U(map) && !$U(map[appkey]) && !$U(map[appkey].moduleList) ){
         map = uxfwk.array2map(map[appkey].moduleList, 'key');
         if ( !$U(map) && !$U(map[modkey]) && !$U(map[modkey].controlPoints) ){
            map = uxfwk.array2map(map[modkey].controlPoints, 'key');
            myctrlpoints = map;
         }
      }
   }

   appUtilities.$session.checkpoint = function (key){
      if ( !$U(myctrlpoints) && !$U(myctrlpoints[key]) ){
         return myctrlpoints[key].value;
      }else{ return false; }
   };// ::session::checkpoint

})(session['session.ctrlpoints2']);




if ( typeof(WindowManagerHotline) != 'undefined' ){
   appUtilities.WindowManagerHotline = WindowManagerHotline;
}
return appUtilities;
}]);

angularAMD.filter('uxfwkUnitLabelNullHider', ['$filter', 'appUtilities', function uxfwkUnitLabelNullHider ($filter, appUtilities){
   var fnTranslate = $filter('translate');
   
function myFilter (value, unit){
   var $U = appUtilities.$u.$U;
   function vshack (){ vshack.catch(); };// SlickEdit hack to make IDE see usefull functions, after this line all members are visible do IDE
   if ( $U(value) || (value === "") || (unit === fnTranslate(unit)) ) { return null; }
   else { return value + ' ' + fnTranslate(unit); }
}
myFilter.$stateful = true;
return myFilter;
}]);// end of filter



angularAMD.bootstrap(app);
};// _bootstrap

/**
 * 
 */


/**
 * 
 */
notifications.alerts = {};
notifications.alerts.list = [];
notifications.alerts.open = function (type, title, error){
   var message = [];
   if ( angular.isArray(error) ){
      for ( var i = 0, leni = error.length; i < leni; ++i ){
         message.push(error[i].message || error[i].status || error[i][0].message || error[i][0].status);
      }
      message = message.join("\n");
   }else if ( angular.isString(error) ){
      message = error;
   }else{
      console.warn("error", error);
      message = error.message || error.status;
   }
   if ( 'error' === type ){ title = notificationText; }
   
   if ( !$U(error) ){
      this.list.push({ type: type, title: title, message: message });
   }
};// notifications:alerts::open
notifications.alerts.close = function (index){
   this.list.splice(index, 1);
};// notifications:alerts::close
notifications.alerts.closeAll = function (){
   this.list = [];
};// notifications:alerts::closeAll


app.directive('fgwResize', ['$window', '$timeout',  function ($window, $timeout){
   var resizeContent = function (element, w) {
      $timeout(function () {                
          var h = angular.element(document.querySelector('.fgw-header')).outerHeight(true),
              f = angular.element(document.querySelector('.fgw-footer')).outerHeight(true),
              t = angular.element(document.querySelector('.fgw-page-title')).outerHeight(true);
          //console.log("w, h, t, f: ",w.height(), h, t, f);
          element.css('min-height', (w.height() - h - t - f) + 'px');
      }, 100);
  };
  var resizeSummary = function (element, w) {
      $timeout(function () {
          var h = angular.element(document.querySelector('.fgw-header')).outerHeight(true),
              f = angular.element(document.querySelector('.fgw-footer')).outerHeight(true);
          //console.log("w, h, f: ", w.height(), h, f);
          angular.element(document.querySelector('body')).css({ 'margin-bottom': f, 'padding-top': h });
          element.css('height', (w.height() - h - f) + 'px');
      }, 110);
  };
  return function (scope, element, attrs) {
     var block = attrs.fgwResize;

     var w = angular.element($window);
     var changeHeight = function () {                
         switch (block) {
             case 'content':
                 resizeContent(element, w);
                 break;
             case 'summary':
                 resizeSummary(element, w);
                 break;
         }
     };
     var timer = null;
     w.on('resize', function () {
         if (timer !== null) {
             clearTimeout(timer);
         }
         timer = setTimeout(function () {
             changeHeight();   // when window size gets changed 
         }, 250);

     });
     changeHeight(); // when page loads  

     //** Destroy
     scope.$on('$destory', function () {
         w.off('resize');
     });
 }
}]);

app.directive('fgwExpandableGroup', ['$translate', function ($translate){
    return {
        restrict: 'A',
        transclude: true,
        controller: ['$scope', function ($scope){
           $scope.title = '';
           $scope.url = '';

           $scope.isCollapsed = false;
           

           $scope.save = function () {
              if ( angular.isFunction($scope.cbCommit) ){
                 $scope.cbCommit()
                 .then(function(response){
                    $console.warn("response", response);
                    if ( true === response ){
                       $scope.toggleEditMode();
                    } else {
                       $console.warn("error", response);
                    }
                 })
              }else{
                 $scope.toggleEditMode();
              }
           }
           $scope.cancel = function () {
              if ( angular.isFunction($scope.cbCancel) ){
                 $scope.cbCancel()
                 .finally(function(){
                    $scope.toggleEditMode();
                 })
              }else{
                 $scope.toggleEditMode();
              }
           }
           $scope.toggleEditMode = function () {
              if ( !$scope.editMode ){ $scope.isCollapsed = false; }
              $scope.editMode = !$scope.editMode;
              $scope.$applyAsync();
           }
        }],
        scope: { editMode: '=?fgwEditMode', hasActions: '=?fgwAsActions', isValid:'=?fgwIsValid' , cbCommit:'=?fgwCbCommit', cbCancel:'=?fgwCbCancel' },
        template: '<div class="fgw-expandable-group">'+
    '<div class="fgw-expandable-group-header clearfix">'+
        '<a href="" ng-click="isCollapsed = !isCollapsed">'+
            '<i class="icon" ng-class="isCollapsed?\'fgw-angle-down\':\'fgw-angle-up\'"></i>{{ title }}'+
        '</a>'+
        '<div class="fgw-expandable-group-header-actions" ng-if="hasActions">'+
            '<div ng-if="!editMode">'+
                '<span fgw-action-button="TEXT.UXFWK.HEADER.EDIT" fgw-icon="icon fgw-pencil" fgw-css="btn btn-xs btn-default" fgw-action="toggleEditMode()"></span>'+
            '</div>'+
            '<div ng-if="editMode">'+
                '<span fgw-action-button="TEXT.UXFWK.HEADER.SAVE" fgw-icon="icon fgw-floppy-disk" fgw-css="btn btn-xs btn-primary" fgw-valid="isValid()" fgw-action="save()"></span> '+
                '<span fgw-action-button="TEXT.UXFWK.HEADER.CANCEL" fgw-icon="" fgw-css="btn btn-xs btn-default" fgw-action="cancel()"></span>'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<div class="fgw-expandable-group-content" uib-collapse="isCollapsed">'+
        '<div data-ng-transclude></div>'+
    '</div>'+
'</div>',
        link: function (scope, element, attrs, ctrl) {
           $translate(attrs.fgwExpandableGroup)
           .then(function(response){
              scope.title = response;
           })
           scope.url = attrs.fgwUrl;
           scope.editMode = scope.editMode || false;
           scope.hasActions = scope.hasActions || false;
        }
    };
}]);

app.directive('fgwToggle', ['$timeout', function ($timeout){
   return {
      restrict: 'AE',
      priority: 2,
      transclude: true,
      template: function (element, attrs) {
         //console.log(attrs);
         var html = '<div class="toggle btn">';
         html += '<input id="fgw-toggle-chk-' + attrs.id + '" type="checkbox" />';
         html += '<div class="toggle-group">';
         html += '<label class="don btn">On</label>'
         html += '<label class="doff active btn">Off</label>'
         html += '<span class="toggle-handle btn btn-default"></span>'
         html += '</div>';
         html += '</div>';
         return html;
      },
      require: 'ngModel',
      compile: fgwToggleCompile
   };

   function fgwToggleCompile(element, attr) {

      var DEFAULTS = {
         on: 'on',
         off: 'off',
         onstyle: 'success',
         offstyle: 'default',
         size: 'normal', //'large', 'normal', 'small', 'mini';
         style: '',
         width: null,
         height: null,
         readonly: false,
         disable: false
      }

      return function (scope, element, attrs, ngModel) {
         // defaults
         var options = getOptions();

         var toggleContainer = angular.element(element[0].querySelector('.toggle'));
         var elemCheckbox = angular.element(element[0].querySelector('input[type=checkbox]'));
         var toggleOn = angular.element(element[0].querySelector('.don'));
         var toggleOff = angular.element(element[0].querySelector('.doff'));
         var toggleHandle = angular.element(element[0].querySelector('.toggle-handle'));
         var onstyle = 'btn-' + options.onstyle;
         var offstyle = 'btn-' + options.offstyle;
         var myContents = element.children().eq(0);

         var size = options.size === 'large' ? 'btn-lg'
            : options.size === 'small' ? 'btn-sm'
            : options.size === 'mini' ? 'btn-xs'
            : options.size === 'xmini' ? 'fgw-btn-xxs'
            : '';

         // render
         //$timeout(render, 0);

         function getOptions() {

            return {
               on: attrs.on || DEFAULTS.on,
               off: attrs.off || DEFAULTS.off,
               onstyle: attrs.onstyle || DEFAULTS.onstyle,
               offstyle: attrs.offstyle || DEFAULTS.offstyle,
               size: attrs.size || DEFAULTS.size,
               style: attrs.style || DEFAULTS.style,
               width: attrs.width || DEFAULTS.width,
               height: attrs.height || DEFAULTS.height,
               readonly: attrs.hasOwnProperty("readonly") || DEFAULTS.readonly,
               //disabled: attrs.hasOwnProperty("disabled") || DEFAULTS.disabled,
               disabled: (attrs.hasOwnProperty("disabled")) ? (attrs.disabled !== 'false') ? true : false : DEFAULTS.disabled
            }
         }

         ngModel.$formatters.push(function ($modelValue) {
            var viewValue = !!$modelValue;

            (viewValue) ? on() : off();
            return viewValue;
         });// endof $formatters

         // Observe: data-disabled for changes
         if ( attrs.hasOwnProperty("disabled") && angular.isString(attrs.disabled) ){
            scope.$watch(attrs.disabled, function (value){
               console.warn('DISABLED', value);
               (value) ? disabled() : enable();
            });
         }
         /*
         scope.$watch(function () {
            return (attrs.hasOwnProperty("disabled")) ? (attrs.disabled !== 'false') ? true : false : DEFAULTS.disabled;
         }, function (value) {
            (value) ? disabled() : enable();
         });
         */

         function disabled() {
            if (options.readonly) return;

            elemCheckbox.prop('disabled', true).addClass("disabled");
            toggleContainer.attr("disabled", "disabled").addClass("disabled");
            myContents.off('click');
         }
         function enable() {
            if (options.readonly) return;

            elemCheckbox.prop('disabled', false).removeClass("disabled");
            toggleContainer.removeAttr("disabled").removeClass("disabled");
            myContents.off('click').on('click', toggle);
         }

         function toggle() {
            if (options.readonly || options.disable) return;

            var newValue = !ngModel.$viewValue;

            (newValue) ? on() : off();

            applyModelValue(newValue);
         }

         function render() {
            if (options.readonly) {
               elemCheckbox.remove();
            }
            if (!options.readonly && options.disabled) {
               elemCheckbox.prop('disabled', true).addClass("disabled");
            }
            if (options.readonly || options.disabled) {
               toggleContainer.attr("disabled", "disabled").addClass("disabled");
            }

            toggleOn.html(options.on).removeClass("toggle-on").addClass(onstyle).addClass(size);
            toggleOff.html(options.off).removeClass("toggle-off").addClass(offstyle).addClass(size).addClass('active');
            toggleHandle.addClass(size);

            toggleContainer.removeClass(onstyle).removeClass(offstyle).removeClass('off');

            toggleContainer.addClass(ngModel.$viewValue ? onstyle : offstyle + ' off').addClass(size).addClass(options.style);

            var width = options.width || Math.max(toggleOn.outerWidth(true), toggleOff.outerWidth(true)) + (toggleHandle.outerWidth(true) / 2);
            var height = options.height || Math.max(toggleOn.outerHeight(true), toggleOff.outerHeight(true));

            toggleOn.addClass('toggle-on');
            toggleOff.addClass('toggle-off');

            toggleContainer.css({ width: width, height: height });
            if (options.height) {
               toggleOn.css('line-height', toggleOn.height() + 'px');
               toggleOff.css('line-height', toggleOff.height() + 'px');
            }

            if (!options.readonly && !options.disabled) {
               console.log("execute update and trigger");
               myContents.off('click').on('click', toggle);
            }
         }
         ngModel.$render = render;

         function on() {
            toggleContainer.removeClass(offstyle).removeClass('off').addClass(onstyle);
         }

         function off() {
            toggleContainer.removeClass(onstyle).addClass(offstyle).addClass('off');
         }
         
         function applyModelValue(newValue) {
            scope.$apply(function () {
               ngModel.$setViewValue(newValue);
            });
         }
      }

   };
}]);

app.directive('fgwTableSort', ['$translate', '$parse', function ($translate, $parse){
   return {
       restrict: 'A',
       compile: function (tElement, tAttrs){
          var fnSettings = $parse(tAttrs.fgwTableSort);
          
          return function postLink ($scope, $element, $attrs, $controllers){
             var settings = fnSettings($scope);             
             var parseFnCurrentSortKey = $parse(settings.currentSortKey || '');
             var fnListenerCurrentSortKey = null;
             var myscope = $scope.$new();
             var sortAsc = null;
             var fnSort = null;
             
             var updateClass = function (){
                $element.removeClass('fgw-sorting fgw-sorting-desc fgw-sorting-asc');
                if ( null === sortAsc ){
                   $element.addClass('fgw-sorting');
                }else if ( true === sortAsc ){
                   $element.addClass('fgw-sorting-asc');
                }else{
                   $element.addClass('fgw-sorting-desc');
                }
             }
             
             fnListenerCurrentSortKey = myscope.$watch(parseFnCurrentSortKey, function(value){
                if ( settings.id != value ){
                   sortAsc = null;
                   updateClass();
                }
             });
             
             $element.off('click').on('click', function (){
                if ( angular.isFunction(parseFnCurrentSortKey.assign) ){
                   parseFnCurrentSortKey.assign($scope, settings.id);
                }
                sortAsc = !sortAsc;
                updateClass();
                if ( angular.isFunction(settings.fnSort) ){
                   settings.fnSort(settings.id, sortAsc);
                }
                $scope.$apply();
             });
             
             $scope.$on('$destroy', function (){
                if ( fnListenerCurrentSortKey ){ fnListenerCurrentSortKey(); }
             });// endof ::$destroy
             
             updateClass();
          }
       }
   };
}]);

app.directive('fgwTableCell', ['$translate', '$parse', function ($translate, $parse){
   return {
       restrict: 'A',
       compile: function (tElement, tAttrs){
          var fnSettings = $parse(tAttrs.fgwTableCell);
          
          return function postLink ($scope, $element, $attrs, $controllers){
             var settings = fnSettings($scope);
             var parseFnCurrentSortKey = $parse(settings.currentSortKey || '');
             var fnListenerCurrentSortKey = null;             
             var myscope = $scope.$new();
             
             fnListenerCurrentSortKey = myscope.$watch(parseFnCurrentSortKey, function(value){
                $element.removeClass('fgw-col-sorting');
                if ( settings.id === value ){ $element.addClass('fgw-col-sorting'); }
             });
             
             $scope.$on('$destroy', function (){
                if ( fnListenerCurrentSortKey ){ fnListenerCurrentSortKey(); }
             });// endof ::$destroy             
          }
       }
   };
}]);

app.directive('fgwActionButton', ['$translate', '$parse', function ($translate, $parse){
   return {
       restrict: 'A',
       transclude: true,
       controller: ['$scope', function ($scope){
          $scope.text = '';
          $scope.icon = '';
          $scope.css = '';
          
          $scope.hasIcon = function () {
              return $scope.icon != '';
          }
          $scope.hasText = function () {
             return $scope.text != '';
         }
       }],
       scope: { action: '&fgwAction', valid: '&fgwValid' },
       template: '<button ng-disabled="!valid()" ng-class="css"><i ng-if="hasIcon()" class="{{icon}}"></i><span ng-if="hasText()">{{text}}</span></button>',
       link: function (scope, element, attrs, ctrl) {
          $translate(attrs.fgwActionButton)
          .then(function(response){
             scope.text = response;
          })
          .catch(function(error){
             $console.warn("error", error);
          })
          scope.icon = attrs.fgwIcon;
          scope.css = attrs.fgwCss;

          scope.valid = ( $U(scope.valid()) ) ? (uxfwk.$true) : (scope.valid);

          $console.warn("scope.valid", scope.valid);
//          scope.valid = scope.valid || uxfwk.$true;
         
          var actionHandler = $parse(scope.action) || function () { };
          
          $(element).click(function (e) {
             if ( scope.valid() ){
                actionHandler();
             }
          });
       }
   };
}]);

app.directive('fgwPasswordDefault', ['$parse', '$compile', function($parse, $compile){
   var TEMPLATE = "<span>**********</span>";
   return {
      template: TEMPLATE,
      restrict: 'A',
      terminal: true,
      require: ['ngModel'],
      link: function($scope, $element, $attrs, $controllers){}
   }
}]);// ::fgwPasswordDefault

app.directive('fgwPasswordVisibilitySwitch', ['$parse', '$compile', function($parse, $compile){
   var DEFAULTS = {
      class: 'form-control input-sm fgw-input-sm-width',
      placeholder: '',
      required: true,
      input: 'password',
      isVisible: false,
      isDisable: false,
      name: null
   };
//   var resolveTemplate = function(tElement, tAttrs){
//      var tpl = "";
//      tpl += "<div class='fgw-password-visibility-switch'><input autocomplete='new-password' type='{{ settings.input }}' name='{{ name }}' class='{{ settings.class }} fgw-password-visibility-switch-input' data-ng-model='data' data-uxfwk-validate='validate(data, ngModel)' data-ng-disabled='isDisabled' data-ng-change='updateNgModelCtrl()' placeholder='{{ placeholder | uxfwkNullHider |translate }}' data-ng-required='settings.required' data-ng-maxlength='{{ settings.maxlength }}' data-uxfwk-form-validation-hints/>"
//      tpl += "<div class='input-group-btn fgw-password-visibility-switch-switch'>";
//      tpl +=   "<button class='btn btn-default' type='button' data-ng-click='actionToggle()'>";
//      tpl +=      "<i data-ng-class='settings.isVisible ? \"fgw-eye-slash\" : \"fgw-eye\"'></i>";
//      tpl +=   "</button>";
//      tpl += "</div></div>";
//      return tpl;
//   }; // TEMPLATE
   
   var resolveTemplate = function(tElement, tAttrs){
      var tpl = "";
      tpl += "<div class='fgw-input-group fgw-input-max-width' >";
      tpl += "<button type='button' data-ng-click='actionToggle()'>";
      tpl += "<i class='icon' data-ng-class='settings.isVisible ? \"fgw-eye-slash\" : \"fgw-eye\"'></i>";
      tpl += "</button>";
      tpl += "<input autocomplete='new-password' type='{{ settings.input }}' name='{{ name }}' class='{{ settings.class }} fgw-password-visibility-switch-input' data-ng-model='data' data-uxfwk-validate='validate(data, ngModel)' data-ng-disabled='isDisabled' data-ng-change='updateNgModelCtrl()' placeholder='{{ placeholder| uxfwkNullHider | translate }}' data-ng-required='settings.required' data-ng-minlength='{{ settings.minlength }}' data-ng-maxlength='{{ settings.maxlength }}' data-uxfwk-validate-printable-ascii-chars data-uxfwk-form-validation-hints/>";
      tpl += "</div>";
      return tpl;
   }; // TEMPLATE

   return {
      restrict: 'A',
      terminal: true,
      scope: true,
      require: ['ngModel'],
      compile: function(tElement, tAttrs){
         var TEMPLATE      = resolveTemplate(tElement, tAttrs);
         var fnTemplate    = $compile(TEMPLATE);
         var fnSettings    = $parse(tAttrs.fgwPasswordVisibilitySwitch);
         var fnValidators  = $parse(tAttrs.fgwPasswordVisibilitySwitchValidators);
         var fnIsDisabled  = $parse(tAttrs.ngDisabled);

         return function postLink($scope, $element, $attrs, $controllers){
            var listenerDisabled = null;

            // [#] - Initialize
            var myscope = $scope.$new(true);
            myscope.ngModelCtrl = $controllers[0];
            myscope.ngModel = $controllers[0];
            myscope.settings = angular.extend({}, DEFAULTS, fnSettings($scope));
            myscope.data = myscope.ngModelCtrl.$modelValue;
            myscope.validate = angular.isFunction(fnValidators($scope)) ? fnValidators($scope) : null;
            myscope.name = $attrs.name || null;
            myscope.placeholder = $attrs.placeholder || null;
            myscope.minlength = $attrs.minlength || null;
            myscope.maxlength = $attrs.maxlength || null;

            listenerDisabled = $scope.$watch(fnIsDisabled, function(value){
               myscope.isDisabled = value;
            })
            
            
            // [#] - Declare the scope where compiled contents will be binded to
            fnTemplate(myscope, function(clone, scope){
               TEMPLATE = clone;
               $element.prepend(TEMPLATE);
            });// endof ::fnTemplate

            // [#] - Updates passed model controller value
            myscope.updateNgModelCtrl = function(){
               myscope.ngModelCtrl.$setViewValue(myscope.data);
            };// endof ::updateNgModelCtrl

            myscope.ngModelCtrl.$formatters.push(function($modelValue){
               myscope.data = $modelValue;
            });

            // [#] - Toggle visibility of the field
            myscope.actionToggle = function(){
               if ( myscope.settings.isVisible ){ myscope.settings.input = 'password'; myscope.settings.isVisible = false; }
               else{ myscope.settings.input = 'text'; myscope.settings.isVisible = true; }
            };// ::actionToggle

            $scope.$on('hide', function(){
               if ( myscope.settings.isVisible ){
                  myscope.actionToggle();
               }
            });// @on.hide
            
            // [#] - Destroy the created scope
            $scope.$on('$destroy', function(){
               if ( listenerDisabled ){ listenerDisabled(); }
               if ( myscope ){ myscope.$destroy(); }
            });// endof $on

         }
      }
   }
}]);// ::fgwPasswordVisibilitySwitch

/**
 * @description
 * @return {date object}
 */
app.directive('fgwTimeParser', ['$parse', function($parse){
   var NAMESPACE = "fgwTimeParser";

   /**
    * @access private (appended to ngModel pipeline)
    * @name ngModelFormatter
    * @param $modelValue {object OR string OR number}
    * @return {object OR string OR number}
    * @description
    * Converts given $modelValue to a new $viewValue according to current context.
    */
   function ngModelFormatter ($modelValue){ var output = null, date = null, hours = null, minutes = null;
      if ( angular.isObject(date = $modelValue) && angular.isFunction(date.getTime) ){}
      else if ( angular.isString($modelValue) && angular.isObject(date = new Date(parseFloat($modelValue))) ){}
      else if ( angular.isNumber($modelValue) && angular.isObject(date = new Date($modelValue)) ){}

      if ( angular.isObject(date) && !isNaN( date.getTime() ) ){
         hours = date.getHours() > 9 ? date.getHours() : "0{0}".sprintf(date.getHours());
         minutes = date.getMinutes() > 9 ? date.getMinutes() : "0{0}".sprintf(date.getMinutes());
         output = "{0}{1}".sprintf(hours, minutes);
      }
      else { output = $modelValue; }

      return output;
   };// ::@ngModelFormatter

   /**
    * @access private (this method is added to ngModel transform pipeline)
    * @name ngModelParser
    * @param $viewValue {object OR string OR number}
    * @return {string}
    * @description
    * Everytime ngModel requires a transformation from viewValue, then this method is called.
    * It iterates through all visible masks and converts checkbox value to bit in sequence.
    */
   function ngModelParser ($viewValue){ var split = null, output = null;
      if ( timeRangeValidator($viewValue) && angular.isArray(split = $viewValue.match(/.{1,2}/g)) ){
         output = new Date();
         output.setHours(split[0]);
         output.setMinutes(split[1]);
         return output;
      }
      return $viewValue;
   };// ::@ngModelParser

   /**
    * @name ngModelValidators
    * @desc ngModel validators pipeline
    * @return {{}}
    */
   function ngModelValidators (){ var allrules = {};
      allrules.validateTime = timeRangeValidator;
      return allrules;
   };// ::@ngModelValidators

   /**
    * @name timeRangeValidator
    * @desc Validates a given if a given param is a valid time data
    * @param time {string OR number OR object}
    * @return {*}
    */
   function timeRangeValidator (time){ var group = null, date = null;
      if ( angular.isString(time) && angular.isArray(group = time.match(/.{1,2}/g)) && group.length == 2 ){
         if ( group[0] < 0 || group[0] > 23 ){ return false; }
         else if( group[1] < 0 || group[1] > 59 ){ return false; }
         return true;
      }
      else if ( (angular.isString(time) || angular.isNumber(time)) && angular.isObject(date = new Date(parseFloat(time))) ){
         return timeRangeValidator(date);
      }
      else if ( angular.isObject(time) ){
         if ( angular.isFunction(time.getTime) && !isNaN( time.getTime() ) ){ return true; }
         return false;
      }
      return false;
   };// ::@timeRangeValidator

   return {
      require: ['ngModel'],
      priority: 101, // Right after ui-mask directive: this affects how parsers and formatters perform
      compile: function(tElement, tAttrs){
         return function postLink($scope, $element, $attrs, $controllers){
            // [#] - Initialize
            var myscope = $scope.$new(true);
            myscope.ngModelCtrl = $controllers[0];

            /**
             * @access public (available through directive controller)
             * @description
             * Initializes some behaviours on ngModel controller to bind it to this directive
             * specifications (namelly, $modelValue transformations)
             */
            myscope.initializeNgModel = (function (controller){
               controller.$parsers.push(ngModelParser);
               controller.$formatters.push(ngModelFormatter);
               controller.$validators = ngModelValidators();
            })(myscope.ngModelCtrl);// ::initializeNgModel

         }
      }
   }
}]);// ::fgwTimeParser

app.filter('startFrom', function () {
   return function (input, start) {
      start = +start; //parse to int
      if ( $U(input) ){ return; }
      return input.slice(start);
  }
});




(function preAngularBootstrap (){
   var provider = {
      authorization:          false,
      locale:                 'en_UK',
      accessDomains:          null,
      freeAccessPoints:       null,
      applicationControlList: null,
      $cookies:               null,
      SCASessionId:           '012345678901234',
      SCARandomKey:           '432109874563210',
      ApplicationKeyOnSCA:    'AGORA-NG Resource Manager',
      currentDA:              null,
   p:null};// provider

   function UxfwkSession (){
      this.checkpoint = function (key, global){
         var output = false, ap = null;

         //[#1.0] If authorization was disabled on REST, disables it on GUI as well
         if ( true != provider.authorization ){ output = true; }
         else if ( (true === global) && !angular.isArray(ap = provider.freeAccessPoints) ){ output = false; }
         else if ( !$U(provider.currentDA) && !angular.isArray(ap = provider.accessDomains[provider.currentDA]) ){ output = false; }
         else if ( angular.isArray(ap) ){ output = ((ap.indexOf(key) < 0)?(false):(true)); }
         //$console.warn('output', key, global, output, ap);
         return output;
      };// ::checkpoint

      this.application = function (key){
         var output = false;

         //[#1.0] If authorization was disabled on REST, disables it on GUI as well
         if ( true != provider.authorization ){ output = true; }
         else if ( !angular.isArray(provider.applicationControlList) ){ output = false; }
         else{ output = ((provider.applicationControlList.indexOf(key) < 0)?(false):(true)); }
         //$console.warn('output', output);
         return output;
      };// ::application

      this.setDomainAccess = function (da){
         provider.currentDA = da;
         //$console.warn('set domain access', da);
      };// ::setDomainAccess

   };// ::UxfwkSession
   app.service('uxfwkSession', [UxfwkSession]);

   app.provider('uxfwkSession', function UxfwkSessionProvider (){

      this.locale = function (value){
         if ( 0 === arguments.length ){ return provider.locale; }
         provider.locale = value;
         return provider.locale;
      };// ::locale

      this.$get = [function (){
         return new UxfwkSession();
      }];
   });

   (function (){
      var cookies = angular.injector(['ng', 'ngCookies']).get('$cookies');
      var tokens = null;

      if ( !$U(cookies) && (angular.isString(cookies.GUIASESSION)) ){
         tokens = uxfwk.trim(cookies.GUIASESSION, '"').split('/');
         if ( angular.isArray(tokens) && (3 === tokens.length) ){
            provider.SCASessionId        = tokens[0];
            provider.SCARandomKey        = tokens[1];
            provider.ApplicationKeyOnSCA = tokens[2];
         }
      }
   })();

   _loadStates();

})();// ::preAngularBootstrap


return app;
});