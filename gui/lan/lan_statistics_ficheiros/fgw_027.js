

define(['angularAMD', 'uxfwk'], function module (angularAMD, uxfwk){'use strict';
   var module = { common:{} };
   var common = module.common;
   var $console = uxfwk.$console, $U = uxfwk.$U, key = 'uxfwk.fgw.wifi.common: ';
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

common.channel = {
      auto:       0,
      ch1:        1,
      ch2:        2,
      ch3:        3,
      ch4:        4,
      ch5:        5,
      ch6:        6,
      ch7:        7,
      ch8:        8,
      ch9:        9,
      ch10:       10,
      ch11:       11,
      ch12:       12,
      ch13:       13,
      ch14:       14,
      ch36:       36,
      ch40:       40,
      ch44:       44,
      ch48:       48,
      ch52:       52,
      ch56:       56,
      ch60:       60,
      ch64:       64,
      ch100:      100,
      ch104:      104,
      ch108:      108,
      ch112:      112,
      ch116:      116,
      ch120:      120,
      ch124:      124,
      ch128:      128,
      ch132:      132,
      ch136:      136,
      ch140:      140,
      ch149:      149,
      ch153:      153,
      ch157:      157,
      ch161:      161,
   p:null};// channel
common.bandwidth = {
      bw20mhz:       1,
      bw40mhz:       3,
      bw80mhz:       7,
      bw160mhz:      15,
   p:null};// bandwidth
common.transmitPower = {
      pw12:       12,
      pw25:       25,
      pw50:       50,
      pw75:       75,
      pw100:      100,
   p:null};// transmitPower
common.netAuth = {
      open:                1,
      shared:              2,
      s8021x:              3,
      wpa:                 4,
      wpa2:                5,
      wpa_psk:             6,
      wpa2_psk:            7,
      mixed_wpa2_wpa_psk:  8,
      mixed_wpa_wpa2:      9,
   p:null};// netAuth
common.encrypt = {
      aes:                 0,
      tkipaes:             1,
   p:null};// encrypt

common.encryptStr = {
      b128:                0,
      b64:                 1,
   p:null};// encryptStr

common.currentNetKey = {
      k1:                  1,
      k2:                  2,
      k3:                  3,
      k4:                  4,
   p:null};// currentNetKey


angularAMD.factory('uxfwk.fgw.wifi.common', [function common (){ return module.common; }]);
return module;
});// endof module
