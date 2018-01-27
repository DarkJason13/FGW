/**
 * @ngdoc object
 * @name uxfwk.router.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a router.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 * Summary
 * {
 *    router:              object<Router>
 *    wan:                 object<Wan>
 *    lan:                 object<Lan>
 *    wifi:                object<Wifi>
 *    voice:               object<Voice>
 *    tv:                  object<Tv>
 * }
 * router
 * {
 *    swVersion:           string
 *    serialNumber:        string
 *    mac:                 string
 *    uptime:              string
 * }
 * wan
 * {
 *    ports:               object<PortStatus>
 *    rxOptPower:          string
 *    txOptPower:          string
 *    rxCatvPower:         string
 * }
 * lan
 * {
 *    ports:               object<PortStatus>
 *    ipFamily:            string
 *    ip:                  string
 *    dhcpStatus:          string
 * }
 * wifi
 * {
 *    wifi0Mode:           string
 *    wifi1Mode:           string
 * }
 * voice
 * {
 *    sipRegisterStatus:   string
 *    extension:           string
 * }
 * tv
 * {
 *    currentTVchannel:    string
 * }
 */
define(['angularAMD', 'uxfwk', 'uxfwk.string'], function module (angularAMD, uxfwk){'use strict';
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.summary.dao', ['appUtilities', function dao (appUtilities){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (data){
   var url     = null, bypass = 0;
   var query   = 'ss-json/fgw.summary.json?bypass={0}';
   var output  = {};
   
   bypass = ( !$U(data) ) ? (data) : (bypass);
   url = query.sprintf(bypass);
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      $console.warn("SUMMARY::DAO::response", response);
      if ( !$U(response.data) ){
         // Parsing of Router
         if ( !$U(response.data.router) ){
            output.router = {};
            output.router = response.data.router;
         }
         // Parsing of LAN
         if ( !$U(response.data.lan) ){
            output.lan = {};

            // Prego para uniformizar modelo de dados
            uxfwk.merge(response.data.lan, response.data.lan.dhcpServer.dhcpServer);
            delete response.data.lan.dhcpServer.dhcpServer;

            output.lan = angular.copy(response.data.lan);
            output.lan.dhcpStatus = ( 1 === response.data.lan.dhcpEnable*1 ) ? (true) : (false);
            
            output.lan.ports = {};
            output.lan.ports.number = 4;
            output.lan.ports.status = 0x00;
            if ( !$U(response.data.lan.portStatus) ){
               var statusIdx = null;
               var content = response.data.lan.portStatus.split('|');
               for ( var i = 0, leni = 4; i < leni; ++i ){
                  statusIdx = i+(i*2);
                  if ( !$U(content[statusIdx]) && ('1' === content[statusIdx]) ){
                     output.lan.ports.status |=  Math.pow(2, i);
                  }
               }
            }
         }
         // Parsing of WAN
         if ( !$U(response.data.wan) ){
            output.wan = {};
            if ( !$U(response.data.wan.opticalInterface) ){ 
               output.wan.opticalInterface = {};
               var content    = response.data.wan.opticalInterface.split('|');
               var val        = null;

               output.wan.opticalInterface.linkStatus     = ( !$U(val = content[0]) ) ? (val): (null);
               output.wan.opticalInterface.optPowerRx     = ( !$U(val = content[1]) ) ? (('-' === val) ? (null): (val.replace("dBm", ""))) : (null);
               output.wan.opticalInterface.optPowerTx     = ( !$U(val = content[2]) ) ? (('-' === val) ? (null): (val.replace("dBm", ""))) : (null);
               output.wan.opticalInterface.optPowerCatvRx = ( !$U(val = content[3]) ) ? (('NOS' === val) ? (null): (val.replace("dBm", ""))): (null);
               
               output.wan.ports        = {};
               output.wan.ports.number = 1;
               output.wan.ports.status = ( !$U(val = content[0]) && ('Up' === val) ) ? (0x01) : (0x00);
            }
         }
         // Parsing of Wifi
         if ( !$U(response.data.wifi) ){
            output.wifi = {};
            output.wifi = response.data.wifi;
            output.wifi.wifi0Mode      = ( !$U(response.data.wifi.wifi0Mode) && (1 === response.data.wifi.wifi0Mode*1) ) ? (true): (false);
            output.wifi.wifi1Mode      = ( !$U(response.data.wifi.wifi1Mode) && (1 === response.data.wifi.wifi1Mode*1) ) ? (true): (false);
         }
         // Parsing of voice
         if ( !$U(response.data.voice) ){
            var aux = null;
            output.voice = {};
            output.voice = angular.copy(response.data.voice);
            
            if ( 2 === response.data.voice.sipAccountsNumber*1 ){
               if ( !$U(aux = response.data.voice.status) ){
                  if ( !$U(aux.split(' ')[1]) ){ output.voice.status1 = aux.split(' ')[1]; }
                  if ( !$U(aux.split(' ')[2]) ){ output.voice.status2 = aux.split(' ')[2]; }
               }
            } else {
               if ( !$U(aux = response.data.voice.status) ){
                  if ( !$U(aux.split(' ')[1]) ){ output.voice.status1 = aux.split(' ')[1]; }
               }
               if ( !$U(aux = response.data.voice.extension) ){
                  if ( !$U(aux.split(' ')[1]) ){ output.voice.extension = aux.split(' ')[1]; }
               }
            }
            output.voice.sipRegisterStatus      = ( !$U(response.data.voice.sipRegisterStatus) && (1 === response.data.voice.sipRegisterStatus*1) ) ? (true): (false);
         }
         // Parsing of TV
         if ( !$U(response.data.tv) ){
            output.tv = {};
            output.tv = angular.copy(response.data.tv);
            switch(response.data.tv.status){
               case "1": output.tv.status = true; break;
               case "0": output.tv.status = false; break;
               case "Not Applicable": output.tv.status = null; break;
            }
            if( !$U(response.data.tv.rftv) ){ output.tv.rftv = response.data.tv.rftv*1; }
         }
         $console.warn("DAO::output", output);
      }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){
      return uxfwk.processRestException(response, data);
   });
};// ::get

return dao;
}]);
return module;
});

