define(['angularAMD', 'uxfwk', 'uxfwk.table'
   , 'uxfwk.require.lang!fgw.security.common'
   , 'uxfwk.require.css!modules/fgw.security/fgw.security.nat'
   , 'uxfwk.fgw.security.deleteModal'
   , 'uxfwk.fgw.security.portforwardmodal'
   , 'uxfwk.fgw.security.portactivationmodal'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/**
* @ngdoc controller
*/
return ['$scope', 'appUtilities', '$filter', 'uxfwk.fgw.security.deleteModal', 'uxfwk.fgw.security.portforwardmodal', 'uxfwk.fgw.security.portactivationmodal'
        , function controller ($scope, appUtilities, $filter, warningModal, forwardModal, activationModal){
   var key           = 'fgwSecurityNat';
   var solution      = 'fgw';
   var myscope = {}, zpriv = {};
   var common = {}, dao = {};
   var fnTranslate = $filter('translate');
   
   common.protocol = {
         tcpudp:    0,
         tcp:       1,
         udp:       2,
     p:null};// app
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

/******************************************************************************
 * @name INITIALIZER BLOCK
 * @description
 * The following blocks initialize controller internal states and trigger startup
 * loading process.
 ******************************************************************************/

(function _initialize (){
   //[#1.0] - Creates object scope
   myscope = ($scope[key] = {
      criticalError:        null,
      loadInProgress:       true,
      dependenciesResolved: false,
      statusInProgress:     false,
      portFwIsInEdition:    false,
      portActIsInEdition:   false,
      portForwardingMap:    {},
      portActivationMap:    {},
      serviceCatalog:       [],
      aplicationCatalog:    [],
      tplData:              { portForwarding: [], portActivation: [] },
      data:                 { portForwarding: [], portActivation: [] },
      common:               common,
   p:null});// just for padding

   //[#1.1] - Groups attributes based on template view.

   //[#2.0] - Request additional dependencies (if no critical error occurs)
   if ( !$scope[key].criticalError ){
      var $injector = angular.element(document).injector();
      var deps = [];

      //[#2.1] - Request javascript dependencies
      deps.push('modules/{0}.security/{0}.security.dao'.sprintf(solution));
      require(deps, function(){

         // Inject dependencies
         dao  = $injector.get('uxfwk.{0}.security.dao'.sprintf(solution));
         //[#2.2] - Request language files
         appUtilities.$translate.refresh()
         .then(function(){ return dao.nat.portForwarding.getCatalog().then(function(response){ $console.warn("response", response); myscope.serviceCatalog    = response.data; return response; }); })
         .then(function(){ return dao.nat.portActivation.getCatalog().then(function(response){ $console.warn("response", response); myscope.aplicationCatalog = response.data; return response; }); })
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
   $console.info('SCOPE _initialize', myscope);
})();// endof _initialize 

/******************************************************************************
 * @name ACTION METHODS
 * @description
 * The following methods shall be used whenever user trigger some kind of action
 ******************************************************************************/

myscope.deletePortForwardingEntry = function (data){
   var defer   = appUtilities.$q.defer();
   var deleteObj = {};
   var sendData = null;
   deleteObj.msg     = fnTranslate('TEXT.FGW.SECURITY.NAT.COMMON.WARNINGMODAL.DELETEENTRY.MESSAGE');   
   deleteObj.rules   = [];
   deleteObj.entity  = 'portForwarding';
   for ( var i = 0, leni = myscope.data.portForwarding.length; i < leni; ++i ){
      if ( myscope.data.portForwarding[i].service === data.service ){
         deleteObj.rules.push(myscope.data.portForwarding[i]);
      }
   }
   warningModal(deleteObj)
   .then(function(response){
      myscope.loadInProgress = true;
      if ( (true === response.success) && !$U(response.data) ){
         for ( var i = 0, leni = response.data.length; i < leni; ++i ){
            var aux = null;
            if ( !$U(aux = uxfwk.findInArray(myscope.data.portForwarding, 'internalId', response.data[i].internalId)) ){
               myscope.data.portForwarding.splice(myscope.data.portForwarding.indexOf(aux), 1);
            }
         }
         return dao.nat.portForwarding.remove(response.data);
      }
      return;
   })
   .then(function(response){
      if ( response instanceof AbortHttpRequestError ){}
      else if ( (true === response.success) && !$U(response.data)  ){
         myscope.portForwardingMap = {};
         myscope.tplData.portForwarding = [];
         
         // Atualiza o num de entradas
         myscope.data.portForwardRemEntries = myscope.data.portForwardRemEntries + response.data.length;
         
         zpriv.extendsData(myscope.data.portForwarding, 'portForwarding');
         zpriv.extendsForwardData(myscope.data.portForwarding);
      }
      else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return;
   })
   .catch(function(){}).finally(function(){ myscope.loadInProgress = false; });
   return defer.promise; 
};

myscope.deletePortActivationEntry = function (data){
   var defer   = appUtilities.$q.defer();
   var deleteObj = {};
   var sendData = null;
   deleteObj.msg     = fnTranslate('TEXT.FGW.SECURITY.NAT.COMMON.WARNINGMODAL.DELETEENTRY.MESSAGE');   
   deleteObj.rules   = [];
   deleteObj.entity  = 'portActivation';
   for ( var i = 0, leni = myscope.data.portActivation.length; i < leni; ++i ){
      if ( myscope.data.portActivation[i].aplicationName === data.aplicationName ){
         deleteObj.rules.push(myscope.data.portActivation[i]);
      }
   }
   $console.warn("deleteObj", deleteObj);
   warningModal(deleteObj)
   .then(function(response){
      myscope.loadInProgress = true;
      $console.warn("deletePortActivationEntry::response", response);
      if ( (true === response.success) && !$U(response.data) ){
         for ( var i = 0, leni = response.data.length; i < leni; ++i ){
            var aux = null;
            if ( !$U(aux = uxfwk.findInArray(myscope.data.portActivation, 'internalId', response.data[i].internalId)) ){
               myscope.data.portActivation.splice(myscope.data.portActivation.indexOf(aux), 1);
            }
         }
         return dao.nat.portActivation.remove(response.data);
      }
      return;
   })
   .then(function(response){
      if ( response instanceof AbortHttpRequestError ){}
      else if ( (true === response.success) && !$U(response.data)  ){
         myscope.portActivationMap = {};
         myscope.tplData.portActivation = [];
         
         // Atualiza o num de entradas
         myscope.data.portActRemEntries = myscope.data.portActRemEntries + response.data.length;
         
         zpriv.extendsData(myscope.data.portActivation, 'portActivation');
         zpriv.extendsAppData(myscope.data.portActivation);
      }
      else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return;
   })
   .catch(function(){}).finally(function(){ myscope.loadInProgress = false; });
   return defer.promise; 
};

myscope.actionAddTriggerPorts = function (){
   var defer   = appUtilities.$q.defer();
   var info = { catalog: [] }, auxId = null;
   info.entriesRem = myscope.data.portActRemEntries;
   info.catalog = myscope.aplicationCatalog;
   activationModal(info)
   .then(function(newRule){
      myscope.loadInProgress = true;
      $console.warn("newRule", newRule);
      return dao.nat.portActivation.create(newRule);
   })
   .then(function(response){
      $console.warn("then::response", response);
      if ( !$U(response) && (true === response.success) && !$U(response.data) ){
         //myscope.portActivationMap = {};
         myscope.tplData.portActivation = [];
         auxId = myscope.data.portActivation.length;
         for ( var i = 0, leni = response.data.length; i < leni; ++i ){
            response.data[i].interface = "veip0.1";
            response.data[i].internalId = auxId;
            response.data[i].aplicationName = decodeURIComponent(response.data[i].aplicationName);
            auxId++;
         }
         // Atualiza o num de entradas
         myscope.data.portActRemEntries = myscope.data.portActRemEntries + response.data.length;

         myscope.data.portActivation.push.apply(myscope.data.portActivation, response.data);
         zpriv.extendsData(response.data, 'portActivation');
         zpriv.extendsAppData(myscope.data.portActivation);
         defer.resolve(myscope.data);
         return true;
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return false;
   })
   .catch(function(response){
      if ( response ){
         $scope.$root.notifications.alerts.open('error', null, response.errors);
      }
   })
   .finally(function(){
      $console.warn("newRule::myscope", myscope);
      myscope.loadInProgress = false;
   })
   return defer.promise;
};// endof ::actionAddTriggerPorts

myscope.actionAddVirtualServer = function (){
   var defer   = appUtilities.$q.defer();
   var info = { catalog: [] }, auxId = null;
   info.entriesRem = myscope.data.portForwardRemEntries;
   info.catalog = myscope.serviceCatalog;
   forwardModal(info)
   .then(function(newRule){
      myscope.loadInProgress = true;
      $console.warn("newRule", newRule);
      return dao.nat.portForwarding.create(newRule);
   })
   .then(function(response){
      $console.warn("actionAddVirtualServer::then", response);
      if ( (true === response.success) && !$U(response.data) ){
         myscope.tplData.portForwarding = [];
         auxId = myscope.data.portForwarding.length;
         for ( var i = 0, leni = response.data.length; i < leni; ++i ){
            response.data[i].internalId = auxId;
            response.data[i].service = decodeURIComponent(response.data[i].service);
            auxId++;
         }
         // Atualiza o num de entradas
         myscope.data.portForwardRemEntries = myscope.data.portForwardRemEntries - response.data.length;
         
         myscope.data.portForwarding.push.apply(myscope.data.portForwarding, response.data);
         zpriv.extendsData(response.data, 'portForwarding');
         zpriv.extendsForwardData(myscope.data.portForwarding);
         defer.resolve(myscope.data);
         return true;
      }else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
      return false;
   })
   .catch(function(response){
      $console.warn("actionAddVirtualServer::catch", response);
      if ( response ){
         $scope.$root.notifications.alerts.open('error', null, response.errors);
      }
   })
   .finally(function(){
      $console.warn("newRule::myscope", myscope);
      myscope.loadInProgress = false;
   })
   return defer.promise;
};// endof ::actionAddVirtualServer

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
   dao.nat.get()
   .then(function(args){
      $console.warn("args: ", args);
      if ( (true === args.success) && !$U(args.data) ){
         myscope.data = args.data;
         if ( !$U(args.data.portForwarding) ){
            myscope.data.portForwarding = angular.copy(args.data.portForwarding);
         }
         if ( !$U(args.data.portActivation) ){
            myscope.data.portActivation = angular.copy(args.data.portActivation);
         }
         zpriv.extendsData(myscope.data.portForwarding, 'portForwarding');
         zpriv.extendsData(myscope.data.portActivation, 'portActivation');
         zpriv.extendsForwardData(myscope.data.portForwarding);
         zpriv.extendsAppData(myscope.data.portActivation);
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

zpriv.extendsForwardData = function (data){
   if ( angular.isArray(data) ){
      for ( var key in myscope.portForwardingMap ){ myscope.tplData.portForwarding.push(myscope.portForwardingMap[key]); }
   }
};// ::@extendsForwardData

zpriv.extendsAppData = function (data){
   if ( angular.isArray(data) ){
      for ( var key in myscope.portActivationMap ){ myscope.tplData.portActivation.push(myscope.portActivationMap[key]); }
   }
};// ::@extendsAppData

zpriv.extendsData = function (data, key){
   var aux = null, obj = { protocol: [], externalPortStart: [], externalPortEnd: [], internalPortStart: [], internalPortEnd: [] }, mapKey = null;
   var obj2 = { activeProtocol: [], activePortStart: [], activePortEnd: [], forwardProtocol: [], forwardPortStart: [], forwardPortEnd: [] };
   if ( angular.isArray(data) ){
      for ( var i = 0, leni = data.length; i < leni; ++i ){
         zpriv.extendsData(data[i], key);
      }
   }else{
      if ('portForwarding' === key){
         mapKey = data.service + '_' + data.serverIp;
         if ( $U(myscope.portForwardingMap[mapKey]) ){
            if ( !$U(data.interface) ) { obj.interface  = data.interface; }
            obj.service    = data.service;
            obj.serverIp   = data.serverIp;
            obj.protocol.push(data.protocol);
            obj.externalPortStart.push(data.externalPortStart);
            obj.externalPortEnd.push(data.externalPortEnd);
            obj.internalPortStart.push(data.internalPortStart);
            obj.internalPortEnd.push(data.internalPortEnd);
            myscope.portForwardingMap[mapKey] = obj;
         } else {
            myscope.portForwardingMap[mapKey].protocol.push(data.protocol);
            myscope.portForwardingMap[mapKey].externalPortStart.push(data.externalPortStart);
            myscope.portForwardingMap[mapKey].externalPortEnd.push(data.externalPortEnd);
            myscope.portForwardingMap[mapKey].internalPortStart.push(data.internalPortStart);
            myscope.portForwardingMap[mapKey].internalPortEnd.push(data.internalPortEnd);
         }
      }
      if ('portActivation' === key){
         if ( $U(myscope.portActivationMap[data.aplicationName]) ){
            if ( !$U(data.interface) ) { obj2.interface       = data.interface; }
            obj2.aplicationName  = data.aplicationName;
            obj2.activeProtocol.push(data.activeProtocol);
            obj2.activePortStart.push(data.activePortStart);
            obj2.activePortEnd.push(data.activePortEnd);
            obj2.forwardProtocol.push(data.forwardProtocol);
            obj2.forwardPortStart.push(data.forwardPortStart);
            obj2.forwardPortEnd.push(data.forwardPortEnd);
            myscope.portActivationMap[data.aplicationName] = obj2;
         } else {
            myscope.portActivationMap[data.aplicationName].activeProtocol.push(data.activeProtocol);
            myscope.portActivationMap[data.aplicationName].activePortStart.push(data.activePortStart);
            myscope.portActivationMap[data.aplicationName].activePortEnd.push(data.activePortEnd);
            myscope.portActivationMap[data.aplicationName].forwardProtocol.push(data.forwardProtocol);
            myscope.portActivationMap[data.aplicationName].forwardPortStart.push(data.forwardPortStart);
            myscope.portActivationMap[data.aplicationName].forwardPortEnd.push(data.forwardPortEnd);
         }
      }
//      $console.warn("myscope.tplData.portForwarding", angular.toJson(myscope.tplData.portForwarding));
//      $console.warn("myscope.tplData.portActivation", angular.toJson(myscope.tplData.portActivation));
   }
   return data;
};// ::@extendsData

/******************************************************************************
 * @name VALIDATION METHODS 
 * @description
 * The following methods shall be used as validators for each attribute. They 
 * are called directly from template. 
 ******************************************************************************/
myscope.isFormValid = function (){
   if ( !$U(myscope.formData) ){ return myscope.formData.$valid; }
   return false;
};// ::isFormValid

zpriv.validators = function (){
   myscope.validators = { protocol: {}, externalPorts: {}, internalPorts: {}, activePorts: {}, forwardPorts: {}, create: {} };

   myscope.validators.protocol.options = function (data){
      var options = uxfwk.map2array(uxfwk.mapFilter(myscope.common.protocol, ['tcpudp', 'tcp', 'udp']), 'key', 'value');
      return uxfwk.cache(data, '$$$protocol', options);
   };// ::@protocol::options

   myscope.validators.create = {
         isForwardValid: function (data){
            var result = true;
            result = (!$U(myscope.data.portForwardRemEntries) && (0 === myscope.data.portForwardRemEntries*1)) ? (false) : (true);
            return result;
         },
         isActiveValid: function (data){
            var result = true;
            result = (!$U(myscope.data.portActRemEntries) && (0 === myscope.data.portActRemEntries*1)) ? (false) : (true);
            return result;
         },
   p:null};
   
   myscope.validators.protocol = {
         texter: function (expression){return{
            textualize: function (value){
               var output = null, aux = null, key = null;
               if ( $U(expression) ){ return $filter('uxfwkNullHider')(); }
               if ( !angular.isArray(expression)) { return $filter('uxfwkNullHider')(); }
               
               output = '';
               for ( var i = 0, leni = expression.length; i < leni; ++i ){
                  key = uxfwk.getKeyByValue(expression[i], myscope.common.protocol);
                  output += '<div>' + fnTranslate('TEXT.FGW.SECURITY.NAT.COMMON.PROTICOL.OPTION.' + angular.uppercase(key)) + '</div>';
               }
               return output;
            },// ::textualize
            disableTooltip: true,
            expression: expression}},
      p:null};
   
   myscope.validators.externalPorts = {
         texter: function (expression){return{
            textualize: function (value){
               var output = null, portMap = {}, key = null, aux = null;
               if ( $U(expression) ){ return $filter('uxfwkNullHider')(); }
               if ( $U(expression.externalPortStart) ){ return $filter('uxfwkNullHider')(); }
               if ( $U(expression.externalPortEnd) ){ return $filter('uxfwkNullHider')(); }
               if ( !angular.isArray(expression.externalPortStart)) { return $filter('uxfwkNullHider')(); }
               if ( !angular.isArray(expression.externalPortEnd)) { return $filter('uxfwkNullHider')(); }

               for ( var i = 0, leni = expression.externalPortStart.length; i < leni; ++i ){
                  key = 'i{0}'.sprintf(i);
                  portMap[key] = {};
                  portMap[key].start = expression.externalPortStart[i];
               }
               for ( var i = 0, leni = expression.externalPortEnd.length; i < leni; ++i ){
                  var searchKey = 'i{0}'.sprintf(i);
                  for ( var key in portMap ){
                     if ( (searchKey === key) && !$U(portMap[searchKey]) ){
                        portMap[searchKey].end = expression.externalPortEnd[i];
                     }
                  }
               }
               output = '';
               for ( var key in portMap ){
                  output += '<div class="fgw-meta-data fgw-text-center"><span class="fgw-datetime">' + portMap[key].start + '</span>&nbsp;<span>'+ portMap[key].end + '</span></div>';
               }
               return output;
            },// ::textualize
            disableTooltip: true,
            expression: expression}},
      p:null};
   
   myscope.validators.internalPorts = {
         texter: function (expression){return{
            textualize: function (value){
               var output = null, portMap = {}, key = null, aux = null;
               if ( $U(expression) ){ return $filter('uxfwkNullHider')(); }
               if ( $U(expression.internalPortStart) ){ return $filter('uxfwkNullHider')(); }
               if ( $U(expression.internalPortEnd) ){ return $filter('uxfwkNullHider')(); }
               if ( !angular.isArray(expression.internalPortStart)) { return $filter('uxfwkNullHider')(); }
               if ( !angular.isArray(expression.internalPortEnd)) { return $filter('uxfwkNullHider')(); }

               for ( var i = 0, leni = expression.internalPortStart.length; i < leni; ++i ){
                  key = 'i{0}'.sprintf(i);
                  portMap[key] = {};
                  portMap[key].start = expression.internalPortStart[i];
               }
               for ( var i = 0, leni = expression.internalPortEnd.length; i < leni; ++i ){
                  var searchKey = 'i{0}'.sprintf(i);
                  for ( var key in portMap ){
                     if ( (searchKey === key) && !$U(portMap[searchKey]) ){
                        portMap[searchKey].end = expression.internalPortEnd[i];
                     }
                  }
               }
               output = '';
               for ( var key in portMap ){
                  output += '<div class="fgw-meta-data fgw-text-center"><span class="fgw-datetime">' + portMap[key].start + '</span>&nbsp;<span>'+ portMap[key].end + '</span></div>';
               }
               return output;
            },// ::textualize
            disableTooltip: true,
            expression: expression}},
      p:null};
   
   myscope.validators.activePorts = {
         texter: function (expression){return{
            textualize: function (value){
               var output = null, portMap = {}, key = null, aux = null;
               if ( $U(expression) ){ return $filter('uxfwkNullHider')(); }
               if ( $U(expression.activePortStart) ){ return $filter('uxfwkNullHider')(); }
               if ( $U(expression.activePortEnd) ){ return $filter('uxfwkNullHider')(); }
               if ( !angular.isArray(expression.activePortStart)) { return $filter('uxfwkNullHider')(); }
               if ( !angular.isArray(expression.activePortEnd)) { return $filter('uxfwkNullHider')(); }

               for ( var i = 0, leni = expression.activePortStart.length; i < leni; ++i ){
                  key = 'i{0}'.sprintf(i);
                  portMap[key] = {};
                  portMap[key].start = expression.activePortStart[i];
               }
               for ( var i = 0, leni = expression.activePortEnd.length; i < leni; ++i ){
                  var searchKey = 'i{0}'.sprintf(i);
                  for ( var key in portMap ){
                     if ( (searchKey === key) && !$U(portMap[searchKey]) ){
                        portMap[searchKey].end = expression.activePortEnd[i];
                     }
                  }
               }
               output = '';
               for ( var key in portMap ){
                  output += '<div class="fgw-meta-data fgw-text-center"><span class="fgw-datetime">' + portMap[key].start + '</span>&nbsp;<span>'+ portMap[key].end + '</span></div>';
               }
               return output;
            },// ::textualize
            disableTooltip: true,
            expression: expression}},
      p:null};
   
   myscope.validators.forwardPorts = {
         texter: function (expression){return{
            textualize: function (value){
               var output = null, portMap = {}, key = null, aux = null;
               if ( $U(expression) ){ return $filter('uxfwkNullHider')(); }
               if ( $U(expression.forwardPortStart) ){ return $filter('uxfwkNullHider')(); }
               if ( $U(expression.forwardPortEnd) ){ return $filter('uxfwkNullHider')(); }
               if ( !angular.isArray(expression.forwardPortStart)) { return $filter('uxfwkNullHider')(); }
               if ( !angular.isArray(expression.forwardPortEnd)) { return $filter('uxfwkNullHider')(); }

               for ( var i = 0, leni = expression.forwardPortStart.length; i < leni; ++i ){
                  key = 'i{0}'.sprintf(i);
                  portMap[key] = {};
                  portMap[key].start = expression.forwardPortStart[i];
               }
               for ( var i = 0, leni = expression.forwardPortEnd.length; i < leni; ++i ){
                  var searchKey = 'i{0}'.sprintf(i);
                  for ( var key in portMap ){
                     if ( (searchKey === key) && !$U(portMap[searchKey]) ){
                        portMap[searchKey].end = expression.forwardPortEnd[i];
                     }
                  }
               }
               output = '';
               for ( var key in portMap ){
                  output += '<div class="fgw-meta-data fgw-text-center"><span class="fgw-datetime">' + portMap[key].start + '</span>&nbsp;<span>'+ portMap[key].end + '</span></div>';
               }
               return output;
            },// ::textualize
            disableTooltip: true,
            expression: expression}},
      p:null};
};// ::@validators

}];
});



