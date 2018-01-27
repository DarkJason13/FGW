'use strict';
/**
 * @ngdoc object
 * @name uxfwk.router.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a router.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 * WAN
 * {
 *    service:             object<Service>
 *    opticalInterface:    object<OpticalInterface>
 * }
 * Service
 * {
 *    interface:           string
 *    description:         string
 *    serviceType:         string
 *    ipFamilyIPv6:        string
 *    nat:                 string
 *    natType:             string
 *    firewall:            string
 *    status:              string
 *    ip:                  string
 *    ipv6Address:         string
 *    enable:              string
 *    defaultGw:           string
 *    dns:                 string
 *    ipv6PrimaryDns:      string
 *    ipv6SecundaryDns:    string
 *    ipv6Prefix:          string
 *    ipv6DefaultGw:       string
 * }
 * OpticalInterface
 * {
 *    linkStatus:          string
 *    optPowerRx:          string
 *    optPowerTx:          string
 *    optPowerCatvRx:      string
 * }
 */
define(['angularAMD', 'uxfwk', 'uxfwk.string'], function module (angularAMD, uxfwk){
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

zpriv.filterDNS = function(value){
   var output = null;
   if ( !$U(value) ){
      switch(value){
         case '::':
         case '0.0.0.0':
            break;
         default: 
            output = value;
            break;
      }
   }
   return output;
}; // @filterDNS

angularAMD.factory('uxfwk.fgw.wan.dao', ['appUtilities', function dao (appUtilities){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (data){
   var url     = 'ss-json/fgw.wan.json';
   var output  = {};
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      if ( !$U(response.data) ){
         /**
          * Interface   Description Type  VlanMuxId   IPv6  IgmpPxy IgmpSrcEnbl MLDPxy MLDSrcEnbl NAT   Firewall Status   IPv4Address   DNS Servers   DefaultGW  IPv6Address   Enable/disable
          * <tr align='center'><td>veip0.1</td><td>internet.12</td><td>IPoE</td><td>12</td><td>Enabled</td><td>Enabled</td><td>Enabled</td><td>Disabled</td><td>Disabled</td><td>Enabled</td><td>Enabled</td><td>Connected</td><td>172.22.107.233</td><td>172.16.100.1,172.16.100.2</td><td>172.22.107.254</td><td>FAKE::IPV6::ADDRESS</td><td>Enabled</td></tr>
          */
         
         if ( !$U(response.data.service) ){
            output.service    = {};
            var contents      = angular.element('<div><table><tbody>' + response.data.service + '</tbody></table></div>');
            var rows          = contents.find('tr');
            var colls         = rows.eq(0).find('td');
            var aux           = {}, val = null;
            
            aux.interface     = colls.eq(0).text();
            aux.description   = colls.eq(1).text();
            aux.serviceType   = colls.eq(2).text();
            aux.ipFamilyIPv6  = ( !$U(val = colls.eq(4)) && ('Enabled' === val.text()) ) ? (true): (false);
            aux.firewall      = ( !$U(val = colls.eq(10)) && ('Enabled' === val.text()) ) ? (true): (false);
            aux.status        = ( !$U(val = colls.eq(11)) && ('Connected' === val.text()) ) ? (true): (false);
            aux.ip            = colls.eq(12).text();
            if ( !$U(val = colls.eq(13)) ){
               var val2       = null;
               aux.primarydns    = ( !$U(val2 = val.text().split(',')[0]) ) ? (zpriv.filterDNS(val2)) : (null);
               aux.secundarydns  = ( !$U(val2 = val.text().split(',')[1]) ) ? (zpriv.filterDNS(val2)) : (null);
            }
            aux.defaultGw     = colls.eq(14).text();
            aux.ipv6Address   = ('::' === (val = colls.eq(15).text())) ? (null) : (val);
            if ( !$U(val = colls.eq(16)) ){
               var val2       = null;
               aux.ipv6PrimaryDns    = ( !$U(val2 = val.text().split(',')[0]) ) ? (('::' === val2)?(null):(val2)) : (null);
               aux.ipv6SecundaryDns  = ( !$U(val2 = val.text().split(',')[1]) ) ? (('::' === val2)?(null):(val2)) : (null);
            }
            aux.ipv6Prefix    = ('::' === (val = colls.eq(17).text())) ? (null) : (val);
            aux.ipv6DefaultGw = ('::' === (val = colls.eq(18).text())) ? (null) : (val);
            aux.enable        = colls.eq(19).text(); //not used
            output.service    = aux;
         }
         // Parsing of Optical interface
         /**
          * Up|-20.00dBm|3dBm|-15.00dBm;
          * Up|-20.00dBm|3dBm|NOS;
          * 
          */
         if ( !$U(response.data.opticalInterface) ){ 
            output.opticalInterface = {};
            var val        = null;
            var content    = response.data.opticalInterface.split('|');
            
            output.opticalInterface.linkStatus     = ( !$U(val = content[0]) && ('Up' === val) ) ? (true): (false);
            output.opticalInterface.optPowerRx     = ( !$U(val = content[1]) ) ? (('-' === val) ? (null): (val.replace("dBm", ""))) : (null);
            output.opticalInterface.optPowerTx     = ( !$U(val = content[2]) ) ? (('-' === val) ? (null): (val.replace("dBm", ""))) : (null);
            output.opticalInterface.optPowerCatvRx = ( !$U(val = content[3]) ) ? (('NOS' === val) ? (null): (val.replace("dBm", ""))): (null);
         }
         // Parsing route interface name
         /**
          * internet.12/veip.0.1
          */
         if ( !$U(response.data.interfaceRoute) ){
            output.routeInterface = {};
            var val        = null;
            var content    = response.data.interfaceRoute.split('/');
            var idx        = content.length-1;
            output.routeInterface.name = ( !$U(val = content[idx]) ) ? (val): (null);
         }
      }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::get

dao.config = function (data){
   var urla = '{0}';
   var url = null;

   $console.warn("DAO::data", data);
   // Configuração do Dynamic DNS
   
   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   else if ( $U(data.id) ){ throw new ReferenceError('Missing mandatory arguments[data.id]') };
   url = urla.sprintf(data.id);

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      return { success: true, data: response };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::config


dao.statistics = {};
dao.statistics.get = function (data){
   var url  = 'ss-json/fgw.wanstatistics.json';
   var output = [], stats = {};
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      $console.warn("DAO::response", response);
      /**
       * HTML response
       * Interface   Description Type  VlanMuxId   IPv6  Igmp Pxy Igmp Src Enbl  MLD Pxy  MLD Src Enbl   NAT   Firewall Status   IPv4 Address   IPv6 Address
       * "<tr align='center'><td class='hd'>veip0.1</td><td>ipoe_veip0.12</td><td>782</td><td>5</td><td>0</td><td>0</td><td>84</td><td>2</td><td>0</td><td>3</td><td>1314</td><td>10</td><td>0</td><td>0</td><td>0</td><td>0</td><td>10</td><td>0</td></tr>",
       */
      if ( !$U(response.data) ){
         if ( !$U(response.data.statistics) ){ 
            var contents      = angular.element('<div><table><tbody>' + response.data.statistics + '</tbody></table></div>');
            var rows          = contents.find('tr');
            for ( var i = 0, leni = rows.length; i < leni; i++ ){
               var colls   = rows.eq(i).find('td');
               stats.interfaceName = colls.eq(0).text();
               stats.rx = {};
               stats.rx.totalBytes = colls.eq(2).text();
               stats.rx.totalPkts  = colls.eq(3).text();
               stats.rx.totalErrors = colls.eq(4).text();
               stats.rx.totalDrops = colls.eq(5).text();
               stats.tx = {};
               stats.tx.totalBytes = colls.eq(10).text();
               stats.tx.totalPkts = colls.eq(11).text();
               stats.tx.totalErrors = colls.eq(12).text();
               stats.tx.totalDrops = colls.eq(13).text();
               output.push(stats);
            }
         }
      }

      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::statistics::get

dao.statistics.reset = function (data){
   var url = 'wanStatsRst.cmd?';

   //[#2.0] - send request
   //return $http.get('ss-json/fgw.wan.json') // Emulation - To be removed
   return $http.get(url)
   .then(function(response){
      return { success: true, data: {} };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::statistics::reset

return dao;
}]);
return module;
});

