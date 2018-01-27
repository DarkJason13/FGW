/**
 * @description 
 * This module is a RequireJS loading plugin. It is based on text plugin.
 * This plugin enables any module to define HTML dependencies. This plugin 
 * is aware of HTML contents to a degree where it can automatically insert 
 * templates in angular cache. It analyses all top elements, checking if 
 * they are all script elements with both attributes:<br> 
 * - type with value "text/ng-template";<br>
 * - id with a URL value<br> 
 * If so, then it loads each template to angular cache identified it with 
 * the URL provided. If no script elements are found, then it loads the 
 * entire document to cache as a single template and use the name of RequireJS 
 * module (with .html suffix) as the template URL.<br> 
 * The module must use the the URL previously defined as the URL of template. 
 * With this rules, the dependency works on the following scenarios (without 
 * any change of dependencies):<br> 
 * - before packaging optimizations, each module has its own template, where 
 * RequireJs uses the true filepath. As long as this loading plugin, loads 
 * the contents to angular cache, angular will never try to transfer the 
 * template from server.<br>
 * - after packaging, all templates joined in the same file, must be wrapped 
 * each one by a script element with the two attributes defined earlier. 
 * @see http://requirejs.org/docs/plugins.html 
 */
define('uxfwk.require.html', ['module', 'angular'], function (module){
   'use strict';
   
   var pending = [], // stores all template registers pending for application bootstrap
      html = {},     // the object where to store loading plugin
      map = {},      // maps true URLs to avoid duplicate template processing
      boot = false;  // signals if angular bootstrap was already done
   var loadTemplate = null;// this variable will became a function to register new templates after bootstrap

   html.load = function (name, req, onLoad, config){
      var paths = ((config || {}).paths || {});
      var path = null;

      //[#] This line was copied from requireJS documentation
      // @http://requirejs.org/docs/plugins.html
      if ( config && config.isBuild ){
         onLoad();
         return;
      }

      //[#] Since many HTML files may be concatenated in a single one,
      // I should only add to DOM once the file that sums all. So, I
      // need to check if the super file was already loaded.
      if ( (path = paths[name]) && map[path] ){
         onLoad(map[path]);
         return;
      }
      map[path] = true;

      /*
      //[#] Bypass request if module is already loaded
      if ( req.defined(name) && req.specified(name) ){
         onLoad();
         return;
      }
      */
      //console.warn(name, req.defined(name));
      //console.warn(name, req.specified(name));

      //[#] Finally the work. I will use text loading plugin to
      // request data as text and then integrate it in DOM.
      req(['text!' + name + '.html'], function (content){
         if ( false === boot ){
            pending.push({ name: name, content: content });
         }else{
            loadTemplate(name, content);
         }
         onLoad(content);
      });
   };// load

   angular.module('uxfwk.require.html', [])
   .run(['$templateCache', '$filter', function ($templateCache, $filter){

      //[#] Defines the load template method that shall be used always after bootstrap
      loadTemplate = function (name, content){
         var templates = angular.element('<div>' + content + '</div>').children();
         var lowercase = $filter('lowercase');
         var isJoinedFile = true;

         //[#] This first loop is required to check if all document will be a single file or a joined one
         // (it is considered a joined one only if all top elements are of type script).
         for ( var i = 0, leni = templates.length; i < leni; ++i ){
            if ( ('script' != lowercase(templates.eq(i)[0].tagName)) || !templates.eq(i).attr('type') || ('text/ng-template' != templates.eq(i).attr('type')) || !templates.eq(i).attr('id') ){
               isJoinedFile = false;
               break;
            }
         }

         //[#] If a joined file is detected, then it parses each script to register template in cache
         if ( true === isJoinedFile ){
            for ( var i = 0, leni = templates.length; i < leni; ++i ){
               $templateCache.put(templates.eq(i).attr('id'), templates.eq(i).html());
               //console.warn('register template', templates.eq(i).attr('id'), templates.eq(i).html(), templates.eq(i));
            }
         }
         //[#] If not a joined file, loads all content as a single template to cache
         else{
            $templateCache.put(name + '.html', content);
            //console.warn('register template', name + '.html', content);
         }
      };// loadTemplate

      //[#] Loads all pending templates to cache
      for ( var i = 0, leni = pending.length; i < leni; ++i ){
         if ( angular.isObject(pending[i]) ){
            loadTemplate(pending[i].name, pending[i].content);
         }
      }

      //[#] Marks bootstrap as completed
      boot = true;
   }]);

   return html;
});// module
