'use strict';
/**
 * @description This module adds some core services
 * @author nuno-r-farinha
 */
define(['angularAMD', 'angular'], function uxfwk_dom_module (angularAMD, angular){

(function(){
   var nativeFn = angular.element.prototype;

   nativeFn.clean = function (bRecursive){
      var output = [];

      for ( var i = 0, leni = this.length; i < leni; ++i ){
         if ( this[i].nodeType != 3 ){
            output.push(this[i]);
            if ( true === bRecursive ){
               this.eq(i).contents().clean(true);
            }
         }else{ angular.element(this[i]).remove(); }
      }
      return angular.element(output);
   };// ::clean

   nativeFn.dom = function (){ return (this instanceof HTMLElement)?(this):(this[0]); };

   nativeFn.extract = function (selector){
      return angular.element('<div></div>').append(this.clone()).query(selector).contents();
   };

   nativeFn.tag = function (tagName){
      if ( tagName ){ return !!(angular.lowercase(tagName) === angular.lowercase(this.dom().tagName)); }
      else{ return angular.lowercase(this.dom().tagName); }
   }; 
   nativeFn.query = function (query){ return angular.element(this.dom().querySelectorAll(query) || null); };

   //[#] Creates filter function (by tagName only) if none is defined
   nativeFn.filter = nativeFn.filter || function (tag){
      for ( var i = 0, leni = this.length; (i < this.length) && (i < leni); ){
         if ( this.eq(i).tag(tag) ){ i++; }
         else{ this.splice(i, 1); }
      }
      return this;
   };

   //[#] Returns the last element of collection
   nativeFn.last = nativeFn.last || function (){ return this[this.length - 1]; };
})();

function return_self (obj){ return obj; }

//[#1.0] - DOM tree traverse methods
angularAMD.factory('uxfwk.dom.traverse', [function (){
   var ns = '$$uxfwk.dom.traverse'; // a object with this key will be created for private data
   var fnExtend = return_self;      // temporary function to be used when some method requires extension applied

   /**
    * @description Look for the first ancestor of an element with a specific tag 
    * @author nuno-r-farinha
    */
   function ancestor (tagName){
      var elem = this.dom();
      //[#] - shortcut for a well known element
      if ( 'body' == tagName ){ return document.body; }
      //[#] - navigates upward the DOM tree until the top (or one valid ancestor is found)
      while ( angular.isDefined(elem) && (tagName != angular.lowercase(elem.tagName)) && angular.isDefined(elem.parentNode) ){ elem = elem.parentNode; }
      //[#] - wraps the output
      return fnExtend(elem);
   };// ancestor

   /**
    * @description Look for the first ancestor of an element with a specific tag 
    * @author nuno-r-farinha
    */
   function children (tagName){
      //[#] - gets native method output
      var childs = this[ns].children.apply(this, arguments);
      var output = [];

      //[#] - if jquery, selector are supported, else is jqlite, tagName selection must be supported
      if ( !angular.isDefined(this.jquery) && angular.isDefined(tagName) ){
         for ( var i = 0, leni = childs.length; i < leni; i++ ){
            if ( angular.isDefined(childs[i].tagName) && (angular.lowercase(tagName) == angular.lowercase(childs[i].tagName)) ){ output.push(fnExtend(childs[i])); }
         }
      //[#] - if jquery defined, only need to wrap each element
      }else{ output = childs; }
      return fnExtend(output);
   };// children

   /**
    * @description Returns DOM element related to this wrapper
    * @author nuno-r-farinha
    */
   function dom (){
      return this[0];
   };// dom

   /**
    * @description Returns Angular elements extended
    * @author nuno-r-farinha
    */
   function eq (){
      return fnExtend(this[ns].eq.apply(this, arguments));
   };// eq

   /**
    * @description Returns Angular elements extended
    * @author nuno-r-farinha
    */
   function find (){
      return fnExtend(this[ns].find.apply(this, arguments));
   };// find

   /**
    * @description 
    * Checks if current element is ancestor of another element 
    * @author nuno-r-farinha
    */
   function isAncestorOf (elem){
      elem = fnExtend(elem).dom();
      while ( (elem) && (document.body != elem.parentNode) && (elem.parentNode != this[0]) ){ elem = elem.parentNode; }
      if ( (elem) && (elem.parentNode == this[0]) ){ return true; }
      return false;
   };// ::isAncestorOf

   /**
    * @description Returns Angular elements extended
    * @author nuno-r-farinha
    */
   function next (tagName){
      if ( angular.isDefined(tagName) ){
         var next = this.dom().nextSibling;
         while ( next && (angular.lowercase(tagName) != angular.lowercase(next.tagName)) ){ next = next.nextSibling; }
         return fnExtend(next);
      }
      return fnExtend(this.dom().nextSibling);
   };// next

   /**
    * @description Returns Angular element extended
    * @author nuno-r-farinha
    */
   function parent (){
      return fnExtend(this[ns].parent.apply(this, arguments));
   };// parent

   /**
    * @description Returns Angular elements extended
    * @author nuno-r-farinha
    */
   function previous (tagName){
      if ( angular.isDefined(tagName) ){
         var next = this.dom().previousSibling;
         while ( next && (angular.lowercase(tagName) != angular.lowercase(next.tagName)) ){ next = next.previousSibling; }
         return fnExtend(next);
      }
      return fnExtend(this.dom().previousSibling);
   };// previous

   /**
    * @description Wrapper to standard querySelector
    * @author nuno-r-farinha
    */
   function querySelector (selector){
      var dom = this.dom().querySelector(selector);

      if ( dom ){ return fnExtend(dom); }
      return null;
   };// querySelector

   /**
    * @description Wrapper to standard querySelectorAll
    * @author nuno-r-farinha
    */
   function querySelectorAll (selector){
      var dom = this.dom().querySelectorAll(selector);

      if ( dom ){ return fnExtend(dom); }
      return null;
   };// querySelectorAll

   /**
    * @description Returns tagname allways in lower case
    * @author nuno-r-farinha
    */
   function tagName (){
      return angular.lowercase(this.dom().tagName);
   };// tagName

   /**
    * @description Extends native angular element (jqlite or jquery) with new methods 
    * @author nuno-r-farinha 
    */
   function extend (elem, extend){
      var e = null;

      //[#] - return NULL when NULL element
      if ( !angular.isDefined(elem) || (null == elem) ){ return null; }
      //[#] - wraps element in angular element if not already
      if ( !angular.isDefined(elem.jquery) ){ e = angular.element(elem); }
      else{ e = elem; }

      if ( !angular.isDefined(e[ns]) ){
         e[ns] = {};

         //[#] - defines which function to be used as extension
         fnExtend = extend || return_self;
         //[#] - adds dom navigation methods
         e.ancestor           = ancestor;          // this is new (not jquery or jqlite)
         e[ns].children       = e.children;        // saves original
         e.children           = children;          // replaces with one jqlite extension (optional filter by tagName)
         e.dom                = dom;               // this is new (not jquery or jqlite)
         e[ns].eq             = e.eq;              // saves original
         e.eq                 = eq;                // replaces with one jqlite extension (optional filter by tagName)
         e[ns].find           = e.find;            // saves original
         e.find               = find;              // replaces with one jqlite extension (optional filter by tagName)
         e.isAncestorOf       = isAncestorOf;      // this is new (not jquery or jqlite)
         e.next               = next;              // this is new (not jquery or jqlite)
         e[ns].parent         = e.parent;          // saves original
         e.previous           = previous           // this is new (not jquery or jqlite)
         e.parent             = parent;            // replaces with one jqlite extension (optional filter by tagName)
         e.querySelector      = querySelector;     // this is new (not jquery or jqlite)
         e.querySelectorAll   = querySelectorAll;  // this is new (not jquery or jqlite)
         e.tagName            = tagName;           // this is new (not jquery or jqlite)
      }

      return e;
   };// extend
   return extend;
}]);


});
