'use strict';
/**
 * @ngdoc object
 * @name uxfwk.lan.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a lan.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 * parentalControl
 * [{
 *    ruleName:            string
 *    deviceName:          string
 *    mac:                 string
 *    blockUser:           string
 *    weekDays:            string
 *    blockingTime:        string
 * },
 * ...]
 * urlFilter
 * [{
 *    "address":           string
 *    "port":              string
 * },
 * ...]
 * firewall:
 * {
 *    "enable":            string
 * }
 * dmz:
 * {
 *    "enable":            string
 *    "host":              string
 * }
 * portForwarding:
 * [{
 *    "interface":               string
 *    "serverIp":                string
 *    "service":                 string
 *    "enablePortRange":         string
 *    "protocol":                string
 *    "externalPortStart":       string
 *    "externalPortEnd":         string
 *    "internalPortStart":       string
 *    "internalPortEnd":         string
 * },
 * ...]
 * portActivation:
 * [{
 *    "aplicationName":          string
 *    "activePortStart":         string
 *    "activePortEnd":           string
 *    "forwardPortStart":        string
 *    "forwardPortEnd":          string
 *    "activate":                string
 * },
 * ...]
 * 
 */
define(['angularAMD', 'uxfwk', 'uxfwk.string', 'modules/fgw.wan/fgw.wan.dao'], function module (angularAMD, uxfwk){
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.security.dao', ['appUtilities', 'uxfwk.fgw.wan.dao', function dao (appUtilities, wanDao){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (data){
   var url  = 'ss-json/fgw.security.json';
   var output = {};
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      if ( !$U(response.data) ){
         
         /**
          * <tr><td>user</td><td>b4:b5:2f:87:99:99</td>
          * Mon <td align='center'>&nbsp;</td> 0x01
          * Tue <td align='center'>&nbsp;</td> 0x02
          * Wed <td align='center'>&nbsp;</td> 0x04
          * Thu <td align='center'>x</td>      0x08
          * Fri <td align='center'>&nbsp;</td> 0x10
          * Sat <td align='center'>&nbsp;</td> 0x20
          * Sun <td align='center'>&nbsp;</td> 0x40
          * Start <td>1:30</td> Stop <td>10:30</td>
          * <td align='center'><input type='checkbox' name='rml' value='user'></td></tr>
          */
         if ( !$U(response.data.parentalControl) ){
            output.parentalList  = [];
            var contents            = angular.element('<div><table><tbody>' + response.data.parentalControl + '</tbody></table></div>');
            var rows                = contents.find('tr');
            
            for ( var i = 0, leni = rows.length; i < leni; i++ ){
               var aux   = {};
               var colls = rows.eq(i).find('td');
               
               aux.ruleName     = colls.eq(0).text();
               aux.mac          = colls.eq(1).text();

               aux.weekDays = 0x00;
               aux.weekDays |= ( "x" === colls.eq(2).text() ) ? (0x01) : (0x00); // Mon
               aux.weekDays |= ( "x" === colls.eq(3).text() ) ? (0x02) : (0x00); // Tue
               aux.weekDays |= ( "x" === colls.eq(4).text() ) ? (0x04) : (0x00); // Wed
               aux.weekDays |= ( "x" === colls.eq(5).text() ) ? (0x08) : (0x00); // Thu
               aux.weekDays |= ( "x" === colls.eq(6).text() ) ? (0x10) : (0x00); // Fri
               aux.weekDays |= ( "x" === colls.eq(7).text() ) ? (0x20) : (0x00); // Sat
               aux.weekDays |= ( "x" === colls.eq(8).text() ) ? (0x40) : (0x00); // Sun
               
               aux.blockingTime  = "" + colls.eq(9).text() + " - " + colls.eq(10).text() + "";
               aux.rmLst         = colls.eq(11).find('input').val();
               output.parentalList.push(aux);
            }
         }

         /**
          * <tr><td>expresso.pt</td><td>80</td><td align='center'><input type='checkbox' name='rml' value='expresso.pt'></td></tr>
          */
         if ( !$U(response.data.urlFilter) ){
            output.urlList  = [];
            var contents            = angular.element('<div><table><tbody>' + response.data.urlFilter + '</tbody></table></div>');
            var rows                = contents.find('tr');
            
            for ( var i = 0, leni = rows.length; i < leni; i++ ){
               var aux   = {};
               var colls = rows.eq(i).find('td');
               
               aux.address    = colls.eq(0).text();
               aux.port       = colls.eq(1).text();
               aux.rmLst      = colls.eq(2).find('input').val();
               output.urlList.push(aux);
            }
         }
         if ( !$U(response.data.urlmode) ){
            output.urlmode = ('Include' === response.data.urlmode) ? (0) : (1);
         }
         if ( !$U(response.data.firewall) )  { 
            output.firewall = {};
            //output.firewall.enable = ( 1 === response.data.firewall*1 ) ? (true) : (false);
            if ( !$U(response.data.firewall) ){
               var contents      = angular.element('<div><table><tbody>' + response.data.firewall + '</tbody></table></div>');
               var rows          = contents.find('tr');
               var colls         = rows.eq(0).find('td');
               var aux           = {}, val = null;
               output.firewall.enable      = ( !$U(val = colls.eq(10)) && ('Enabled' === val.text()) ) ? (1): (0);
            }
            if ( !$U(response.data.wanIf) ){ output.firewall.wanIf = response.data.wanIf; }
         }
         if ( !$U(response.data.dmz) && !$U(response.data.dmzHost) ){ 
            output.dmz              = {};
            output.dmz.enable = ( (1 === response.data.dmz*1) && ("" !== response.data.dmzHost) ) ? (true) : (false);
            output.dmz.host   = response.data.dmzHost;
         }
      }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::get

dao.firewall = {};
dao.firewall.config = function (data){
   var query = null, url = null;
   var cgiQueryEnable   = 'wancfg.cmd?action=enableFirewall&wanIfName={0}';
   var cgiQueryDisable  = 'wancfg.cmd?action=disableFirewall&wanIfName={0}';

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   $console.warn("DAO::data", data);
   // Configuração do DMZ
   
   // Fazer um serviço no index que faça o preenchimento do sessionKey
   if ( !$U(data.firewall) && !$U(data.firewall.enable) ){
      query = (!!data.firewall.enable) ? (cgiQueryEnable.sprintf(data.firewall.wanIf)) : (cgiQueryDisable.sprintf(data.firewall.wanIf));
      $console.warn("query", query);
   } else { return; }
   url = query;
   $console.warn("url", url);

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      $console.warn("response", response);
      return { success: true, data: data };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::config

dao.parentalrule = {};
dao.parentalrule.create = function (data){
   var query = null, url = null;
   var cgiQuery = 'todmngr.tod?action=add&username={0}&mac={1}&days={2}&start_time={3}&end_time={4}';

   $console.warn("data", data);
   //[#1.0] - Validate input arguments
   if ( !angular.isObject(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }

   query = cgiQuery.sprintf(encodeURIComponent(data.username)
      , data.mac
      , (data.days || 0)
      , ((data.start_time.getHours()*60)+data.start_time.getMinutes())
      , ((data.end_time.getHours()*60)+data.end_time.getMinutes()));
   url = query;
   $console.warn("url", url);

   //[#2.0] - send request
   //return $http.get('ss-json/fgw.wifi.json') // Emulation - To be removed
   return $http.get(url)
   .then(function(response){ $console.warn("then::response", response); return { success: true, data: data, errors: null }; })
   .catch(function(response){ $console.warn("catch::response", response); return appUtilities.$processRestException(response, data); });
};// ::create

dao.parentalrule.remove = function (data){
   var query = null, url = null;
   var cgiQuery = 'todmngr.tod?action=remove&rmLst={0}';
   var remove = {};

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }

   remove = data;
   $console.warn("data", data);
   query = cgiQuery.sprintf(encodeURIComponent(data.rmLst));
   url = query;
   $console.warn("url", url);

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){ return { success: true, data: data, errors: null }; })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::remove

dao.urlrule = {};
dao.urlrule.config = function (data){
   var query = null, url = null, val = null;
   var cgiQuery = 'urlfilter.cmd?action=save&listtype={0}';

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   $console.warn("data", data);

   val = ( 0 === data.value*1 ) ? ('Include') : ('Exclude');
   url = cgiQuery.sprintf(val);
   $console.warn("url", url);

   //[#2.0] - send request

   //return $http.get('ss-json/fgw.wifi.json') // Emulation - To be removed
   return $http.get(url)
   .then(function(response){
      return { success: true, data: data };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::config

dao.urlrule.create = function (data){
   var query = null, url = null;
   var cgiQuery = 'urlfilter.cmd?action=set_url&TodUrlAdd={0}&port_num={1}';

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }

   query = cgiQuery.sprintf(encodeURIComponent(data.address), data.port);
   url = query;
   $console.warn("url", url);

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){ return { success: true, data: data, errors: null }; })
   .catch(function(response){ $console.warn("ERROR::RESPONSE=", response); return appUtilities.$processRestException(response, data); });
};// ::create

dao.urlrule.remove = function (data){
   var query = null, url = null;
   var cgiQuery = 'urlfilter.cmd?action=remove_url&rmLst={0}';
   var remove = {};

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }

   $console.warn("remove_data", data);
   query = cgiQuery.sprintf(encodeURIComponent(data.address));
   url = query;

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){ return { success: true, data: data }; })
   .catch(function(response){ $console.warn("remove::response", response); return appUtilities.$processRestException(response, data); });
};// ::remove


dao.dmz = {};
dao.dmz.config = function (data){
   var query = null, url = null;
   var defer = $q.defer();
   var cgiQuery = 'scdmz.cmd?address={0}';
   var config = {};

   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   $console.warn("DAO::data", data);
   // Configuração do DMZ
   
   // Fazer um serviço no index que faça o preenchimento do sessionKey
   if ( !$U(data.dmz) /*&& !$U(data.dmz.enable)*/ ){
      config.dmz = {};
      config.dmz.dmzHost = data.dmz.host;
      
      $console.warn("config.dmz.dmzHost", config.dmz.dmzHost);
      query = cgiQuery.sprintf(config.dmz.dmzHost);
      $console.warn("query", query);
   } else { return defer.promise; }
   url = query;
   $console.warn("url", url);

   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      $console.warn("response", response);
      return { success: true, data: data, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::config

dao.nat = {};
dao.nat.get = function (data){
   var url  = 'ss-json/fgw.nat.json';
   //var url  = 'ss-json/fgw.nat2.json';
   var output = {}, iface = null;
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      $console.warn("DAO::response", response);
      /**
       * HTML response
       *    <tr><td>Skype UDP at 192.168.1.64:23346 (3636)</td><td>23346</td><td>23346</td><td>UDP</td><td>23346</td><td>23346</td><td>192.168.1.64</td><td>veip0.1</td><td align='center'><input type='checkbox' name='rml' value='192.168.1.64|23346|23346|UDP|23346|23346'></td></tr>
       *    <tr><td>Skype TCP at 192.168.1.64:23346 (3636)</td><td>23346</td><td>23346</td><td>TCP</td><td>23346</td><td>23346</td><td>192.168.1.64</td><td>veip0.1</td><td align='center'><input type='checkbox' name='rml' value='192.168.1.64|23346|23346|TCP|23346|23346'></td></tr>
       */
      if ( !$U(response.data.portForwarding) ){
         output.portForwarding = [];
         var contents   = angular.element('<div><table><tbody>' + response.data.portForwarding + '</tbody></table></div>');
         var rows       = contents.find('tr');
         
         for ( var i = 0, leni = rows.length; i < leni; i++ ){
            var aux   = {};
            var colls = rows.eq(i).find('td');
            
            aux.service             = decodeURIComponent(colls.eq(0).text());
            if ( !$U(colls.eq(1)) ) { aux.externalPortStart   = colls.eq(1).text()*1; }
            if ( !$U(colls.eq(2)) ) { aux.externalPortEnd     = colls.eq(2).text()*1; }
            if ( !$U(colls.eq(3)) ) { aux.protocol            = colls.eq(3).text()*1; }
            if ( !$U(colls.eq(4)) ) { aux.internalPortStart   = colls.eq(4).text()*1; }
            if ( !$U(colls.eq(5)) ) { aux.internalPortEnd     = colls.eq(5).text()*1; }
            aux.serverIp            = colls.eq(6).text();
            iface = aux.interface   = colls.eq(7).text();
            aux.internalId          = i;
            output.portForwarding.push(aux);
         }
      }
      if ( !$U(response.data.portForwardRemEntries) ){
         output.portForwardRemEntries = response.data.portForwardRemEntries*1;
      }
      /**
       * HTML response
       * <tr><td>Napster</td><td>TCP</td><td>6699</td><td>6699</td><td>TCP</td><td>6699</td><td>6699</td><td>veip0.1</td><td align='center'><input type='checkbox' name='rml' value='veip0.1|TCP|6699|6699'></td></tr>
       */
      if ( !$U(response.data.portActivation) ){
         output.portActivation = [];
         var contents   = angular.element('<div><table><tbody>' + response.data.portActivation + '</tbody></table></div>');
         var rows       = contents.find('tr');
         
         for ( var i = 0, leni = rows.length; i < leni; i++ ){
            var aux   = {};
            var colls = rows.eq(i).find('td');
            
            aux.aplicationName      = decodeURIComponent(colls.eq(0).text());
            if ( !$U(colls.eq(1)) ) { aux.activeProtocol      = colls.eq(1).text()*1; }
            //aux.activeProtocol      = ('TCP' === colls.eq(1).text()) ? (0) : (1); 
            if ( !$U(colls.eq(2)) ) { aux.activePortStart     = colls.eq(2).text()*1; }
            if ( !$U(colls.eq(3)) ) { aux.activePortEnd       = colls.eq(3).text()*1; }
            if ( !$U(colls.eq(4)) ) { aux.forwardProtocol     = colls.eq(4).text()*1; }
            //aux.forwardProtocol      = ('TCP' === colls.eq(4).text()) ? (0) : (1); 
            if ( !$U(colls.eq(5)) ) { aux.forwardPortStart    = colls.eq(5).text()*1; }
            if ( !$U(colls.eq(6)) ) { aux.forwardPortEnd      = colls.eq(6).text()*1; }
            iface = colls.eq(7).text() || 'veip0.1';
            aux.internalId          = i;
            if (!$U(iface))         { aux.interface = iface; }
            output.portActivation.push(aux);
         }
      }
      if ( !$U(response.data.portActRemEntries) ){
         output.portActRemEntries = response.data.portActRemEntries*1;
      }
      $console.warn("output", output);
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::devices::get

dao.nat.portForwarding = {};
dao.nat.portForwarding.getCatalog = function (data){
   var url  = 'ss-json/fgw.natservices.catalog.json';
   var output = [];
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      $console.warn("DAO::response", response);
      if ( !$U(response.data.catalog) ){
         for ( var i = 0, leni = response.data.catalog.length; i < leni; ++i ){
            var serviceObj = {}
            var service = response.data.catalog[i];
            serviceObj.serviceName = service.serviceName;
            serviceObj.portList = [];
            for ( var j = 0, lenj = service.portList.length-1; j < lenj; ++j ){
               var ports = {};
               ports.externalPortStart   = service.portList[j][0];
               ports.externalPortEnd     = service.portList[j][1];
               ports.protocol            = service.portList[j][2];
               ports.internalPortStart   = service.portList[j][3];
               ports.internalPortEnd     = service.portList[j][4];
               serviceObj.portList.push(ports);
            }
            output.push(serviceObj);
         }
      }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::portForwarding::getCatalog

dao.nat.portForwarding.create = function (data){
   var url = null, aux = null;
   var cgiQuery = 'scvrtsrv.cmd?action=add&srvName={0}&dstWanIf={1}&srvAddr={2}&proto={3}&eStart={4}&eEnd={5}&iStart={6}&iEnd={7}';
   var config = [], protocol = '', extStart = '', extEnd = '', intStart = '', intEnd = '';
   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   return wanDao.get()
   .then(function(response){
      if ( (true === response.success) && !$U(response.data) ){
         for ( var i = 0, leni = data.portList.length; i < leni; ++i ){
            var obj = {};
            delete data.portList[i].id;
            //if (i > 0){ extStart += ','; extEnd += ','; protocol += ','; intStart += ','; intEnd += ','; }
            data.portList[i].externalPortEnd = ( !$U(data.portList[i].externalPortEnd) ) ? (data.portList[i].externalPortEnd) : (data.portList[i].externalPortStart);
            data.portList[i].internalPortEnd = ( !$U(data.portList[i].internalPortEnd) ) ? (data.portList[i].internalPortEnd) : (data.portList[i].internalPortStart);
            extStart       += data.portList[i].externalPortStart;
            extEnd         += data.portList[i].externalPortEnd;
            protocol       += data.portList[i].protocol;
            intStart       += data.portList[i].internalPortStart;
            intEnd         += data.portList[i].internalPortEnd;
            obj.service    = angular.copy(encodeURIComponent(data.service));
            obj.interface  = (!$U(response.data.routeInterface.name)) ? (angular.copy(response.data.routeInterface.name)) : ("veip0.1");
            obj.serverIp   = angular.copy(data.serverIp);
            extStart += ','; extEnd += ','; protocol += ','; intStart += ','; intEnd += ','; 
            for ( var key in data.portList[i] ){ obj[key] = angular.copy(data.portList[i][key]*1); }
            config.push(obj);
         }
         url = cgiQuery.sprintf(data.service, response.data.routeInterface.name, data.serverIp, protocol, extStart, extEnd, intStart, intEnd);
         $console.warn("url", url);     
      }
      $console.warn("config", config);
      
      //return { success: true, data: config }; // Emulation - To be removed
      //[#2.0] - send request
      return $http.get(url).then(function(response){ return response; }).catch(function(response){ return response; });
   })
   .then(function(response){
      $console.warn("DAO::response", response);
      //return { success: true, data: config }; // Emulation - To be removed
      if (200 == response.status){
         return { success: true, data: config };
      } else {
         return appUtilities.$processRestException(response, data);
      }
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::nat::portForwarding::create
dao.nat.portForwarding.remove = function (data){
   var url = null, aux = null;
   var cgiQuery = 'scvrtsrv.cmd?action=remove&rmLst=';
                 //scvrtsrv.cmd?action=remove&rmLst=192.168.1.44%7C2300%7C2400%7C0%7C2300%7C2400&sessionKey=1807480155
                 //scvrtsrv.cmd?action=remove&rmLst=192.168.1.44|2300|2400|TCP|2300|2400,&sessionKey=942108414
   var config = {};
   //[#1.0] - Validate input arguments
   $console.warn("data", data);
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   
   for ( var i = 0, leni = data.length; i < leni; ++i ){
      var params = '{0}|{1}|{2}|{3}|{4}|{5}'.sprintf(data[i].serverIp, data[i].externalPortStart, data[i].externalPortEnd, data[i].protocol, data[i].internalPortStart, data[i].internalPortEnd);
      cgiQuery += params;
      cgiQuery += ',';
   }
   url = cgiQuery;
   $console.warn("url", url);

//   var defer = $q.defer(); // Emulation - To be removed
//   defer.resolve()
//   return defer.promise
   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      return { success: true, data: data };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::nat::portForwarding::remove

dao.nat.portActivation = {};
dao.nat.portActivation.getCatalog = function (data){
   var url  = 'ss-json/fgw.nataplications.catalog.json';
   var output = [];
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      $console.warn("DAO::getCatalog::response", response);
      if ( !$U(response.data.catalog) ){ output = response.data.catalog; }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::portActivation::getCatalog

dao.nat.portActivation.create = function (data){
   var url = null, aux = null;
   var cgiQuery = 'scprttrg.cmd?action=add&appName={0}&dstWanIf={1}&tProto={2}&tStart={3}&tEnd={4}&oProto={5}&oStart={6}&oEnd={7}';
                 //scprttrg.cmd?action=add&appName=Calista%20IP%20Phone&dstWanIf=veip0.1&tStart=5190,&tEnd=5190,&tProto=1,&oStart=3000,&oEnd=3000,&oProto=2,&sessionKey=402773982
   var config = [], activeProtocol = '', activeStart = '', activeEnd = '', forwardProtocol = '', forwardStart = '', forwardEnd = '';
   //[#1.0] - Validate input arguments
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   return wanDao.get()
   .then(function(response){
      if ( (true === response.success) && !$U(response.data) ){
         for ( var i = 0, leni = data.portList.length; i < leni; ++i ){
            var obj = {};
            delete data.portList[i].id;
            //if (i > 0){ activeProtocol += ','; activeStart += ','; activeEnd += ','; forwardProtocol += ','; forwardStart += ','; forwardEnd += ','; }
            data.portList[i].activePortEnd = ( !$U(data.portList[i].activePortEnd) ) ? (data.portList[i].activePortEnd) : (data.portList[i].activePortStart);
            data.portList[i].forwardPortEnd = ( !$U(data.portList[i].forwardPortEnd) ) ? (data.portList[i].forwardPortEnd) : (data.portList[i].forwardPortStart);
            activeProtocol    += data.portList[i].activeProtocol;
            activeStart       += data.portList[i].activePortStart;
            activeEnd         += data.portList[i].activePortEnd;
            forwardProtocol   += data.portList[i].forwardProtocol;
            forwardStart      += data.portList[i].forwardPortStart;
            forwardEnd        += data.portList[i].forwardPortEnd;
            obj.aplicationName = angular.copy(encodeURIComponent(data.aplicationName));
            for ( var key in data.portList[i] ){ obj[key] = angular.copy(data.portList[i][key]*1); }
            config.push(obj);
            activeProtocol += ','; activeStart += ','; activeEnd += ','; forwardProtocol += ','; forwardStart += ','; forwardEnd += ','; 
         }
         url = cgiQuery.sprintf(data.aplicationName, response.data.routeInterface.name, activeProtocol, activeStart, activeEnd, forwardProtocol, forwardStart, forwardEnd);
         $console.warn("url", url);     
      }
      $console.warn("config", config);
      
      //return { success: true, data: config }; // Emulation - To be removed
      //[#2.0] - send request
      return $http.get(url).then(function(response){ return response; }).catch(function(response){ return response; });
   })
   .then(function(response){
      if (200 == response.status){
         return { success: true, data: config };
      } else {
         return appUtilities.$processRestException(response, data);
      }
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::nat::portActivation::create

dao.nat.portActivation.remove = function (data){
   var url = null, aux = null;
   var cgiQuery = 'scprttrg.cmd?action=remove&rmLst=';
                 //scprttrg.cmd?action=remove&rmLst=veip0.1%7C1%7C5190%7C5190%7C1%7C3000%7C3000&sessionKey=778209433
   var config = {};
   //[#1.0] - Validate input arguments
   $console.warn("data", data);
   if ( $U(data) ){ throw new ReferenceError('Missing mandatory arguments[data]'); }
   
   for ( var i = 0, leni = data.length; i < leni; ++i ){
      var params = '{0}|{1}|{2}|{3}|{4}|{5}|{6}'.sprintf(data[i].interface, data[i].activeProtocol, data[i].activePortStart, data[i].activePortEnd, data[i].forwardProtocol, data[i].forwardPortStart, data[i].forwardPortEnd);
      cgiQuery += params;
      cgiQuery += ',';
   }
   url = cgiQuery;
   $console.warn("url", url); 
   //return { success: true, data: data }; // Emulation - To be removed
   //[#2.0] - send request
   return $http.get(url)
   .then(function(response){
      return { success: true, data: data };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::nat::portActivation::remove

return dao;
}]);
return module;
});

