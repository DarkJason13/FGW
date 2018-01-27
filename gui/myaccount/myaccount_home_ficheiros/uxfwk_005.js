/**
 * @description 
 * This module is a RequireJS loading plugin. It is based on text plugin.
 * This plugin enables any module to define CSS dependencies, where this 
 * plugin automatically loads the CSS contents to DOM. This plugin uses 
 * text plugin to request text data (CSS content). It also requires angular 
 * since it uses its DOM API do access head DOM element and insert a new 
 * style tag. This plugin is aware of CSS files concatenation, and keeps 
 * track of each request true path (so it only inserts each path file once). 
 * @see http://requirejs.org/docs/plugins.html 
 */
define('uxfwk.require.css', ['module', 'angular'], function (module){
   'use strict';

   var css = {}, map = {};

   css.load = function (name, req, onLoad, config){
      var style = null, head = null, path = null;
      var paths = ((config || {}).paths || {});
      var requestPath = null;

      //[#] This line was copied from requireJS documentation
      // @http://requirejs.org/docs/plugins.html
      if ( config && config.isBuild ){
         onLoad();
         return;
      }

      //[#] Since many CSS files may be concatenated in a single one,
      // I should only add to DOM once the file that sums all. So, I
      // need to check if the super file was already loaded.
      if ( (path = paths[name]) && map[path] ){
         onLoad(map[path]);
         return;
      }
      map[path] = true;

      //[#] Finally the work. I will use text loading plugin to
      // request data as text and then integrate it in DOM.
      requestPath = 'text!' + name + '.css';
      req([requestPath], function (content){
         head = angular.element(document.getElementsByTagName('head'));
         style = angular.element('<style>');

         if ( path ){ map[path] = content; }
         style.attr('data-uxfwk-path', path);
         style.attr('type', 'text/css');
         style.text(content);
         head.append(style);
         onLoad(content);
      }, function (error){
         onLoad.error(new Error('Failed retrieving file [' + requestPath + ']: detail[' + error.toString() + ']'));
      });
   };// load

   return css;
});// module
