define(['angularAMD', 'uxfwk'
   , 'uxfwk.require.lang!fgw.lan.common'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/**
* @ngdoc controller
*/
return ['$scope', 'appUtilities', '$filter', 'uxfwkValidateRules', function controller ($scope, appUtilities, $filter, uxfwkValidateRules){
   var key           = 'fgwLanHome';
   var solution      = 'fgw';
   var myscope = {}, zpriv = {};
   var common = {}, dao = {};
   var fnTranslate = $filter('translate');
   
   common.admin = {
         disabled:      0,
         enabled:       1,
      p:null};// admin
   
   common.mode = {
         half:       0,
         full:       1,
      p:null};// mode
   
   common.speed = {
         auto:       0,
         s10:        10,
         s100:       100,
         s1000:      1000,
      p:null};// speed
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/******************************************************************************
 * @name INITIALIZER BLOCK
 * @description
 * The following blocks initialize controller internal states and trigger startup
 * loading process.
 ******************************************************************************/

(function _initialize (){
   var myattrs = null, mygroup = null;

   //[#1.0] - Creates object scope
   myscope = ($scope[key] = {
      criticalError:        null,
      loadInProgress:       true,
      dependenciesResolved: false,
      lanIsInEdition:       false,
      dhcpIsInEdition:      false,
      ifsAreInEdition:      false,
      data: {}, extradata: { ipRange: {}, mask: { value: null }, dhcpStart: {}, dhcpEnd: {} },
      dataReady:            false,  // state flag for main data
      common:               common,
   p:null});// just for padding

   //[#1.1] - Groups attributes based on template view.

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !$scope[key].criticalError ){
      var $injector = angular.element(document).injector();
      var deps = [];

      //[#2.1] - Request javascript dependencies
      deps.push('modules/{0}.lan/{0}.lan.dao'.sprintf(solution));
      //deps.push('modules/{0}.home/{0}.home.common'.sprintf(solution));
      require(deps, function(){

         // Inject dependencies
         dao  = $injector.get('uxfwk.{0}.lan.dao'.sprintf(solution));
//         myscope.common.rfoverlay = common  = dataCommon = $injector.get('uxfwk.{0}.home.common'.sprintf(solution));

         

         //[#2.2] - Request language files
         //appUtilities.$translatePartialLoader.addPart('{0}.home.common'.sprintf(solution));
         appUtilities.$translate.refresh()
         .then(function(){
            zpriv.validators();
            //[#2.3] - Finally, sets resolution as concluded
            $scope[key].dependenciesResolved = true;
            $scope[key].actionGetData();
         })
         .catch(function(){
         });
      }, function(response){
         $console.warn(response);
         myscope.criticalError = response;
      });
   }//[END#2.0]
   $console.info('SCOPE _initialize', myscope, $scope);
})();// endof _initialize 

/******************************************************************************
 * @name ACTION METHODS
 * @description
 * The following methods shall be used whenever user trigger some kind of action
 ******************************************************************************/

myscope.actionCancelIfData = function (){
   var defer = appUtilities.$q.defer();
   for ( var i = 0, leni = myscope.data.generalInfo.interfaces.length; i < leni; ++i ){
      myscope.data.generalInfo.interfaces[i] = uxfwk.merge(myscope.data.generalInfo.interfaces[i], myscope.data.generalInfo.interfaces[i].$$$init);
   }
   zpriv.extendsData(myscope.data.generalInfo.interfaces);
   defer.resolve({});
   return defer.promise;
};// ::actionCancelIfData

myscope.actionConfigIfData = function (){
   var configData = [], aux = {};

//   for ( var i = 0, leni = myscope.data.generalInfo.interfaces.length; i < leni; ++i ){
//      aux = uxfwk.clean(uxfwk.merge({}, myscope.data.generalInfo.interfaces[i]), myscope.data.generalInfo.interfaces[i].$$$init, null, ['interfaceName']);
//      configData.push(aux);
//   }
   configData = myscope.data.generalInfo.interfaces;
   $console.warn("configData", configData);
   return dao.interfaces.config(configData)
   .then(function(response){
      $console.warn("response", response);
      if ( true === response.success ){
         var aux = null;

         myscope.data.generalInfo.interfaces = response.data;
//         for ( var i = 0, leni = response.data.length; i < leni; ++i ){
//            if ( !$U(aux = uxfwk.findInArray(myscope.data.generalInfo.interfaces, 'interfaceName', response.data[i].interfaceName)) ){
//               uxfwk.merge(aux, response.data[i]);
//            }
//         }
         zpriv.extendsData(myscope.data.generalInfo.interfaces);
         return true;
      }else{ return false; $scope.$root.notifications.alerts.open('error', null, response.errors); }
      //return false;
   })
   .catch(function(response){
      $console.warn("erro", angular.toJson(response));
      $scope.$root.notifications.alerts.open('error', null, response.errors);
   })
   .finally(function(){
      myscope.loadInProgress = false;
   })
};// endof ::actionConfigIfData

myscope.actionCancelDhcpData = function (){
   var defer = appUtilities.$q.defer();
   angular.extend(myscope.data.dhcpServer, zpriv.processStringWithPatterns(myscope.extradata.ipRange, ['ipStart', 'ipEnd'], null, '.', false));
   myscope.data.dhcpServer = uxfwk.merge(myscope.data.dhcpServer, myscope.data.$$$init.dhcpServer);
   zpriv.extendsData(myscope.data);
   defer.resolve({});
   return defer.promise;
};// ::actionCancelDhcpData

myscope.actionConfigDhcpData = function (){
   var configData = {}, msg = '', title = '';

   myscope.loadInProgress = true;
   $console.warn("myscope.data.dhcpServer", myscope.data.dhcpServer, angular.toJson(myscope.data.dhcpServer));
   var configData = {}, validateData = {};
   if ( !$U(myscope.data.dhcpServer) ){
      angular.extend(myscope.data.dhcpServer, zpriv.processStringWithPatterns(myscope.extradata.ipRange, ['ipStart', 'ipEnd'], null, '.', false));
      configData = angular.copy(myscope.data.dhcpServer);
      validateData = uxfwk.clean(uxfwk.merge({}, myscope.data.dhcpServer), myscope.data.$$$init.dhcpServer);
   }
   $console.warn("configData", configData);
   $console.warn("validateData", validateData);
   return dao.dhcp.config(configData)
   .then(function(response){
      $console.warn("response", response);
      if ( true === response.success ){
         myscope.data.dhcpServer = angular.copy(response.data);
         zpriv.extendsData(myscope.data);
         // At this point connectivity will be lost!
         if ( !$U(validateData.defaultGateway) ){
            title = fnTranslate("TEXT.COMMON.POPUP.SUCCESS");
            msg = fnTranslate("TEXT.FGW.LAN.HOME.COMMON.SUCCESS.MSG");
            $scope.$root.notifications.alerts.open('success', title, msg);
         }
         return true;
         //return true;
      }else{ return false; $scope.$root.notifications.alerts.open('error', null, response.errors); defer.resolve(false); }
      //return false;
   })
   .catch(function(response){
      $console.warn("erro", angular.toJson(response));
      $scope.$root.notifications.alerts.open('error', null, response.errors);
   })
   .finally(function(){
      myscope.loadInProgress = false;
   })
};// endof ::actionConfigDhcpData


/**
 * @ngdoc function
 * @name  actionGetData
 * @methodOf
 *
 * @description
 * Action to be triggered whenever a request for refresh data is done.
 *
 * @returns void
 */
myscope.actionGetData = function actionGetData (){
   var defer = appUtilities.$q.defer();

   $scope[key].loadInProgress = true;
   dao.get()
   .then(function(args){
      $console.warn("args: ", args);
      if ( (true === args.success) && !$U(args.data) ){
         myscope.data = angular.copy(args.data);
         zpriv.extendsData(myscope.data);
         if ( !$U(myscope.data.generalInfo) && !$U(myscope.data.generalInfo.interfaces) ){
            zpriv.extendsData(myscope.data.generalInfo.interfaces);
         }
         defer.resolve(myscope.data);
      }else{ appUtilities.$rootScope.notifications.alerts.open('error', null, args.errors); }
   })
   .catch(function(error){
      defer.reject();
   })
   .finally(function(){
      myscope.loadInProgress = false;
      $console.warn("GET::MYSCOPE: ", myscope);
   })

   return defer.promise;
};// actionGetData

/**
 * @ngdoc function
 * @name  actionRefresh
 * @methodOf
 *
 * @description
 * Action to be triggered whenever a request for refresh data is done.
 *
 * @returns void
 */
$scope[key].actionRefresh = function actionRefresh (){
   $scope[key].actionGetData(); // check if ng-click could be attach to getData function.. check the future imnplications
};// actionGetData

/******************************************************************************
 * @name PRIVATE METHODS
 * @description
 * The following methods shall be used internally by this controller
 ******************************************************************************/
zpriv.extendsData = function (data){
   var dgwByte2 = null, dgwByte3 = null, maskByte2 = null, maskByte3 = null;
   if ( angular.isArray(data) ){
      for ( var i = 0, leni = data.length; i < leni; ++i ){
         zpriv.extendsData(data[i]);
      }
   }else{
      data.$$$init = uxfwk.merge({}, data);
      if ( !$U(data.dhcpServer) ){ 
         myscope.extradata.ipRange = zpriv.processStringWithPatterns(data.dhcpServer, ['ipStart', 'ipEnd'], null, '.', true);
         dgwByte2 = data.dhcpServer.defaultGateway.split('.')[2];
         maskByte2 = data.dhcpServer.mask.split('.')[2];
         myscope.calcNewIp(dgwByte2, myscope.extradata.mask.value, maskByte2, 'localAttr2', {}, {});
         dgwByte3 = data.dhcpServer.defaultGateway.split('.')[3];
         maskByte3 = data.dhcpServer.mask.split('.')[3];
         myscope.calcNewIp(dgwByte3, myscope.extradata.mask.value, maskByte3, 'localAttr3', {}, {});
      }
   }
   return data;
};// ::@extendsData

/**
 * @ngdoc function
 * @name  processStringWithPatterns
 * @methodOf
 * @arguments
 *  - data: contains data to be converted
 *  - attributes: array of attribute strings to be processed
 *  - pattern: string pattern to be used ('.', '/', ...)
 *  - format: convertion direction (model->view, true), (view -> model, false)
 * @description
 * Function to convert a string with a pre-defined pattern into an o object and an object into a patterned string
 *
 * @returns object
 */
zpriv.processStringWithPatterns = function (data, attributes, overrideKey, pattern, format){
   var output = {}, result = [], aux = null, searchKey = null, idx = null;
   if (!!format){
      /**
       *  model -> view
       */
      for ( var i = 0, leni = attributes.length; i < leni; ++i ){
         if ( !$U(aux = data[attributes[i]]) ){
            for ( var j = 0, lenj = aux.split(pattern).length; j < lenj; ++j ){
               if ( !$U(overrideKey) ){
                  output[overrideKey+''+j] = aux.split(pattern)[j]*1;
               } else {
                  var key = attributes[i]+''+j;
                  output[key] = aux.split(pattern)[j]*1;
               }
            }
         }
      }
   } else {
      /**
       *  view -> model
       */
      for ( var i = 0, leni = attributes.length; i < leni; ++i ){
         result = [], idx = 0;
         for ( var key in data ){
            // Pattern to detect and skip bad words
            var regex = new RegExp('^((?!'+attributes[i]+').)*$', 'gm');
            var match = key.match(regex);
            if ( !$U( key.match(regex) ) ){ continue; }
            searchKey = attributes[i]+''+idx;
            // This guarantees the order of attributes
            if ( searchKey === key ){ result.push(data[key]); }
            idx++;
         }
         if ( !$U(overrideKey) ){
            output[overrideKey] = '{0}'.sprintf(result.join(pattern));
         } else {
            output[attributes[i]] = '{0}'.sprintf(result.join(pattern));
         }
      }
   }
   return output;
}; // ::@processStringWithPatterns

myscope.calcNewIp = function (dgwByte, maskAddress, maskByte, byteKey, startByte, endByte){
   var hosts = null, subnetByte = null, broadcastByte = null, delta1 = null, delta2 = null, skip = false;
   hosts = 256 - maskByte - 2;
   subnetByte = dgwByte & maskByte;
   broadcastByte = subnetByte + hosts + 1;

   switch(byteKey){
      case 'localAttr2': 
         if (0 === maskByte){
            startByte[byteKey] = subnetByte;
            endByte[byteKey]   = broadcastByte;
         } else {
            startByte[byteKey] = subnetByte;
            endByte[byteKey]   = subnetByte + hosts + 1;
         }
         delta1 = dgwByte - subnetByte;
         delta2 = broadcastByte - dgwByte;
         if ( delta1 < delta2 ){
            startByte[byteKey] += (delta1+1);
         } else {
            endByte[byteKey] -= delta2;
         }
         myscope.extradata.dhcpStart[byteKey] = startByte[byteKey];
         myscope.extradata.dhcpEnd[byteKey] = endByte[byteKey];
         break;
      case 'localAttr3': 
         if (0 === maskByte){
            if ( ("255.255.0.0" === maskAddress) || ("255.255.255.0" !== maskAddress) ){
               startByte[byteKey] = 0;
               endByte[byteKey]   = 254;
               skip = true;
            } else {
               startByte[byteKey] = subnetByte + 1;
               endByte[byteKey]   = broadcastByte - 1;
            }
         } else {
            startByte[byteKey] = subnetByte + 1;
            endByte[byteKey]   = subnetByte + hosts;
         }
         if ( !skip ){
            delta1 = dgwByte - subnetByte;
            delta2 = broadcastByte - dgwByte;
            if ( delta1 < delta2 ){
               startByte[byteKey] += delta1;
            } else {
               endByte[byteKey] -= delta2;
            }
         }
         myscope.extradata.dhcpStart[byteKey] = startByte[byteKey];
         myscope.extradata.dhcpEnd[byteKey] = endByte[byteKey];
         break;
      default:
         if ( startByte[byteKey] !== dgwByte ){
            startByte[byteKey] = (startByte[byteKey] & ~maskByte) | (dgwByte & maskByte);
         }
         if ( endByte[byteKey] !== dgwByte ){
            endByte[byteKey] = (endByte[byteKey] & ~maskByte) | (dgwByte & maskByte);
         }
         break;
   }
   $console.warn("myscope", myscope);
}; // ::@calcNewIp

myscope.processDhcp = function (){
   var newGateway = null, newMask = null;
   var localMask = {}, localStart = {}, localEnd = {}, aux = [], searchKey = null, dhcpServer = {};
   // [#1.0.0] - Get the default gateway and mask values
   if ( !$U(myscope.data) && !$U(myscope.data.dhcpServer) ){
      newGateway = myscope.data.dhcpServer.defaultGateway;
      newMask    = myscope.data.dhcpServer.mask;
   }
   // [#2.0.0] - Calculate new IP range
   if ( !$U(newGateway) && !$U(newMask) ){
      // [#2.1.0] - Validate address format
      if ( !!uxfwkValidateRules.validateIpv4Addr(newGateway, newGateway, { $isEmpty:uxfwk.$false }) && !!uxfwkValidateRules.validateIpv4Addr(newMask, newMask, { $isEmpty:uxfwk.$false }) ) {
         // [#2.1.1] - Get all address in object format and default gw an array 
         aux = newGateway.split('.');
         localMask   = zpriv.processStringWithPatterns(myscope.data.dhcpServer, ['mask'], 'localAttr', '.', true);
         localStart  = zpriv.processStringWithPatterns(myscope.data.dhcpServer, ['ipStart'], 'localAttr', '.', true);
         localEnd    = zpriv.processStringWithPatterns(myscope.data.dhcpServer, ['ipEnd'], 'localAttr', '.', true);
         
         // [#2.1.2] - Iterate default gw and Search respective address byte 
         for ( var i = 0, leni = aux.length; i < leni; ++i ){
            searchKey = 'localAttr{0}'.sprintf(i);
            for ( var key in localMask ){
               
               if ( key === searchKey ){
                  myscope.calcNewIp(aux[i]*1, myscope.extradata.mask.value, localMask[key], searchKey, localStart, localEnd);
               }
            }
         }
         // [#2.1.3] - Updates IP range with the new calculated addresses
         for ( var key in localStart ) { angular.extend(dhcpServer, zpriv.processStringWithPatterns(localStart, ['localAttr'], 'ipStart', '.', false)); }
         for ( var key in localEnd )   { angular.extend(dhcpServer, zpriv.processStringWithPatterns(localEnd, ['localAttr'], 'ipEnd', '.', false)); }
         uxfwk.merge(myscope.data.dhcpServer, dhcpServer);
         myscope.extradata.ipRange = zpriv.processStringWithPatterns(myscope.data.dhcpServer, ['ipStart', 'ipEnd'], null, '.', true); 
      }
   }
}; //processDhcp

/******************************************************************************
 * @name VALIDATION METHODS 
 * @description
 * The following methods shall be used as validators for each attribute. They 
 * are called directly from template. 
 ******************************************************************************/
myscope.isFormValid = function (){
   var result = false;
   if ( !$U(myscope.formData) ){ return myscope.formData.$valid; }
   $console.warn("result", result);
   return result;
};// ::isFormValid

zpriv.validators = function (){
   myscope.validators = { mask: {}, ip: {}, ipStartByte3: {}, ipEndByte3: {}, ipStartByte4: {}, ipEndByte4: {}, admin: {}, speed: {} };

   myscope.validators.ipStartByte3.spec = function (data, ngModel){
      return {
         uxfwkFgwLanIpStartByte3Spec: function ($modelValue){
            var maskByte = null, defaultGwByte = null, endByte = null;
            $modelValue = $U($modelValue)?(''):($modelValue);
            myscope.extradata.ipRange.ipStart2 = $modelValue;
            if ( !$U(myscope.data.dhcpServer) ){
               if ( !$U(myscope.data.dhcpServer.defaultGateway) && !$U(myscope.data.dhcpServer.mask) ){
                  maskByte       = myscope.data.dhcpServer.mask.split('.')[2];
                  defaultGwByte  = myscope.data.dhcpServer.defaultGateway.split('.')[2];
                  endByte        = myscope.extradata.ipRange.ipEnd2;
                  if ( endByte >= $modelValue ){
                     if ( ($modelValue >= myscope.extradata.dhcpStart.localAttr2) && ($modelValue <= myscope.extradata.dhcpEnd.localAttr2) ){
                        return true;
                     } else { return false; }
                  } else { return false; }
               } else { return false; }
            } else { return false; }
         },
      pad:uxfwk.$true};
   };// ::@ipStartByte3.spec
   
   myscope.validators.ipStartByte4.spec = function (data, ngModel){
      return {
         uxfwkFgwLanIpStartByte3Spec: function ($modelValue){
            var maskByte = null, defaultGwByte = null, endByte = null;
            $modelValue = $U($modelValue)?(''):($modelValue);
            myscope.extradata.ipRange.ipStart3 = $modelValue;
            if ( !$U(myscope.data.dhcpServer) ){
               if ( !$U(myscope.data.dhcpServer.defaultGateway) && !$U(myscope.data.dhcpServer.mask) ){
                  maskByte       = myscope.data.dhcpServer.mask.split('.')[3];
                  defaultGwByte  = myscope.data.dhcpServer.defaultGateway.split('.')[3];
                  endByte        = myscope.extradata.ipRange.ipEnd3;
                  if ( endByte >= $modelValue ){
                     if ( ($modelValue >= myscope.extradata.dhcpStart.localAttr3) && ($modelValue <= myscope.extradata.dhcpEnd.localAttr3) ){
                        return true;
                     } else { return false; }
                  } else { return false; }
               } else { return false; }
            } else { return false; }
         },
      pad:uxfwk.$true};
   };// ::@ipStartByte4.spec
   
   myscope.validators.ipEndByte3.spec = function (data, ngModel){
      return {
         uxfwkFgwLanIpEndByte3Spec: function ($modelValue){
            var maskByte = null, defaultGwByte = null, startByte = null;
            $modelValue = $U($modelValue)?(''):($modelValue);
            myscope.extradata.ipRange.ipEnd2 = $modelValue;
            if ( !$U(myscope.data.dhcpServer) ){
               if ( !$U(myscope.data.dhcpServer.defaultGateway) && !$U(myscope.data.dhcpServer.mask) ){
                  maskByte       = myscope.data.dhcpServer.mask.split('.')[2];
                  defaultGwByte  = myscope.data.dhcpServer.defaultGateway.split('.')[2];
                  startByte      = myscope.extradata.ipRange.ipStart2;
                  if ( startByte <= $modelValue ){
                     if ( ($modelValue >= myscope.extradata.dhcpStart.localAttr2) && ($modelValue <= myscope.extradata.dhcpEnd.localAttr2) ){
                        return true;
                     } else { return false; }
                  } else { return false; }
               } else { return false; }
            } else { return false; }
         },
      pad:uxfwk.$true};
   };// ::@ipEndByte3.spec
   
   myscope.validators.ipEndByte4.spec = function (data, ngModel){
      return {
         uxfwkFgwLanIpEndByte4Spec: function ($modelValue){
            var maskByte = null, defaultGwByte = null, startByte = null;
            $modelValue = $U($modelValue)?(''):($modelValue);
            myscope.extradata.ipRange.ipEnd3 = $modelValue;
            if ( !$U(myscope.data.dhcpServer) ){
               if ( !$U(myscope.data.dhcpServer.defaultGateway) && !$U(myscope.data.dhcpServer.mask) ){
                  maskByte       = myscope.data.dhcpServer.mask.split('.')[3];
                  defaultGwByte  = myscope.data.dhcpServer.defaultGateway.split('.')[3];
                  startByte      = myscope.extradata.ipRange.ipStart3;
                  if ( startByte <= $modelValue ){
                     if ( ($modelValue >= myscope.extradata.dhcpStart.localAttr3) && ($modelValue <= myscope.extradata.dhcpEnd.localAttr3) ){
                        return true;
                     } else { return false; }
                  } else { return false; }
               } else { return false; }
            } else { return false; }
         },
      pad:uxfwk.$true};
   };// ::@ipEndByte4.spec
   
   
   myscope.validators.ip.isDisabled = function (){
      var result = true;
      if ( !$U(myscope.formData) ){ 
         result = (!myscope.formData.defaultGw.$valid || !myscope.formData.mask.$valid);
      }
      return result;
   };// ::@ipStart::isDisabled
   
   myscope.validators.ip.isDisabled = function (){
      var result = true;
      if ( !$U(myscope.formData) ){ 
         result = (!myscope.formData.defaultGw.$valid || !myscope.formData.mask.$valid);
      }
      return result;
   };// ::@ipStart::isDisabled
   
   myscope.validators.mask = function (mask){
      mask.getterSetter = mask.getterSetter || {
         getterSetter: function (value){
            if ( $U(myscope.extradata.mask.value) ){
               myscope.extradata.mask.value = ( "" === myscope.data.dhcpServer.mask ) ? ("255.") : (myscope.data.dhcpServer.mask);
            }
            if ( arguments.length > 0 ){
               if ( (myscope.extradata.mask.value !== value) && angular.isString(value) && !(/^255\./g).test(value) ){
                  myscope.extradata.mask.value = value.replace(/^[^\.]*./g, "255.");
               }else{
                  myscope.extradata.mask.value = value;
               }
            }
            myscope.data.dhcpServer.mask = myscope.extradata.mask.value;
            return myscope.extradata.mask.value;
         }
      };
      return mask.getterSetter;
   };// mask
   myscope.validators.mask.spec = function (data, ngModel){
         return {
            uxfwkFgwMaskSpec: function ($modelValue){
               $modelValue = $U($modelValue)?(''):($modelValue);
               if ( '255.255.255.254' !== $modelValue ){
                  return true;
               } else { return false; }
            },
         pad:uxfwk.$true};
   };// ::@mask.spec
   
   myscope.validators.admin.options = function (data){
      var options = uxfwk.map2array(uxfwk.mapFilter(myscope.common.admin, ['enabled', 'disabled']), 'key', 'value', function(obj){
         obj.text = fnTranslate('TEXT.FGW.LAN.HOME.COMMON.ADMIN.OPTION.' + angular.uppercase(obj.key))
         return obj;
      });
      return uxfwk.cache(data, '$$$admin', options);
   };// ::@admin::options
   
   myscope.validators.speed.options = function (data){
      var options = uxfwk.map2array(uxfwk.mapFilter(myscope.common.speed, ['auto', 's10', 's100', 's1000']), 'key', 'value', function(obj){
         obj.text = fnTranslate('TEXT.FGW.LAN.HOME.COMMON.SPEED.OPTION.' + angular.uppercase(obj.key))
         return obj;
      });
      return uxfwk.cache(data, '$$$speed', options);
   };// ::@speed::options
};// ::@validators

}];
});



