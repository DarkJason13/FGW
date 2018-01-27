/**
 * @ngdoc object
 * @name uxfwk.logout.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a router.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 */
define('uxfwk.logout.dao', ['angularAMD', 'uxfwk', 'uxfwk.string'], function module (angularAMD, uxfwk){'use strict';
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.logout.dao', ['$http', '$q', function dao ($http, $q){
//var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.cmds = {};
dao.cmds.logout = function (data){
   var query = null, url = null;
   query = 'logout.cmd';
   url = query;

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      $console.warn("then::response", response);
      return { success: true, data: response };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, {}); });
};// ::get

return dao;
}]);
return module;
});

