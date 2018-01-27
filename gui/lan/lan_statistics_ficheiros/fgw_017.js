'use strict';
/**
 * @ngdoc object
 * @name uxfwk.router.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a router.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 * Services
 * {
 *    upnp:             string
 *    dyn:              object<DynamicDNS>
 *    storageDevices:   list<StorageDevices>
 * }
 * StorageDevices:
 * [
 *    {
 *       volumeName:    string
 *       fileSystem:    string
 *       totalSpace:    number
 *       usedSpace:     number
 *       storageUsers:  list<StorageUsers>
 *    }, 
 * ...]
 * StorageUsers:
 * [
 *    {
 *       userName:         string
 *       homeDir:          string - Syntax: 'volumeName/userName' (read-only)
 *       password:         string (write-only)
 *       comfirmPassword:  string (write-only)
 *    },
 * ...]
 */
define(['angularAMD', 'uxfwk', 'modules/fgw.wan/fgw.wan.dao', 'uxfwk.string'], function module (angularAMD, uxfwk){
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.contents.dao', ['appUtilities', 'uxfwk.fgw.wan.dao', function dao (appUtilities, wanDao){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (data){
   var url     = 'ss-json/fgw.contents.json';
   var output  = {};
   $console.warn("url", url);
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      $console.warn("response", response);
      if ( !$U(response) && !$U(response.data) ){
         output = angular.copy(response.data);
         output.upnp = (1 === response.data.upnp*1) ? (true) : (false);
         /**
          * HTML response for Dynamic DNS - max 1
          * <tr><td>myNetwork</td><td>email@domain.com</td><td>no-ip.com</td><td>veip.0.1</td><td align='center'><input type='checkbox' name='rml' value='myNetwork'></td></tr>
          */
         if ( !$U(response.data.dyn) ){
            output.dyn = {};
            var aux = null;
            var contents   = angular.element('<div><table><tbody>' + response.data.dyn + '</tbody></table></div>');
            var rows       = contents.find('tr');
            $console.warn("rows.length", rows.length);
            if ( rows.length > 0 ){
               var colls = rows.eq(0).find('td');
               output.dyn.enable    = true;
               output.dyn.hostname  = colls.eq(0).text();
               output.dyn.email     = colls.eq(1).text();
               $console.warn("colls.eq(2).text()", colls.eq(2).text());
               switch(colls.eq(2).text()){
                  case 'tzo':          output.dyn.provider = 0; break;
                  case 'dyndns':       output.dyn.provider = 1; break;
                  case 'noip':         output.dyn.provider = 2; break;
                  default: output.dyn.provider = -1; break;
               }
               // DNS status
               if ( !$U(colls.eq(4)) && ("" !=colls.eq(4).text()) ){
                  output.status = {};
                  output.status.value = colls.eq(4).text();
               }
               if ( !$U(colls.eq(5)) ){
                  output.dyn.id = ( !$U(aux = colls.eq(5).children()) && !$U(aux.attr("value")) ) ? (aux.attr("value")) : (null);
               }
            } else {
               output.dyn.enable    = false;
            }
         }
         /**
          * HTML response Storage Devices - Max 2
          * <tr><td>disk1_1</td><td>ntfs</td><td>30524</td><td>26711</td></tr><tr><td>disk1_2</td><td>ntfs</td><td>30524</td><td>26711</td></tr>
          */
         if ( !$U(response.data.storageDevices) ){
            output.storageDevices = [];
            var contents   = angular.element('<div><table><tbody>' + response.data.storageDevices + '</tbody></table></div>');
            var rows       = contents.find('tr');
            
            for ( var i = 0, leni = rows.length; i < leni; i++ ){
               var device   = {};
               var colls = rows.eq(i).find('td');
               
               device.volumeName      = colls.eq(0).text();
               device.fileSystem      = colls.eq(1).text();
               if ( !$U(colls.eq(2)) ) { device.totalSpace  = colls.eq(2).text()*1; }
               if ( !$U(colls.eq(3)) ) { device.usedSpace   = colls.eq(3).text()*1; }
               
               /**
                * HTML response Storage User
                * <tr><td>user1</td><td>disk1_1/user1</td><td>ignore</td></tr>
                * <tr><td>user1</td><td>disk1_1/user2</td><td>ignore</td></tr>
                * <tr><td>user1</td><td>disk1_2/user3</td><td>ignore</td></tr>
                */
               if ( !$U(response.data.storageUsers) ){
                  device.storageUsers = [];
                  var userContent   = angular.element('<div><table><tbody>' + response.data.storageUsers + '</tbody></table></div>');
                  var userRows      = userContent.find('tr');
                  for ( var j = 0, lenj = userRows.length; j < lenj; j++ ){
                     var user = {}, aux = null, volumeName = null;
                     var userColls = userRows.eq(j).find('td');

                     user.userName     = userColls.eq(0).text();
                     volumeName        = ( !$U(aux = userColls.eq(1).text()) && ("" !== aux) ) ? (aux.split('/')[0]) : (volumeName);
                     user.volumeName   = volumeName;
                     user.rmLst        = userColls.eq(2).find('input').val();
                     
                     if ( volumeName === device.volumeName ){ device.storageUsers.push(user); }
                  }
               }
               output.storageDevices.push(device);
            }
         }
      }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::get

dao.dns = {};
dao.dns.add = function (data){
   var query = null, url = null;
   var promise = {};
   var iface = null, key = null, aux = null;
   var cgiQuery = 'ddnsmngr.cmd?action=add&service={0}&username={1}&password={2}&hostname={3}&iface={4}';

   $console.warn("DAO::ADD", data, wanDao);
   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   
   return wanDao.get()
   .then(function(response){
      $console.warn("DAO::response", data, response);
      if ( (true === response.success) && !$U(response.data) && !$U(response.data.routeInterface) && !$U(response.data.routeInterface.name) ){
         iface = response.data.routeInterface.name;
      }
      query = cgiQuery.sprintf(data.provider, data.email, encodeURIComponent(data.key), data.hostname, iface);
      url = query;
      $console.warn("url", url);
      //[#2.0] - send request
      return $http.get(url);
   })
   .then(function(response){
      return ({ success: true, data: data });
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::dns::add

dao.dns.remove = function (data){
   var query = null, url = null, aux = null;
   var promise = {};
   var cgiQuery = 'ddnsmngr.cmd?action=remove&rmLst={0}';

   $console.warn("DAO::REMOVE", data);
   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   if ( $U(data.id) ){ throw new ReferenceError('Missing mandatory arguments[data.id]'); }
   
   query = cgiQuery.sprintf(data.id);;
   return $http.get(query)
   .then(function(response){
      return ({ success: true, data: { enable: false } });
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::dns::remove

dao.upnp = {};
dao.upnp.config = function (data){
   var query = null, url = null;
   var cgiQuery = 'upnpcfg.cgi?enblUpnp={0}';
   var config = {};

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }

   // Fazer um serviço no index que faça o preenchimento do sessionKey
   if ( !$U(data.upnp) ){
      config.upnp = (!!data.upnp) ? (1) : (0);
      
      query = cgiQuery.sprintf(config.upnp);
   } else { return; }
   url = query;

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){ return { success: true, data: data }; })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::config

dao.user = {};
dao.user.create = function (data){
   var query = null, url = null;
   var cgiQuery = 'storageuseraccountcfg.cmd?action=add&userName={0}&Password={1}&volumeName={2}';
   var create = {};

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }

   query = cgiQuery.sprintf(data.userName, encodeURIComponent(data.password), data.volumeName);
   url = query;

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){ return { success: true, data: data }; })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::create

dao.user.remove = function (data){
   var query = null, url = null;
   var cgiQuery = 'storageuseraccountcfg.cmd?action=remove&rmLst={0}';
   var remove = {};

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }

   query = cgiQuery.sprintf(data.rmLst);
   url = query;

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){ return { success: true, data: data }; })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::remove

return dao;
}]);
return module;
});

