'use strict';
/**
 * @ngdoc object
 * @name uxfwk.router.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a router.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 * home
 * {
 *    internet:            string
 *    lan:                 object<Info>
 *    wifi24:              object<Info>
 *    wifi5:               object<Info>
 *    voice:               object<Info>
 *    usb:                 object<Info>
 * }
 * Info
 * {
 *    status:           string
 *    deviceNum:        string
 * }
 */
define(['angularAMD', 'uxfwk', 'uxfwk.string', 'modules/fgw.lan/fgw.lan.dao', 'modules/fgw.wifi/fgw.wifi.dao'], function module (angularAMD, uxfwk){
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.home.dao', ['appUtilities', 'uxfwk.fgw.lan.dao', 'uxfwk.fgw.wifi.dao', function dao (appUtilities, lanDao, wifiDao){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (data){
   var promises = {}, bypass = 0, url = null;
   var query  = 'ss-json/fgw.home.json?bypass={0}';
   var output = {};
   var errors = [];
   var fn_promises = [], fn_args = [];
   
   bypass = ( !$U(data) ) ? (data) : (bypass);
   url = query.sprintf(bypass); 
   //[#2.0] - Makes REST request
   fn_promises.push(lanDao.get);
   fn_args.push({ bypassSession: bypass });
//   fn_promises.push(dao.devicesWrapper);
//   fn_args.push({ bypassSession: bypass });
//   fn_promises.push(wifiDao.devices.get);
//   fn_args.push({ bypassWifi: true, bypassSession: bypass });
   
   return uxfwk.promiseChain(fn_promises, fn_args, true)
      .then(function(response){
      $console.warn("promiseChain::responses", response);
      if ( (true === response[0].success) && !$U(response[0].data) && !$U(response[0].data.generalInfo) ){
         promises['lan'] = angular.copy(response[0].data.generalInfo);
      }else{ errors.push(response[0].errors); }
      
//      if ( (true === response[1].success) && !$U(response[1].data) ){
//         promises['devices'] = angular.copy(response[1].data);
//      }else{ errors.push(response[1].errors); }
      
//      if ( (true === response[2].success) && !$U(response[2].data) ){
//         promises['wifiDevices'] = angular.copy(response[2].data);
//      }else{ errors.push(response[2].errors); }
      

      promises['request'] = $http.get(url);
      return appUtilities.$q.all(promises);
   })
   .then(function(response){
      var countWl0 = 0, countWl1 = 0;
      output.wifi24 = {}, output.wifi5 = {}, output.lan = {}, output.usb = {}, output.voice = {};
      // Fazer parse de html
      $console.warn("HOME::DAO::response", response);
      if ( !$U(response.lan) && !$U(response.lan.interfaces) ){
         output.lan.status = false;
         for ( var i = 0, leni = response.lan.interfaces.length; i < leni; ++i ){
            if (true === response.lan.interfaces[i].status){
               output.lan.status = true; break;
            }
         }
      }
      //output.lan.deviceNum = ( !$U(response.lanDevices) && angular.isArray(response.lanDevices) ) ? (response.lanDevices.length) : (0);

      output.lan.deviceNum = 0;
      output.wifi24.deviceNum = countWl0;
      output.wifi5.deviceNum = countWl1;
//      if ( !$U(response.wifiDevices) ){
//         for ( var i = 0, leni = response.wifiDevices.length; i < leni; ++i ){
//            if ("Wi-Fi 2,4 GHz" === response.wifiDevices[i].portName){
//               countWl0++;
//               output.wifi24.deviceNum = countWl0;
//            }
//            if ("Wi-Fi 5 GHz" === response.wifiDevices[i].portName){
//               countWl1++;
//               output.wifi5.deviceNum = countWl1;
//            }
//         }
//      }
      output.usb.status = false;
      output.usb.deviceNum = 0;
      output.voice.status = false;
      output.voice.deviceNum = 0;
      if ( !$U(response.request) && !$U(response.request.data) ){
         if ( !$U(response.request.data.internet) ){
            var val           = null;
            var contents      = angular.element('<div><table><tbody>' + response.request.data.internet + '</tbody></table></div>');
            var rows          = contents.find('tr');
            var colls         = rows.eq(0).find('td');
            output.internet   = ( !$U(val = colls.eq(11)) && ('Connected' === val.text()) ) ? (true): (false);
         }
         if ( !$U(response.request.data.usb) ){
            var val           = null;
            var contents      = angular.element('<div><table><tbody>' + response.request.data.usb + '</tbody></table></div>');
            var rows          = contents.find('tr');
            output.usb.status = ( rows.length*1 > 0 ) ? (true) : (false);
            output.usb.deviceNum = rows.length*1;
         }
         if ( !$U(response.request.data.voice) ){
            var voice = null, num = 0;
            voice = response.request.data.voice.status.split(" ");
            output.voice.status = false;
            for ( var i = 1, leni = voice.length; i < leni; ++i ){
               if ( "Up" === voice[i] ){
                  num++;
                  output.voice.status = true;
               }
            }
            output.voice.deviceNum = (!!output.voice.status) ? (num) : (0);
         }
         if ( !$U(response.request.data.wifi) ){
            output.wifi24.status = ( (1 === response.request.data.wifi.statusWl0primary*1) || (1 === response.request.data.wifi.statusWl0guest*1) ) ? (true) : (false);
            output.wifi5.status = ( (1 === response.request.data.wifi.statusWl1primary*1) || (1 === response.request.data.wifi.statusWl1guest*1) ) ? (true) : (false);

         }
         if ( !$U(response.request.data.devices) ){
            var counter = [];
            // <#2.4GHz> <#5GHz> <#Eth>
            counter = response.request.data.devices.hostCount.split(" ");
           if ( !$U(counter[0]) ){ output.wifi24.deviceNum  = counter[0]*1; }
           if ( !$U(counter[1]) ){ output.wifi5.deviceNum   = counter[1]*1; }
           if ( !$U(counter[2]) ){ output.lan.deviceNum     = counter[2]*1; }
         }
      }
      $console.warn("output", output);
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); })
};// ::get

return dao;
}]);
return module;
});

