'use strict';
/**
* @ngdoc object
* @name uxfwk.tools.dao
*
* @description
* By using this DAO, one can make requests to remote server to manage a lan.dao.fgw entity.
* JSON definition MUST follow (as strongly possible) the REST API specification.
* systemLogs
* {
*    enable:            boolean
*    logs:              string
* }
*
*/
define(['angularAMD', 'uxfwk', 'uxfwk.string'], function module (angularAMD, uxfwk){
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.tools.dao', ['appUtilities', '$timeout', function dao (appUtilities, $timeout){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (data){
   var output = {};
   var url  = 'ss-json/fgw.tools.json';

   //[#2.0] - Makes REST request
   return $http.get(url)
      .then(function(response){
         $console.warn("response", response);
         if ( !$U(response.data) ){
            output = angular.copy(response.data);
            if ( !$U(response.data.systemLogs.enable) )   { output.systemLogs.enable = (1 === response.data.systemLogs.enable*1) ? (true) : (false); }
            if ( !$U(response.data.systemLogs.serverUdp) ){ output.systemLogs.serverUdp = response.data.systemLogs.serverUdp*1; }
         }
         $console.warn("output", output);
         return { success: true, data: output, errors: null };
      })
      .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::get

dao.logs = {};
dao.logs.get = function (data){
   var url  = 'ss-json/fgw.syslog.json';
   var output = [];

   //[#2.0] - Makes REST request
   return $http.get(url)
      .then(function(response){
         /**
          * HTML response
          * "<tr><td>Jan  1 00:06:27</td><td>syslog</td><td>info</td><td>syslogd started: BusyBox v1.24.2</td></tr>"
          */
         $console.warn("DAO::response", response);
         if ( !$U(response.data) && !$U(response.data.logData) ){
            var contents   = angular.element('<div><table><tbody>' + response.data.logData + '</tbody></table></div>');
            var rows       = contents.find('tr');

            for ( var i = 0, leni = rows.length; i < leni; i++ ){
               var aux   = {};
               var colls = rows.eq(i).find('td');

               aux.date          = colls.eq(0).text();
               aux.facility      = colls.eq(1).text();
               aux.severity      = colls.eq(2).text();
               aux.message       = colls.eq(3).text();
               output.push(aux);
            }
         }
         return { success: true, data: output, errors: null };
      })
      .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::logs::get

dao.logs.config = function (data){
   //var defer = appUtilities.$q.defer();
   var query = null, url = null, params = {};
   var promise = {};
   var aux = null;
   var cgiQuery = 'logconfig.cgi?logStatus={0}&logLevel={1}&logDisplay={2}&logMode={3}&logIpAddress={4}&logPort={5}';

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   $console.warn("DAO::LOGS::CONFIG", data);
   
   params = angular.copy(data);
   params.enable = ( !!data.enable ) ? ("1") : ("0");
   query = cgiQuery.sprintf(params.enable, params.logLevel, params.displayLevel, params.mode, params.serverIp, params.serverUdp);
   url = query;
   $console.warn("url", url);

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      $console.warn("response", response, data);
      return ({ success: true, data: data });
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
   //return defer.promise;
};// ::logs::config

dao.cmds = {};
dao.cmds.reboot = function (){
   var query = null, url = null;
   var cgiQuery = 'rebootinfo.cgi';
   var config = {};
   query = cgiQuery.sprintf(0);
   url = query;

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      $console.warn("then::response", response);
      return { success: true, data: response };
   })
   .catch(function(response){ $console.warn("catch::response", response); return appUtilities.$processRestException(response, {}); });
};// ::cmds::reboot

dao.cmds.restoreDefaults = function (){
   var query = null, url = null;
   var cgiQuery = 'restoreinfo.cgi';
   var config = {};
   query = cgiQuery.sprintf(0);
   url = query;

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      return { success: true, data: response };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, {}); });
};// ::cmds::restoreDefaults

dao.cmds.backup = function (){
   var query = null, url = null;
   var cgiQuery = 'backupsettings.conf';
   var config = {};
   url = cgiQuery;

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      return { success: true, data: response };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, {}); });

};// ::cmds::backup

dao.restore = function(data){
   var url  = 'ss-json/fgw.tools.json';
   var output = [];
   var defer = appUtilities.$q.defer();
   $timeout(function(){
      output = angular.copy({});
      return defer.resolve({ success: true, data: output, errors: null });
   }, 3000);
   return defer.promise;

   //[#2.0] - Makes REST request
   /*return $http.post(url, data)
      .then(function(response){
      })
      .catch(function(response){ return uxfwk.processRestException(response, data); });
      */
};

return dao;
}]);
return module;
});

