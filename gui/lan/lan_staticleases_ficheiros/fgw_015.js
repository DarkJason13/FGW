'use strict';
/**
 * @ngdoc object
 * @name uxfwk.wifi.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a wifi.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 * wifi
 * {
 *    wl0    object<Wlx>
 *    wl1    object<Wlx>
 * }
 * Wlx:
 * {
 *    wifiMode       int    - 1-> 5G; 2->2.4G
 *    channel        string - Auto, 1,..,13
 *    bandwidth      int    - 0->20MHz; 1->40MHz; 3->80MHz;
 *    transmitPower  int    - 25 -> 25%; 50 -> 50%; 75-> 75%; 100-> 100%
 *    primary        object<AccessPoint>
 *    guest          object<AccessPoint>
 * }
 * AccessPoint
 * {
 *    enableWifi     int
 *    wps            string - "Enabled" ou "Disabled"
 *    netAuth        string -  Open, Shared, 802.1X, WPA, WPA2, WPA-PSK, WPA2-PSK, Mixed WPA2/WPA-PSK, Mixed WPA/WPA2
 *    ssid           string
 *    password       string - Apenas válida quando a autenticação é WPA-PSK, WPA2-PSK ou Mixed WPA2/WPA-PSK;
 * }
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
 */
define(['angularAMD', 'uxfwk', 'uxfwk.string'], function module (angularAMD, uxfwk){
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

zpriv.translateNetworkAuthentication = function(value){
   var result = {};
   if ( $U(value) ){ throw new ReferenceError('Missing mandatory arguments[value]'); }
   
   switch(value){
      case 1:     result = 1; break; // Open
      case 2:     result = 3; break; // Shared
      case 3:     result = 2; break; // 802.1X
      case 4:     result = 4; break; // WPA
      case 5:     result = 5; break; // WPA2
      case 6:     result = 6; break; // WPA-PSK
      case 7:     result = 7; break; // WPA2-PSK
      case 8:     result = 8; break; // Mixed WPA2/WPA-PSK
      case 9:     result = 9; break; // Mixed WPA/WPA2
   }
   return result;
};

zpriv.getSsid = function(data, port){
   var result = null, val = null;
   if ( $U(data) ){ $console.error('Missing mandatory arguments[data]'); return; }
   if ( $U(port) ){ $console.error('Missing mandatory arguments[port]'); return; }
   
   switch(port){
      case 'wl0': result = ( !$U(data.wl0) && !$U(data.wl0.primary) && !$U(val = data.wl0.primary.ssid) ) ? (val) : (null);  break;
      case 'wl0.3': result = ( !$U(data.wl0) && !$U(data.wl0.guest) && !$U(val = data.wl0.guest.ssid) ) ? (val) : (null); break;
      case 'wl1': result = ( !$U(data.wl1) && !$U(data.wl1.primary) && !$U(val = data.wl1.primary.ssid) ) ? (val) : (null); break;
      case 'wl1.3': result = ( !$U(data.wl1) && !$U(data.wl1.guest) && !$U(val = data.wl1.guest.ssid) ) ? (val) : (null); break;
   }
   return result;
};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.wifi.dao', ['appUtilities', '$timeout', function dao (appUtilities, $timeout){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (){
   var output = {}, value = null;
   var url  = 'ss-json/fgw.wifi.json';
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      
      if (!$U(response.data)){
         output = angular.copy(response.data);
         if ( !$U(response.data.wl0) ){
            if ( !$U(value = response.data.wl0.bandwidth) )                         { output.wl0.bandwidth = value*1; }
            if ( !$U(response.data.wl0.primary) ){
               if ( !$U(value = response.data.wl0.primary.enableWifi) )             { output.wl0.primary.enableWifi =  ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl0.primary.broadcastSSID) )          { output.wl0.primary.broadcastSSID = ( 0 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl0.primary.wps) )                    { output.wl0.primary.wps = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl0.primary.netAuth) )                { output.wl0.primary.netAuth = value*1; }
               if ( !$U(value = response.data.wl0.primary.encrypt) )                { output.wl0.primary.encrypt = value*1; }
               if ( !$U(value = response.data.wl0.primary.preAuthWpa2) )            { output.wl0.primary.preAuthWpa2 = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl0.primary.reAuthInterval) )         { output.wl0.primary.reAuthInterval = value*1; }
               if ( !$U(value = response.data.wl0.primary.intervalWpaKeyChange) )   { output.wl0.primary.intervalWpaKeyChange = value*1; }
               if ( !$U(value = response.data.wl0.primary.radiusPort) )             { output.wl0.primary.radiusPort = value*1; }
               if ( !$U(value = response.data.wl0.primary.wep) )                    { output.wl0.primary.wep = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl0.primary.encryptStr) )             { output.wl0.primary.encryptStr = value*1; }
               if ( !$U(value = response.data.wl0.primary.currentNetKey) )          { output.wl0.primary.currentNetKey = value*1; }
            }
            if ( !$U(response.data.wl0.guest) ){
               if ( !$U(value = response.data.wl0.guest.enableWifi) )               { output.wl0.guest.enableWifi =  ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl0.guest.broadcastSSID) )            { output.wl0.guest.broadcastSSID = ( 0 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl0.guest.wps) )                      { output.wl0.guest.wps = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl0.guest.netAuth) )                  { output.wl0.guest.netAuth = value*1; }
               if ( !$U(value = response.data.wl0.guest.encrypt) )                  { output.wl0.guest.encrypt = value*1; }
               if ( !$U(value = response.data.wl0.guest.preAuthWpa2) )              { output.wl0.guest.preAuthWpa2 = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl0.guest.reAuthInterval) )           { output.wl0.guest.reAuthInterval = value*1; }
               if ( !$U(value = response.data.wl0.guest.intervalWpaKeyChange) )     { output.wl0.guest.intervalWpaKeyChange = value*1; }
               if ( !$U(value = response.data.wl0.guest.radiusPort) )               { output.wl0.guest.radiusPort = value*1; }
               if ( !$U(value = response.data.wl0.guest.wep) )                      { output.wl0.guest.wep = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl0.guest.encryptStr) )               { output.wl0.guest.encryptStr = value*1; }
               if ( !$U(value = response.data.wl0.guest.currentNetKey) )            { output.wl0.guest.currentNetKey = value*1; }
            }
         }
         if ( !$U(response.data.wl1) ){
            if ( !$U(value = response.data.wl1.bandwidth) )                         { output.wl1.bandwidth = value*1; }
            if ( !$U(response.data.wl1.primary) ){
               if ( !$U(value = response.data.wl1.primary.enableWifi) )             { output.wl1.primary.enableWifi =  ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl1.primary.broadcastSSID) )          { output.wl1.primary.broadcastSSID = ( 0 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl1.primary.wps) )                    { output.wl1.primary.wps = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl1.primary.netAuth) )                { output.wl1.primary.netAuth = value*1; }
               if ( !$U(value = response.data.wl1.primary.encrypt) )                { output.wl1.primary.encrypt = value*1; }
               if ( !$U(value = response.data.wl1.primary.preAuthWpa2) )            { output.wl1.primary.preAuthWpa2 = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl1.primary.reAuthInterval) )         { output.wl1.primary.reAuthInterval = value*1; }
               if ( !$U(value = response.data.wl1.primary.intervalWpaKeyChange) )   { output.wl1.primary.intervalWpaKeyChange = value*1; }
               if ( !$U(value = response.data.wl1.primary.radiusPort) )             { output.wl1.primary.radiusPort = value*1; }
               if ( !$U(value = response.data.wl1.primary.wep) )                    { output.wl1.primary.wep = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl1.primary.encryptStr) )             { output.wl1.primary.encryptStr = value*1; }
               if ( !$U(value = response.data.wl1.primary.currentNetKey) )          { output.wl1.primary.currentNetKey = value*1; }
            }
            if ( !$U(response.data.wl1.guest) ){
               if ( !$U(value = response.data.wl1.guest.enableWifi) )               { output.wl1.guest.enableWifi =  ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl1.guest.broadcastSSID) )            { output.wl1.guest.broadcastSSID = ( 0 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl1.guest.wps) )                      { output.wl1.guest.wps = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl1.guest.netAuth) )                  { output.wl1.guest.netAuth = value*1; }
               if ( !$U(value = response.data.wl1.guest.encrypt) )                  { output.wl1.guest.encrypt = value*1; }
               if ( !$U(value = response.data.wl1.guest.preAuthWpa2) )              { output.wl1.guest.preAuthWpa2 = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl1.guest.reAuthInterval) )           { output.wl1.guest.reAuthInterval = value*1; }
               if ( !$U(value = response.data.wl1.guest.intervalWpaKeyChange) )     { output.wl1.guest.intervalWpaKeyChange = value*1; }
               if ( !$U(value = response.data.wl1.guest.radiusPort) )               { output.wl1.guest.radiusPort = value*1; }
               if ( !$U(value = response.data.wl1.guest.wep) )                      { output.wl1.guest.wep = ( 1 === value*1 ) ? (true) : (false); }
               if ( !$U(value = response.data.wl1.guest.encryptStr) )               { output.wl1.guest.encryptStr = value*1; }
               if ( !$U(value = response.data.wl1.guest.currentNetKey) )            { output.wl1.guest.currentNetKey = value*1; }
            }
         }
      }
      $console.warn("output", output);
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::get

dao.status = function (){
   var output = {}, value = null;
   var url  = 'ss-json/fgw.wifiStatus.json';
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      
      if (!$U(response.data)){
         output = angular.copy(response.data);
      }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::status

dao.config = function (data, idx){
   var urla = 'wirelesscfg.cmd?wlIdx={0}&wlEnbl={1}&wlEnblGuest3={2}&wlSsid={3}&wlSsidGuest3={4}&wlWpaPsk={5}&wlWpaPskGuest3={6}&wlAuthMode={7}&wlAuthModeGuest3={8}&wlWscMode={9}&wlWscModeGuest3={10}&wlChannel={11}&wlTxPwrPcnt={12}&wlNBwCap={13}&wlWpa={14}&wlWpaGuest3={15}&wlWep={16}&wlWepGuest3={17}&wlKeyBit={18}&wlKeyBitGuest3={19}&wlKeyIndex={20}&wlKeyIndexGuest3={21}&wlKey1={22}&wlKey1Guest3={23}&wlKey2={24}&wlKey2Guest3={25}&wlKey3={26}&wlKey3Guest3={27}&wlKey4={28}&wlKey4Guest3={29}&wlRadiusServerIP={30}&wlRadiusServerIPGuest3={31}&wlRadiusPort={32}&wlRadiusPortGuest3={33}&wlRadiusKey={34}&wlRadiusKeyGuest3={35}&wlNetReauth={36}&wlNetReauthGuest3={37}&wlPreauth={38}&wlPreauthGuest3={39}&wlWpaGtkRekey={40}&wlWpaGtkRekeyGuest3={41}&wlHide={42}&wlHideGuest3={43}';

   var url = null, primary = {}, guest = {};
   
   $console.warn("DAO::data", data);
   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   //else if ( $U(data[idx]) ){ throw new ReferenceError('Missing mandatory arguments[data.idx]'); }
   
   // Prego: Uso este artificio para converter o valor netAuth de string para number para poder reutilizar as regras referentes a este atributo (ver regra no serviço de regras).
   if ( !$U(data.primary) && !$U(data.primary.netAuth) ) { data.primary.netAuth = data.primary.netAuth*1; }
   if ( !$U(data.guest) && !$U(data.guest.netAuth) )     { data.guest.netAuth = data.guest.netAuth*1; }
   if ( !$U(data.primary) && !$U(data.primary.encrypt) ) { data.primary.encrypt = data.primary.encrypt*1; }
   if ( !$U(data.guest) && !$U(data.guest.encrypt) )     { data.guest.encrypt = data.guest.encrypt*1; }
   // ---------------------------------------------------------------------------------------------------------------------
   
   primary.enableWifi            = ( !$U(data.primary)   && !$U(data.primary.enableWifi) )            ? ( (!!data.primary.enableWifi) ? (1) : (0) ) : ('');
   guest.enableWifi              = ( !$U(data.guest)     && !$U(data.guest.enableWifi) )              ? ( (!!data.guest.enableWifi) ? (1) : (0) ) : ('');
   primary.ssid                  = ( !$U(data.primary)   && !$U(data.primary.ssid) )                  ? ( data.primary.ssid ) : ('');
   guest.ssid                    = ( !$U(data.guest)     && !$U(data.guest.ssid) )                    ? ( data.guest.ssid ) : ('');
   primary.password              = ( !$U(data.primary)   && !$U(data.primary.password) )              ? ( data.primary.password ) : ('');
   guest.password                = ( !$U(data.guest)     && !$U(data.guest.password) )                ? ( data.guest.password ) : ('');
   primary.netAuth               = ( !$U(data.primary)   && !$U(data.primary.netAuth) )               ? ( data.primary.netAuth ) : ('');
   guest.netAuth                 = ( !$U(data.guest)     && !$U(data.guest.netAuth) )                 ? ( data.guest.netAuth ) : ('');
   primary.encrypt               = ( !$U(data.primary)   && !$U(data.primary.encrypt) )               ? ( data.primary.encrypt ) : ('');
   guest.encrypt                 = ( !$U(data.guest)     && !$U(data.guest.encrypt) )                 ? ( data.guest.encrypt ) : ('');
   primary.wps                   = ( !$U(data.primary)   && !$U(data.primary.wps) )                   ? ( (!!data.primary.wps) ? (1) : (0) ) : ('');
   guest.wps                     = ( !$U(data.guest)     && !$U(data.guest.wps) )                     ? ( (!!data.guest.wps) ? (1) : (0) ) : ('');
   primary.wep                   = ( !$U(data.primary)   && !$U(data.primary.wep) )                   ? ( (!!data.primary.wep) ? (1) : (0) ) : ('');
   guest.wep                     = ( !$U(data.guest)     && !$U(data.guest.wep) )                     ? ( (!!data.guest.wep) ? (1) : (0) ) : ('');
   primary.encryptStr            = ( !$U(data.primary)   && !$U(data.primary.encryptStr) )            ? ( data.primary.encryptStr ) : ('');
   guest.encryptStr              = ( !$U(data.guest)     && !$U(data.guest.encryptStr) )              ? ( data.guest.encryptStr ) : ('');
   primary.currentNetKey         = ( !$U(data.primary)   && !$U(data.primary.currentNetKey) )         ? ( data.primary.currentNetKey ) : ('');
   guest.currentNetKey           = ( !$U(data.guest)     && !$U(data.guest.currentNetKey) )           ? ( data.guest.currentNetKey ) : ('');
   primary.netKey1               = ( !$U(data.primary)   && !$U(data.primary.netKey1) )               ? ( data.primary.netKey1 ) : ('');
   guest.netKey1                 = ( !$U(data.guest)     && !$U(data.guest.netKey1) )                 ? ( data.guest.netKey1 ) : ('');
   primary.netKey2               = ( !$U(data.primary)   && !$U(data.primary.netKey2) )               ? ( data.primary.netKey2 ) : ('');
   guest.netKey2                 = ( !$U(data.guest)     && !$U(data.guest.netKey2) )                 ? ( data.guest.netKey2 ) : ('');
   primary.netKey3               = ( !$U(data.primary)   && !$U(data.primary.netKey3) )               ? ( data.primary.netKey3 ) : ('');
   guest.netKey3                 = ( !$U(data.guest)     && !$U(data.guest.netKey3) )                 ? ( data.guest.netKey3 ) : ('');
   primary.netKey4               = ( !$U(data.primary)   && !$U(data.primary.netKey4) )               ? ( data.primary.netKey4 ) : ('');
   guest.netKey4                 = ( !$U(data.guest)     && !$U(data.guest.netKey4) )                 ? ( data.guest.netKey4 ) : ('');
   primary.radiusIp              = ( !$U(data.primary)   && !$U(data.primary.radiusIp) )              ? ( data.primary.radiusIp ) : ('');
   guest.radiusIp                = ( !$U(data.guest)     && !$U(data.guest.radiusIp) )                ? ( data.guest.radiusIp ) : ('');
   primary.radiusPort            = ( !$U(data.primary)   && !$U(data.primary.radiusPort) )            ? ( data.primary.radiusPort ) : ('');
   guest.radiusPort              = ( !$U(data.guest)     && !$U(data.guest.radiusPort) )              ? ( data.guest.radiusPort ) : ('');
   primary.radiusKey             = ( !$U(data.primary)   && !$U(data.primary.radiusKey) )             ? ( data.primary.radiusKey ) : ('');
   guest.radiusKey               = ( !$U(data.guest)     && !$U(data.guest.radiusKey) )               ? ( data.guest.radiusKey ) : ('');
   primary.reAuthInterval        = ( !$U(data.primary)   && !$U(data.primary.reAuthInterval) )        ? ( data.primary.reAuthInterval ) : ('');
   guest.reAuthInterval          = ( !$U(data.guest)     && !$U(data.guest.reAuthInterval) )          ? ( data.guest.reAuthInterval ) : ('');
   primary.preAuthWpa2           = ( !$U(data.primary)   && !$U(data.primary.preAuthWpa2) )           ? ( (!!data.primary.preAuthWpa2) ? (1) : (0) ) : ('');
   guest.preAuthWpa2             = ( !$U(data.guest)     && !$U(data.guest.preAuthWpa2) )             ? ( (!!data.guest.preAuthWpa2) ? (1) : (0) ) : ('');
   primary.intervalWpaKeyChange  = ( !$U(data.primary)   && !$U(data.primary.intervalWpaKeyChange) )  ? ( data.primary.intervalWpaKeyChange ) : ('');
   guest.intervalWpaKeyChange    = ( !$U(data.guest)     && !$U(data.guest.intervalWpaKeyChange) )    ? ( data.guest.intervalWpaKeyChange ) : ('');
   primary.wlHide                = ( !$U(data.primary)   && !$U(data.primary.broadcastSSID) )         ? ( (!!data.primary.broadcastSSID) ? (0) : (1) ) : ('');
   guest.wlHideGuest3            = ( !$U(data.guest)     && !$U(data.guest.broadcastSSID) )           ? ( (!!data.guest.broadcastSSID) ? (0) : (1) ) : ('');

   url = urla.sprintf(
   /* 0*/(idx == 'wl0') ? 0 : 1,
   /* 1*/primary.enableWifi,
   /* 2*/guest.enableWifi,
   /* 3*/encodeURIComponent(primary.ssid),
   /* 4*/encodeURIComponent(guest.ssid),
   /* 5*/encodeURIComponent(primary.password),
   /* 6*/encodeURIComponent(guest.password),
   /* 7*/primary.netAuth,
   /* 8*/guest.netAuth,
   /* 9*/primary.wps,
   /*10*/guest.wps,
   /*11*/data.channel ? (data.channel) : (''),
   /*12*/data.transmitPower ? (data.transmitPower) : (''),
   /*13*/data.bandwidth ? (data.bandwidth) : (''),
   /*14*/primary.encrypt,
   /*15*/guest.encrypt,
   /*16*/primary.wep,
   /*17*/guest.wep,
   /*18*/primary.encryptStr,
   /*19*/guest.encryptStr,
   /*20*/primary.currentNetKey,
   /*21*/guest.currentNetKey,
   /*22*/primary.netKey1,
   /*23*/guest.netKey1,
   /*24*/primary.netKey2,
   /*25*/guest.netKey2,
   /*26*/primary.netKey3,
   /*27*/guest.netKey3,
   /*28*/primary.netKey4,
   /*29*/guest.netKey4,
   /*30*/primary.radiusIp,
   /*31*/guest.radiusIp,
   /*32*/primary.radiusPort,
   /*33*/guest.radiusPort,
   /*34*/primary.radiusKey,
   /*35*/guest.radiusKey,
   /*36*/primary.reAuthInterval,
   /*37*/guest.reAuthInterval,
   /*38*/primary.preAuthWpa2,
   /*39*/guest.preAuthWpa2,
   /*40*/primary.intervalWpaKeyChange,
   /*41*/guest.intervalWpaKeyChange,
   /*42*/primary.wlHide,
   /*43*/guest.wlHideGuest3
      );


   //[#2.0] - send request
   $console.warn("url", url);
   //return $http.get('ss-json/fgw.wifi.json') // Emulation - To be commented
   return $http.get(url)
   .then(function(response){
      return { success: true, data: data };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::config

zpriv.handleBwCapabilities = function (expression){
   var output = [], aux = null;
   aux = expression.split(" ");
   for ( var i = 0, leni = aux.length; i < leni; ++i ){
      switch(aux[i]){
         case '20': output.push(1); break;
         case '40': output.push(3); break;
         case '80': output.push(7); break;
         case '160': output.push(15); break;
      }
   }
   return output;
}; // @handleBwCapabilities

zpriv.handleChCapabilities = function (expression){
   var output = { bw20: [], bw40: [], bw80: [], bw160: [] }, aux = null;
   aux = expression.split(" ");

   for ( var i = 0, leni = aux.length; i < leni; ++i ){
      var bw = null, value = null;

      value = aux[i].split("/")[0]*1;
      bw    = aux[i].split("/")[1];
      switch(bw){
         case '20': output.bw20.push(value); break;
         case '40': output.bw40.push(value); break;
         case '80': output.bw80.push(value); break;
         case '160': output.bw160.push(value); break;
      }
   }
   return output;
}; // @handleChCapabilities

dao.caps = {};
dao.caps.get = function (data){
   var output = { bandwidth: { wl0: [], wl1: [] },  channel: { wl0: {}, wl1: {} }  };
   var url  = 'ss-json/fgw.wifiCaps.json';
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      $console.warn("response", response);
      if (!$U(response.data)){
         if ( !$U(response.data.bandwidth) && !$U(response.data.bandwidth.wl0) ) { output.bandwidth.wl0  = zpriv.handleBwCapabilities(response.data.bandwidth.wl0); }
         if ( !$U(response.data.bandwidth) && !$U(response.data.bandwidth.wl1) ) { output.bandwidth.wl1  = zpriv.handleBwCapabilities(response.data.bandwidth.wl1); }
         if ( !$U(response.data.channel) && !$U(response.data.channel.wl0) )     { output.channel.wl0    = zpriv.handleChCapabilities(response.data.channel.wl0) }
         if ( !$U(response.data.channel) && !$U(response.data.channel.wl1) )     { output.channel.wl1    = zpriv.handleChCapabilities(response.data.channel.wl1) }
      }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};

dao.devices = {};
dao.devices.get = function (data){
   var promises   = {}, bypass = 0, url = null;
   var defer      = appUtilities.$q.defer();
   var query        = 'ss-json/fgw.devices.json?bypass={0}';
   var output     = [];
   
   bypass = ( !$U(data) && !$U(data.bypassSession) ) ? (data.bypassSession) : (bypass);
   url = query.sprintf(bypass); 
   //[#2.0] - Makes REST request
   defer.resolve();
   return defer.promise
   .then(function(response){
      if ( !$U(data) && !$U(data.bypassWifi) && !!data.bypassWifi ){
         return;
      } else{
         return dao.get();
      }
   })
   .then(function(response){
      $console.warn("wifi::response", response);
      if ( !$U(response) && (true === response.success) && !$U(response.data) ){
         promises['wifi'] = angular.copy(response.data);
      }
      promises['request'] = $http.get(url);
      return appUtilities.$q.all(promises);
   })
   .then(function(response){
      /**
       * HTML response
       * Wifi: wl0, wl0.1, wl0.2, wl0.3, wl1, wl1.1, wl1.2, wl1.3
       * Sintaxe: HostName; MAC Address; IP Address; IPv6 Address; IPv6 Link-Local Address; Remaining Lease Time; Interface; Active Status
       * "<tr><td>ANDR�PT</td><td>f4:b7:e2:84:f8:19</td><td>192.168.1.2</td><td> </td><td>fe80::997c:b6c1:eda5:e6f7</td><td>1 horas, 58 minutos, 32 segundos</td><td>wl0</td><td>1</td></tr>"
       */
      // Fazer parse de html
      $console.warn("DAO::response", response);
      if ( !$U(response.request) && !$U(response.request.data) && !$U(response.request.data.dhcpLeases) ){
         var contents   = angular.element('<div><table><tbody>' + response.request.data.dhcpLeases + '</tbody></table></div>');
         var rows       = contents.find('tr');
         var value      = null;
         
         
         for ( var i = 0, leni = rows.length; i < leni; i++ ){
            var aux   = {}, port = null;
            var colls = rows.eq(i).find('td');
            $console.warn("colls.eq(6).text()", colls.eq(6).text());
            if ( !$U(port = colls.eq(6).text()) ){
               if ('wl0' === port){
                  aux.portName   = 'Wi-Fi 2,4 GHz';
                  if ( !$U(response['wifi']) ){ aux.netName    = zpriv.getSsid(response['wifi'], port); }
               } else if ('wl0.3' === port){
                  aux.portName   = 'Wi-Fi 2,4 GHz';
                  if ( !$U(response['wifi']) ){ aux.netName    = zpriv.getSsid(response['wifi'], port); }
               } else if ('wl1' === port){
                  aux.portName   = 'Wi-Fi 5 GHz';
                  if ( !$U(response['wifi']) ){ aux.netName    = zpriv.getSsid(response['wifi'], port); }
               } else if ('wl1.3' === port){
                  aux.portName   = 'Wi-Fi 5 GHz';
                  if ( !$U(response['wifi']) ){ aux.netName    = zpriv.getSsid(response['wifi'], port); }
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
            aux.status     = ( '1' === colls.eq(7).text() ) ? (true) : (false);
            output.push(aux);
         }
      }
      $console.warn("output", output);
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::devices::get

dao.devices.remove = function (data){
   return;
};// ::devices::remove

dao.macfilter = {};
dao.macfilter.get = function (){
   var url  = 'ss-json/fgw.macfilter.json';
   var promises = {}, output = { wl0: { primary: [], guest: [] }, wl1: { primary: [], guest: [] } }, macList = {};
   return dao.devices.get()
   .then(function(response){
      if ( (true === response.success) && !$U(response.data) ){
         promises['devices'] = angular.copy(response.data);
      }
      promises['request'] = $http.get(url);
      return appUtilities.$q.all(promises);
   })
   .then(function(response){
      $console.warn("response", response);
      if ( !$U(response.request) && !$U(response.request.data) ){
         output.wlanIfCount = angular.copy(response.request.data.wlanIfCount);
         // 2.4 GHz
         if ( !$U(response.request.data.wl0) ){
            macList.wl0 = { primary: {}, guest: {} };
            if ( !$U(response.request.data.wl0.primary) ){
               var aux = null;
               var primaryMacs = ( angular.isString(aux = response.request.data.wl0.primary.maclist) && aux.length > 0 ) ? (aux.split(' ')) : ([]);
               if ( primaryMacs.length > 0 ){
                  for ( var i = 0, leni = primaryMacs.length; i < leni; ++i ){
                     var key = '{0}'.sprintf(primaryMacs[i]);
                     macList.wl0.primary[key] = {};
                     macList.wl0.primary[key].mode = response.request.data.wl0.primary.mode*1;
                     macList.wl0.primary[key].mac  = primaryMacs[i];
                     macList.wl0.primary[key].ssid = response.request.data.wl0.primary.ssid;
                  }
               } else {
                  var key = 'empty';
                  macList.wl0.primary[key] = {};
                  macList.wl0.primary[key].mode   = response.request.data.wl0.primary.mode*1;
                  macList.wl0.primary[key].ssid   = response.request.data.wl0.primary.ssid;
               }
            }
            if ( !$U(response.request.data.wl0.guest) ){
               var aux = null;
               var guestMacs = ( angular.isString(aux = response.request.data.wl0.guest.maclist) && aux.length > 0 ) ? (aux.split(' ')) : ([]);
               if ( guestMacs.length > 0 ){
                  for ( var i = 0, leni = guestMacs.length; i < leni; ++i ){
                     var key = '{0}'.sprintf(guestMacs[i]);
                     macList.wl0.guest[key] = {};
                     macList.wl0.guest[key].mode   = response.request.data.wl0.guest.mode*1;
                     macList.wl0.guest[key].mac    = guestMacs[i];
                     macList.wl0.guest[key].ssid   = response.request.data.wl0.guest.ssid;
                  }
               } else {
                  var key = 'empty';
                  macList.wl0.guest[key] = {};
                  macList.wl0.guest[key].mode   = response.request.data.wl0.guest.mode*1;
                  macList.wl0.guest[key].ssid   = response.request.data.wl0.guest.ssid;
               }

            }
         }
         // 5 GHz
         if ( !$U(response.request.data.wl1) ){
            macList.wl1 = { primary: {}, guest: {} };
            if ( !$U(response.request.data.wl1.primary) ){
               var aux = null;
               var primaryMacs = ( angular.isString(aux = response.request.data.wl1.primary.maclist) && aux.length > 0 ) ? (aux.split(' ')) : ([]);
               if ( primaryMacs.length > 0 ){
                  for ( var i = 0, leni = primaryMacs.length; i < leni; ++i ){
                     var key = '{0}'.sprintf(primaryMacs[i]);
                     macList.wl1.primary[key] = {};
                     macList.wl1.primary[key].mode = response.request.data.wl1.primary.mode*1;
                     macList.wl1.primary[key].mac  = primaryMacs[i];
                     macList.wl1.primary[key].ssid = response.request.data.wl1.primary.ssid;
                  }
               } else {
                  var key = 'empty';
                  macList.wl1.primary[key] = {};
                  macList.wl1.primary[key].mode   = response.request.data.wl1.primary.mode*1;
                  macList.wl1.primary[key].ssid   = response.request.data.wl1.primary.ssid;
               }
            }
            if ( !$U(response.request.data.wl1.guest) ){
               var aux = null;
               var guestMacs = ( angular.isString(aux = response.request.data.wl1.guest.maclist) && aux.length > 0 ) ? (aux.split(' ')) : ([]);
               if ( guestMacs.length > 0 ){
                  for ( var i = 0, leni = guestMacs.length; i < leni; ++i ){
                     var key = '{0}'.sprintf(guestMacs[i]);
                     macList.wl1.guest[key] = {};
                     macList.wl1.guest[key].mode   = response.request.data.wl1.guest.mode*1;
                     macList.wl1.guest[key].mac    = guestMacs[i];
                     macList.wl1.guest[key].ssid   = response.request.data.wl1.guest.ssid;
                  }
               } else {
                  var key = 'empty';
                  macList.wl1.guest[key] = {};
                  macList.wl1.guest[key].mode   = response.request.data.wl1.guest.mode*1;
                  macList.wl1.guest[key].ssid   = response.request.data.wl1.guest.ssid;
               }
            }
         }
      }
      $console.warn("response", response);
      for ( var i = 0, leni = response.devices.length; i < leni; ++i ){
         var device = response.devices[i];
         if ("Wi-Fi 2,4 GHz" === device.portName){
            for (var key in macList.wl0.primary){
               if (key === device.mac){ macList.wl0.primary[key].deviceName = device.hostName; }
            }
            for (var key in macList.wl0.guest){
               if (key === device.mac){ macList.wl0.guest[key].deviceName = device.hostName; }
            }
         }
         if ("Wi-Fi 5 GHz" === device.portName){
            for (var key in macList.wl1.primary){
               if (key === device.mac){ macList.wl1.primary[key].deviceName = device.hostName; }
            }
            for (var key in macList.wl1.guest){
               if (key === device.mac){ macList.wl1.guest[key].deviceName = device.hostName; }
            }
         }
      }
      for ( var key in macList.wl0.primary ) { output.wl0.primary.push(macList.wl0.primary[key]); }
      for ( var key in macList.wl1.primary ) { output.wl1.primary.push(macList.wl1.primary[key]); }
      for ( var key in macList.wl0.guest )   { output.wl0.guest.push(macList.wl0.guest[key]); }
      for ( var key in macList.wl1.guest )   { output.wl1.guest.push(macList.wl1.guest[key]); }
      $console.warn("output", output);
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
   
};// ::macfilter::get

dao.macfilter.config = function (data){
   var query = null, url = null;
   var cgiQuery = 'wirelessmacfltcfg.cmd?action=mode&wlIdx={0}&wlFltMacMode={1}&wlFltMacModeGuest3={2}';
   var primaryMode = '', guestMode = '';

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   $console.warn("data", data);
   
   if ( 'primary' === data.network ){
      primaryMode += data.value;
   }
   if ( 'guest' === data.network ){
      guestMode += data.value;
   }
   
   url = cgiQuery.sprintf(data.iface, primaryMode, guestMode);
   $console.warn("url", url);

   //[#2.0] - send request
   //return $http.get('ss-json/fgw.wifi.json') // Emulation - To be removed
   return $http.get(url)
   .then(function(response){
      return { success: true, data: data };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::macfilter::create

dao.macfilter.create = function (data){
   var query = null, url = null;
   var cgiQuery = 'wirelessmacfltcfg.cmd?action=add&wlIdx={0}&wlFltMacList={1}&wlFltMacListGuest3={2}';
   var primaryMac = '', guestMac = '';

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   $console.warn("data", data);
   if ('primary' === data.ssid){
      primaryMac += data.mac;
   } 
   if ('guest' === data.ssid){
      guestMac += data.mac;
   }
   url = cgiQuery.sprintf(data.networkInterface, primaryMac, guestMac);
   $console.warn("url", url);
   //return { success: true, data: data }; // Emulation - To be removed
// var defer = appUtilities.$q.defer();
// $timeout(function(){
//    return defer.resolve({ success: true, data: data, errors: null });
// }, 8000);
// return defer.promise;
   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      return { success: true, data: data };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::macfilter::create

dao.macfilter.remove = function (data){
   var url = null, aux = null;
   var cgiQuery = 'wirelessmacfltcfg.cmd?action=remove&wlIdx={0}&wlFltMacList={1}&wlFltMacListGuest3={2}';
   var primaryMac = '', guestMac = '';
   //[#1.0] - Validate input arguments
   $console.warn("data", data);
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   
   if ( !!data.isGuest ){
      guestMac += data.mac;
   } else {
      primaryMac += data.mac;
   }
   url = cgiQuery.sprintf(data.iface, primaryMac, guestMac);
   $console.warn("url", url);
   //return { success: true, data: data } // Emulation - To be removed
   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      return { success: true, data: data };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::macfilter::remove

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
         for ( var i = 4, leni = rows.length; i < leni; i++ ){
            var colls   = rows.eq(i).find('td');
            var val     = colls.eq(0).text();
            var res     = null;
            stats = {}
            stats.interfaceName = ( !$U(res = val.match(/Wi[^\]]+/g)) && !$U(res[0])) ? (res[0]) : (null);
            stats.rx = {};
            stats.rx.totalBytes = colls.eq(1).text();
            stats.rx.totalPkts = colls.eq(2).text();
            stats.rx.totalErrors = colls.eq(3).text();
            stats.rx.totalDrops = colls.eq(4).text();
            stats.tx = {};
            stats.tx.totalBytes = colls.eq(9).text();
            stats.tx.totalPkts = colls.eq(10).text();
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
   var url = 'wirelessStatsRst.cmd?';

   //[#2.0] - send request
   //return $http.get('ss-json/fgw.wan.json') // Emulation - To be removed
   return $http.get(url)
   .then(function(response){
      return { success: true, data: {} };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::statistics::reset

dao.neighbours = {};
dao.neighbours.get = function (data){
   var url     = null;
   var querya  = 'ss-json/fgw.neighbours24.json';
   var queryb  = 'ss-json/fgw.neighbours5.json';

   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   if ( $U(data.ifType) ){ throw new ReferenceError('Missing mandatory arguments[data.ifType]'); }
   url = (1 === data.ifType) ? (queryb) : (querya);
   
   //[#2.0] - send request
   //return $http.get('ss-json/fgw.wan.json') // Emulation - To be removed

   
   return $http.get(url)
   .then(function(response){
      $console.warn("response", response);
      
//    var defer = appUtilities.$q.defer();
//    $timeout(function(){
//       return defer.resolve({ success: true, data: response.data.data || {}, errors: null });
//    }, 8000);
//    return defer.promise;
      
      
      return { success: true, data: response.data.data || {} };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::neighbours::get

return dao;
}]);
return module;
});

