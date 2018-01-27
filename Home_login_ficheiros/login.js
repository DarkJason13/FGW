'use strict';
/**
 * 
 */
var SESSIONINFO = {};
define(['angularAMD', 'uxfwk', 'ngAnimate', 'ngCookies', 'ngSanitize', 'ui.utils', 'ui.router', 'pascalprecht.translate', 'ui.bootstrap', 'ui.select2', 'uxfwk.require.html', 'uxfwk.require.lang', 'header', 'uxfwk.base64'
   //, 'uxfwk.require.lang!fgw.common'
], function launcher (angularAMD, uxfwk){
   var session = {'session.username': 'developper'};
   var app = angular.module('mainModule', ['ngCookies', 'ngSanitize', 'ui.utils', 'ui.router', 'ui.router.state', 'pascalprecht.translate', 'ui.bootstrap', 'ui.select2', 'uxfwk.require.html', 'uxfwk.require.lang']);
   var moduleLanguages = [], moduleInits = [], stateTree = [];
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack['catch'](); };// SlickEdit hack, do not remove!!!
var notifications = {}, notificationText = '';


/**
 * @name launcher_config 
 * @description 
 * Configures application before bootstrap 
 */
function _bootstrap(){
app.config(['$urlRouterProvider', '$stateProvider', '$translateProvider', '$translatePartialLoaderProvider', '$uibTooltipProvider', '$httpProvider', '$provide', '$sceProvider', '$compileProvider',
function launcher_config ($urlRouterProvider, $stateProvider, $translateProvider, $translatePartialLoaderProvider, $tooltipProvider, $httpProvider, $provide, $sceProvider, $compileProvider){
   var languageKey = 'en';

   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|data|blob):/)
}]);// app.config

app.controller('mainCtrl', ['$scope', '$rootScope', '$cookies', '$http', '$translate', '$stateParams', '$compile', '$timeout', '$window', '$parse', '$filter', '$document', 'uxfwk.base64', function launcher_controller ($scope, $rootScope, $cookies, $http, $translate, $stateParams, $compile, $timeout, $window, $parse, $filter, $document, base64){

   angular.element($document[0].body).css('display', 'block');
   
   console.warn("LOGIN", $window.location);
   $scope.data = { lang: "PT", error: false, msg: '' };

   $rootScope.notifications = notifications;
   //$scope.notificationAlerts = [{ message: "hello world" }];
   //$scope.notificationClose = function (notification){
   //};// notificationClose

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
   //appUtilities.$translate.refresh();

   $scope.$root.uxfwk = uxfwk;
   
   $scope.login = function (){
      var auth = base64.encode($scope.data.username + ':' + $scope.data.password);
      var url = "#/gui/home.html";
      $http.get(url, { headers:{ 'Authorization': 'Basic '+auth } })
      .then(function(response){
         console.warn("LOGIN::response", response, $rootScope.session);
         if ( !$U(response) && !$U(response.data) ){
            var lang = null, configLang = null;
            var cgiQuery = 'webGUILang.cmd?ptinGUILanguage={0}';
            lang = !$U(lang = $scope.data.lang) ? (lang) : ('PT');
            configLang = cgiQuery.sprintf(lang);
            return $http.get(configLang);
         }
         return null;
      })
      .then(function(response){
         console.warn("Success", response);
         if ( !$U(response) ){
            $window.location.href = '#/gui/home.html';
         }
      })
      .catch(function(response){
         console.warn("response", response, $scope.data);
         $scope.data.error = true;
         $scope.data.msg = ('EN' === $scope.data.lang) ? ("Login failed. Please enter valid access credentials.") : ("Login falhou. Por favor insira credenciais válidas.");
      })
   }
   
   $scope.$watch('[data.username, data.password]', function(newValue, oldValue){
      if ( !$U(newValue[0]) && ("" === newValue[0]) && !$U(newValue[1]) && ("" === newValue[1]) ){
         $scope.data.error = false
      }
   }, true);
   console.warn("$scope", $scope)
}]);




   angularAMD.bootstrap(app);
};// _bootstrap

_bootstrap();

return app;
});