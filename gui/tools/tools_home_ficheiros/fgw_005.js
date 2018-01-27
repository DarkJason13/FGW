'use strict';
/**
 * @ngdoc object
 * @name uxfwk.router.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a router.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 * router
 * {
 *    deviceInfo:       object<DeviceInfo>
 * }
 * deviceInfo
 * {
 *    "name":               string
 *    "ip":                 string
 *    "mac":                string
 *    "uptime":             string
 *    "linkStatus":         string
 *    "ipv4":               string
 *    "ipv6":               string
 *    "model":              string
 *    "swVersion":          string
 * }
 */
define(['angularAMD', 'uxfwk', 'uxfwk.string', 'modules/fgw.wan/fgw.wan.dao'], function module (angularAMD, uxfwk){
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.router.dao', ['appUtilities', 'uxfwk.fgw.wan.dao', function dao (appUtilities, wanDao){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (data){
   var output = {};
   var url  = 'ss-json/fgw.router.json';
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      if ( !$U(response.data) ){
         output = angular.copy(response.data);
         if ( !$U(response.data.deviceInfo) && !$U(response.data.deviceInfo.linkStatus) && (5 === response.data.deviceInfo.linkStatus*1) ){
            return wanDao.get();
         } else return;
      }
   })
   .then(function(response){
      if ( !$U(response) ){
         if ( (true === response.success) && !$U(response.data) && !$U(response.data.service) ){
            output.deviceInfo.ipv4 = response.data.service.ip;
            output.deviceInfo.ipv6 = response.data.service.ipv6Address;
         }
      }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::get

return dao;
}]);
return module;
});

