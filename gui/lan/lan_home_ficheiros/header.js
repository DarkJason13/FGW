define(['angularAMD', 'uxfwk.session.loader', 'uxfwk'
   //, 'uxfwk.fgw.warningmodal.deleteEntry'
   , 'uxfwk.logout.dao'
], function (angularAMD, sessionLoader){
   'use strict';

angularAMD.controller('uxfwk.header', ['$document', '$window', '$q', '$scope', '$cookies', '$http', '$filter', 'uxfwk.logout.dao', function ($document, $window, $q, $scope, $cookies, $http, $filter, dao){
   
   $scope.language = null;
   $scope.model = null;
   $scope.sessionKey = null;
   sessionLoader(function(session){
      console.warn("session", session);
      $scope.language   = session.language;
      $scope.wlanCount  = session.wlanCount;
      $scope.model      = session.model;
   })
   $scope.configLang = function (lang){
      console.warn("LANG", lang, $scope.language);
      var query = null, url = null, language = null;
      var cgiQuery = 'webGUILang.cmd?ptinGUILanguage={0}';
      if (lang !== $scope.language){
         switch(lang){
            case 'pt-PT': language = 'PT'; break;
            case 'en': language = 'EN'; break;
         }
         query = cgiQuery.sprintf(language);
         url = query;
         
         /**
          * Emulate lang
          */
//         $scope.language = ('PT' === language) ? ('EN') : ('PT');
//         $window.location.href = 'index.html';
//         return ({ success: true, data: {} });
         
         
         
         //[#2.0] - send request
         return $http.get(url)
         .then(function(response){
            console.warn("response", response);
            $window.location.href = 'index.html';
            return ({ success: true, data: {} });
         })
         .catch(function(response){
            return ({ success: false, data: {} });
         });
      }
   }
   $scope.logout = function (){
      var defer   = $q.defer();
      var obj = {};
      
      require(['uxfwk.fgw.warningmodal.deleteEntry'], function (){
         var $injector = $document.injector();
         var warningModal = $injector.get('uxfwk.fgw.warningmodal.deleteEntry');
         var fnTranslate = $filter('translate');
         
         obj.title = fnTranslate('TEXT.COMMON.WARNINGMODAL.LOGOUT.TITLE');
         obj.msg = fnTranslate('TEXT.COMMON.WARNINGMODAL.LOGOUT.MESSAGE');
         obj.button = fnTranslate('TEXT.COMMON.WARNINGMODAL.LOGOUT.BUTTON');
         warningModal(obj)
         .then(function(response){
            if ( true === response.success ){ return dao.cmds.logout(); }
            return;
         })
         .then(function(response){
            $window.location.href = 'login.html';
         })
         .catch(function(){}).finally(function(){});
      });
      return defer.promise;
   }
   return;
}]);


});