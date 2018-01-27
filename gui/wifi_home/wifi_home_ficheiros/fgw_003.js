'use strict';
/**
 * @ngdoc object
 * @name uxfwk.lan.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a lan.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 * lan
 * {
 *    generalInfo:      object<GeneralInfo>
 *    dhcpServer:       object<DHCPServer>
 *    ipv6:             object<IPv6>
 * }
 * generalInfo
 * {
 *    "ipAddress":         string
 *    "interfaces":        list<Interface>
 * }
 * IPv6
 * {
 *    ipv6Address:         string
 *    ipv6Prefix:          string
 *    ipv6LinkLocal:       string
 * }
 * Interface
 * {
 *    "interfaceName":     string
 *    "admin":             string
 *    "speed":             string
 * }
 * DHCPServer:
 * {
 *    "dhcpEnable":        boolean
 *    "ipStart":           string
 *    "ipEnd":             string
 *    "mask":              string
 *    "primarydns":        string
 *    "secundarydns":      string
 *    "leaseTime":         string
 * }
 * connectedDevices:
 * [{
 *    "portName":          string
 *    "duplexMode":        string
 *    "status":            string
 *    "speed":             string
 *    "hostName":          string
 *    "mac":               string
 *    "ip":                string
 *    "leaseTime":         string
 * },
 * ...]
 * statistics:
 * [{
 *    "interfaceName":    string
 *    "rx":               object<RxTx>
 *    "tx":               object<RxTx>
 * },
 * ...]
 * RxTx:
 * {
 *    totalBytes:         "int"
 *    totalErrors:        "int"
 *    totalPkts:          "int"
 *    totalDrops:         "int"
 * }
 * 
 */
define(['angularAMD', 'uxfwk', 'uxfwk.string'], function module (angularAMD, uxfwk){
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

zpriv.filterDNS = function(value){
   var output = null;
   if ( !$U(value) ){
      switch(value){
         case 'undefined':
         case '0.0.0.0':
         case '192.168.1.1': 
            break;
         default: 
            output = value;
            break;
      }
   }
   return output;
}; // @filterDNS

angularAMD.factory('uxfwk.fgw.lan.dao', ['appUtilities', function dao (appUtilities){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (data){
   var output = {}, val = null, bypass = 0, url = null;
   var query  = 'ss-json/fgw.lan.json?bypass={0}';
   
   bypass = ( !$U(data) && !$U(data.bypassSession) ) ? (data.bypassSession) : (bypass);
   url = query.sprintf(bypass); 
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      $console.warn("response", response);
      if ( !$U(response.data) ){
         
         response.data.dhcpServer = angular.copy(response.data.dhcpServer.dhcpServer);
         delete response.data.dhcpServer.dhcpServer;

         output = angular.copy(response.data);
         
         /**
          * Response:
          * (admin|status|speed)*4
          * 1|Up|Auto|1|Disabled|Auto|0|Disabled|100|1|Up|10
          * 1|1000|Full|1|100|Half|0|---|---|0|---|---|
          */
         if ( !$U(response.data) && !$U(response.data.generalInfo) && !$U(response.data.generalInfo.interfaces) ){
            output.generalInfo.interfaces = [];
            var adminIdx = null, statusIdx = null, speedIdx = null, modeIdx = null;
            var content = response.data.generalInfo.interfaces.split('|');
            
            for ( var i = 0, leni = 4; i < leni; ++i ){
               var ifObj = {};
               ifObj.interfaceName     = 'LAN {0}'.sprintf(i+1);
               adminIdx = i+(i*2);
               if ( !$U(content[adminIdx]) ){ ifObj.admin = content[adminIdx]*1; }
               // By commiting this code, it is introduced a new bug in the Home diagram LAN status node.
//               statusIdx = i+(i*2)+1;
//               if ( !$U(content[statusIdx]) ){ ifObj.status = ('Up' === content[statusIdx]) ? (true) : (false); }
               // Prego:
               if ( !$U(ifObj.admin) ) { ifObj.status = (1 === ifObj.admin) ? (true) : (false); }

               speedIdx = i+(i*2)+1;
               if ( !$U(content[speedIdx]) ){ ifObj.speed = ('Auto' === content[speedIdx]) ? (0) : (content[speedIdx]*1); }
               modeIdx = i+(i*2)+2;
               if ( !$U(content[modeIdx]) ){ 
                  if ('Full' === content[modeIdx]){ ifObj.mode = 1; }
                  if ('Half' === content[modeIdx]){ ifObj.mode = 0; }
               }
               output.generalInfo.interfaces.push(ifObj);
            }
         }
         if ( !$U(response.data) && !$U(response.data.dhcpServer) && !$U(val = response.data.dhcpServer.leaseTime) ) { output.dhcpServer.leaseTime = val*1; }
         output.dhcpServer.dhcpEnable = ( 1 === response.data.dhcpServer.dhcpEnable*1 ) ? (true) : (false);
         if ( !$U(val = response.data.dhcpServer.dns) ){
            output.dhcpServer.primarydns = ( !$U(val.split(',')[0]) ) ? (zpriv.filterDNS(val.split(',')[0])) : (null);
            output.dhcpServer.secundarydns = ( !$U(val.split(',')[1]) ) ? (zpriv.filterDNS(val.split(',')[1])) : (null);
         } 
      }
      $console.warn("output", output);
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::get

dao.dhcp = {};
dao.dhcp.config = function (data){
   //var defer = appUtilities.$q.defer();
   var query = null, url = null, params = {};
   var promise = {};
   var aux = null, dns = '', dnsManual = null;
   var cgiQuery = 'lancfg2.cgi?ethIpAddress={0}&LANdefaultGW={1}&ethSubnetMask={2}&enblDhcpSrv={3}&dhcpEthStart={4}&dhcpEthEnd={5}&LANdnsPrimary={6}&ManualDNS={7}&dhcpLeasedTime={8}';

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   $console.warn("DAO::DHCP::CONFIG", data);
   
   params = angular.copy(data);
   params.dhcpEnable = ( !!data.dhcpEnable ) ? ("1") : ("0");
   if ( $U(data.primarydns) ){
      dnsManual = 0;
      dns += '0.0.0.0';
   } else {
      dnsManual = 1;
      dns += data.primarydns;
      if ( !$U(data.secundarydns) ){
         dns += ',{0}'.sprintf(data.secundarydns);
      }
   }
   query = cgiQuery.sprintf(params.defaultGateway, params.defaultGateway, params.mask, params.dhcpEnable, params.ipStart, params.ipEnd, dns, dnsManual, params.leaseTime);
   url = query;
   $console.warn("url", url);

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      $console.warn("then::response", response, data);
      return ({ success: true, data: data });
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
   //return defer.promise;
};// ::dhcp::config

dao.interfaces = {}
dao.interfaces.config = function(data){
   var query = null, url = null, lan1 = '{0},{1},Full,{2}', lan2 = '{0},{1},Full,{2}', lan3 = '{0},{1},Full,{2}', lan4 = '{0},{1},Full,{2}';
   var cgiQuery = 'lanethcfg.cgi?ethCfgList={0}|{1}|{2}|{3}';

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   if ( !angular.isArray(data) ){ throw new ReferenceError('Invalid mandatory arguments[data]'); }
   $console.warn("data", data);

   for ( var i = 0, leni = data.length; i < leni; ++i ){
      switch(data[i].interfaceName){
         case 'LAN 1': $console.warn('LAN 1'); lan1 = lan1.sprintf('eth0', data[i].admin, data[i].speed); break;
         case 'LAN 2': $console.warn('LAN 2'); lan2 = lan2.sprintf('eth1', data[i].admin, data[i].speed); break;
         case 'LAN 3': $console.warn('LAN 3'); lan3 = lan3.sprintf('eth2', data[i].admin, data[i].speed); break;
         case 'LAN 4': $console.warn('LAN 4'); lan4 = lan4.sprintf('eth3', data[i].admin, data[i].speed); break;
      }
   }
   url = cgiQuery.sprintf(lan1, lan2, lan3, lan4);
   $console.warn("url", url);
   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      return { success: true, data: data };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); }); 
};

dao.devices = {};
dao.devices.get = function (data){
   var url = null, bypass = 0;
   var query  = 'ss-json/fgw.devices.json?bypass={0}';
   var output = [];
   
   bypass = ( !$U(data) && !$U(data.bypassSession) ) ? (data.bypassSession) : (bypass);
   url = query.sprintf(bypass); 
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      /**
       * HTML response
       * Portas LAN: eth0.0, eth1.0, eth2.0, eth3.0; 
       * Sintaxe: HostName; MAC Address; IP Address; IPv6 Address; IPv6 Link-Local Address; Remaining Lease Time; Interface; Active Status
       * "<tr><td>HEPC362VT7</td><td>10:1f:74:e7:77:5d</td><td>192.168.1.65</td><td>36 minutes, 14 seconds</td><td>eth0.0</td></tr>"
       */
      // Fazer parse de html
      $console.warn("DAO::response", response);
      if ( !$U(response.data) && !$U(response.data.dhcpLeases) ){
         var contents   = angular.element('<div><table><tbody>' + response.data.dhcpLeases + '</tbody></table></div>');
         var rows       = contents.find('tr');
         
         for ( var i = 0, leni = rows.length; i < leni; i++ ){
            var aux   = {}, port = null;
            var colls = rows.eq(i).find('td');
            
            if ( !$U(port = colls.eq(6).text()) ){
               if ('eth0.0' === port){
                  aux.portName   = 'LAN 1';
               } else if ('eth1.0' === port){
                  aux.portName   = 'LAN 2';
               } else if ('eth2.0' === port){
                  aux.portName   = 'LAN 3';
               } else if ('eth3.0' === port){
                  aux.portName   = 'LAN 4';
               } else {
                  continue;
               }
            }
            aux.hostName      = colls.eq(0).text();
            aux.mac           = colls.eq(1).text();
            aux.ip            = colls.eq(2).text();
            aux.ipv6          = colls.eq(3).text();
            aux.linkLocalIpv6 = colls.eq(4).text();
            aux.leaseTime     = colls.eq(5).text();
            aux.status        = ( '1' === colls.eq(7).text() ) ? (true) : (false);
            if ( !$U(response.data.status) && ('' !== response.data.status) ){ aux.status = response.data.status; }
            
            output.push(aux);
         }
      }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::devices::get

dao.devices.remove = function (data){
   return;
};// ::devices::remove

dao.statistics = {};
dao.statistics.get = function (data){
   var url  = 'ss-json/fgw.lanstatistics.json';
   var output = [], stats = {};
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      $console.warn("DAO::response", response);
      /**
       * HTML response
       * "<tr><td class='hd'>eth0 [LAN1]</td><td>249762</td><td>2380</td><td>0</td><td>4</td><td>408</td><td>1783</td><td>189</td><td>273</td><td>1918</td><td>57</td><td>89</td><td>43</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
       *  <tr><td class='hd'>eth1 [LAN2]</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
       *  <tr><td class='hd'>eth2 [LAN3]</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
       *  <tr><td class='hd'>eth3 [LAN4]</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
       *  <tr><td class='hd'>wl0[Wi-Fi 2.4GHz]</td><td>0</td><td>0</td><td>0</td><td>3</td><td>0</td><td>0</td><td>0</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"
       */
      if ( !$U(response.data) && !$U(response.data.stats) ){
         var contents   = angular.element('<div><table><tbody>' + response.data.stats + '</tbody></table></div>');
         var rows       = contents.find('tr');
         for ( var i = 0, leni = 4; i < leni; i++ ){
            var colls          = rows.eq(i).find('td');
            stats = {};
            stats.interfaceName = 'LAN {0}'.sprintf(i + 1);
            stats.rx = {};
            stats.rx.totalBytes = colls.eq(1).text();
            stats.rx.totalPkts  = colls.eq(2).text();
            stats.rx.totalErrors = colls.eq(3).text();
            stats.rx.totalDrops = colls.eq(4).text();
            stats.tx = {};
            stats.tx.totalBytes = colls.eq(9).text();
            stats.tx.totalPkts  = colls.eq(10).text();
            stats.tx.totalErrors = colls.eq(11).text();
            stats.tx.totalDrops = colls.eq(12).text();
            output.push(stats); 
         }
      }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::statistics::get

dao.statistics.reset = function (data){
   var url = 'lanStatsRst.cmd?';

   //[#2.0] - send request
   //return $http.get('ss-json/fgw.wan.json') // Emulation - To be removed
   return $http.get(url)
   .then(function(response){
      return { success: true, data: {} };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::statistics::reset

dao.staticlease = {};
dao.staticlease.get = function(data){
   var url  = 'ss-json/fgw.staticleases.json';
   
   //[#2.0] - send request
   //return $http.get('ss-json/fgw.wan.json') // Emulation - To be removed
   return $http.get(url)
   .then(function(response){
      $console.warn("response", response);
      return { success: true, data: response.data || {} };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::staticlease::get

dao.staticlease.create = function(data){
   var query = null, url = null;
   var cgiQuery = 'location=dhcpdstaticlease.cmd?action=add&mac={0}&static_ip={1}&groupName={2}';

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   $console.warn("data", data);
   url = cgiQuery.sprintf(data.lease.macAddr, data.lease.ipAddr, data.groupname);
   $console.warn("url", url);
   //return { success: true, data: data }; // Emulation - To be removed
   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      $console.warn("response::then", response);
      if ( 200 != response.status ){
         var defer = $q.defer();
         defer.reject(response);
         return defer.promise;
      }
      return { success: true, data: data };
   })
   .catch(function(response){ $console.warn("response::catch", response); return appUtilities.$processRestException(response, data); });
};// ::staticlease::create

dao.staticlease.remove = function(data, name){
   var url = null, aux = null;
   var cgiQuery = 'dhcpdstaticlease.cmd?action=remove&groupName={0}&rmLst={1}';
   var macList = '';
   //[#1.0] - Validate input arguments
   $console.warn("data", data);
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   if ( $U(name) ){ throw new ReferenceError('Missing mandatory arguments[name]'); }
   macList += data.macAddr;

   url = cgiQuery.sprintf(name, macList);
   $console.warn("url", url);
   //return { success: true, data: data } // Emulation - To be removed
   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      return { success: true, data: data };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::staticlease::remove
return dao;
}]);
return module;
});

