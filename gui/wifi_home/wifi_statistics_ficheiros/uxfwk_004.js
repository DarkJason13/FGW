
define(['angularAMD', 'uxfwk'], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U, module = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!




module.IPv4 = (function (){
   var IPv4 = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

IPv4.encode = function (input){};// ::encode

IPv4.decode = function (input){};// ::decode

IPv4.convertIpAddr2Bin = function (input){
   var output = 0, aux = [], binString = '';
   
   if ( !angular.isString(input) ){ throw new TypeError('Argument must be string'); }
   aux = input.split('.');
   
   output += (aux[0]*1 << 24) & 0xFF000000;
   output += (aux[1]*1 << 16) & 0xFF0000;
   output += (aux[2]*1 <<  8) & 0xFF00;
   output += (aux[3]*1 <<  0) & 0xFF;
   
   return output;
};// ::convertIpAddr2Bin

IPv4.compactMaskAddr = function (input){
   var output = null, aux = [], binString = '';
   if ( !angular.isString(input) ){ throw new TypeError('Argument must be string'); }
   aux = input.split('.');
   
   for ( var i = 0, leni = aux.length; i < leni; ++i ){
      binString += (aux[i] >>> 0).toString(2);
   }
   output =  binString.indexOf(0);
   return output;
};// ::compactMaskAddr

return IPv4;
})();// endof IPv4
angularAMD.factory('uxfwk.ipv4', [function(){ return module.IPv4; }]);// endof IPv4

return module;
});// endof module
