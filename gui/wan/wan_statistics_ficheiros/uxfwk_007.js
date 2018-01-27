/** 
 * @warning 
 * Do not mistake this cache with others. This cache is meant to be used as 
 * a repository of additional data appended to main JSON data used widely 
 * on this application. For example, to expand REST data with internal data 
 * regarding things like histeresis and other stuff (without polluting the 
 * main data). Cache regarding HTTP requests and other scenarios should use 
 * another services rather than this one. 
 * @description 
 * This module implements a centralized service for data cache manager. 
 * There is no stale control over this cache so, to allow cache clean up, 
 * it is assumed that cache is cleared everytime there is a state change 
 * (whenever state change is successfuly completed). 
 * Nonetheless, a persistent mode is available through which specific 
 * namespaces may be used to allow stale control over each namespace by the 
 * service user.
 * Since this cache is central, for debug purposes there must be a way to
 * access private data. It is therefore supported a combination of keys and
 * mouse buttons that will dump to console, all internal data of this cache.
 * The choosed combination is CTRL + ALT + DEL + double click. 
 */
define('uxfwk.rm.cache.data.manager', ['angularAMD', 'uxfwk'], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U, key = 'uxfwk.rm.cache.data.manager: ';
   var debug = $console.debug.bind($console, key), error = $console.error.bind($console, key), info = $console.info.bind($console, key), warn = $console.warn.bind($console, key);
angularAMD.factory('uxfwk.rm.cache.data.manager', ['$rootScope', '$document'
, function uxfwkRmCacheDataManager ($rootScope, $document
){
   var ckey = 'object:{0}', pkey = '$$$$uxfwkHashKey';
   var DATA = { STALE:{}, PERSISTENT:{}, hashKey:1 };
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/**
 * @description 
 * Whenever a state change occurs, cleans all STALE cache. 
 */
$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
   DATA.STALE = {};
});// @$stateChangeSuccess

$document.on('dblclick', function (event){
   if ( event.altKey && event.ctrlKey && event.shiftKey ){ info(DATA); }
});

return{
   /**
    * @description
    * Obtain cache data appended to JSON data. It begins as a empty object.
    * 
    * @param data JSON data to be extended with additional cachable properties
    * @param init JSON data to be used as default cache object
    * @param ns optional namespace for cache (on persistent scenarios)
    */
   cache: function (data, init, ns, persistent){
      //[#1.0] Checks if cache key is available; if not, creates it
      if ( !angular.isString(data[pkey]) ){ data[pkey] = ckey.sprintf(DATA.hashKey++); }

      //[#2.0] Checks if cache is created; if not, creates it and returns it
      //       Special constraints, must check if cache is persistent or not
      if ( !persistent ){
         DATA.STALE[ns] = DATA.STALE[ns] || {};
         DATA.STALE[ns][data[pkey]] = DATA.STALE[ns][data[pkey]] || init || {};
         return DATA.STALE[ns][data[pkey]];
      }else{
         DATA.PERSISTENT[ns] = DATA.PERSISTENT[ns] || {};
         DATA.PERSISTENT[ns][data[pkey]] = DATA.PERSISTENT[ns][data[pkey]] || init || {};
         return DATA.PERSISTENT[ns][data[pkey]];
      }
      return null;
   },// ::cache

   /**
    * @description
    * Cleans all data from given namespace
    * 
    * @param ns 
    */
   clean: function (ns){
      if ( !angular.isString(ns) ){ return; }
      DATA.STALE[ns] = null;
      DATA.PERSISTENT[ns] = null;
   },// ::clean

'p':null};}]);// endof service

});// endof module
