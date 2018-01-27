/**
 * uxfwk
 */
define('uxfwk', ['angularAMD', 'uxfwk.dom', 'uxfwk.string', 'uxfwk.collapse', 'uxfwk.tooltip'], function(angularAMD){'use strict';
   var uxfwk = { version: '2.0.0' }, $console = {}, nativeConsole = null;
   var session = { 'session.username':'developper' };
   var zpriv = {};
   var CONSTANTS = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

uxfwk.$console = { log: angular.noop, info: angular.noop, debug: angular.noop, warn: angular.noop, error: angular.noop };
nativeConsole  = angular.copy(uxfwk.$console);
function $U (object){ return ((null == object) || (undefined == object)); };
if ( 'developper' == session['session.username'] ){ uxfwk.$console = console; nativeConsole = angular.copy(console); }
$console = uxfwk.$console;
$console.debug = angular.noop;
$console.log   = angular.noop;

window.uxfwkDebug = function (on){ uxfwk.$console.debug = (!!on)?(nativeConsole.debug):(angular.noop); return uxfwk.$console; }
window.uxfwkLog   = function (on){ uxfwk.$console.log   = (!!on)?(nativeConsole.log):(angular.noop); return uxfwk.$console; }

CONSTANTS.HTMLUXFWKSPINNING = '<i class="uxfwkicons-spinning"></i>';
CONSTANTS.HTMLUXFWKCHECKBOX = function(value){ return ('<input type="checkbox" disabled="true" {0} style="margin:0px;"/>').sprintf(value?"checked":""); }

uxfwk.$U = $U;
uxfwk.$identity   = function(a){ return a; }
uxfwk.$null       = function(){ return null; }
uxfwk.$true       = function(){ return true; }
uxfwk.$false      = function(){ return false; }
uxfwk.$object     = function(){ return {}; }
uxfwk.$controller = function(){ return [function(){}]; };// creates an empty controller definition
uxfwk.$evalKey = function(root, keys){
   if ( $U(root) ){ return null; }
   for ( var i = 0, leni = keys.length; i < leni; ++i ){
      if ( $U(root[keys[i]]) ){ return null; }
      else{ root = root[keys[i]]; }
   }
   return root;
};// ::$evalKey
uxfwk.$map = function(){ var output = {};
   for ( var i = 0, leni = (arguments.length - 1); i < leni; i += 2 ){ output[arguments[i]] = arguments[i + 1]; }
   return output;
};// ::$map


uxfwk.$sortNumber   = function(a,b){ return $U(a)?(1):($U(b)?(-1):((a*1 < b*1)?(-1):(a*1 > b*1)?(1):(0))); }
uxfwk.$sortString   = function(a,b){ if ($U(a) && !$U(b)){ return -1; }else if (!$U(a) && $U(b)){ return 1; }else{ return (angular.lowercase(a) < angular.lowercase(b))?(-1):(angular.lowercase(a) > angular.lowercase(b))?(1):(0); }}
uxfwk.$sortNewFirst = function(a,b,fnSort){ a.$$uxtbl = a.$$uxtbl || {}; b.$$uxtbl = b.$$uxtbl || {}; return (a.$$uxtbl.isNewEntry)?(-1):((b.$$uxtbl.isNewEntry)?(1):(fnSort(a,b))); }
uxfwk.$sortIpAddress= function(a,b){
   var toka = null, tokb = null, r = 0;
   //[#1.0] First three conditions, check for non string values (in which case, puts to the end the non string values)
   if ( !angular.isString(a) && !angular.isString(b) ){ return 0; }
   if ( !angular.isString(a) ){ return -1; }
   if ( !angular.isString(b) ){ return 1; }
   //[#2.0] If both are IPv4 addresses, compaires both from the highest octet to the lowest
   toka = a.split('.');tokb = b.split('.');
   if ( (4 == toka.length) && (4 == tokb.length) ){
      if ( 0 != (r = toka[0]*1 - tokb[0]*1) ){ return r; }
      if ( 0 != (r = toka[1]*1 - tokb[1]*1) ){ return r; }
      if ( 0 != (r = toka[2]*1 - tokb[2]*1) ){ return r; }
      return toka[3]*1 - tokb[3]*1;
   }
   //[#3.0] If both are non IPv4, then do a string compairson
   if ( (4 != toka.length) && (4 != tokb.length) ){ return uxfwk.$sortString(a,b); }
   //[#4.0] If one is IPv4 and other is IPv6, assumes that IPv4 is lowest than IPv6
   if ( (4 != toka.length) ){ return 1; }
   if ( (4 != tokb.length) ){ return -1; }
   return 0;
};// ::$sortIpAddress

uxfwk.findInArray = function (array, key, value, exclude){
   var leni = 0, i = 0;

   if ( $U(array) ){ throw new ReferenceError('NULL mandatory argument {array}'); }
   if ( $U(key) ){ throw new ReferenceError('NULL mandatory argument {key}'); }
   if ( $U(value) ){ throw new ReferenceError('NULL mandatory argument {value}'); }
   if ( !angular.isArray(array) ){ throw new TypeError('Argument {array} MUST be an Array object'); }
   if ( !angular.isString(key) ){ throw new TypeError('Argument {key} MUST be a String object'); }
   //if ( !angular.isString(value) ){ throw new TypeError('Argument {value} MUST be a String object'); } - fui eu (NRF) que comentei isto no PC do CMM

   array.$$$$findInArrayCache = array.$$$$findInArrayCache || { key: null, value: null, item: null, exclude: exclude };
   if ( (array.$$$$findInArrayCache.key === key) && (array.$$$$findInArrayCache.value === value) && (array.$$$$findInArrayCache.exclude === exclude) ){
      return array.$$$$findInArrayCache.item;
   }else{
      for ( i = 0, leni = array.length; (i < leni); ++i ){
         if ( array[i] && (value === array[i][key]) && (array[i] != exclude) ){
            array.$$$$findInArrayCache = { key: key, value: value, item: array[i] };
            return array[i];
         }
      }
   }
   array.$$$$findInArrayCache = { key: key, value: value, item: null };
   return null;
};// ::findInArray

uxfwk.array2map = function (array, key, sPrefix){
   var newKey = null, map = {};

   if ( $U(array) || $U(key) ){ return {}; }
   for ( var i = 0, leni = array.length; i < leni; ++i ){
      if ( $U(array[i]) || $U(newKey = array[i][key]) ){ continue; }
      if ( angular.isNumber(newKey) ){ newKey = array[i][key].toString(10); }
      if ( !$U(sPrefix) ){ newKey = sPrefix + newKey; }
      map[newKey] = array[i];
   }
   return map;
};// ::array2map

uxfwk.arrayDiff = function (a, b, compare, callbacks){
   var output = { remove:[], create:[], config:[] };
   var leni, lenj, i, j;

   //[#1.0] Validate input arguments
   if ( $U(a) ){ throw new ReferenceError('NULL mandatory argument {a}'); }
   if ( $U(b) ){ throw new ReferenceError('NULL mandatory argument {b}'); }
   if ( $U(compare) ){ throw new ReferenceError('NULL mandatory argument {compare}'); }
   if ( !angular.isArray(a) ){ throw new TypeError('Argument {a} MUST be an Array object'); }
   if ( !angular.isArray(b) ){ throw new TypeError('Argument {b} MUST be an Array object'); }
   if ( !angular.isFunction(compare) ){ throw new TypeError('Argument {compare} MUST be a Function object'); }

   //[#2.0] Check for missing entries from a on b (should be remove)
   for ( i = 0, leni = a.length; (i < leni); ++i ){
      for ( j = 0, lenj = b.length; (j < lenj) && (false === compare(a[i], b[j])); ++j );
      if ( j >= lenj ){ output.remove.push(a[i]); }
   }

   //[#3.0] Check for missing entries from b on a (should be create)
   for ( i = 0, leni = b.length; (i < leni); ++i ){
      for ( j = 0, lenj = a.length; (j < lenj) && (false === compare(a[j], b[i])); ++j );
      if ( j >= lenj ){ output.create.push(b[i]); }
   }

   //[#4.0] Check for entries that are kept for old list to new list
   for ( i = 0, leni = a.length; (i < leni); ++i ){
      for ( j = 0, lenj = b.length; (j < lenj) && (false === compare(a[i], b[j])); ++j );
      if ( j < lenj ){
         output.config.push(b[j]);
         if ( !$U(callbacks) && !$U(callbacks.config) ){ callbacks.config(a[i], b[j]); }
      }
   }

   return output;
};// ::arrayDiff

uxfwk.arraySortDiff = function (a, b, compare, callbacks){
   var fnCbRemove = null, fnCbCreate = null, fnCbEqual = null;
   var output = { remove:[], create:[], equal:[] }, check = 0;
   var alen = 0, blen = 0;
   var ai = 0, bi = 0;

   if ( 0 ){}//[#1.0] Validate input arguments
   else if ( $U(a) ){ throw new ReferenceError('Missing input argument[a]'); }
   else if ( $U(b) ){ throw new ReferenceError('Missing input argument[b]'); }
   else if ( $U(compare) ){ throw new ReferenceError('Missing input argument[compare]'); }
   else if ( !angular.isArray(a) ){ throw new TypeError('Argument[a] is not an array!'); }
   else if ( !angular.isArray(b) ){ throw new TypeError('Argument[b] is not an array!'); }
   else if ( !angular.isFunction(compare) ){ throw new TypeError('Argument[compare] is not a function!'); }
   alen = a.length; blen = b.length;

   if ( !$U(callbacks) && angular.isFunction(callbacks.equal) ){ fnCbEqual = callbacks.equal; }
   else{ fnCbEqual = function(a,b){ return a; }; }


   while ( (ai < alen) || (bi < blen) ){
      check = compare(a[ai], b[bi]);
      //[#] If equals, increment both offsets
      if ( 0 === check ){
         output.equal.push(a[ai]);
         a[ai] = fnCbEqual(a[ai], b[bi]);
         ai++; bi++;
      //[#] If a greater than b, it means a hole in 'a' (a creation)
      }else if ( (check > 0) ){
         output.create.push(b[bi]);
         bi++;

      //[#] If a lesser than b, it means a hole in 'b' (a removal)
      }else if ( (check < 0) ){
         output.remove.push(a[ai]);
         ai++;

      //[#] A strange case it this happens
      }else{
         $console.warn('What happened here? check[{0}], ai[{1}], bi[{2}]'.sprintf(check, ai, bi));
         break;
      }
   }

   return output;
};// ::arraySortDiff

uxfwk.arrayTransform = function (arr, transform){
   var output = null;

   if ( !angular.isFunction(transform) ){ throw new ReferenceError('Missing or invalid input argument[transform]'); }
   if ( angular.isArray(arr) ){
      output = [];
      for ( var i = 0, leni = arr.length; i < leni; ++i ){
         output.push(transform(arr[i]));
      }
   }else{ output = transform(arr); }
   return output;
};// ::arrayTransform

uxfwk.map2api = function (map, target, locals, include, exclude){
   for ( var p in map ){
      if ( map.hasOwnProperty(p) && angular.isFunction(map[p]) && (!angular.isArray(include) || (include.indexOf(p) >= 0)) && (!angular.isArray(exclude) || (-1 === exclude.indexOf(p))) ){
         target[p] = {}; map[p](target[p], locals);
      }
   }
   return target;
};// ::map2api

uxfwk.map2array = function (map, key, value, fnTransform){
   var output = [];

   //[#1.0] - Validate input arguments
   if ( $U(map) ){ throw new ReferenceError('NULL mandatory argument {map}'); }
   if ( $U(key) ){ throw new ReferenceError('NULL mandatory argument {key}'); }
   if ( $U(value) ){ throw new ReferenceError('NULL mandatory argument {value}'); }
   if ( !angular.isString(key) ){ throw new TypeError('Argument {key} MUST be a String object'); }
   if ( !angular.isString(value) ){ throw new TypeError('Argument {value} MUST be a String object'); }

   //[#2.0] - Pass a reference from each source do destination ONLY if property is in filter
   for ( var p in map ){
      if ( map.hasOwnProperty(p) && !$U(map[p]) ){
         var object = {};
         object[key] = p;
         object[value] = map[p];
         if ( angular.isFunction(fnTransform) ){
            output.push(fnTransform(object));
         }else{ output.push(object); }
      }
   }

   //[#3.0] - Returns the new filtered map
   return output;
};// ::map2array

/**
 * @description 
 * Method used to filter a hash table properties, returning a new hash table with only the properties listed. 
 * 
 * @param map hash table to be filtered
 * @param keyList list of properties allowed
 * @param replaceKeyList list optional list which allows translation of properties name
 */
uxfwk.mapFilter = function (map, keyList, replaceKeyList){
   var output = {}, offset = -1;

   //[#1.0] - Validate input arguments
   if ( $U(map) ){ throw new ReferenceError('NULL mandatory argument {map}'); }
   if ( $U(keyList) ){ throw new ReferenceError('NULL mandatory argument {keyList}'); }
   if ( !angular.isArray(keyList) ){ throw new TypeError('Argument {keyList} MUST be an Array object'); }
   if ( 0 == keyList.length ){ return output; }// if filter is empty, then output MUST be an empty map

   //[#2.0] - Pass a reference from each source do destination ONLY if property is in filter
   for ( var p in map ){
      if ( map.hasOwnProperty(p) && ((offset = keyList.indexOf(p)) >= 0) ){
         if ( $U(replaceKeyList) || $U(replaceKeyList[offset]) ){
            output[p] = map[p];
         }else{ output[replaceKeyList[offset]] = map[p]; }
      }
   }

   //[#3.0] - Returns the new filtered map
   return output;
};// ::mapFilter

uxfwk.map2keys = function (map, keyFilter, transform){
   var output = [], excludes = null;;

   //[#1.0] - Validate input arguments
   if ( !angular.isObject(map) ){ throw new TypeError('Argument {map} MUST be an object'); }
   transform = transform || uxfwk.$identity;

   //[2.0] Iterates though all own properties, checks for exclusions and
   // appends tranformed key to output list of keys
   for ( var p in map ){
      if ( map.hasOwnProperty(p) && !$U(map[p]) && (!excludes || (angular.isArray(excludes) && (excludes.indexOf(p) < 0))) ){
         output.push(transform(p));
      }
   }

   return output;
};// ::map2keys

uxfwk.mapGroupBoolean = function (map, keyList){
   var output = {}, keyIsMap = false;

   //[#1.0] - Validate input arguments
   if ( $U(map) ){ throw new ReferenceError('NULL mandatory argument {map}'); }
   if ( $U(keyList) ){ throw new ReferenceError('NULL mandatory argument {keyList}'); }
   keyIsMap = !angular.isArray(keyList);

   //[#2.0] - For each group, check if at least one key exists
   for ( var p in map ){
      if ( map.hasOwnProperty(p) ){
         output[p] = false;
         for ( var i = 0, leni = map[p].length; i < leni; ++i ){
            // if flag became true, no need for further lookups
            if ( !keyIsMap && keyList.indexOf(map[p][i]) >= 0 ){
               output[p] = true; break;
            }else if ( !$U(keyList[map[p][i]]) ){
               output[p] = true; break;
            }
         }
      }
   }

   //[#3.0] - Returns the new map grouped
   return output;
};// ::mapGroupBoolean

uxfwk.promiseList = function (){
   var promises = [];

   return {
      push:   function (promise){ promises.push(promise); return promise; },
      cancel: function (){
         for( var i = 0, leni = promises.length; i < leni; ++i ){
            if ( !uxfwk.$U(promises[i].cancel) ){ promises[i].cancel('Canceled promise'); }
         }
         promises = [];
      }
   }
};// ::promiseList

uxfwk.promiseAll = function (creators, args, bAllowErrors){
   var $q = angular.element(document).injector().get('$q');
   var promises = uxfwk.promiseList();
   var creatorList = [], responses = [];
   var defer = $q.defer(), count = 0;

   //[#1.0] - Validates input arguments
   if ( !creators || !args ){ throw new ReferenceError('NULL input arguments'); }
   if ( !angular.isArray(args) || (0 == args.length) ){ throw new TypeError('Argument {args} MUST be a non empty Array object'); }
   if ( angular.isArray(creators) && (0 == creators.length) ){ throw new TypeError('Argument {creators} MUST be a non empty Array object'); }
   if ( angular.isArray(creators) && (creators.length != args.length) ){ throw new ArgumentError('Though {creators} is an Array object, {creators} and {args} lengths mismatch ({0} vs {1})'.sprintf(creators.length, args.length)); }

   //[#2.0] - For convenience, creators list will become an array with the same size as args (whenever creators was before)
   if ( !angular.isArray(creators) ){ for ( var i = 0, leni = args.length; i < leni; i++ ){ creatorList.push(creators); } }
   else{ creatorList = creators; }

   //[#3.0] - Iterate for each promise (requests are made all at once)
   for ( var i = 0, leni = creatorList.length; i < leni; ++i ){
      (function(idx){
         promises.push(creatorList[idx](args[idx]))
         .then(function(response){
            if ( (++count) == creatorList.length ){ defer.resolve(responses); }
            responses[idx] = response;
         })
         .catch(function(response){
            if ( (++count) == creatorList.length ){
               if ( true === bAllowErrors ){ defer.resolve(responses); }
               else{ defer.reject(responses); }
            }
            responses[idx] = response;
         })
      })(i);
   }
   defer.promise.cancel = promises.cancel;

   //[#4.0] - Returns the umbrella promise
   return defer.promise;
};// ::promiseAll

uxfwk.regExpEscapeChars = function (str) {
   return new RegExp(str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "gi");
};// ::regExpEscapeChars

uxfwk.trim = function(subject, tokens){
   var regexp = null;

   if ( $U(subject) ){ return null; }
   tokens = tokens || '\s';
   regexp = new RegExp('^{0}+|{0}+$'.sprintf(tokens), 'g');
   return subject.replace(regexp, '');
};// ::trim
angularAMD.filter('trim', [function trim (){return function (value, tokens){ return uxfwk.trim(value, tokens); }}]);

/*
uxfwk.trim = function(){ return this.replace(/^\s+|\s+$/g,""); }
uxfwk.ltrim = function(){ return this.replace(/^\s+/,""); }
uxfwk.rtrim = function(){ return this.replace(/\s+$/,""); }
*/

/*!
 * uxfwk.utils
 * A namespace containing utils for the rest of the uxfwk library
 */
uxfwk.utils = {};

angularAMD.factory('uxfwk', [function (){
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/** 
 * @description 
 * This function is quite simple. This function is to be used to return a cached object. In angular 
 * this is important because digest cycles depends on stabilization to end corretly. The only thing 
 * that it does is check if object is already cached, if not cache and returns it; if cached just 
 * returns it.
 * 
 * @param placeholder object JSON to extend with a cache object
 * @param attribute attribute to be used on placeholder as a key to cached object
 * @param object object to be cached 
 * @param checker function to be used as a checker for cache validity 
 */
uxfwk.cache = function (placeholder, attribute, object, checker){
   if ( $U(placeholder) ){ throw new ReferenceError('Missing mandatory argument [placeholder]'); }
   if ( $U(attribute) ){ throw new ReferenceError('Missing mandatory argument [attribute]'); }
   if ( $U(object) ){ throw new ReferenceError('Missing mandatory argument [object]'); }

   if ( $U(checker) ){
      if ( !$U(placeholder[attribute]) && !$U(placeholder[attribute].object) ){
         return placeholder[attribute].object;
      }else{
         placeholder[attribute] = { object: object, value: null };
         return placeholder[attribute].object;
      }
   }else{
      if ( !$U(placeholder[attribute]) && !$U(placeholder[attribute].object) && (placeholder[attribute].value == checker(placeholder)) ){
         return placeholder[attribute].object;
      }else{
         placeholder[attribute] = { object: object, value: checker(placeholder) };
         return placeholder[attribute].object;
      }
   }
   return null;
};// ::cache

uxfwk.merge = function (destination, source){
   if ( $U(destination) ){ throw new ReferenceError('Missing mandatory argument [destination]'); }
   if ( $U(source) ){ throw new ReferenceError('Missing mandatory argument [source]'); }
   if ( angular.isArray(destination) && !angular.isArray(source) ){ throw new ArgumentError('Arguments mismatch, destination is Array but source is not!'); }
   if ( !angular.isArray(destination) && angular.isArray(source) ){ throw new ArgumentError('Arguments mismatch, source is Array but destination is not!'); }

   if ( angular.isArray(destination) ){
      for ( var i = 0, leni = source.length; i < leni; ++i ){
         if ( angular.isArray(source[i]) ){
            destination[i] = uxfwk.merge(destination[i] || [], source[i]);
         }else{
            destination[i] = uxfwk.merge(destination[i] || {}, source[i]);
         }
      }
   }else{
      for ( var key in source ){
         if ( '$' === key.charAt(0) ){ continue; }// bypass any attribute which name begins with '$'
         if ( ('id' == key) || ('aid' == key) ){ destination[key] = angular.copy(source[key]); continue; }
         if ( source.hasOwnProperty(key) ){
            if ( angular.isArray(source[key]) ){
               destination[key] = angular.copy(source[key]);
            }else if ( angular.isObject(source[key]) ){
               destination[key] = uxfwk.merge(destination[key] || {}, source[key]);
            }else{
               destination[key] = source[key];
            }
         }
      }
   }
   return destination;
};// ::merge

uxfwk.clean = function (destination, source, attribute, exclude, explicit){
   if ( $U(destination) ){ throw new ReferenceError('Missing mandatory argument [destination]'); }
   if ( $U(source) ){ throw new ReferenceError('Missing mandatory argument [source]'); }
   if ( angular.isArray(destination) && !angular.isArray(source) ){ throw new ArgumentError('Arguments mismatch, destination is Array but source is not!'); }
   if ( !angular.isArray(destination) && angular.isArray(source) ){ throw new ArgumentError('Arguments mismatch, source is Array but destination is not!'); }

   if ( angular.isArray(destination) ){
      for ( var i = 0, leni = source.length; i < leni; ++i ){
         destination[i] = uxfwk.merge(angular.copy(source[i], {}), destination[i] || {});
         if ( !$U(source[i][attribute]) ){
            destination[i] = uxfwk.clean(destination[i], source[i][attribute], null, exclude);
         }
      }
   }else{
      for ( var key in source ){
         if ( (angular.isArray(exclude) && (exclude.indexOf(key) >= 0)) ){ destination[key] = angular.copy(source[key]); continue; }
         if ( (angular.isArray(explicit) && (explicit.indexOf(key) >= 0)) ){ delete destination[key]; continue; }
         if ( ('$' === key.charAt(0)) ){ continue; }// bypass any attribute which name begins with '$'
         if ( ('id' == key) || ('aid' == key) ){ destination[key] = angular.copy(source[key]); continue; }
         if ( source.hasOwnProperty(key) ){
            if ( angular.isArray(source[key]) && ($U(destination[key]) || !angular.equals(destination[key], source[key])) ){
               destination[key] = angular.copy(source[key]);
            }else if ( angular.isObject(source[key]) && ($U(destination[key]) || !angular.equals(destination[key], source[key])) ){
               $console.debug('check', destination[key], source[key])
               destination[key] = uxfwk.clean(destination[key] || {}, source[key]);
               //destination[key] = uxfwk.merge(source[key], destination[key] || {});
            }else if ( !angular.equals(destination[key], source[key]) ){
               $console.debug('???', key)
            }else{
               $console.debug('delete', key)
               delete destination[key];
            }
         }
      }
   }
   return destination;
};// ::clean

/**
 * @description
 * This method should be used when an object requires to be completed overwrited by other, but the original reference MUST be preserved. 
 * The algorithm is a clear of all owned properties followed by a deep merge. 
 * 
 * @param target 
 * @param destination 
 */
uxfwk.overwrite = function (target, source){
   //[#1.0] Validate input arguments
   if ( !angular.isObject(target) ){ throw new ReferenceError('Mandatory argument [target] MUST be an object'); }
   if ( !angular.isObject(source) ){ throw new ReferenceError('Mandatory argument [source] MUST be an object'); }

   //[#2.0] Clears all owned properties
   for ( var key in target ){ if ( target.hasOwnProperty(key) ){ delete target[key]; } }

   //[#3.0] Merge properties form source object to target
   uxfwk.merge(target, source);

   return target;
};// ::overwrite

// see AngularJS $injector documentation for details of Injection Function Annotation
// bottom line, a Annotation is an array where all (n-1) first elements are strings, and the last one is a function (it is not possible to check anything else)
uxfwk.isAnnotation = function (object){
   if ( !angular.isArray(object) ){ return false; }
   for ( var i = 0, leni = object.length - 1; i < leni; ++i ){ if ( !angular.isString(object[i]) ){ return false; } }
   if ( !angular.isFunction(object[object.length - 1]) ){ return false; }
   return true;
};// ::isAnnotation

uxfwk.isPromise = function (object){
   if ( $U(object) ){ return false; }
   if ( !angular.isFunction(object.then) ){ return false; }
   if ( !angular.isFunction(object.catch) ){ return false; }
   if ( !angular.isFunction(object.finally) ){ return false; }
   return true;
};// ::isPromise

uxfwk.isEmpty = function (object, excludes){
   excludes = excludes || [];
   for ( var p in object ){
      if ( object.hasOwnProperty(p) && (excludes.indexOf(p) < 0) ){
         return false;
      }
   }
   return true;
};// ::isEmpty

uxfwk.isBoolean = function (object){
   return ((true === object)||(false === object));
};// ::isBoolean

/**
 * @description 
 * Method to truncate a numeric value between an interval defined by 
 * [thLower, ..., thHigher].
 * If valLower or valHigher, then the truncage will be to those values rather 
 * than the ones defining the interval.
 *  
 * @param value 
 * @param thLower 
 * @param thHigher 
 * @param valLower 
 * @param valHigher 
 */
uxfwk.limit = function (value, thLower, thHigher, valLower, valHigher){
   if ( $U(value) ){ return value; }
   if ( !angular.isNumber(value) ){ return value; }

   if ( value <= thLower ){ return $U(valLower)?(thLower):(valLower); }
   else if ( value >= thHigher ){ return $U(valHigher)?(thHigher):(valHigher); }
   return value;
};// ::limit

return uxfwk;
}]);


angularAMD.filter('uxfwkKeyByValue', [function(){ return uxfwk.utils.getKeyByValue; }]);

angularAMD.filter('uxfwkIntegerGroup', [function(){ return function uxfwkIntegerGroup (input, size, token){
   var threshold = 100;
   var output = '---';

   size = size || 3;
   token = token || ' ';
   if ( input || (0 == input) ){
      var rx = new RegExp("([\\d\\w]+)([\\d\\w]{" + size + "})");
      var it = 0;

      output = input.toString(10);
      while ( rx.test(output) && (it < threshold) ){
         output = output.replace(rx, '$1' + token + '$2'); it++;
      }
      if ( threshold == it ){ throw new EvalError('Possible infinite loop stoped! Regular expression iteration reached loop threshold[{0}]'.sprintf(threshold));}
   }
   return output;
};}])//uxfwkIntegerGroup

.filter('uxfwkInteger2FloatString', ['appUtilities', function uxfwkInteger2FloatString (appUtilities){
var $U = appUtilities.$u.$U;

return function (input, power10, decDigits){
   var output = '---';

   if ( $U(input) ){ return '---'; }
   if ( angular.isString(input) && input.match(/inf/gi) ){ return input; }
   power10   = power10 || 1;
   decDigits = decDigits || 0;
   if ( !$U(input) ){
      output = (input / power10).toFixed(decDigits);
   }
   return output;
}}])// ::uxfwkInteger2FloatString

/**
 * @ngdoc filter
 *
 * @description
 * Check if value is defined and if not, sets a default value of '---'
 *
 * @returns {string}
 */
.filter('uxfwkNullHider', ['$filter', 'appUtilities', function uxfwkNullHider ($filter, appUtilities){ return function (value){
   var $U = appUtilities.$u.$U;
   function vshack (){ vshack.catch(); };// SlickEdit hack to make IDE see usefull functions, after this line all members are visible do IDE
   if ( $U(value) || (value === "") ) { return '---'; }
   else { return value; }
}}]);// end of filter

angularAMD.directive('uxfwkStatusHider', ['$parse', function uxfwkStatusHider ($parse){

function getData(){ return this.data.data[this.data.attr]; }
function isLoading(){ return ($U(this.getData())||(true === this.getData())); }
function isEmpty(){ return (false === this.getData()); }
function isDone(){ return ((!this.isLoading())&&(!this.isEmpty())); }

return {
   template: '<i class="uxfwkicons-spinning" data-ng-if="$$$$uxfwkStatusHider.isLoading()"></i><div data-ng-if="$$$$uxfwkStatusHider.isEmpty()">---</div><div data-ng-transclude data-ng-if="$$$$uxfwkStatusHider.isDone()"></div>',
   compile: function ($element, $attrs){
      var fnParse = $parse($attrs.uxfwkStatusHider);

      return function link ($scope, $element, $attrs){
         $scope.$$$$uxfwkStatusHider = {
            isLoading: isLoading,
            isEmpty:   isEmpty,
            isDone:    isDone,
            getData:   getData,
         data: fnParse($scope)};
      };// ::link
   },// ::compile
   transclude: true,
restrict:'A'};
}]);// endof uxfwkStatusHider

angularAMD.factory('uxfwk.utils', ['$q', '$timeout', function utils ($q, $timeout){
   var utils = uxfwk;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

utils.processRestException = function (response, userdata, options){
   var bTreatRemovalErrorAsOk = $U(options)?(false):(options.bTreatRemovalErrorAsOk || false);
   var bSuccess = false;
   var errors = [];

   if ( $U(response) ){ errors = [(new InvalidJsonDocumentError('Unknown exception: response is NULL'))]; }
   else if ( response instanceof AbortHttpRequestError ){ errors = [response]; userdata = response; }
   else if ( $U(response.data) || (response instanceof Error) ){ errors = [(new InvalidJsonDocumentError(response.toString()))]; }
   else if ( !$U(response.data) && !$U(response.data.message) ) {
      response.data.toString = function(){
         var message = this.message;
         if ( !$U(this.stacktrace) ){
            var more = this.stacktrace.match(/message=(.*)\./);
            if ( angular.isArray(more) && (more.length > 1) ){
               message = message + ' ' + more[1];
            }
         }
         return message;
      };
      errors = [response.data];
   }
   else{ errors = [(new Error('HTTP ERROR{0} - {1}'.sprintf(response.status, response.message || response.cause || response.data.message || response.data.cause)))]; }

   if ( (true == bTreatRemovalErrorAsOk) && !$U(response) && (404 == response.status) ){ bSuccess = true; }
   return { success: bSuccess, data: userdata, errors: errors };
};// ::utils::processRestException

   function promisesChain (data, cbCreatePromise){
      var defer = $q.defer();
      var responses = [];
      var i = 0;

      var _cbProcess = function(args){
         responses.push(args);
         if ( (++i) < data.length ){
            cbCreatePromise(data[i]).then(_cbProcess);
         }else{
            defer.resolve(responses);
         }
      };// _cbProcess

      cbCreatePromise(data[i])
         .then(_cbProcess)
         .catch(_cbProcess);

      return defer.promise;
   };// promisesChain

   function isNullOrUndefined (object){
      return ((null == object) || (undefined == object));
   };// isNullOrUndefined

   function forprint (json, format){
      var output = [];
      for ( var key in json ){
         if ( json.hasOwnProperty(key) && angular.isDefined(json[key]) ){ output.push(format.sprintf(key, json[key])); }
      }
      return output;
   };// forprint

   uxfwk.toArray = function (object){
      var arr = [];

      if ( isNullOrUndefined(object.length) || (0 == object.length) ){ return []; }
      else{ for ( var i = 0, leni = object.length; i < leni; i++ ){ arr.push(object[i]); }}

      return arr;
   };// toArray

   uxfwk.toHex = function (tNumber, tLength){
      var value = tNumber, res = "", val;

      if ( $U(tNumber) ){ throw new ReferenceError('Missing mandatory argument [tNumber]'); }
      while ( 0 != value ){
         val = value & 0xFFFF;
         val = val.toString(16).toUpperCase();
         while ( val.length < tLength ){ val = "0" + val; }
         value = value >>> 16;
         res = val + res;
      }
      while ( res.length < tLength ){ res = "0" + res; }
      return res;
   };// ::toHex

   uxfwk.toInt = function (sValue, base){
      if ( angular.isArray(sValue) ){
         for ( var i = 0, leni = sValue.length; i < leni; ++i ){ sValue[i] = uxfwk.toInt(sValue[i], base); }
         return sValue;
      }else{
         base = base || 10;
         if ( 10 == base ){ return (sValue * 1); }
         else{ return parseInt(sValue, base); }
      }
   };// toInt
   
   uxfwk.toGroup = function (input, size, token){
      var threshold = 100;
      var output = '---';

      size = size || 3;
      token = token || ' ';
      if ( input || (0 == input) ){
         var rx = new RegExp("([\\d\\w]+)([\\d\\w]{" + size + "})");
         var it = 0;

         output = input.toString(10);
         while ( rx.test(output) && (it < threshold) ){
            output = output.replace(rx, '$1' + token + '$2'); it++;
         }
         if ( threshold == it ){ throw new EvalError('Possible infinite loop stoped! Regular expression iteration reached loop threshold[{0}]'.sprintf(threshold));}
      }
      return output;
   };// toInt

   uxfwk.ipv4ToInt = function (ipv4Octects){
      var octects = ipv4Octects.split('.');
      var output = 0;
      
      output += (((octects[0] || 0)*1) << 24) & 0xFF000000;
      output += (((octects[1] || 0)*1) << 16) & 0xFF0000;
      output += (((octects[2] || 0)*1) <<  8) & 0xFF00;
      output += (((octects[3] || 0)*1) <<  0) & 0xFF;
      return output;
   };// ipv4ToInt

   uxfwk.intToIpv4 = function (ipv4Int){
      var octects = [0,0,0,0]
      var output = 0;
      
      octects[0] = ((ipv4Int*1) >> 24) & 0xFF;
      octects[1] = ((ipv4Int*1) >> 16) & 0xFF;
      octects[2] = ((ipv4Int*1) >>  8) & 0xFF;
      octects[3] = ((ipv4Int*1) >>  0) & 0xFF;
      output = '{0}.{1}.{2}.{3}'.sprintf(octects[0], octects[1], octects[2], octects[3]);
      return output;
   };// intToIpv4
   
   return{
      processRestException: utils.processRestException,
      promisesChain:    promisesChain,
      $U:               isNullOrUndefined,
      forprint:         forprint,
      toArray:          uxfwk.toArray,
      toHex:            uxfwk.toHex,
      toInt:            uxfwk.toInt,
      toGroup:          uxfwk.toGroup,
      intToIpv4:        uxfwk.intToIpv4,
      ipv4ToInt:        uxfwk.ipv4ToInt,
   p:null};
}]);

angularAMD.factory('uxfwk.dom.utils', [function(){

   function ancestor (element, tagname){
      var elem = angular.element(element);

      if ( 'body' == tagname ){ return document.body; }
      elem = elem[0]; while ( (document.body != elem) && (tagname != angular.lowercase(elem.tagName)) && elem.parentNode ){ elem = elem.parentNode; }
      if ( (document.body == elem) || !elem.parentNode ){ return null; }
      return angular.element(elem);
   };// ancestor

   function hasAttr (element, attr){
      var elem = angular.element(element)[0];
      return ((null != elem.getAttribute(attr)) && (undefined != elem.getAttribute(attr)));
   };// hasAttr

   function hide (element){
      angular.element(element)[0].style.display = 'none';
   };// hide

   function previous (element){
      return angular.element(angular.element(element)[0].previousSibling)
   };// previous

   function show (element){
      angular.element(element)[0].style.display = '';
   };// show

   function tagName (element){
      return angular.lowercase(angular.element(element)[0].tagName);
   };// tagName

   return{
      ancestor: ancestor,
      hasAttr:  hasAttr,
      hide:     hide,
      previous: previous,
      show:     show,
      tagName:  tagName,
   pad:null};
}]);

angularAMD.factory('uxfwk.dom.dimension', [function uxfwk_dom_dimension(){
   "use strict";

   //[#] - A precious help from http://www.quirksmode.org/dom/getstyles.html
   function fnGetStyleBoxProperty (element, prop){
      var box = ['top', 'right', 'bottom', 'left'];
      var boxProperty = {};

      //[#] - First IE way
      if ( element.currentStyle ){
         angular.forEach(box, function(b){
            var myprop = prop.supplant([b]).camelcase();

            boxProperty[b] = parseInt(element.currentStyle[myprop], 10) || 0;
         });

      //[#] - The others way
      }else{
         var p = document.defaultView.getComputedStyle(element, null);
         angular.forEach(box, function(b){
            var myprop = prop.supplant([b]);

            boxProperty[b] = parseInt(p.getPropertyValue(myprop), 10) || 0;
         });
      }
      return boxProperty;
   };// fnGetStyleBoxProperty

   function box (){
      var elem = this[0];
      var output = { offsetWidth:0, offsetHeight:0, width:0, height:0, outerWidth:0, outerHeight: 0, margin: [0,0,0,0], border: [0,0,0,0], padding: [0,0,0,0] };

      //[#] - Discards null elements or nodeText
      if ( !angular.isDefined(elem) || !angular.isDefined(elem.offsetParent) ){
         return output;
      }

      //[#] - offset = border + padding + w/h
      output.offsetWidth  = parseInt(elem.offsetWidth, 10);
      output.offsetHeight = parseInt(elem.offsetHeight, 10);
      //[#] - margin
      output.margin = fnGetStyleBoxProperty(elem, 'margin-{0}');
      //[#] - border
      output.border = fnGetStyleBoxProperty(elem, 'border-{0}-width');
      //[#] - padding
      output.padding = this.padding();
      //[#] - width/height
      output.width  = output.offsetWidth  - ((output.padding.left + output.padding.right) + (output.border.left + output.border.right));
      output.height = output.offsetHeight - ((output.padding.top + output.padding.bottom) + (output.border.top + output.border.bottom));
      //[#] - outer = offset + margin
      output.outerWidth  = output.offsetWidth  + (output.margin.left + output.margin.right);
      output.outerHeight = output.offsetHeight + (output.margin.top + output.margin.bottom);
      
      return output;
   };// box

   function height (h){
      if ( 0 == arguments.length ){
         return this.box().height;
      }else{
         this[0].style.height = h + 'px';
         return h;
      }
   };// height

   function padding (t, r, b, l){
      if ( 0 == arguments.length ){
         return fnGetStyleBoxProperty(this[0], 'padding-{0}');
      }else{
      }
   };// padding

   function width (w){
      if ( 0 == arguments.length ){
         return this.box().width;
      }else{
         this[0].style.width = w + 'px';
         return w;
      }
   };// width

   function maxWidth (w){
      if ( 0 == arguments.length ){
         throw new Error('Method is only a setter');
         return this.box().width;
      }else{
         this[0].style.maxWidth = w + 'px';
         return w;
      }
   };// maxWidth

   function minWidth (w){
      if ( 0 == arguments.length ){
         throw new Error('Method is only a setter');
         return this.box().width;
      }else{
         this[0].style.minWidth = w + 'px';
         return w;
      }
   };// minWidth

   function wrapper (element){
      var w = element;

      if ( null == element ){ return null; }
      if ( !w._uxfwkdomdimension ){
         w._uxfwkdomdimension = true;

         w.box      = box;
         w.height   = height;
         w.padding  = padding;
         w.width    = width;
         w.maxWidth = maxWidth;
         w.minWidth = minWidth;
      }
      return w;
   };// wrapper

   return wrapper;
}]);

angularAMD.factory('uxfwk.dom.wrapper', ['uxfwk.dom.traverse', 'uxfwk.dom.dimension', function uxfwk_dom_wrapper ($t, $d){
   'use strict';

   //[#1.0] - DOM tree navigation methods


   function hasAttr (attr){
      var elem = wrapper(this)[0];
      return ((null != elem.getAttribute(attr)) && (undefined != elem.getAttribute(attr)));
   };// hasAttr

   function hide (){
      this.dom().style.display = 'none';
   };// hide

   function id (value){
      if ( 0 == arguments.length ){
         return (wrapper(this)[0].id || undefined);
      }else{
         wrapper(this).attr('id', value);
         return value;
      }
   };// hide

   function last (){
      return wrapper(this[this.length - 1]);
   };// last


   function show (){
      this.dom().style.display = '';
   };// show

   function tagName (){
      return angular.lowercase(wrapper(this)[0].tagName);
   };// tagName

   function wrapper (element){
      var e = element;

      e = $t(e, wrapper);
      e = $d(e);
      e.id = id;
      return e;
   };// wrapper

   return wrapper;
}]);


angularAMD.directive('uxfwkEmail', function(){
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.uxfwkEmail = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (/[^@]+@[^\.]+\..+/.test(viewValue)) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});

angularAMD.directive('uxfwkIp', ['$parse',function uxfwkIp ($parse){
   return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl){
         ctrl.$validators.uxfwkIp = function (modelValue, viewValue){
            var isValid = true;
            var allowWildCard = $parse(attrs.uxfwkIpWildCard)(scope);

            if ( ctrl.$isEmpty(modelValue) ){
               // consider empty models to be valid
               isValid = true;
            }
            else if (!$U(allowWildCard) && allowWildCard){
               if(!$U(modelValue.match(/[^\d.]/))){
                  return false;
               }else{ return true;}
            }
            else if ( !modelValue.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) ){
               // it is invalid
               isValid = false;
            }
            else{
               var countLesser = 0, countGreater = 0, count0s = 0, count255s = 0;
               var args = modelValue.split('.');

               if ( 4 != args.length ){ isValid = false; }
               else{
                  for ( var i = 0; i < 4; ++i ){
                     args[i] = args[i] * 1;
                     if ( args[i] < 0 ){ countLesser++; }
                     if ( 0 == args[i] ){ count0s++; }
                     if ( 255 == args[i] ){ count255s++; }
                     if ( args[i] > 255 ){ countGreater++; }
                  }
                  if ( (countGreater > 0) || (countLesser > 0) ){ isValid = false; }
                  else if ( 4 == count255s ){ isValid = false; }
                  else if ( 4 == count0s ){ isValid = false; }
               }
            }

            // it is valid
            //console.info('uxfwkIp::isValid', isValid, angular.toJson(ctrl));
            return isValid;
         };
      }
   };
}]);

angularAMD.directive('uxfwkHexadecimal', ['$parse', function uxfwkHexadecimal ($parse){

   function textualize ($modelValue){
      if ( $modelValue < -1000 ){ return '---'; }
      return (($modelValue || 0)*0.1).toFixed(1);
   };// ::@textualize

   function formatter ($modelValue, length){
      if ( $U($modelValue) ){ return null; }
      return ('0x' + uxfwk.toHex($modelValue, length));
   };// ::@formatter

   function parser ($viewValue){
      var output = parseInt(($viewValue || '').replace(/0x/,''), 16);

      if ( true === isNaN(output) ){ output = $viewValue; }
      return output;
   };// ::@parser

   return{
      restrict: 'A',
      require: ['?ngModel'],
      compile: function (tElement, tAttrs){
         var fnData = $parse(tAttrs.uxfwkHexadecimal);

         return function link (tScope, tElement, tAttrs, tControllers){
            var ngModel = tControllers[0];
            var mydata = fnData(tScope);

            //[#] This directive is only activated if input type is 'uxfwk-hexadecimal'
            if ( !$U(ngModel) ){
               ngModel.$formatters.push(function($modelValue){ return formatter($modelValue, 4); });
               ngModel.$parsers.push(parser);
            }else if ( !$U(mydata.expression) ){
               tScope.$watch(mydata.expression, function(newValue){ tElement.html(formatter(newValue, 4)); });
            }
         };// ::link
      }
   };
}]);// ::uxfwkInputHexadecimal

/**
 * @description
 * This service provides the validator to each generic rule defined on Wiki. Being a service enables specific rules to use generic rules for further specification.
 * 
 * @author nuno-r-farinha (24/04/2015)
 */
function uxfwkValidateRules (){
   var uxfwkValidateRules = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

uxfwkValidateRules.validateHex = function ($modelValue, $viewValue, $ngModel, options){
   if ( !$U($ngModel) && $ngModel.$isEmpty($modelValue) ){ return true; }// empty values are not considered as invalid
   if ( $modelValue.match(/^0x[0-9a-fA-F]*$/) ){ return true; }
   return false;
};// ::validateHex

uxfwkValidateRules.validateMac = function ($modelValue, $viewValue, $ngModel, options){
   var isValid = false;

   if ( $U($viewValue) || ('' == $viewValue) ){ return true; }
   if ( $modelValue.match(/^([a-fA-F0-9]{2,2})(:[a-fA-F0-9]{2,2}){5,5}/) ){ isValid = true; }
   return isValid;
};// ::validateMac

/**
 * @description
 * This validator MUST validate a value as a IPv4 address according to ETHVLN001.
 * @see Wiki::rule ETHVLN001
 */
uxfwkValidateRules.validateCtag = function ($modelValue, $viewValue, $ngModel, options, $directive){
   var isValid = false, value = -1;
   var min = 1, max = 4094;

   if ( !$U($directive) && !$U($directive.$scope) && !$U($directive.$scope.$$$$validateVlan) ){
      min = $directive.$scope.$$$$validateVlan.min; max = $directive.$scope.$$$$validateVlan.max;
   }else if ( !$U($directive) && !$U($directive.$scope) && !$U($directive.$attrs) && !$U($directive.$parse) ){
      $directive.$scope.$$$$validateVlan = {};
      if ( !$U($directive.$attrs.$attr['ngMin']) ){ min = $directive.$parse($directive.$attrs.$attr['ngMin'])($directive.$scope) || min; }
      if ( !$U($directive.$attrs.$attr['ngMax']) ){ max = $directive.$parse($directive.$attrs.$attr['ngMax'])($directive.$scope) || max; }
      $directive.$scope.$$$$validateVlan.min = min; $directive.$scope.$$$$validateVlan.max = max;
   }
   if ( $U($viewValue) || ('' == $viewValue) ){ return true; }
   if ( $viewValue.match(/^[0-9]*$/) ){ isValid = true; }
   value = $viewValue*1;
   if ( (value < min) || (value > max) ){ return false; }
   return isValid;
};// ::validateCtag

/**
 * @description
 * This validator MUST validate a value as a IPv4 address according to IPADDR001.
 * @see Wiki::rule IPADDR001
 */
uxfwkValidateRules.validateIpv4Addr = function ($modelValue, $viewValue, $ngModel, options){
   var octets = null;

   if ( $ngModel.$isEmpty($modelValue) ){ return true; }// empty values are not considered as invalid
   if ( !$modelValue.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) ){ return false; }// if is not complete and with only digits, is invalid
   octets = $modelValue.split('.');
   if ( 4 != octets.length ){ return false; }// a fail proof, but rather redundant
   else{
      for ( var i = 0; i < 4; ++i ){
         var octet = octets[i]*1;
         if ( octet < 0 ){ return false; }// no negative octets allowed
         if ( octet > 255 ){ return false; }// octet may only have one byte storage
      }
   }
   return true;
};// ::validateIpv4Addr

/**
 * @description
 * This validator MUST validate a value as a IPv6 address according to IPADDR003.
 * @see Wiki::rule IPADDR003
 */
uxfwkValidateRules.validateIpv6Addr = function ($modelValue, $viewValue, $ngModel, options){
   var query = null, blocks = null, words = null, count = 0;

   if ( $ngModel.$isEmpty($modelValue) ){ return true; }// empty values are not considered as invalid
   if ( !$U(query = $modelValue.match(/::/g)) && (query.length > 1) ){ return false; }// only one '::' token may exists
   if ( !$U(query = $modelValue.match(/:::/g)) ){ return false; }// token ':::' should never appear (this is a complement to the previous one)
   blocks = $modelValue.split(/::/);
   for ( var i = 0, leni = blocks.length; i < leni; ++i ){
      if ( '' != blocks[i] ){
         words = blocks[i].split(/:/);
         count += words.length;
         for ( var j = 0, lenj = words.length; j < lenj; ++j ){
            if ( true != uxfwkValidateRules.validateHex('0x' + words[j], '0x' + words[j], null, null) ){ return false; }// if a word is not a valid hexadecimal value, return invalid
         }
      }
   }
   if ( (8 == count) && (blocks.length > 1) ){ return false; }// there is a '::' but 8 words were counted, it make no sense
   if ( count > 8 ){ return false; }// no more than 8 words may exist on address
   return true;
};// ::validateIpv6Addr

/**
 * @description
 * This validator MUST validate a value as a IP address according to IPADDR001 or IPADDR003.
 * @see Wiki::rule IPADDR001 | IPADDR003
 */
uxfwkValidateRules.validateIpAddr = function ($modelValue, $viewValue, $ngModel, options){
   return (uxfwkValidateRules.validateIpv4Addr($modelValue, $viewValue, $ngModel, options) || uxfwkValidateRules.validateIpv6Addr($modelValue, $viewValue, $ngModel, options));
};// ::validateIpAddr

/**
 * @description
 * This validator checks if value is a valid IPv4 multicast address (which means, first octet must be in range 224-239)
 * @see Wiki::rule IPADDR005
 */
uxfwkValidateRules.validateIpv4AddrMulticast = function ($modelValue, $viewValue, $ngModel, options, $directive){ var output = true, tokens = null;
   if ( $ngModel.$isEmpty($modelValue) ){ output = true; }

   // [#] - Allow default value (0). If so, the last ((tokens >= 224) && (tokens <= 239)) validation wont be made
   if ( !$U($directive) && !$U($directive.$attrs) && !$U($directive.$attrs.$attr['uxfwkIpv4AddrMulticastAllowDefault']) && (true === $directive.$parse($directive.$attrs['uxfwkIpv4AddrMulticastAllowDefault'])($directive.$scope)) ){
      return true;
   }else if ( !$U(tokens = (''+$modelValue).split('.')) && (4 == tokens.length) ){
      tokens = tokens[0]*1;
      output = (tokens >= 224) && (tokens <= 239);
   }
   return output;
};// ::validateIpv4AddrMulticast

/**
 * @description
 * This validator MUST validate a string according to rule NUMBER001.
 * @see Wiki::rule STRING001
 */
uxfwkValidateRules.validatePercentage = function ($modelValue, $viewValue, $ngModel, options){
   var value = 0;

   if ( $ngModel.$isEmpty($modelValue) ){ return true; }// empty values are not considered as invalid
   if ( !$U($viewValue.match(/[^\d]/g)) ){ return false; }
   value = $viewValue*1;
   if ( (value < 0) || (value > 100) ){ return false; }
   return true;
};// ::validatePercentage

/**
 * @description
 * This validator MUST validate a string according to rule STRING001.
 * @see Wiki::rule STRING001
 */
uxfwkValidateRules.validateReservedChars = function ($modelValue, $viewValue, $ngModel, options, $directive){
   if ( $ngModel.$isEmpty($modelValue) ){ return true; }// empty values are not considered as invalid
   if ( !$U($directive.$attrs.extraReservedChars) && !$U(angular.lowercase($modelValue).match(new RegExp($directive.$attrs.extraReservedChars.split('').join('|'), "g"))) ){
      return false;
   }
   return $U($modelValue.match(/&|'|<|>|"|\?|%|:|\/|#|;/g));
};// ::validateReservedChars

/**
 * @description
 * This validator MUST validate a string according to rule.
 * @see Wiki::rule STRING001
 */
uxfwkValidateRules.validatePrintableAsciiChars = function ($modelValue, $viewValue, $ngModel, options, $directive){
   if ( !$U($ngModel) && $ngModel.$isEmpty($modelValue) ){ return true; }// empty values are not considered as invalid
   return $U($modelValue.match(/([^\x20-\x7F])/));
};// ::validatePrintableAsciiChars

/**
 * @description
 * This validator MUST validate a string according to the rules of GPON equipments .
 * @see Wiki
 */
uxfwkValidateRules.validateGponReservedChars = function ($modelValue, $viewValue, $ngModel, options){
   if ( $ngModel.$isEmpty($modelValue) ){ return true; }// empty values are not considered as invalid
   return $U($modelValue.match(/([^., +_*()0-9a-zA-Z\/-])/));
};// ::validateGponReservedChars

return uxfwkValidateRules;
};// endof uxfwkValidateRules
(function(){
   var validators = uxfwkValidateRules();

   angularAMD.factory('uxfwkValidateRules', [uxfwkValidateRules]);// ::uxfwkValidateRules
   function createWrapperDirective (directiveName, methodName){
      angularAMD.directive(directiveName, ['$parse', function ($parse){
         return { link: function ($scope, $element, $attrs, $ctrl){
            $ctrl.$validators[directiveName] = function($modelValue, $viewValue){ return validators[methodName]($modelValue, $viewValue, $ctrl, null, { $scope: $scope, $attrs: $attrs, $parse: $parse }); }
            //validators[methodName]($modelValue, $viewValue, $ctrl, null, $scope, $element, $attrs);
         },require: 'ngModel'};
      }]);
   };
   for ( var m in validators ){
      if ( validators.hasOwnProperty(m) ){
         createWrapperDirective('uxfwk' + m.properCase(), m);
      }
   }
   uxfwk.uxfwkValidateRules = validators;
})();// loadup service and directive wrappers

/**
 * @description
 * This directive implements validation over a IPv4 mask. Validation is applied 
 * only over complete IPv4 values (which means: all 4 octets MUST be defined and 
 * non empty). 
 * @see Wiki::rule IPADDR004. 
 * 
 */
angularAMD.directive('uxfwkValidateIpv4Mask', ['$parse', function uxfwkValidateIpv4Mask ($parse){

   function validator ($modelValue, $viewValue, $scope){
      var ngModel = $scope.$$$$uxfwkValidateIpv4Mask.ngModel;
      var octets = null, octet = 0;
      var leni = 4, i = 0, j = 0;

      if ( ngModel.$isEmpty($modelValue) ){ return true; }// empty values are not considered as invalid
      else if ( 4 != (octets = $modelValue.split('.')).length ){ return true; }// incomplete mask (missing octets) is not invalid
      else if ( '' === octets[3] ){ return true; }// special case, not invalid if last octet is still empty
      else{
         for ( ; (i < leni) && (0xFF == octets[i]*1); ++i );
         if ( i >= leni ){ return true; }// assume that 255.255.255.255 is allways a valid mask
         else if ( 0 != octets[i]*1 ){// the boundary block octect is not a full NULL octet, bitwise analysis is required
            octet = octets[i]*1;
            for ( j = 0; (j < 8) && (octet & (0x80 >> j)); ++j );
            if ( j >= 8 ){ $console.warn('A strange conclusion...see these octets', octets); return true; }// a strange conclusion, since octet should not be 255 by previous premises
            for ( ; (j < 8) && !(octet & (0x80 >> j)); ++j );
            if ( j < 8 ){ return false; }// there is not a continuous ending block of 0's (but a 0 was found)
         }
         if ( i < (leni - 1) ){
            for ( i++; (i < leni) && (0x00 == octets[i]*1); ++i );
            if ( i < leni ){ return false; }// there is not a continuous ending block of 0's (but a 0 was found)
         }
         //if ( 254 === (octets[3]*1) ){ return false; }// a special case, last octet SHOULD never be 254..which means that mask would make a subnet with no hosts available.
         return true;
      }
      $console.warn('Should not reached this point...', $modelValue, octets);
      return false;
   };// ::@validator

   return { link: function ($scope, $element, $attrs, $ctrl){

      $scope.$$$$uxfwkValidateIpv4Mask = { ngModel: $ctrl };
      $ctrl.$validators.uxfwkValidateIpv4Mask = function($modelValue, $viewValue){ return validator($modelValue, $viewValue, $scope); }

   },require: 'ngModel'};
}]);// ::uxfwkValidateIpv4Mask


angularAMD.directive('uxfwkValidateIpHost', [function uxfwkValidateIpHost (){

   function validator ($modelValue, $viewValue){
      var isValid = false, octets = null, octet0 = 0;

      if ( $U($viewValue) || ('' == $viewValue) ){ return true; }
      octets = $modelValue.split('.');
      if ( 4 != octets.length ){ return true; }// this validation is only for HOST, so it will not mark as invalid an incomplete address
      octet0 = octets[0]*1;
      if ( (1 <= octet0) && (126 >= octet0) ){// classA
         isValid = !(((0 == (octets[1]*1)) && (0 == (octets[2]*1)) && (0 == (octets[3]*1))) || ((255 == (octets[1]*1)) && (255 == (octets[2]*1)) && (255 == (octets[3]*1))));
      }else if ( (128 <= octet0) && (191 >= octet0) ){// classB
         isValid = !(((0 == (octets[2]*1)) && (0 == (octets[3]*1))) || ((255 == (octets[2]*1)) && (255 == (octets[3]*1))));
      }else if ( (192 <= octet0) && (223 >= octet0) ){// classC
         isValid = !(((0 == (octets[3]*1))) || ((255 == (octets[3]*1))));
      }else{ isValid = false; }

      return isValid;
   };// ::@validator

   return { link: function ($scope, $element, $attrs, $ctrl){
      $scope.$$$$uxfwkValidateIpHost = { ngModel: $ctrl };
      $ctrl.$validators.uxfwkValidateIpHost = validator;
   },require: 'ngModel'};
}]);// ::uxfwkValidateIpHost

angularAMD.directive('uxfwkValidateMac', [function uxfwkValidateMac (){

   function validator ($modelValue, $viewValue){
      var isValid = false;

      if ( $U($viewValue) || ('' == $viewValue) ){ return true; }
      if ( $modelValue.match(/^([a-fA-F0-9]{2,2})(:[a-fA-F0-9]{2,2}){5,5}/) ){ isValid = true; }
      return isValid;
   };// ::@validator

   return { link: function ($scope, $element, $attrs, $ctrl){
      $scope.$$$$uxfwkValidateMac = { ngModel: $ctrl };
      $ctrl.$validators.uxfwkValidateMac = validator;
   },require: 'ngModel'};
}]);// ::uxfwkValidateMac


angularAMD.directive('uxfwkReadonlyCheckbox', ['$interpolate', '$parse', 'appUtilities', function ($interpolate, $parse, appUtilities){

   function _interpolate(exp){ return ('{0} {1} {2}').sprintf($interpolate.startSymbol(), exp, $interpolate.endSymbol()); }

   var controller = ['$scope', '$element', '$attrs', function (tScope, tElement, tAttrs){
      var that = this;

      that.value      = null;
      that.checked    = false;
      that.trueValue  = true;
      that.falseValue = false;

      if ( !$U(tAttrs.ngTrueValue) ){ that.trueValue = $parse(tAttrs.ngTrueValue)(tScope); }
      if ( !$U(tAttrs.ngFalseValue) ){ that.falseValue = $parse(tAttrs.ngFalseValue)(tScope); }

      tScope.$watch(tAttrs.uxfwkReadonlyCheckbox, function(newValue, oldValue){
         that.checked = (newValue === that.trueValue); that.value = newValue;
         appUtilities.$w(tElement).children('input').dom().checked = that.checked;
      });

   }];// ::controller

   return {
      restrict: 'A',
      controller: controller,
      controllerAs: 'myMan',
      template:('<input class="input-sm" style="height:auto;margin-top:0px" type="checkbox" data-ng-disabled="true"'+
                '/>'),
      compile: function (tElement, tAttrs){
         return function link (tScope, tElement, tAttrs){};
      }
   };
}]);// ::uxfwkReadonlyCheckbox

angularAMD.directive('uxfwkLabelsReadOnly', [function() {
function fnPostLink ($scope, $elem, $attrs){};// fnPostLink
return {
   scope: {
      items: "=uxfwkLabelsReadOnly"
   },
   template: ("<span data-ng-repeat='item in items' class='ng-scope'>"+
      "<span class='ui-select-match-item btn btn-default btn-xs' tabindex='-1' type='button' disabled='disabled'>"+
      "<span><span class=''>{{item.name || item.text || item}}</span></span></span></span>"),
   link: fnPostLink,
   restrict: "A"};
}]);

angularAMD.directive('input', ['$parse', function uxfwkInputPrecisionAndScale ($parse){

   function formatter ($modelValue, factor, precision, scale, offset){
      return ((($modelValue || 0)/(factor * scale)) + offset).toFixed(precision);
   };// ::@formatter

   function parser ($viewValue, factor, scale, offset){
      var output = ($viewValue*1 - offset)*factor*scale;

      if ( true === isNaN(output) ){ output = $viewValue; }
      else{ output = Math.round(output); }
      return output;
   };// ::@parser

   return{
      restrict:'E',
      require: ['?ngModel'],
      compile: function (tElement, tAttrs){
         var fnPrecision = null, fnOffset = null, fnScale = null;

         if ( !$U(tAttrs.scale) ){ fnScale = $parse(tAttrs.scale); }
         if ( !$U(tAttrs.precision) ){ fnPrecision = $parse(tAttrs.precision); }
         if ( !$U(tAttrs.offset) ){ fnOffset = $parse(tAttrs.offset); }
         return function link (tScope, tElement, tAttrs, tControllers){
            var precision = null, offset = 0, scale = null, ngModel = null, factor = null;

            if ( $U(fnPrecision) && $U(fnScale) ){ return; }
            if ( $U(ngModel = tControllers[0]) ){ return; }

            if ( $U(fnScale) ){ scale = 1; }
            else{ scale = fnScale(tScope); }
            
            if ( $U(fnOffset) ){ offset = 0; }
            else{ offset = fnOffset(tScope); }

            precision = fnPrecision(tScope);
            factor = Math.pow(10, precision);
            ngModel.$formatters.push(function($modelValue){ return formatter($modelValue, factor, precision, scale, offset); });
            ngModel.$parsers.push(function($viewValue){ return parser($viewValue, factor, scale, offset); });
         };
      }
   };
}]);// ::uxfwkInputPrecision

/**
 * This directive pretends to be a more efficient and flexible way to translate 
 * JSON objects to text representation understandable by humans. It accepts a settings 
 * object with many options to control exactly how a JSON attribute object  should
 * be translated to human text. 
 * It may be used to translate any scalar value as well has any enumerator. Also, 
 * the setting object may be defined in such a way that allows it to be shared by many 
 * similar objects (such as list of same type interfaces). The HTML content of the tag 
 * where this directive resides, will be completely controlled by this attribute...so 
 * any other content will be lost.
 * Setting object definition 
 * { 
 *    expression: <string>                      this attribute is mandatory and it is the expression to be watched
 *    userdata:   <object|string>               any user data to be exposed on other callbacks used on this settings
 *    textualize: <function(value, userdata)>   Lookup handler that converts a value to a text
 *                                              If defined, it will be used as the base text converter before any other transformations are done
 *    isLoading:  <boolean|function(userdata)>  If defined, returns a boolean checking if a loading spinning should be shown
 * } 
 */
(function directiveUxfwkJsonTextualize (){angularAMD.directive('uxfwkJsonTextualize', ['$parse', function ($parse){

   function defaultTextualize(a){ return ($U(a)?('---'):(a)).toString(); }

   var controller = ['$scope', '$element', '$attrs', '$window', '$document', 'appUtilities', function (tScope, tElement, tAttrs, $window, $document, appUtilities){
      var that = this;

      that.isLoading    = null;// check if a loading icon should be show instead
      that.textualize   = defaultTextualize;
      that.userdata     = null;// to be used by any callback
      that.lastValue    = null;// cached value (updates everytime value watcher is triggered)

      tElement = appUtilities.$w(tElement);

      //[#] Called everytime JSON attribute changes value
      that.update = function (newValue, oldValue){
         var hastip = false, text = null;

         if ( angular.isFunction(that.isLoading) && (true === that.isLoading(that.userdata)) ){
            text = CONSTANTS.HTMLUXFWKSPINNING;
         }else if ( angular.isFunction(that.textualize) ){
            text = that.textualize(newValue, that.userdata); hastip = true;
         }
         if ( (true === text) || (false === text) ){
            text = CONSTANTS.HTMLUXFWKCHECKBOX(text);
            hastip = false;
         }

         //[#] Sets HTML content and native tooltip
         if ( (true === hastip) && (true !== that.settings.disableTooltip) ){ tElement.dom().title = text || ''; }
         tElement.dom().innerHTML = (text || '---');
         that.lastValue = newValue;
      };// ::update

      //[#] Adds a dblclick handler to easy text selection (specially when text overflows)
      tElement.dom().ondblclick = function (){
         var selection = null, range = null;

         if ( $document[0].body.createTextRange ){
            range = $document[0].body.createTextRange();
            range.moveToElementText(tElement.dom());
            range.select();
         }else if ( $window.getSelection && $document[0].createRange ){
            selection = $window.getSelection();        
            range = $document[0].createRange();
            range.selectNodeContents(tElement.dom());
            selection.removeAllRanges();
            selection.addRange(range);
         }
      };// ::selectText
   }];// controller

   return{
      scope: true,
      restrict:'A',
      controller: controller,
      require: ['uxfwkJsonTextualize'],
      compile: function (tElement, tAttrs){
         var fnSettings = $parse(tAttrs.uxfwkJsonTextualize);

         return function link (tScope, tElement, tAttrs, tControllers){
            var settings = fnSettings(tScope);
            var myCtrl = tControllers[0];

            //[#] Sets the base watcher on desired attribute
            if ( $U(settings.expression) ){ throw new ReferenceError('Mandatory attribute (settings.expression) missing!'); }
            tScope.$watch(settings.expression, myCtrl.update);

            //[#] Sets userdata if defined
            if ( !$U(settings.userdata) ){
               if ( angular.isString(settings.userdata) ){ myCtrl.userdata = $parse(settings.userdata)(tScope); }
               else{ myCtrl.userdata = settings.userdata; }
            }
            //[#] Passes settings to controller (after validated)
            if ( angular.isFunction(settings.textualize) ){ myCtrl.textualize = settings.textualize; }
            if ( angular.isFunction(settings.isLoading) ) { myCtrl.isLoading  = settings.isLoading; }

            //[#] If isLoading and userdata are both defined, a watcher is required to catch transitions
            //    of loading (since expression may be allways NULL, the change of load state must trigger
            //    a content update).
            if ( angular.isFunction(myCtrl.isLoading) && !$U(myCtrl.userdata) ){
               tScope.$watch(function(){ return myCtrl.isLoading(myCtrl.userdata); },
                  function(value){ myCtrl.update(myCtrl.lastValue); }
               );
            }

            if ( !$U(settings.watcher) ){
               tScope.$watch(settings.watcher, function(value){
                  if ( angular.isFunction(settings.onWatchChange) ){ settings.onWatchChange.call(myCtrl, tScope, value); }
                  myCtrl.update(myCtrl.lastValue);
               });
            }
            myCtrl.settings = settings;
         };
      }
   };
}]);})();// directive for textualize JSON attributes

(function directiveUxfwkButtonAuth (){angularAMD.directive('uxfwkButtonAuth', ['$parse', 'uxfwkSession', function ($parse, uxfwkSession){

   return{
      restrict:'A',
      compile: function (tElement, tAttrs){
         var fnSettings = $parse(tAttrs.uxfwkButtonAuth);

         return function link (tScope, tElement, tAttrs, tControllers){
            tScope.$watch(function(){ return fnSettings(tScope); }, function(newvalue){
               if ( true === uxfwkSession.checkpoint() ){ tElement.show(); }
               if ( !!newvalue ){ tElement.show(); }
               else{ tElement.hide(); }
            });
         };
      }
   };
}]);})();// directive for controlling button authorization


(function directiveUxfwkDatepickerPopup (){angularAMD.directive('uxfwkDatepickerPopup', ['$parse', function ($parse){
   var TEMPLATEHTML=('<div class="uxfwk-datepicker">'+
      '<div><input ttype="date" class="form-control" data-ng-model="uxfwkDatepickerPopup.model" data-uib-datepicker-popup data-datepicker-append-to-body="true" is-open="uxfwkDatepickerPopup.isOpen" '+
         'show-button-bar="false" data-ng-disabled="uxfwkDatepickerPopup.disabled" '+
         'dmin-date="minDate" dmax-date="\'2015-06-22\'"/></div>'+
      '<span class="input-group-btn">'+
         '<button type="button" class="btn btn-default" ng-click="uxfwkDatepickerPopup.toggle($event)" data-ng-disabled="uxfwkDatepickerPopup.disabled"><i class="glyphicon glyphicon-calendar"></i></button>'+
      '</span>'+
   '</div>');

   var controller = [function(){
      var that = this;

      that.model = null;
      that.isOpen = false;
      that.disabled = false;
      that.toggle = function($event){
         $event.preventDefault();
         $event.stopPropagation();
         that.isOpen = !that.isOpen;
      };
   }];// controller

   return{
      scope: true,
      restrict:'A',
      template: TEMPLATEHTML,
      controller: controller,
      controllerAs: 'uxfwkDatepickerPopup',
      compile: function (tElement, tAttrs){
         var sExpression = $parse(tAttrs.uxfwkDatepickerPopup);

         return function link (tScope, tElement, tAttrs, tControllers){
            var myCtrl = tScope.uxfwkDatepickerPopup;
            var expression = sExpression(tScope);
            var fnIsDisabled = uxfwk.$false;

            tElement.addClass('uxfwk-datepicker-wrapper');

            //[#1.0] - The following two watchers are required to support two-way data-binding between ngModel and this directive
            //[#1.1] - If anyone outside this directive, changes the value, this watcher listens directly to expression
            tScope.$watch(tAttrs.uxfwkDatepickerPopup, function(newvalue){
               myCtrl.model = newvalue;
            });
            //[#1.2] - The following watcher is required to export value if changed internally
            tScope.$watch(function(){ return myCtrl.model }, function(newvalue){
               if ( angular.isFunction(sExpression.assign) ){ sExpression.assign(tScope, newvalue); }
            });
            tAttrs.$observe('ngDisabled', function(value){
               var myexpression = $parse(value);
               fnIsDisabled = function(){ return myexpression(tScope); }
            });
            tScope.$watch(function(){ return fnIsDisabled(); }, function(newvalue){ myCtrl.disabled = newvalue; });
         };
      }
   };
}]);})();// wrapper directive for ui-bootstrap

(function directiveUxfwkTimepickerPopup (){angularAMD.directive('uxfwkTimepicker', ['$parse', function ($parse){
   var TEMPLATEHTML=('<div class="uxfwk-timepicker">'+
      '<div ttype="date" data-ng-model="uxfwkTimepicker.model" timepicker '+
         'data-ng-disabled="uxfwkTimepicker.disabled" show-meridian="false" '+
         'dmin-date="minDate" dmax-date="\'2015-06-22\'"></div>'+
   '</div>');

   var controller = [function(){
      var that = this;

      that.model = null;
      that.disabled = false;
   }];// controller

   return{
      scope: true,
      restrict:'A',
      template: TEMPLATEHTML,
      controller: controller,
      controllerAs: 'uxfwkTimepicker',
      compile: function (tElement, tAttrs){
         var sExpression = $parse(tAttrs.uxfwkTimepicker);

         return function link (tScope, tElement, tAttrs, tControllers){
            var expression = sExpression(tScope);
            var myCtrl = tScope.uxfwkTimepicker;
            var fnIsDisabled = uxfwk.$false;

            tElement.addClass('uxfwk-timepicker-wrapper');

            //[#1.0] - The following two watchers are required to support two-way data-binding between ngModel and this directive
            //[#1.1] - If anyone outside this directive, changes the value, this watcher listens directly to expression
            tScope.$watch(tAttrs.uxfwkTimepicker, function(newvalue){
               myCtrl.model = newvalue;
            });
            //[#1.2] - The following watcher is required to export value if changed internally
            tScope.$watch(function(){ return myCtrl.model }, function(newvalue){
               if ( angular.isFunction(sExpression.assign) ){ sExpression.assign(tScope, newvalue); }
            });
            tAttrs.$observe('ngDisabled', function(value){
               var myexpression = $parse(value);
               fnIsDisabled = function(){ return myexpression(tScope); }
            });
            tScope.$watch(function(){ return fnIsDisabled(); }, function(newvalue){
               var buttons = tElement.find('button');
               var inputs = tElement.find('input');
               var links = tElement.find('a');
               
               myCtrl.disabled = newvalue;
               for ( var i = 0, leni = buttons.length; i < leni; ++i ){ if ( true === myCtrl.disabled ){ buttons.eq(i).attr('disabled', 'true'); }else{ buttons.eq(i).removeAttr('disabled'); } }
               for ( var i = 0, leni = inputs.length; i < leni; ++i ){ if ( true === myCtrl.disabled ){ inputs.eq(i).attr('disabled', 'true'); }else{ inputs.eq(i).removeAttr('disabled'); } }
               for ( var i = 0, leni = links.length; i < leni; ++i ){ if ( true === myCtrl.disabled ){ links.eq(i).attr('disabled', 'true'); }else{ links.eq(i).removeAttr('disabled'); } }
            });
         };
      }
   };
}]);})();// wrapper directive for ui-bootstrap

/**
 * This service should be used whenever someones wants to launch many HTTP requests at the same time. 
 * It will throttle the requests to a lower number of concurrent requests. 
 * Also, each requests MAY be identified by a unique ID, making it possible to replace requests on the same resource. 
 */
(function serviceUxfwkPromiseFifo (){angularAMD.factory('uxfwk.promise.fifo', ['$q', '$timeout', function($q, $timeout){
   var serviceInternalKey = 0;

   function drop (fifo, job){
      var offset = fifo.current.indexOf(job.id);

      if ( offset >= 0 ){ fifo.current.splice(offset, 1); }
      dispatch(fifo);
   };// @drop

   function dispatch (fifo){
      var left = fifo.settings.size - fifo.current.length;
      var len = fifo.queue.length;

      for ( var i = 0; (i < left) && (len > 0); ++i, len-- ){
         var newone = fifo.queue.shift();
         var job = fifo.map[newone];

         fifo.current.push(newone);
         (job.promise = job.creator.apply(job.creator, job.args))
         .then(function(response){
            job.defer.resolve(response);
         })
         .catch(function(response){
            job.defer.reject(response);
         })
         .finally(function(){
            drop(fifo, job);
         });
         if ( !$U(fifo.settings.timeout) ){
            $timeout(function(){
               if ( angular.isFunction(job.promise.cancel) ){ job.promise.cancel(); }
               job.defer.reject();
               drop(fifo, job);
            }, fifo.settings.timeout);
         }
      }
   };// @dispatch

   function cancel (fifo){
      //[#] Cancel all promises in progress (if cancel method is available)
      fifo.queue = [];
      fifo.key = 'key'+serviceInternalKey++;
      for ( var i = 0, leni = fifo.current.length; i < leni; ++i ){
         var job = fifo.map[fifo.current[i]];

         if ( !$U(job) && !$U(job.promise) && angular.isFunction(job.promise.cancel) ){ job.promise.cancel(); }
      }
      //[#] Clears all buffers
      fifo.current = [];
      fifo.map = {};
   };// ::cancel

   function push (fifo, id, creator, args){
      var id = fifo.key + id;
      var defer = $q.defer();
      var offset = -1;

      if ( !angular.isFunction(creator) ){ throw new Error('Invalid argument [creator] - Not a function'); }
      fifo.map[id] = { id:id, creator:creator, args:args, defer:defer, promise:null };
      if ( (offset = fifo.queue.indexOf(id)) >= 0 ){ fifo.queue.splice(offset, 1); }
      fifo.queue.push(id);
      dispatch(fifo);
      return defer.promise;
   };// ::push

return function (settings){
   var fifo = { settings:(settings || {}), current:[], queue:[], map:{}, key:('key'+ serviceInternalKey++) };

   fifo.settings.size = fifo.settings.size || 1;
   fifo.settings.timeout = fifo.settings.timeout || null;

   return{
      push: function(i,c,a){ return push(fifo, i, c, a); },
   cancel:function(){ return cancel(fifo); }};
}}])})();// serviceUxfwkPromiseFifo


angularAMD.directive('uxfwkSelect2', ['$compile', '$interpolate', '$parse', function uxfwkSelect2Fix ($compile, $interpolate, $parse){
   var $U = uxfwk.$U;
   var startSym = $interpolate.startSymbol();
   var endSym = $interpolate.endSymbol();
   var uxfwkSelect2 = { d:{}, i:{} };
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

uxfwkSelect2.d.compile = function ($element, $attrs, $ctrls){
   var ngIf = $element.attr('data-ng-if');
   var watcher = uxfwk.$null;

   if ( ngIf ){ ngIf = '(('+ngIf+') && ($$$$uxfwkSelect2.ngIf))'; }
   else{ ngIf = '$$$$uxfwkSelect2.ngIf'; }
   $element.attr('data-ng-if', ngIf);
   $element.removeAttr($attrs.$attr.uxfwkSelect2);
   $attrs.$observe('ngModel', function(value){
      watcher = $parse(value);
   });

   return function ($scope, $element, $attrs){
      $scope.$$$$uxfwkSelect2 = { ngIf: true };
      $compile($element)($scope);
      $scope.$watch(function(){ return watcher($scope); }, function (newValue, oldValue, scope){
         if ( !$U(oldValue) && $U(newValue) ){
            $scope.$$$$uxfwkSelect2.ngIf = false;
            $scope.$applyAsync(function(){
               $scope.$$$$uxfwkSelect2.ngIf = true;
            });
         }
      })
   }
};// ::compile

uxfwkSelect2.d.replace  = false;
uxfwkSelect2.d.restrict = 'A';
uxfwkSelect2.d.priority = 1001;
uxfwkSelect2.d.terminal = true;
return uxfwkSelect2.d;
}]);// ::uxfwkSelect2Fix

(function directiveUiSelect2Fix (){angularAMD.directive('uiSelect2', ['$parse', '$timeout', function ($parse, $timeout){
   return{
      priority: 2, // this only needs to have a priority bigger than uiSelect2 (which is 1)
      restrict: 'A',
      require: ['?ngModel', '?select'],
      compile: function ($element, $attrs){
         var repeatOption = null, watch = null;
         var fnSettings = null;

         $attrs.uiSelect2 = $attrs.uiSelect2 || '{}';
         if ( $U($attrs.uiSelect2.match(/\bdropdownAutoWidth\:/)) ){
            if ( '{}' === $attrs.uiSelect2 ){ $attrs.uiSelect2 = '{ dropdownAutoWidth:true }'; }
            else{ $attrs.uiSelect2 = $attrs.uiSelect2.replace(/}$/, ', dropdownAutoWidth:true }'); }
         }
         fnSettings = $parse($attrs.uiSelect2);

         repeatOption = $element.find('optgroup[ng-repeat], optgroup[data-ng-repeat], option[ng-repeat], option[data-ng-repeat]');
         if ( repeatOption.length ){
            repeatOption = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
            watch = $parse(uxfwk.trim(repeatOption.split('|')[0]).split(' ').pop());
         }

         return function postLink ($scope, $element, $attrs, $controllers){
            var settings = fnSettings($scope);
            var ngModel = $controllers[0];
            var currentOptions = null;

            if ( settings.uxfwkModelAsObject && watch ){
               $scope.$watch(watch, function (value){
                  currentOptions = value;
               });
            }

            if ( ngModel ){
               if ( $element.tag('select') ){
                  ngModel.$render = function (){
                     $element.select2('val', ngModel.$viewValue);
                  };// endof render
               }

               ngModel.$formatters.push(function($modelValue){
                  var output = $modelValue;

                  if ( settings.uxfwkModelAsObject ){
                     output = ($modelValue || {}).id || null;
                  }
                  if ( $element.tag('select') ){
                     $timeout(function(){
                        //$console.warn('fix value', output);
                        $element.select2('val', output);
                     }, 0);
                  }
                  return output;
               });
               ngModel.$parsers.push(function($viewValue){
                  var output = $viewValue;

                  if ( settings.uxfwkModelAsObject ){
                     if ( angular.isArray(currentOptions) && $viewValue ){
                        output = (uxfwk.findInArray(currentOptions, 'id', $viewValue) || {}).data;
                     }else{ output = null; }
                  }
                  //$console.info($viewValue, '=>', output, $element.val());
                  return output;
               });
            }
         };
      }
   };
}]);})();// directive for controlling button authorization

angularAMD.directive('select', ['$compile', '$interpolate', '$parse', function uxfwkSelect ($compile, $interpolate, $parse){
   var uxfwkSelect = { d:{}, i:{} };
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

uxfwkSelect.i.convert2Number = function (value){
   if ( !$U(value) ){ return value*1; }
};// ::convert2Number

uxfwkSelect.d.link = function ($scope, $element, $attrs, $ctrls){
   if ( !$U($ctrls) && !$U($ctrls[0]) && ('number' === $attrs['type']) ){
      $ctrls[0].$parsers.push(uxfwkSelect.i.convert2Number);
   }
};// ::link

uxfwkSelect.d.require = ['?ngModel'];
uxfwkSelect.d.restrict = 'E';

return uxfwkSelect.d;
}]);// ::select

angularAMD.directive('uxfwkMessageAlert', ['$parse', function uxfwkMessageAlert ($parse){
   var TEMPLATE = ('<div class="uxfwk-message uxfwk-css-transition-ease-height">'+
      '<div class="alert alert-{{ uxfwkMessageAlert.severity }}">'+
         '<div class="fx-alert-icon"><i class="fuxicons fuxicons-{{ uxfwkMessageAlert.severity }}"></i></div>'+
         '<div class="fx-alert-desc">'+
            '<strong>{{ uxfwkMessageAlert.title }}</strong>'+
            '<p>{{ uxfwkMessageAlert.message }}</p>'+
         '</div>'+
      '</div>'+
   '</div>');

   var controller = [function (){
      var that = this;

      that.severity = 'warning';
      that.title    = null;
      that.message  = null;
   }];// @controller;

return{
   resttrict: 'A',
   template: TEMPLATE,
   controller: controller,
   controllerAs: 'uxfwkMessageAlert',
   compile: function (tElement, tAttrs){
      var fnSettings = $parse(tAttrs.uxfwkMessageAlert);

      return function link (tScope, tElement, tAttrs, tControllers){
         var myCtrl = tScope.uxfwkMessageAlert;
         var settings = fnSettings(tScope);

         tScope.$watch(function (){ return fnSettings(tScope); }, function(newSettings){
            if ( !$U(newSettings) ){
               myCtrl.severity = newSettings.severity || 'warning';
               myCtrl.title    = newSettings.title || null;
               myCtrl.message  = newSettings.message || null;
            }
         });
      };// ::link
   },// ::compile
p:null}}]);


angularAMD.directive('uxfwkOnResize', ['$window', '$rootScope', '$parse', 'uxfwk.dom.wrapper', function uxfwkOnResize ($window, $rootScope, $parse, $w){

//[#] This code is run only once at directive startup..and it will register a digest everytime window size changes
angular.element($window).bind('resize', function(){ $rootScope.$apply(); });

var controller = [function (){
   var that = this;

   that.currentClass = null;
}];// @controller

return{
   restrict:'A',
   controller: controller,
   controllerAs: 'uxfwkOnResize',
   compile: function (tElement, tAttrs){
      var fnSettings = $parse(tAttrs.uxfwkOnResize);

      return function link (tScope, tElement, tAttrs, tControllers){
         var settings = fnSettings(tScope);
         var myCtrl = tScope.uxfwkOnResize;
         var element = $w(tElement);

         tScope.$watch(function(){
            var box = element.box();
            return '{0}/{1}'.sprintf(box.width, box.height);
         }, function(newSize){
            var newClass = null, size = null;

            if ( angular.isString(newSize) ){
               size = newSize.split('/');
               size = { width: size[0]*1, height: size[1]*1 };
               if ( angular.isFunction(settings.classer) ){
                  if ( !$U(myCtrl.currentClass) ){ element.removeClass(myCtrl.currentClass); myCtrl.currentClass = null; }
                  if ( !$U(newClass = settings.classer(size)) ){ element.addClass(newClass); myCtrl.currentClass = newClass; }
               }
               if ( angular.isFunction(settings.handler) ){
                  settings.handler(size);
               }
            }
         });
      };
   },
p:null}}]);// uxfwkOnResize


angularAMD.directive ('uxfwkResizable', ['uxfwk.dom.wrapper', function directive_uxfwkTableResizable ($w){
   "use strict";
   
   function fnResize ($scope, $element, force){
      "use strict";

      var $element  = $w($element);
      var $parent   = $element.parent();
      var parentBox = $w($parent).box();
      var myCtrl = $scope.myCtrl;

      if ( force || (parentBox.width != myCtrl.parentContentSize.w) || (parentBox.height != myCtrl.parentContentSize.h) ){
         var myBox = $element.box();

         myCtrl.parentContentSize.w = parentBox.width;
         myCtrl.parentContentSize.h = parentBox.height;

         $element.width(parentBox.width - (myBox.margin.left + myBox.margin.right));
         $element.height(parentBox.height - (myBox.margin.top + myBox.margin.bottom));
      }
   };// fnResize

   var controller = ['$scope', '$element', '$attrs', function ($scope, $element, $attrs){
      "use strict";

      this.parentContentSize = {// stores parent content size, to allow for caching and better performance (only do stuff if parent content size changes)
         w: -1,
         h: -1,
      p:null};
   }];// controller

   function fnPostLink ($scope, $element, $attrs, $ctrl){
      "use strict";

      //[#1.0] - Registers listening for resize
      $scope.$on('resize', function(event, forced){
         fnResize($scope, $element, forced);
      });

      //[#2.0] - Stores my controller reference for future use
      $scope.myCtrl = $ctrl;

      //[#3.0] - Makes a resize
      fnResize($scope, $element);
   };// fnPostLink

   return{
      link:       fnPostLink,
      controller: controller,
   restrict:'A'};
}]);


angularAMD.directive('uxfwkLoadPanel', ['uxfwk.dom.wrapper', '$compile',
function directive_uxfwkLoadPanel ($w, $compile){

var template = (''+
   '<div class="icon"></div>'+
   '<div class="alert" data-uib-alert type="danger">Oops! Resource retrieval failed or context not valid!</div>'+
'');


function fnPreLink ($scope, $element, $attrs){
   if ( 'static' === $scope.status ){
      $w($element).html('<div class="uxfwk-table-load-panel inprogress">'+
         template+
      '</div>');
   }
};// fnPreLink

function fnPostLink ($scope, $element, $attrs){
   var $panel = $w(document.createElement('div'));

   if ( 'static' === $scope.status ){ return; }
   $panel.html(''+
      '<div class="icon"></div>'+
      '<div class="alert" data-uib-alert type="danger">Oops! Resource retrieval failed or context not valid!</div>'+
   '');
   $panel.addClass('uxfwk-table-load-panel');
   if ( true === $scope.status ){
      $panel.addClass('inprogress');
   }
   $w($element).append($panel);
   $compile($panel)($scope);

   $scope.$watch(function(){
      return $scope.status;
   },function(newValue, oldValue){
      if ( newValue && !$scope.error ){
         $panel.addClass('inprogress');
      }else{
         $panel.removeClass('inprogress');
      }
   });

   $scope.$watch(function(){
      return $scope.error;
   },function(newValue, oldValue){
      if ( newValue ){
         $panel.addClass('error');
      }else{
         $panel.removeClass('error');
      }
   });

};// fnPostLink

return{
   link:{ 
      pre:  fnPreLink,
      post: fnPostLink
   },
   scope: {
      status: '=uxfwkLoadPanel',
      error:  '=uxfwkLoadPanelError'
   },
restrict: 'A'};
}]);


function countWatchers () {
   var ids = [];
    var root = angular.element(document.body);
    var watchers = 0;

    var f = function (element) {
        if (element.data().hasOwnProperty('$scope')) {
           if ( !ids[element.data().$scope.$id] )
           {
               watchers += (element.data().$scope.$$watchers || []).length;
               //console.log(element.data().$scope.$id, element.data().$scope, element.data().$scope.$$watchers);
               ids[element.data().$scope.$id] = true;
           }
        }

        angular.forEach(element.children(), function (childElement) {
            f(angular.element(childElement));
        });
    };

    f(root);

    console.log('watchers num', watchers);
    return watchers;
};


/**
 * 
 * @param object 
 */
uxfwk.utils.$U = function (object){
   return ((null == object) || (undefined == object));
};// uxfwk:utils::$U

/**
 * 
 * 
 * @param json 
 * @param format 
 */
uxfwk.utils.forprint = function (json, format){
   var output = [];
   for ( var key in json ){
      if ( json.hasOwnProperty(key) && !uxfwk.utils.$U(json[key]) ){ output.push(format.sprintf(key, json[key])); }
   }
   return output;
};// uxfwk:utils::forprint

/**
 * 
 * 
 * @author nuno-r-farinha
 * 
 * @param object 
 */
uxfwk.utils.shallowCopy = function (object)
{
   var output = {};

   //[#1.0] - Validates input arguments
   for ( var key in object ){
      if ( object.hasOwnProperty(key) && ('$' != key.charAt(0)) ){
         output[key] = object[key]
      }
   }

   return output;
};// uxfwk:utils::shallowCopy

/*
uxfwk.utils.shallowCopy = function (destination, object)
{
   var output = destination;

   //[#1.0] - Validates input arguments
   for ( var key in object ){
      if ( object.hasOwnProperty(key) && ('$' != key.charAt(0)) ){
         output[key] = object[key];
      }
   }

   return output;
};// uxfwk:utils::shallowCopy
*/ 
 
/**
 * 
 * @author nuno-r-farinha
 */
uxfwk.promiseChain = uxfwk.utils.promiseChain = function (creators, args, bAllowErrors)
{
   var promiseReveiver = null, errorReceiver = null;
   var responses = [], it = 0;
   var creatorList = [];

   //[#1.0] - Validates input arguments
   if ( !creators ){ throw new ReferenceError('Missing mandatory argument {creators}'); }
   if ( !args ){ throw new ReferenceError('Missing mandatory argument {args}'); }
   if ( !angular.isArray(args) || (0 == args.length) ){ throw new TypeError('Argument {args} MUST be a non empty Array object'); }
   if ( angular.isArray(creators) && (0 == creators.length) ){ throw new TypeError('Argument {creators} MUST be a non empty Array object'); }
   if ( angular.isArray(creators) && (creators.length != args.length) ){ throw new ArgumentError('Though {creators} is an Array object, {creators} and {args} lengths mismatch ({0} vs {1})'.sprintf(creators.length, args.length)); }

   //[#2.0] - For convenience, creators list will become an array with the same size as args (whenever creators was before)
   if ( !angular.isArray(creators) ){ for ( var i = 0, leni = args.length; i < leni; i++ ){ creatorList.push(creators); } }
   else{ creatorList = creators; }

   //[#3.0] - Creates a callback function to be used as the reveiver of promise
   promiseReveiver = function (data){
      responses.push(data);
      if ( (data instanceof Error) && (true !== bAllowErrors) ){ return responses; }
      if ( (++it) < args.length ){
         return creatorList[it](args[it]).then(promiseReveiver).catch(errorReceiver);
      }else{
         return responses;
      }
   };// promiseReveiver

   //[#4.0] - In case that an error hapens, one of two options, go on or abort all
   errorReceiver = function (error){
      responses.push(error);
      if ( true === bAllowErrors ){
         if ( (++it) < args.length ){
            return creatorList[it](args[it]).then(promiseReveiver).catch(errorReceiver);
         }else{
            return responses;
         }
      }else{
         throw responses;
      }
   };// errorReceiver

   //[#4.0] - Launch the first promise
   return creatorList[0](args[0]).then(promiseReveiver).catch(errorReceiver);
};// uxfwk:utils::promiseChain


/**
 * 
 * 
 * 
 * @param value 
 * @param enumerator 
 */
uxfwk.utils.getKeyByValue = uxfwk.getKeyByValue = function (value, enumerator)
{
   //[#1.0] - Validate input mandatory arguments
   if ( !angular.isDefined(value) )     { return ""; throw new ReferenceError('NULL mandatory argument {value}'); }
   if ( !angular.isDefined(enumerator) ){ throw new ReferenceError('NULL mandatory argument {enumerator}'); }

   //[#2.0] - Look for an object attribute with the same value and return its key
   for ( var key in enumerator ){
      if ( (enumerator.hasOwnProperty(key)) && (null != enumerator[key]) && (value == enumerator[key]) ){
         return key;
      }
   }

   //[#3.0] - If this points is reached, then no valid attribute has been found
   return null;
};// uxfwk:utils::getKeyByValue






return uxfwk;
});

function UxfwkDaoReader (object){
   this.all  = object.all;
   this.get  = object.get;
   this.load = object.load;
};// UxfwkDaoReader

function AbortHttpRequestError (message){
   this.name    = 'AbortHttpRequestError';
   this.message = message;
   this.stack   = (new Error()).stack;
};// AbortHttpRequestError
AbortHttpRequestError.prototype = new Error();

function ArgumentError (message){
   this.name    = 'ArgumentError';
   this.message = message;
   this.stack   = (new Error()).stack;
};// ArgumentError
ArgumentError.prototype = new Error();

function InvalidHtmlDomError (message){
   this.name    = 'InvalidHtmlDomError';
   this.message = message;
   this.stack   = (new Error()).stack;
};// InvalidHtmlDomError
InvalidHtmlDomError.prototype = new Error();

function InvalidJsonDocumentError (message){
   this.name    = 'InvalidJSONDocument';
   this.message = message;
   this.stack   = (new Error()).stack;
};// InvalidJsonDocument
InvalidJsonDocumentError.prototype = new SyntaxError();

