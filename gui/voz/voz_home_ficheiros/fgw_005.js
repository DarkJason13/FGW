'use strict';
/**
 * @ngdoc object
 * @name uxfwk.lan.dao
 * 
 * @description 
 * By using this DAO, one can make requests to remote server to manage a lan.dao.fgw entity. 
 * JSON definition MUST follow (as strongly possible) the REST API specification. 
 * voice
 * {
 *    sipConfiguration:       object<SipConfiguration>
 *    sipAccounts:            object<SipAccounts>
 * }
 * SipConfiguration
 * {
 *    sipDomainName           string
 *    useSipRegister          string
 *    sipRegisterAddress      string
 *    sipRegisterPort         number
 *    useSipProxy             string
 *    sipProxyAddress         string
 *    sipProxyPort            number
 *    useSipOutbandProxy      string
 *    sipOutbandProxyAddress  string
 *    sipOutbandProxyPort     number
 * }
 * SipAccounts
 * {
 *    sipAccoutNumber         int
 *    sipAccount1             object<SipAccountX>
 *    sipAccount2             object<SipAccountX>
 * }
 * SipAccountX
 * {
 *    sipAccount              int
 *    enable                  string
 *    extension               string
 *    displayName             string
 *    authName                string
 *    password                string
 *    physicalTerminal        string
 * }
 */
define(['angularAMD', 'uxfwk', 'uxfwk.string'], function module (angularAMD, uxfwk){
var $console = uxfwk.$console, $U = uxfwk.$U;
var zpriv = {};

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

zpriv.parsePhysicalTerminal = function(phyTerminal){
   var output = null, key = 0;
   if ( $U(phyTerminal) ){ throw new ReferenceError('Missing mandatory arguments[phyTerminal]'); }

   output =  0x00;
   var terminal = phyTerminal.split(',');
   if ( !$U(terminal[0]) && (0 === terminal[0]*1) ){ output |= 0x01; } // FXS0
   if ( !$U(terminal[0]) && (1 === terminal[0]*1) ){ output |= 0x02; } // FXS1
   if ( !$U(terminal[1]) )                         { output = 0x04; } // FXS0, FXS1

   $console.warn("zpriv.parsePhysicalTerminal", output);
   return output;
}; // parsePhysicalTerminal

zpriv.parseSipAccounts = function(accountsNumber, accountsInfo){
   var output = {};
   if ( $U(accountsNumber) ){ throw new ReferenceError('Missing mandatory arguments[accountsNumber]'); }
   if ( $U(accountsInfo) ){ throw new ReferenceError('Missing mandatory arguments[accountsInfo]'); }
   
   if (2 === accountsNumber){
      var value = null;
      output.sipAccoutNumber = accountsNumber;
      output.sipAccount1 = {};
      output.sipAccount2 = {};
      
      output.sipAccount1.sipAccount = 1;
      output.sipAccount2.sipAccount = 2;
      
      if ( !$U(value = accountsInfo.status) ){
         if ( !$U(value.split(' ')[1]) ){ output.sipAccount1.status = value.split(' ')[1]; }
         if ( !$U(value.split(' ')[2]) ){ output.sipAccount2.status = value.split(' ')[2]; }
      }
      if ( !$U(value = accountsInfo.enable) && angular.isString(value) ){ 
         output.sipAccount1.enable = ("1" === value.split(' ')[1])?(true):(false);
         output.sipAccount2.enable = ("1" === value.split(' ')[2])?(true):(false);
      }
      if ( !$U(value = accountsInfo.extension) && angular.isString(value) ){ 
         output.sipAccount1.extension = value.split(' ')[1];
         output.sipAccount2.extension = value.split(' ')[2];
      }
      if ( !$U(value = accountsInfo.displayName) && angular.isString(value) ){ 
         output.sipAccount1.displayName = value.split(' ')[1];
         output.sipAccount2.displayName = value.split(' ')[2];
      }
      if ( !$U(value = accountsInfo.authName) && angular.isString(value) ){ 
         output.sipAccount1.authName = value.split(' ')[1];
         output.sipAccount2.authName = value.split(' ')[2];
      }
      if ( !$U(value = accountsInfo.physicalTerminal) && angular.isString(value) ){ 
         if ( !$U(value.split(' ')[1]) ) { output.sipAccount1.physicalTerminal = zpriv.parsePhysicalTerminal(value.split(' ')[1]); }
         if ( !$U(value.split(' ')[2]) ) { output.sipAccount2.physicalTerminal = zpriv.parsePhysicalTerminal(value.split(' ')[2]); }
      }
   } else {
      output.sipAccoutNumber = accountsNumber;
      output.sipAccount1 = {};
      
      if ( !$U(value = accountsInfo.status) ){
         if ( !$U(value.split(' ')[1]) ){ output.sipAccount1.status = value.split(' ')[1]; }
      }
      if ( !$U(value = accountsInfo.enable) && angular.isString(value) ){ 
         output.sipAccount1.enable = ("1" === value.split(' ')[1])?(true):(false);
      }
      if ( !$U(value = accountsInfo.extension) && angular.isString(value) ){ 
         output.sipAccount1.extension = value.split(' ')[1];
      }
      if ( !$U(value = accountsInfo.displayName) && angular.isString(value) ){ 
         output.sipAccount1.displayName = value.split(' ')[1];
      }
      if ( !$U(value = accountsInfo.authName) && angular.isString(value) ){ 
         output.sipAccount1.authName = value.split(' ')[1];
      }
      
      //output.sipAccount1 = accountsInfo;
      output.sipAccount1.sipAccount = 1;
      if ( !$U(value = accountsInfo.physicalTerminal) && angular.isString(value) ){ 
         if ( !$U(value.split(' ')[1]) ) { output.sipAccount1.physicalTerminal = zpriv.parsePhysicalTerminal(value.split(' ')[1]); }
      }
   }
   $console.warn("zpriv.parseSipAccounts::output", output);
   return output;
};

angularAMD.factory('uxfwk.fgw.voice.dao', ['appUtilities', function dao (appUtilities){
var $http = appUtilities.$http, $q = appUtilities.$q;
var dao = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

dao.get = function (data){
   var url  = 'ss-json/fgw.voice.json';
   //var url  = 'ss-json/fgw.voice2.json';
   var output = {};
   
   //[#2.0] - Makes REST request
   return $http.get(url)
   .then(function(response){
      if ( !$U(response.data) ){
         if ( !$U(response.data.sipConfiguration) ){ 
            output.sipConfiguration = angular.copy(response.data.sipConfiguration); 
            if ( !$U(output.sipConfiguration.sipRegisterPort) )      { output.sipConfiguration.sipRegisterPort       = output.sipConfiguration.sipRegisterPort*1; }
            if ( !$U(output.sipConfiguration.sipProxyPort) )         { output.sipConfiguration.sipProxyPort          = output.sipConfiguration.sipProxyPort*1; }
            if ( !$U(output.sipConfiguration.sipOutbandProxyPort) )  { output.sipConfiguration.sipOutbandProxyPort   = output.sipConfiguration.sipOutbandProxyPort*1; }
         }
         if ( !$U(response.data.sipAccountsNumber) && !$U(response.data.sipAccount) ){ 
            output.sipAccounts = {};
            // Fazer Parse
            output.sipAccounts = zpriv.parseSipAccounts(response.data.sipAccountsNumber*1, response.data.sipAccount);
         }
      }
      return { success: true, data: output, errors: null };
   })
   .catch(function(response){ return appUtilities.$processRestException(response, data); });
};// ::get

dao.config = function (data){};// ::config

return dao;
}]);
return module;
});

