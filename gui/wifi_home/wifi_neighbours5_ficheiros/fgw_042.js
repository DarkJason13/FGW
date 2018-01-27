'use strict';
/**
 * @ngdoc object
 * @name uxfwk.router.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a router.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 * TV
 * {
 *    serviceStatus:    string
 *    stb:              object<STB>
 *    rftv:             string
 *    channel:          string
 * }
 * STB
 * {
 *    interf:           string
 *    ip:               string
 * }
 */
define(['angularAMD', 'uxfwk', 'uxfwk.string'], function module (angularAMD, uxfwk){
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.tv.dao', ['appUtilities', function dao (appUtilities){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (data){
   var url     = 'ss-json/fgw.tv.json';
   var output  = {};
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      if ( !$U(response.data) ) { 
         output = angular.copy(response.data);
         switch(response.data.serviceStatus){
            case "1": output.serviceStatus = true; break;
            case "0": output.serviceStatus = false; break;
            case "Not Applicable": output.serviceStatus = null; break;
         }
         if ( !$U(response.data.rftv) ){
            output.rftv = response.data.rftv*1;
         }
         /**
          * Response:
          * ip1|intf1|ip2|intf2|...
          * 192.168.1.100|eth0|192.168.1.200|eth1|192.168.1.201|eth2|192.168.1.201|eth3|192.168.1.201|wl0|192.168.1.201|wl0.3|192.168.1.201|wl1|192.168.1.201|wl1.3|
          * <tr><td>HEPC362VT7</td><td>10:1f:74:e7:77:5d</td><td>192.168.1.64</td><td>2a02:818:803c:6a00:3cf9:3ab0:2065:374a</td><td>fe80::d19d:bede:2bf1:5db0</td><td>0 segundos</td><td>eth0.0</td><td>1</td>
          */
         output.stb = [];
//         var content = response.data.stbs.split('|');
//         for ( var i = 0, leni = content.length; i < leni; i=i+2 ){
//            var obj = {};
//
//            if ( "" == content[i] ) { continue; }
//            obj.ip = content[i];
//            switch(content[i+1]){
//               case 'eth0':   obj.interf = 'LAN 1';                  break;
//               case 'eth1':   obj.interf = 'LAN 2';                  break;
//               case 'eth2':   obj.interf = 'LAN 3';                  break;
//               case 'eth3':   obj.interf = 'LAN 4';                  break;
//               case 'wl0':    obj.interf = 'Wi-Fi 2.4GHz primary';   break;
//               case 'wl0.3':  obj.interf = 'Wi-Fi 2.4GHz guest';     break;
//               case 'wl1':    obj.interf = 'Wi-Fi 5GHz primary';     break;
//               case 'wl1.3':  obj.interf = 'Wi-Fi 5GHz guest';       break;
//            }
//            output.stb.push(obj);
//         }
         
         var contents   = angular.element('<div><table><tbody>' + response.data.stbs + '</tbody></table></div>');
         var rows       = contents.find('tr');
         
         for ( var i = 0, leni = rows.length; i < leni; i++ ){
            var obj = {}, port = null;
            var colls = rows.eq(i).find('td');
            obj.hostName   = colls.eq(0).text();
            obj.mac        = colls.eq(1).text();
            obj.ip         = colls.eq(2).text();
            port           = colls.eq(6).text();
            
            if ( "" === obj.ip ){ continue; }
            
            switch(port){
               case 'eth0.0':   obj.interf = 'LAN 1';                  break;
               case 'eth1.0':   obj.interf = 'LAN 2';                  break;
               case 'eth2.0':   obj.interf = 'LAN 3';                  break;
               case 'eth3.0':   obj.interf = 'LAN 4';                  break;
               case 'wl0':      obj.interf = 'Wi-Fi 2.4GHz primary';   break;
               case 'wl0.3':    obj.interf = 'Wi-Fi 2.4GHz guest';     break;
               case 'wl1':      obj.interf = 'Wi-Fi 5GHz primary';     break;
               case 'wl1.3':    obj.interf = 'Wi-Fi 5GHz guest';       break;
            }
            output.stb.push(obj);
         }
    }
      $console.warn("output", output);
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::get

return dao;
}]);
return module;
});

