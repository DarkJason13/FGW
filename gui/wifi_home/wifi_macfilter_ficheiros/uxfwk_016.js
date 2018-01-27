/**
 * @description
 * This module is a RequireJS loading plugin. This plugin should be used
 * as a language text loader. It has dependencies to angular and translate
 * components. It loads language files as JSON files where data is defined
 * as object or array of objects.<br>
 * @see http://requirejs.org/docs/plugins.html
 */
define('uxfwk.require.lang', ['module', 'uxfwk.session.loader', 'angular', 'pascalprecht.translate', 'uxfwk.string'], function module2 (module, sessionLoader){
   'use strict';
   
   var pending = [], // stores all template registers pending for application bootstrap
      langKey = null,// key for the current selected language
      lang = {},     // the object where to store loading plugin
      map = {},      // maps true URLs to avoid duplicate file processing
      boot = false;  // signals if angular bootstrap was already done
   var loadTexts = null;// this variable will became a function to load new texts after bootstrap

   //[#] Checks if session component returns a function. It is required so that
   // assynchronous loading may be done (the function returned must accept two
   // callbacks, the first for success, the second for error - just the way require
   // works)
   if ( !angular.isFunction(sessionLoader) ){
      throw new Error('Session component MUST return a function constructor!');
   }

   lang.load = function (name, req, onLoad, config){
      var paths = ((config || {}).paths || {});
      var tokens = null, url = null;
      var path = null;

      //[#] This line was copied from requireJS documentation
      // @http://requirejs.org/docs/plugins.html
      if ( config && config.isBuild ){
         onLoad();
         return;
      }

      //[#] Since many lang files may be concatenated in a single one,
      // I should only add to translate once the new text keys. So, I
      // need to check if the file was already loaded.
      if ( (path = paths[name]) && map[path] ){
         onLoad();
         return;
      }
      map[path] = true;

      //[#] Finally the work. I will use text loading plugin to
      // request data as text and then integrate it in translate.
      tokens = name.split('.');
      tokens = 'module.' + tokens.slice(0, -1).join('.');
      sessionLoader(function (session){
         if ( !angular.isString(paths[tokens]) || !angular.isString(session.language) ){
            onLoad.error(new Error('Failed retrieving texts for module [' + name + ']: detail[no path defined for "' + tokens + '"]'));
         }
         url = '{0}/lang/{1}/{2}.json'.sprintf(paths[tokens], session.language, name);
         req(['text!' + url], function (content){
            if ( false === boot ){
               pending.push({ name: name, content: content });
               onLoad();
            }else{
               loadTexts(name, content)
               .then(function(){
                  onLoad();
               });
            }
         });
      }, function (error){
         onLoad.error(new Error('Failed loading session data'));
      });
   };// load

   angular.module('uxfwk.require.lang', ['ng', 'pascalprecht.translate'])
   .config(['$translateProvider', function ($translateProvider){
      $translateProvider.useLoaderCache('uxfwk.require.lang.cache');
   }])
   .run(['$rootScope', '$translate', '$translatePartialLoader', 'uxfwk.require.lang.cache', function ($rootScope, $translate, $translatePartialLoader, langCache){

      //[#] This listerner is here only for debug purposes
      $rootScope.$on('$translateRefreshEnd', function(){
         console.warn('lang table reloaded');
      });

      //[#] Reads and stores current language key
      langKey = $translate.proposedLanguage();

      //[#] Marks bootstrap as completed
      boot = true;

      //[#] Now that angular components are available, creates the real loading method
      loadTexts = function (name, content){
         var url = 'lang/{0}/{1}.json'.sprintf(langKey, name);

         langCache.put(url, [200, content, {}, 'OK']);
         $translatePartialLoader.addPart(name);
         return $translate.refresh();
      };// loadTexts

      //[#] Processes all pending texts
      for ( var i = 0, leni = pending.length; i < leni; ++i ){
         loadTexts(pending[i].name, pending[i].content);
      }

   }])
   .factory('uxfwk.require.lang.cache', ['$cacheFactory', function ($cacheFactory){
      var cache = $cacheFactory('uxfwk.require.lang.cache');
      
      return{
         get: function (name){
            //console.warn('hello', name);
            return cache.get(name);
         },
         put: function (name, value){
            //console.warn('hello', name, value);
            return cache.put(name, value);
         }
      }
   }]);

   return lang;
});// module
