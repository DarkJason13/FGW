/**
 * 
 */
define('uxfwk.fgw.wifi.rules', ['angularAMD', 'uxfwk'
   , 'uxfwk.fgw.wifi.common'
   , 'uxfwk.rm.cache.data.manager'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U, lkey = 'uxfwk.fgw.wifi.rules: ';
   var info = $console.info.bind($console, lkey), warn = $console.warn.bind($console, lkey);
angularAMD.factory('uxfwk.fgw.wifi.rules', ['$filter', 'appUtilities'
   , 'uxfwk.rm.cache.data.manager'
   , 'uxfwk.fgw.wifi.common'
, function rules ($filter, appUtilities
   , cacheDataManager
   , common
){
var RULES = {field:{}}, zpriv = {};
var fnTranslate = $filter('translate');
var fnUppercase = $filter('uppercase');

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

zpriv.cache = function (data){
   if ( !angular.isObject(data) ){ return null; }
   return cacheDataManager.cache(data, {
      bandwidth0:     { list: null },
      bandwidth1:     { list: null },
      channel0:       { list: null },
      channel1:       { list: null },
      transmitPower0: { list: null },
      transmitPower1: { list: null },
      netAuth:        { list: null },
      encrypt:        { list: null },
      encryptStr:     { list: null },
      currentNetKey:  { list: null, init:angular.copy(data) }
   }, 'uxfwk.fgw.wifi.rules');
};// @init

zpriv.handleBandwidthValue = function (value){
   var output = null;
   switch(value){
      case '20':  output = common.bandwidth.bw20mhz; break;
      case '40':  output = common.bandwidth.bw40mhz; break;
      case '80':  output = common.bandwidth.bw80mhz; break;
      case '160': output = common.bandwidth.bw160mhz; break;
      default:    output = value*1; break;
   }
   return output;
}; // @handleBandwidthValue

RULES.field.network = function (field, locals){
   field.isVisible = function (value){
      var result = false;
      result = ( !$U(value) && !!value ) ? (true) : (false);
      return result;
   };// ::isVisible
};// ::network

RULES.field.bandwidth0 = function (field, locals){
   var attrkey = 'bandwidth0';
   field.isDisabled = uxfwk.$false;
   field.options = function (data){
      var mycache = zpriv.cache(data, attrkey), options = [], caps = [];
      if ( $U(locals) || $U(locals.capabilities) || $U(caps = locals.capabilities.bandwidthwl0) ){ return null; }
      if ( !mycache || !angular.isObject(mycache[attrkey]) ){ return null; }
      else if ( !angular.isArray(mycache[attrkey].list) ){
         for ( var i = 0, leni = caps.length; i < leni; ++i ){
            for ( var key in common.bandwidth ){
               if ( caps[i] === common.bandwidth[key] ){
                  options.push(key);
               }
            }
         }
         mycache[attrkey].list = uxfwk.map2array(uxfwk.mapFilter(common.bandwidth, options), 'key', 'value', function(obj){
            obj.text = fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.BANDWIDTH.OPTION.' + angular.uppercase(obj.key))
            return obj;
         });
      }
      return mycache[attrkey].list;
   };// ::options
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         if ( angular.isNumber(value) ){
            if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.bandwidth)) ){ return null; }
            else { return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.BANDWIDTH.OPTION.'+fnUppercase(key)); }
         } else { 
            if ( !angular.isString(key = uxfwk.getKeyByValue(zpriv.handleBandwidthValue(value), common.bandwidth)) ){ return null; }
            return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.BANDWIDTH.OPTION.'+fnUppercase(key));
         }
      },// @textualize
      expression: expression}};// @texter
   field.hasAlert = function (value, bwVal){
      var result = false;
      if ( !$U(bwVal) ){
         result = ( !$U(value) && (bwVal*1 !== value*1) ) ? (true) : (false);
      }
      return result;
   };// @texter
};// ::bandwidth0

RULES.field.channel0 = function (field, locals){
   var attrkey = 'channel0';
   field.isDisabled = uxfwk.$false;
   field.options = function (data){
      var keys = [], options = [], newArray = [], len = null, key = null;
      var mycache = zpriv.cache(data, attrkey), options = [], caps = [];
      if ( $U(locals) || $U(locals.capabilities) || $U(caps = locals.capabilities.channelwl0) ){ return null; }
      if ( !mycache || !angular.isObject(mycache[attrkey]) ){ return null; }
      if ( !angular.isObject(data.wl0) || $U(data.wl0.bandwidth) ){ return null; }
      if ( !$U(mycache[attrkey].list) && (data.wl0.bandwidth != data.$$$channelWl0OldBw) ){
         if ( null != data.wl0.channel ){
            data.wl0.channel = null;
         }else{
            mycache[attrkey].list = null;
         }
      } else if ( !angular.isArray(mycache[attrkey].list) ){
         data.$$$channelWl0OldBw = data.wl0.bandwidth;
         switch(data.wl0.bandwidth*1){
            case common.bandwidth.bw20mhz: keys = caps.bw20; break;
            case common.bandwidth.bw40mhz: keys = caps.bw40; break;
            case common.bandwidth.bw80mhz: keys = caps.bw80; break;
            case common.bandwidth.bw160mhz: keys = caps.bw160; break;
         }
         options.push({ key: 'auto', value: 0, text: fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.CHANNEL.OPTION.AUTO') });
         
         len = options.length;
         keys = keys.sort(uxfwk.$sortNumber);
         
         for ( var i = 0, leni = keys.length; i < leni; ++i ){
            if ( options[len-1].value != keys[i] ){
               key = 'ch{0}'.sprintf(keys[i]);
               
               options.push({ key: key, value: keys[i], text: fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.CHANNEL.OPTION.' + angular.uppercase(key)) });
               len = options.length;
            }
         }
         mycache[attrkey].list = options;
      }
      return mycache[attrkey].list;
   };// ::options
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.channel)) ){ return null; }
         else { return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.CHANNEL.OPTION.'+fnUppercase(key)); }
      },// @textualize
      expression: expression}};// @texter
   field.hasInfo = function (value, chVal){
      var result = false;
      if ( !$U(chVal) ){
         result = ( !$U(value) && (common.channel.auto === chVal*1) && (chVal*1 !== value*1) ) ? (true) : (false);
      }
      return result;
   };// @hasInfo
   field.hasAlert = function (value, chVal){
      var result = false;
      if ( !$U(chVal) ){
         result = ( !$U(value) && (common.channel.auto !== chVal*1) && (chVal*1 !== value*1) ) ? (true) : (false);
      }
      return result;
   };// @hasAlert
};// ::channel0

RULES.field.transmitPower0 = function (field, locals){
   var attrkey = 'transmitPower0';
   field.isDisabled = uxfwk.$false;
   field.options = function (data){
      var mycache = zpriv.cache(data, attrkey);
      if ( !mycache || !angular.isObject(mycache[attrkey]) ){ return null; }
      else if ( !angular.isArray(mycache[attrkey].list) ){
         mycache[attrkey].list = uxfwk.map2array(uxfwk.mapFilter(common.transmitPower, ['pw12', 'pw25', 'pw50', 'pw100']), 'key', 'value', function(obj){
            obj.text = fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.TRANSMITPOWER.OPTION.' + angular.uppercase(obj.key))
            return obj;
         });
      }
      return mycache[attrkey].list;
   };// ::options
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.transmitPower)) ){ return null; }
         else { return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.TRANSMITPOWER.OPTION.'+fnUppercase(key)); }
      },// @textualize
      expression: expression}};// @texter
};// ::transmitPower0

RULES.field.bandwidth1 = function (field, locals){
   var attrkey = 'bandwidth1';
   field.isDisabled = uxfwk.$false;
   field.options = function (data){
      var mycache = zpriv.cache(data, attrkey), options = [], caps = [];
      if ( $U(locals) || $U(locals.capabilities) || $U(caps = locals.capabilities.bandwidthwl1) ){ return null; }
      if ( !mycache || !angular.isObject(mycache[attrkey]) ){ return null; }
      else if ( !angular.isArray(mycache[attrkey].list) ){
         for ( var i = 0, leni = caps.length; i < leni; ++i ){
            for ( var key in common.bandwidth ){
               if ( caps[i] === common.bandwidth[key] ){
                  options.push(key);
               }
            }
         }
         mycache[attrkey].list = uxfwk.map2array(uxfwk.mapFilter(common.bandwidth, options), 'key', 'value', function(obj){
            obj.text = fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.BANDWIDTH.OPTION.' + angular.uppercase(obj.key))
            return obj;
         });
      }
      return mycache[attrkey].list;
   };// ::options
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         if ( angular.isNumber(value) ){
            if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.bandwidth)) ){ return null; }
            else { return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.BANDWIDTH.OPTION.'+fnUppercase(key)); }
         } else {
            if ( !angular.isString(key = uxfwk.getKeyByValue(zpriv.handleBandwidthValue(value), common.bandwidth)) ){ return null; }
            return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.BANDWIDTH.OPTION.'+fnUppercase(key));
         }
      },// @textualize
      expression: expression}};// @texter
   field.hasAlert = function (value, bwVal){
      var result = false;
      if ( !$U(bwVal) ){
         result = ( !$U(value) && (bwVal*1 !== value*1) ) ? (true) : (false);
      }
      return result;
   };// @texter
};// ::bandwidth1

RULES.field.channel1 = function (field, locals){
   var attrkey = 'channel1';
   field.isDisabled = uxfwk.$false;
   field.options = function (data){
      var keys = [], options = [], newArray = [], len = null, key = null;
      var mycache = zpriv.cache(data, attrkey), options = [], caps = [];
      if ( $U(locals) || $U(locals.capabilities) || $U(caps = locals.capabilities.channelwl1) ){ return null; }
      if ( !mycache || !angular.isObject(mycache[attrkey]) ){ return null; }
      if ( !angular.isObject(data.wl1) || $U(data.wl1.bandwidth) ){ return null; }
      if ( !$U(mycache[attrkey].list) && (data.wl1.bandwidth != data.$$$channelWl1OldBw) ){
         if ( null != data.wl1.channel ){
            data.wl1.channel = null;
         }else{
            mycache[attrkey].list = null;
         }
      } else if ( !angular.isArray(mycache[attrkey].list) ){
         data.$$$channelWl1OldBw = data.wl1.bandwidth;
         switch(data.wl1.bandwidth*1){
            case common.bandwidth.bw20mhz: keys = caps.bw20; break;
            case common.bandwidth.bw40mhz: keys = caps.bw40; break;
            case common.bandwidth.bw80mhz: keys = caps.bw80; break;
            case common.bandwidth.bw160mhz: keys = caps.bw160; break;
         }
         options.push({ key: 'auto', value: 0, text: fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.CHANNEL.OPTION.AUTO') });
         
         len = options.length;
         keys = keys.sort(uxfwk.$sortNumber);
         
         for ( var i = 0, leni = keys.length; i < leni; ++i ){
            if ( options[len-1].value != keys[i] ){
               key = 'ch{0}'.sprintf(keys[i]);
               
               options.push({ key: key, value: keys[i], text: fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.CHANNEL.OPTION.' + angular.uppercase(key)) });
               len = options.length;
            }
         }
         mycache[attrkey].list = options;
      }
      return mycache[attrkey].list;
   };// ::options
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.channel)) ){ return null; }
         else { return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.CHANNEL.OPTION.'+fnUppercase(key)); }
      },// @textualize
      expression: expression}};// @texter
   field.hasInfo = function (value, chVal){
      var result = false;
      if ( !$U(chVal) ){
         result = ( !$U(value) && (common.channel.auto === chVal*1) && (chVal*1 !== value*1) ) ? (true) : (false);
      }
      return result;
   };// @hasInfo
   field.hasAlert = function (value, chVal){
      var result = false;
      if ( !$U(chVal) ){
         result = ( !$U(value) && (common.channel.auto !== chVal*1) && (chVal*1 !== value*1) ) ? (true) : (false);
      }
      return result;
   };// @hasAlert
};// ::channel1

RULES.field.transmitPower1 = function (field, locals){
   var attrkey = 'transmitPower1';
   field.isDisabled = uxfwk.$false;
   field.options = function (data){
      var mycache = zpriv.cache(data, attrkey);
      if ( !mycache || !angular.isObject(mycache[attrkey]) ){ return null; }
      else if ( !angular.isArray(mycache[attrkey].list) ){
         mycache[attrkey].list = uxfwk.map2array(uxfwk.mapFilter(common.transmitPower, ['pw12', 'pw25', 'pw50', 'pw100']), 'key', 'value', function(obj){
            obj.text = fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.TRANSMITPOWER.OPTION.' + angular.uppercase(obj.key))
            return obj;
         });
      }
      return mycache[attrkey].list;
   };// ::options
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.transmitPower)) ){ return null; }
         else { return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.TRANSMITPOWER.OPTION.'+fnUppercase(key)); }
      },// @textualize
      expression: expression}};// @texter
};// ::transmitPower1


RULES.field.netAuth = function (field, locals){
   var attrkey = 'netAuth';
   field.isDisabled = uxfwk.$false;
   field.options = function (data){
      var mycache = zpriv.cache(data, attrkey);
      if ( !mycache || !angular.isObject(mycache[attrkey]) ){ return null; }
      else if ( !angular.isArray(mycache[attrkey].list) ){
         mycache[attrkey].list = uxfwk.map2array(uxfwk.mapFilter(common.netAuth, ['open', 'shared', 's8021x', 'wpa', 'wpa2', 'wpa2_psk', 'mixed_wpa2_wpa_psk', 'mixed_wpa_wpa2']), 'key', 'value', function(obj){
            obj.text = fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.NETAUTH.OPTION.' + angular.uppercase(obj.key))
            return obj;
         });
      }
      return mycache[attrkey].list;
   };// ::options
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         if ( angular.isNumber(value) ){
            if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.netAuth)) ){ return null; }
            else { return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.NETAUTH.OPTION.'+fnUppercase(key)); }
         } else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::netAuth

RULES.field.encrypt = function (field, locals){
   // These rules are being used for each network
   var attrkey = 'encrypt';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.wpa:
               case common.netAuth.wpa2:
               case common.netAuth.wpa_psk:
               case common.netAuth.wpa2_psk:
               case common.netAuth.mixed_wpa2_wpa_psk:
               case common.netAuth.mixed_wpa_wpa2:
                  result = true;
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
   field.options = function (data){
      var mycache = zpriv.cache(data, attrkey);
      if ( !mycache || !angular.isObject(mycache[attrkey]) ){ return null; }
      else if ( !angular.isArray(mycache[attrkey].list) ){
         mycache[attrkey].list = uxfwk.map2array(uxfwk.mapFilter(common.encrypt, ['aes', 'tkipaes']), 'key', 'value', function(obj){
            obj.text = fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.ENCRYPT.OPTION.' + angular.uppercase(obj.key))
            return obj;
         });
      }
      return mycache[attrkey].list;
   };// ::options
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         if ( angular.isNumber(value) ){
            if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.encrypt)) ){ return null; }
            else { return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.ENCRYPT.OPTION.'+fnUppercase(key)); }
         } else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::encrypt

RULES.field.encryptStr = function (field, locals){
   var attrkey = 'encryptStr';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.open:
               case common.netAuth.s8021x:
               case common.netAuth.shared:
                  if ( !$U(data.wep) && !!data.wep ){
                     result = true;
                  }
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
   field.options = function (data){
      var mycache = zpriv.cache(data, attrkey);
      if ( !mycache || !angular.isObject(mycache[attrkey]) ){ return null; }
      else if ( !angular.isArray(mycache[attrkey].list) ){
         mycache[attrkey].list = uxfwk.map2array(uxfwk.mapFilter(common.encryptStr, ['b128', 'b64']), 'key', 'value', function(obj){
            obj.text = fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.ENCRYPTSTR.OPTION.' + angular.uppercase(obj.key))
            return obj;
         });
      }
      return mycache[attrkey].list;
   };// ::options
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.encryptStr)) ){ return null; }
         else { return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.ENCRYPTSTR.OPTION.'+fnUppercase(key)); }
      },// @textualize
      expression: expression}};// @texter
};// ::encryptStr

RULES.field.currentNetKey = function (field, locals){
   var attrkey = 'currentNetKey';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.open:
               case common.netAuth.s8021x:
               case common.netAuth.shared:
                  if ( !$U(data.wep) && !!data.wep ){
                     result = true;
                  }
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
   field.options = function (data, value){
      var mycache       = zpriv.cache(data, attrkey);
      var options       = ( !$U(data.netAuth) && (common.netAuth.s8021x === data.netAuth*1 ) ) ? (['k2', 'k3']) : (['k1', 'k2', 'k3', 'k4']);

      if ( !$U(mycache[attrkey]) && !$U(mycache[attrkey].init) && !$U(mycache[attrkey].init.netAuth) 
         && (data.netAuth*1 !== mycache[attrkey].init.netAuth*1) && (common.netAuth.s8021x === data.netAuth*1) ){
         mycache[attrkey].init.netAuth = data.netAuth*1;
         mycache[attrkey].list = null;
         options = ['k2', 'k3'];
      } else if ( !$U(mycache[attrkey]) && !$U(mycache[attrkey].init) && !$U(mycache[attrkey].init.netAuth) 
         && (common.netAuth.s8021x === mycache[attrkey].init.netAuth*1) && (mycache[attrkey].init.netAuth*1 !== data.netAuth*1) ){
         mycache[attrkey].init.netAuth = data.netAuth*1;
         mycache[attrkey].list = null;
         options = ['k1', 'k2', 'k3', 'k4'];
      }
      
      if ( !mycache || !angular.isObject(mycache[attrkey]) ){ return null; }
      else if ( !angular.isArray(mycache[attrkey].list) ){
         
         
         mycache[attrkey].list = uxfwk.map2array(uxfwk.mapFilter(common.currentNetKey, options), 'key', 'value', function(obj){
            obj.text = fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.CURRENTNETKEY.OPTION.' + angular.uppercase(obj.key))
            return obj;
         });
      }
      return mycache[attrkey].list;
   };// ::options
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else if ( !angular.isString(key = uxfwk.getKeyByValue(value, common.currentNetKey)) ){ return null; }
         else { return fnTranslate('TEXT.FGW.WIFI.HOME.COMMON.CURRENTNETKEY.OPTION.'+fnUppercase(key)); }
      },// @textualize
      expression: expression}};// @texter
};// ::currentNetKey

RULES.field.password = function (field, locals){
   var attrkey = 'password';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.wpa_psk:
               case common.netAuth.wpa2_psk:
               case common.netAuth.mixed_wpa2_wpa_psk:
                  result = true;
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
};// ::password

RULES.field.wep = function (field, locals){
   var attrkey = 'wep';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.open:
                  result = true;
                  break;
               case common.netAuth.s8021x:
               case common.netAuth.shared:
                  result = true;
                  data.wep = true;
                  break;
               default:
                  result = false;
                  data.wep = false;
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
};// ::wep

RULES.field.preAuthWpa2 = function (field, locals){
   var attrkey = 'preAuthWpa2';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.wpa2:
               case common.netAuth.mixed_wpa_wpa2:
                  result = true;
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
};// ::preAuthWpa2

RULES.field.reAuthInterval = function (field, locals){
   var attrkey = 'reAuthInterval';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.wpa:
               case common.netAuth.wpa2:
               case common.netAuth.mixed_wpa_wpa2:
                  result = true;
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
};// ::reAuthInterval

RULES.field.intervalWpaKeyChange = function (field, locals){
   var attrkey = 'intervalWpaKeyChange';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.wpa:
               case common.netAuth.wpa2:
               case common.netAuth.mixed_wpa_wpa2:
                  result = true;
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
};// ::intervalWpaKeyChange

RULES.field.radiusIp = function (field, locals){
   var attrkey = 'radiusIp';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.s8021x:
               case common.netAuth.wpa:
               case common.netAuth.wpa2:
               case common.netAuth.mixed_wpa_wpa2:
                  result = true;
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
};// ::radiusIp

RULES.field.radiusPort = function (field, locals){
   var attrkey = 'radiusPort';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.s8021x:
               case common.netAuth.wpa:
               case common.netAuth.wpa2:
               case common.netAuth.mixed_wpa_wpa2:
                  result = true;
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
};// ::radiusPort

RULES.field.radiusKey = function (field, locals){
   var attrkey = 'radiusKey';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.s8021x:
               case common.netAuth.wpa:
               case common.netAuth.wpa2:
               case common.netAuth.mixed_wpa_wpa2:
                  result = true;
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
};// ::radiusKey

RULES.field.netKey1 = function (field, locals){
   var attrkey = 'netKey1';

   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.open:
               case common.netAuth.shared:
                  if ( !$U(data.wep) && !!data.wep ){
                     result = true;
                  }
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
   field.spec = function (data, ngModel){
      return {
         uxfwkFgwWifiNetKeyPrintAscii: function (value, modelValue){
            $console.warn("value", value.charCodeAt(0));
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) ){
               switch(data.encryptStr*1){
                  case common.encryptStr.b64: 
                     if ( 5 === value.length*1 ){
                        if ( !!uxfwk.uxfwkValidateRules.validatePrintableAsciiChars(value, value, ngModel) ){
                           return true;
                        } else { return false; }
                     } else { return true; }
                     break;
                  case common.encryptStr.b128: 
                     if ( 13 === value.length*1 ){
                        if ( !!uxfwk.uxfwkValidateRules.validatePrintableAsciiChars(value, value, ngModel) ){
                           return true;
                        } else { return false; }
                     } else { return true; } 
                     break;
                  default: return false; break;
               }
            } else { return false; }
         },// endof uxfwkFgwWifiNetKeyPrintAscii
         uxfwkFgwWifiNetKeyHex: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) ){
               switch(data.encryptStr*1){
                  case common.encryptStr.b64: 
                     if ( 10 === value.length*1 ){
                        var myvalue = "0x" + value;
                        if ( !!uxfwk.uxfwkValidateRules.validateHex(myvalue, myvalue) ){
                           return true;
                        } else { return false; }
                     } else { return true; }
                     break;
                  case common.encryptStr.b128: 
                     if ( 26 === value.length*1 ){
                        var myvalue = "0x" + value;
                        if ( !!uxfwk.uxfwkValidateRules.validateHex(myvalue, myvalue) ){
                           return true;
                        } else { return false; }
                     } else { return true; } 
                     break;
                  default: return false; break;
               }
            } else { return false; }
         },// endof uxfwkFgwWifiNetKey1AsciiHexValidate
         uxfwkFgwWifiNetKey64Len: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) && (common.encryptStr.b64 === data.encryptStr*1 ) ){
               if ( (5 == value.length) || (10 == value.length) ){
                  return true;
               } else {
                  return false; 
               }
            } else { return true; }
         },// endof uxfwkFgwWifiNetKey64Len
         uxfwkFgwWifiNetKey128Len: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) && (common.encryptStr.b128 === data.encryptStr*1 ) ){
               if ( (13 == value.length) || (26 == value.length) ){
                  return true;
               } else {
                  return false; 
               }
            } else { return true; }
         },// endof uxfwkFgwWifiNetKey128Len
      pad:uxfwk.$true};
   };// endof spec
};// ::netKey1

RULES.field.netKey2 = function (field, locals){
   var attrkey = 'netKey2';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.open:
               case common.netAuth.s8021x:
               case common.netAuth.shared:
                  if ( !$U(data.wep) && !!data.wep ){
                     result = true;
                  }
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
   field.spec = function (data, ngModel){
      return {
         uxfwkFgwWifiNetKeyPrintAscii: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) ){
               switch(data.encryptStr*1){
                  case common.encryptStr.b64: 
                     if ( 5 === value.length*1 ){
                        if ( !!uxfwk.uxfwkValidateRules.validatePrintableAsciiChars(value, value, ngModel) ){
                           return true;
                        } else { return false; }
                     } else { return true; }
                     break;
                  case common.encryptStr.b128: 
                     if ( 13 === value.length*1 ){
                        if ( !!uxfwk.uxfwkValidateRules.validatePrintableAsciiChars(value, value, ngModel) ){
                           return true;
                        } else { return false; }
                     } else { return true; } 
                     break;
                  default: return false; break;
               }
            } else { return false; }
         },// endof uxfwkFgwWifiNetKeyPrintAscii
         uxfwkFgwWifiNetKeyHex: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) ){
               switch(data.encryptStr*1){
                  case common.encryptStr.b64: 
                     if ( 10 === value.length*1 ){
                        var myvalue = "0x" + value;
                        if ( !!uxfwk.uxfwkValidateRules.validateHex(myvalue, myvalue) ){
                           return true;
                        } else { return false; }
                     } else { return true; }
                     break;
                  case common.encryptStr.b128: 
                     if ( 26 === value.length*1 ){
                        var myvalue = "0x" + value;
                        if ( !!uxfwk.uxfwkValidateRules.validateHex(myvalue, myvalue) ){
                           return true;
                        } else { return false; }
                     } else { return true; } 
                     break;
                  default: return false; break;
               }
            } else { return false; }
         },// endof uxfwkFgwWifiNetKey1AsciiHexValidate
         uxfwkFgwWifiNetKey64Len: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) && (common.encryptStr.b64 === data.encryptStr*1 ) ){
               if ( (5 == value.length) || (10 == value.length) ){
                  return true;
               } else {
                  return false; 
               }
            } else { return true; }
         },// endof uxfwkFgwWifiNetKey64Len
         uxfwkFgwWifiNetKey128Len: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) && (common.encryptStr.b128 === data.encryptStr*1 ) ){
               if ( (13 == value.length) || (26 == value.length) ){
                  return true;
               } else {
                  return false; 
               }
            } else { return true; }
         },// endof uxfwkFgwWifiNetKey128Len
      pad:uxfwk.$true};
   };// endof spec
};// ::netKey2

RULES.field.netKey3 = function (field, locals){
   var attrkey = 'netKey3';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.open:
               case common.netAuth.s8021x:
               case common.netAuth.shared:
                  if ( !$U(data.wep) && !!data.wep ){
                     result = true;
                  }
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
   field.spec = function (data, ngModel){
      return {
         uxfwkFgwWifiNetKeyPrintAscii: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) ){
               switch(data.encryptStr*1){
                  case common.encryptStr.b64: 
                     if ( 5 === value.length*1 ){
                        if ( !!uxfwk.uxfwkValidateRules.validatePrintableAsciiChars(value, value, ngModel) ){
                           return true;
                        } else { return false; }
                     } else { return true; }
                     break;
                  case common.encryptStr.b128: 
                     if ( 13 === value.length*1 ){
                        if ( !!uxfwk.uxfwkValidateRules.validatePrintableAsciiChars(value, value, ngModel) ){
                           return true;
                        } else { return false; }
                     } else { return true; } 
                     break;
                  default: return false; break;
               }
            } else { return false; }
         },// endof uxfwkFgwWifiNetKeyPrintAscii
         uxfwkFgwWifiNetKeyHex: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) ){
               switch(data.encryptStr*1){
                  case common.encryptStr.b64: 
                     if ( 10 === value.length*1 ){
                        var myvalue = "0x" + value;
                        if ( !!uxfwk.uxfwkValidateRules.validateHex(myvalue, myvalue) ){
                           return true;
                        } else { return false; }
                     } else { return true; }
                     break;
                  case common.encryptStr.b128: 
                     if ( 26 === value.length*1 ){
                        var myvalue = "0x" + value;
                        if ( !!uxfwk.uxfwkValidateRules.validateHex(myvalue, myvalue) ){
                           return true;
                        } else { return false; }
                     } else { return true; } 
                     break;
                  default: return false; break;
               }
            } else { return false; }
         },// endof uxfwkFgwWifiNetKey1AsciiHexValidate
         uxfwkFgwWifiNetKey64Len: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) && (common.encryptStr.b64 === data.encryptStr*1 ) ){
               if ( (5 == value.length) || (10 == value.length) ){
                  return true;
               } else {
                  return false; 
               }
            } else { return true; }
         },// endof uxfwkFgwWifiNetKey64Len
         uxfwkFgwWifiNetKey128Len: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) && (common.encryptStr.b128 === data.encryptStr*1 ) ){
               if ( (13 == value.length) || (26 == value.length) ){
                  return true;
               } else {
                  return false; 
               }
            } else { return true; }
         },// endof uxfwkFgwWifiNetKey128Len
      pad:uxfwk.$true};
   };// endof spec
};// ::netKey3

RULES.field.netKey4 = function (field, locals){
   var attrkey = 'netKey4';
   field.isDisabled = uxfwk.$false;
   field.isVisible  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.enableWifi) && !!data.enableWifi ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.open:
               case common.netAuth.shared:
                  if ( !$U(data.wep) && !!data.wep ){
                     result = true;
                  }
                  break;
            }
         }
      }
      return result;
   };// ::isVisible
   field.spec = function (data, ngModel){
      return {
         uxfwkFgwWifiNetKeyPrintAscii: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) ){
               switch(data.encryptStr*1){
                  case common.encryptStr.b64: 
                     if ( 5 === value.length*1 ){
                        if ( !!uxfwk.uxfwkValidateRules.validatePrintableAsciiChars(value, value, ngModel) ){
                           return true;
                        } else { return false; }
                     } else { return true; }
                     break;
                  case common.encryptStr.b128: 
                     if ( 13 === value.length*1 ){
                        if ( !!uxfwk.uxfwkValidateRules.validatePrintableAsciiChars(value, value, ngModel) ){
                           return true;
                        } else { return false; }
                     } else { return true; } 
                     break;
                  default: return false; break;
               }
            } else { return false; }
         },// endof uxfwkFgwWifiNetKeyPrintAscii
         uxfwkFgwWifiNetKeyHex: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) ){
               switch(data.encryptStr*1){
                  case common.encryptStr.b64: 
                     if ( 10 === value.length*1 ){
                        var myvalue = "0x" + value;
                        if ( !!uxfwk.uxfwkValidateRules.validateHex(myvalue, myvalue) ){
                           return true;
                        } else { return false; }
                     } else { return true; }
                     break;
                  case common.encryptStr.b128: 
                     if ( 26 === value.length*1 ){
                        var myvalue = "0x" + value;
                        if ( !!uxfwk.uxfwkValidateRules.validateHex(myvalue, myvalue) ){
                           return true;
                        } else { return false; }
                     } else { return true; } 
                     break;
                  default: return false; break;
               }
            } else { return false; }
         },// endof uxfwkFgwWifiNetKey1AsciiHexValidate
         uxfwkFgwWifiNetKey64Len: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) && (common.encryptStr.b64 === data.encryptStr*1 ) ){
               if ( (5 == value.length) || (10 == value.length) ){
                  return true;
               } else {
                  return false; 
               }
            } else { return true; }
         },// endof uxfwkFgwWifiNetKey64Len
         uxfwkFgwWifiNetKey128Len: function (value, modelValue){
            if ( $U(value) ) { return true; }
            if ( !$U(data) && !$U(data.encryptStr) && (common.encryptStr.b128 === data.encryptStr*1 ) ){
               if ( (13 == value.length) || (26 == value.length) ){
                  return true;
               } else {
                  return false; 
               }
            } else { return true; }
         },// endof uxfwkFgwWifiNetKey128Len
      pad:uxfwk.$true};
   };// endof spec
};// ::netKey4

RULES.field.wps = function (field, locals){
   var attrkey = 'wps';
   field.isDisabled  = function (data){
      var result = false;
      if ( !$U(data) && !$U(data.wps) ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.shared:
               case common.netAuth.s8021x:
               case common.netAuth.wpa:
               case common.netAuth.wpa2:
               case common.netAuth.mixed_wpa_wpa2:
                  result = true;
                  break;
            }
         }
      }
      if ( !$U(data) && !$U(data.wps) && !!data.wps ){
         if ( !$U(data.netAuth) ){
            switch(data.netAuth*1){
               case common.netAuth.shared:
               case common.netAuth.s8021x:
               case common.netAuth.wpa:
               case common.netAuth.wpa2:
               case common.netAuth.mixed_wpa_wpa2:
                  data.wps = false;
                  break;
            }
         }
      }
      return result;
   };// ::isDisabled
};// ::wps

RULES.field.wpsmsg = function (field, locals){
   var attrkey = 'wpsmsg';
   field.isVisible  = function (newValue, oldValue){
      var result = false;
      if ( (true === oldValue) && (newValue !== oldValue) ){
         result = true;
      }
      return result;
   };// ::isVisible
};// ::wps

RULES.field.ssid = function (field, locals){
   var attrkey = 'ssid';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::ssid

RULES.field.bssid = function (field, locals){
   var attrkey = 'bssid';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::bssid

RULES.field.rssi = function (field, locals){
   var attrkey = 'rssi';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::rssi

RULES.field.snr = function (field, locals){
   var attrkey = 'snr';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::snr

RULES.field.type = function (field, locals){
   var attrkey = 'type';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::type

RULES.field.portName = function (field, locals){
   var attrkey = 'portName';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::portName

RULES.field.hostName = function (field, locals){
   var attrkey = 'hostName';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::hostName

RULES.field.mac = function (field, locals){
   var attrkey = 'mac';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::mac

RULES.field.ip = function (field, locals){
   var attrkey = 'ip';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::ip

RULES.field.leaseTime = function (field, locals){
   var attrkey = 'leaseTime';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::leaseTime

RULES.field.ipv6 = function (field, locals){
   var attrkey = 'ipv6';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::ipv6

RULES.field.linkLocalIpv6 = function (field, locals){
   var attrkey = 'linkLocalIpv6';
   field.texter = function (data, expression){return{
      textualize: function (value, data){ var key = null;
         if ( $U(value) ){ return null; }
         else { return value; }
      },// @textualize
      expression: expression}};// @texter
};// ::linkLocalIpv6
return RULES;
}]);// ::endof module

});//endof module
