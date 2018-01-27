'use strict';
/**
 * @ngdoc object
 * @name uxfwk.router.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a router.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 * Account
 * {
 *    userrole:         string
 *    currentUser:      string
 *    password:         string
 *    oldpassword:      string
 *    newpassword:      string
 *    confirmpassword:  string
 * }
 */
define(['angularAMD', 'uxfwk', 'uxfwk.string'], function module (angularAMD, uxfwk){
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.myaccount.dao', ['appUtilities', function dao (appUtilities){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (data){
   var url     = 'ss-json/fgw.account.json';
   var output  = {};
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      if ( !$U(response.data) ) { output = angular.copy(response.data); }

      output.pass = "******";
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::get

dao.config = function (data){
   var query = null, url = null;
   var promise = {};
   var cgiQuery = 'password.cgi?inUserName={0}&inPassword={1}&inOrgPassword={2}';
   var config = {};

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   $console.warn("DAO::data", data);
   
   if ( data.newpassword !== data.confirmpassword ){ 
      promise = { success: false, data: data, errors: 'Password confirmation does not match new password.' };
      return appUtilities.$q.all(promise);
   }
   
   query = cgiQuery.sprintf(encodeURIComponent(data.currentUser), encodeURIComponent(data.newpassword), encodeURIComponent(data.oldpassword));
   url = query;
   $console.warn("url", url);

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      $console.warn("then::response", response);
      return { success: true, data: data };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::config

return dao;
}]);
return module;
});

