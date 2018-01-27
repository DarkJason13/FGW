/**
 * uxRootDefault - boolean: last resort fallback, anything that does not match anything URL 
 * uxFallback    - string: states with this regexp adds the expression to a list of fallback urls states (internally, fallback will be applied to the first match - seeks from last to first since normally the specific ones are declared last)
 */
define(['angularAMD', 'uxfwk'], function (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.state.context', ['$q', '$rootScope', 'uxfwk.core.interface.dao', function uxfwkStateContext ($q, $rootScope, tpDao){
   var dataLocalInterface = { promise:null, object:null, requestedId:null };
   var uxfwkStateContext = {s:{},i:{}};
   var dataResourceCache = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!


uxfwkStateContext.s.getLocalEquipment = function (){
   return $rootScope.uxExtendedStateParams.equipmentObject;
};

uxfwkStateContext.s.getLocalInterface = function (bForce, $stateParams){
   //[#] bypass request if no interfaceId is defined on current state
   if ( !$U($stateParams) && $U($stateParams.interfaceId) ){
      $console.warn('$stateParams.interfaceId is not yet defined, so interface object cannot be resolved', $stateParams.interfaceId);
      return null;
   }else if ( $U($stateParams) ){ $stateParams = { interfaceId: dataLocalInterface.requestedId }; }

   if ( (!bForce) && (dataLocalInterface.requestedId === $stateParams.interfaceId) && (!$U(dataLocalInterface.promise) || !$U(dataLocalInterface.object)) ){
      //[#] If a promise is current, return it
      if ( !$U(dataLocalInterface.promise) ){
         return dataLocalInterface.promise;
      }
      //[#] If an object already is loaded, return a dummy promise that returns inconditionally the object
      else if ( !$U(dataLocalInterface.object) ){
         var defer = $q.defer();

         defer.resolve(dataLocalInterface.object);
         return defer.promise;
      }
   }else{
      //[#] If not, uses DAO do get a new interface and stores it
      dataLocalInterface.requestedId = $stateParams.interfaceId;
      dataLocalInterface.object = null;
      dataLocalInterface.promise = tpDao.get({ id: $stateParams.interfaceId }).then(function(response){
         dataLocalInterface.object = response[0];
         dataLocalInterface.promise = null;
         return dataLocalInterface.object;
      })
      return dataLocalInterface.promise;
   }
};// ::getLocalInterface

//jsonResource -> { id:{string}, value:{string}, data:{object_to_promiser} }
uxfwkStateContext.s.getResource = function (jsonResource, promiser, bForce){
   var cache = null;

   //[#] If no resource or promiser is provided, return NULL
   if ( $U(jsonResource) || $U(promiser) || $U(jsonResource.id) || !angular.isString(jsonResource.id) ){ $console.warn('Missing mandatory arguments!', arguments); }

   //[#] Creates cache to resource if none exists
   if ( $U(dataResourceCache[jsonResource.id]) ){ dataResourceCache[jsonResource.id] = { promise:null, requestValue:null, requestObject:null, objectReturned:null }; }
   cache = dataResourceCache[jsonResource.id];

   //[#] Checks if it can use cache
   if ( (!bForce) && (cache.requestValue === jsonResource.value) && (!$U(cache.promise) || !$U(cache.objectReturned)) ){
      //[#] If a promise is current, returned it
      if ( !$U(cache.promise) ){ return cache.promise; }
      //[#] If an object is current, returned it in a dummy promise
      else if ( !$U(cache.objectReturned) ){
         var defer = $q.defer();

         defer.resolve(cache.objectReturned);
         return defer.promise;
      }
   }
   //[#] If no cache is current, requests data by promiser
   else{
      cache.requestValue = jsonResource.value;
      cache.objectReturned = null;
      cache.promise = promiser(jsonResource.data).then(function(response){
         cache.objectReturned = response;
         cache.promise = null;
         return cache.objectReturned;
      });
      return cache.promise;
   }
};// ::getResource


return uxfwkStateContext.s;
}]);// ::uxfwk.state.context

function expandURIOptionsByEquipmentVersion (equipmentVersion, uris){
   var output = [];

   for ( var i = 0, leni = uris.length; i < leni; i++ ){
      var version_patch = 'v{0}.{1}.{2}'.sprintf(equipmentVersion.major, equipmentVersion.minor, equipmentVersion.patch);
      var version_minor = 'v{0}.{1}.0'.sprintf(equipmentVersion.major, equipmentVersion.minor);
      var version_edge = 'edge';

      if ( /\{equipmentVersionKey\}/.test(uris[i]) ){
         if ( 0 != equipmentVersion.patch ){ output.push(uris[i].replace(/\{equipmentVersionKey\}/g, version_patch)); }
         output.push(uris[i].replace(/\{equipmentVersionKey\}/g, version_minor));
         output.push(uris[i].replace(/\{equipmentVersionKey\}/g, version_edge));
      }else{
         output.push(uris[i]);
      }
   }
   return output;
};// expandURIOptionsByEquipmentVersion

var getEquipmentCapabilities = ['$rootScope', '$stateParams', '$q', 'uxfwk.core.equipment.dao', 'uxfwk.core.domain.dao', 'uxfwkSession', function($rootScope, $stateParams, $q, equipmentDao, domainDao, uxfwkSession){
   var defer = $q.defer();

   equipmentDao.get({ id: $stateParams.equipmentId })
   .then(function(response){
      return domainDao.get({ id: response[0].managedDomain })
      .then(function(data){
         if ( angular.isArray(data) && (data.length > 0) ){
            uxfwkSession.setDomainAccess(data[0].accessDomain);
         }else{
            uxfwkSession.setDomainAccess(null);
         }
         return response;
      })
   })
   .then(function(data){
      var version = 'any';

      if ( data[0].version ){ version = '{0}.{1}.{2}'.sprintf(data[0].version.major, data[0].version.minor, data[0].version.patch); }
      $rootScope.uxExtendedStateParams.equipmentId         = $stateParams.equipmentId;
      $rootScope.uxExtendedStateParams.equipmentName       = data[0].name;
      $rootScope.uxExtendedStateParams.equipmentType       = data[0].type;
      $rootScope.uxExtendedStateParams.equipmentVersion    = data[0].version;
      $rootScope.uxExtendedStateParams.equipmentVersionKey = 'v{0}'.sprintf(version);
      $rootScope.uxExtendedStateParams.equipmentCaps       = null;
      $rootScope.uxExtendedStateParams.equipmentObject     = data[0];
      $rootScope.uxExtendedStateParams.solutionKey         = null;
      $rootScope.uxExtendedStateParams.errors              = null;
   })
   .then(function(){
      var URICaps = expandURIOptionsByEquipmentVersion($rootScope.uxExtendedStateParams.equipmentVersion, ['caps/equipment/e{0}_{equipmentVersionKey}.caps.js'.sprintf($rootScope.uxExtendedStateParams.equipmentType)]);
      var handlerOk = function (caps){
         //[#] Fix for IE10 (it seems that on 404 error, requireJS was retrieving NULL response as success)
         if ( caps ){
            $console.info('Received URL {0}'.sprintf(URICaps[uri]));
            $rootScope.uxExtendedStateParams.solutionKey   = caps.solution;
            $rootScope.uxExtendedStateParams.equipmentCaps = caps;
            defer.resolve(caps);
         }else{
            handlerNok({ message:'requireJS returned an empty object' });
         }
      };// handlerOk
      var handlerNok = function (response){
         if ( !$U(response) && !$U(response.message) && (response.message.match(/Script error for/)) ){
            $console.warn('URL {0}: NOT FOUND or Invalid Javascript contents'.sprintf(URICaps[uri]));
         }else{
            $console.error('URL {0}: Javascript error [{1}]'.sprintf(URICaps[uri], response.message));
         }
         if ( uri < (URICaps.length) ){
            $console.info('Try fallback to URL {0}'.sprintf(URICaps[uri + 1]));
            require([URICaps[uri++]], handlerOk, handlerNok);
         }else{
            $rootScope.uxExtendedStateParams.errors = new URIError('Failed retrieving equipment capabilities from server; none of the URIs[{0}] returned a valid object'.sprintf(URICaps.join(',')));
            defer.resolve({});
         }
      };// handlerNok
      var uri = 0;

      require([URICaps[uri]], handlerOk, handlerNok);
   })
   .catch(function(){
      $rootScope.uxExtendedStateParams.errors = new URIError('Failed retrieving equipment information from server');
      defer.resolve({});
   });

   return defer.promise;
}];// getEquipmentCapabilities

var getCardCapabilities = ['$rootScope', '$stateParams', '$q', 'uxfwk.utils', 'uxfwk.core.card.dao', '$filter', function($rootScope, $stateParams, $q, $u, cardDao, $filter){
   var defer = $q.defer();

   cardDao.get({ id: $stateParams.cardId })
   .then(function(data){
      $rootScope.uxExtendedStateParams.cardId     = $stateParams.cardId;
      $rootScope.uxExtendedStateParams.cardName   = $filter('uxfwkCoreCardTypeShortName')(data[0].type);
      $rootScope.uxExtendedStateParams.cardType   = data[0].type;
      $rootScope.uxExtendedStateParams.slotId     = data[0].slot;
      $rootScope.uxExtendedStateParams.cardObject = data[0];
   })
   .then(function(){
      var URICaps = expandURIOptionsByEquipmentVersion($rootScope.uxExtendedStateParams.equipmentVersion, ['caps/core.card/e{0}_{equipmentVersionKey}_m{1}_any.caps.js'.sprintf($rootScope.uxExtendedStateParams.equipmentType, $rootScope.uxExtendedStateParams.cardType)]);
      var handlerOk = function (caps){
         //[#] Fix for IE10 (it seems that on 404 error, requireJS was retrieving NULL response as success)
         if ( caps ){
            defer.resolve(caps);
         }else{
            handlerNok({ message:'requireJS returned an empty object' });
         }
      };// handlerOk
      var handlerNok = function (){
         if ( uri < URICaps.length ){
            require([URICaps[uri++]], handlerOk, handlerNok);
         }else{
            throw new URIError('Failed retrieving card capabilities from server; none of the URIs[{0}] returned a valid object'.sprintf(URICaps.join(',')));
            defer.reject();
         }
      };// handlerNok
      var uri = 0;

      require([URICaps[uri]], handlerOk, handlerNok);
   })
   .catch(function(){
      defer.reject();
   });

   return defer.promise;
}];// getCardCapabilities

var getCardContextCapabilities = ['$rootScope', '$stateParams', '$q', 'uxfwk.utils', 'uxfwk.core.equipment.dao', 'uxfwk.core.card.dao', '$filter', function($rootScope, $stateParams, $q, $u, equipmentDao, cardDao, $filter){

   if ( $rootScope.uxExtendedStateParams.equipmentId != $stateParams.equipmentId ){
      return getEquipmentCapabilities[getEquipmentCapabilities.length - 1]($rootScope, $stateParams, $q, equipmentDao)
         .then(function(caps){
            return getCardCapabilities[getCardCapabilities.length - 1]($rootScope, $stateParams, $q, $u, cardDao, $filter);
         })
         .catch(function(){
            return null;
         })
   }else{
      return getCardCapabilities[getCardCapabilities.length - 1]($rootScope, $stateParams, $q, $u, cardDao, $filter);
   }

   return null;
}];// getCardContextCapabilities

var getInterfaceCapabilities = ['$rootScope', '$stateParams', '$q', 'uxfwk.utils', 'uxfwk.core.interface.dao', function($rootScope, $stateParams, $q, $u, interfaceDao){
   var defer = $q.defer();

   interfaceDao.get({ id: $stateParams.interfaceId })
      .then(function(data){
         $rootScope.uxExtendedStateParams.interfaceId   = $stateParams.interfaceId;
         $rootScope.uxExtendedStateParams.interfaceName = data[0].name;
         $rootScope.uxExtendedStateParams.interfaceType = data[0].type;
      })
      .then(function(){
         require(['caps/core.interface/e{1}_v{2}_m{3}_any_i{4}.caps.js'.sprintf(null,
            $rootScope.uxExtendedStateParams.equipmentType,
            $rootScope.uxExtendedStateParams.equipmentVersion,
            $rootScope.uxExtendedStateParams.cardType,
            $rootScope.uxExtendedStateParams.interfaceType)]
         , function(caps){
            defer.resolve(caps);
         }, function(){
            defer.reject();
         });
      })
      .catch(function(){
         defer.reject();
      });

   return defer.promise;
}];// getInterfaceCapabilities

var getInterfaceContextCapabilities = ['$rootScope', '$stateParams', '$q', 'uxfwk.utils', 'uxfwk.core.equipment.dao', 'uxfwk.core.card.dao', 'uxfwk.core.interface.dao', function($rootScope, $stateParams, $q, $u, equipmentDao, cardDao, interfaceDao){

   if ( $rootScope.uxExtendedStateParams.cardId != $stateParams.cardId ){
      return getCardContextCapabilities[getCardContextCapabilities.length - 1]($rootScope, $stateParams, $q, $u, equipmentDao, cardDao)
         .then(function(caps){
            return getInterfaceCapabilities[getInterfaceCapabilities.length - 1]($rootScope, $stateParams, $q, $u, interfaceDao);
         })
         .catch(function(){
            return null;
         })
   }else{
      return getInterfaceCapabilities[getInterfaceCapabilities.length - 1]($rootScope, $stateParams, $q, $u, interfaceDao);
   }

   return null;
}];// getInterfaceContextCapabilities

var resourceCapabilities = ['$stateParams', '$rootScope', 'appUtilities', 'capabilities', 'params', function ($stateParams, $rootScope, appUtilities, capabilities, params){
   var $injector = appUtilities.$injector;
   var defer = appUtilities.$q.defer();
   var reports = {};// for debug
   var URICaps = null;

   $console.debug('RESOURCE.CAPS: get capabilities for URL[{0}]'.sprintf(params.url));
   if ( 1 ){
      var uri = 0;

      URICaps = expandURIOptionsByEquipmentVersion($rootScope.uxExtendedStateParams.equipmentVersion, [params.url.sprintf($rootScope.uxExtendedStateParams.equipmentType, $rootScope.uxExtendedStateParams.cardType)]);
      reports.uris = URICaps;
      reports.retries = [];

      var handlerOk = function (response){
         //[#] Fix for IE10 (it seems that on 404 error, requireJS was retrieving NULL response as success)
         if ( response ){
            $console.info('RESOURCE.CAPS success', reports);
            reports.result = response;
            defer.resolve(response);
            $console.debug('RESOURCE.CAPS: returned capabilities successfully on URL[{0}]'.sprintf(URICaps[uri]));
         }else{
            handlerNok({ message:'requireJS returned an empty object' });
         }
      };// handlerOk
      var handlerNok = function (error){
         reports.retries.push({ message: 'Failed getting resource on URI[{0}]'.sprintf(URICaps[uri]), error: error });
         uri++;
         if ( uri < URICaps.length ){
            require([URICaps[uri]], handlerOk, handlerNok);
         }else{
            $console.warn('RESOURCE.CAPS error', reports, arguments);
            defer.resolve(new URIError('Failed retrieving card capabilities from server; none of the URIs[{0}] returned a valid object'.sprintf(URICaps.join(','))));
         }
      };// handlerNok
      require([URICaps[uri]], handlerOk, handlerNok);
   }

   return defer.promise;
}];// ::resourceCapabilities

function getResourceCapabilities ($stateParams, $q, pathResource, level){
   var $injector = angular.element(document).injector();
   var defer = $q.defer();
   var caps = {};

   //console.info('getResourceCapabilities', arguments);
   $injector.invoke(getEquipmentCapabilities, null, { '$stateParams': $stateParams })
   .then(function(eqpcaps){
      caps.equipment = eqpcaps;
      if ( 1 == level ){
         defer.resolve(caps);
      }else{
         return $injector.invoke(getCardCapabilities, null, { '$stateParams': $stateParams });
      }
   })
   .then(function(crdcaps){
      if ( level <= 1 ){ return; }
      caps.card = crdcaps;
      if ( 2 == level ){
         defer.resolve(caps);
      }else{
         return $injector.invoke(['$rootScope', '$q', function($rootScope, $q){
            //var defer = $q.defer();
            var URICaps = expandURIOptionsByEquipmentVersion($rootScope.uxExtendedStateParams.equipmentVersion, [pathResource.sprintf($rootScope.uxExtendedStateParams.equipmentType, $rootScope.uxExtendedStateParams.cardType)]);
            var handlerOk = function (rsrccaps){
               //[#] Fix for IE10 (it seems that on 404 error, requireJS was retrieving NULL response as success)
               if ( rsrccaps ){
                  caps.resource = rsrccaps;
                  defer.resolve(caps);
               }else{
                  handlerNok({ message:'requireJS returned an empty object' });
               }
            };// handlerOk
            var handlerNok = function (){
               if ( uri < URICaps.length ){
                  require([URICaps[uri++]], handlerOk, handlerNok);
               }else{
                  throw new URIError('Failed retrieving card capabilities from server; none of the URIs[{0}] returned a valid object'.sprintf(URICaps.join(',')));
                  defer.reject();
               }
            };// handlerNok
            var uri = 0;

            require([URICaps[uri]], handlerOk, handlerNok);
         }]);
      }
   })
   .catch(function(error){
      defer.reject(error);
   })
   return defer.promise;
};// getResourceCapabilities


function resolveSequence ($stateParams, bBestEffort, resolutions){
   var $injector = angular.element(document).injector();
   var $q = $injector.get('$q');
   var defer = $q.defer();
   var promise = null;
   var results = {};
   var output = {};
   var offset = 0;

   var handlerOk = function (response){
      var rsrcId = resolutions[offset++].id;

      results[rsrcId] = {};
      output[rsrcId] = response;
      results[rsrcId].response = response;
      results[rsrcId].message = 'Resolution[{0}] resolved successfully'.sprintf(resolutions[offset - 1].id);
      if ( (offset < resolutions.length) && resolutions[offset] ){
         if ( !$U(promise = $injector.invoke(resolutions[offset].handler, null, { '$stateParams': $stateParams, 'capabilities': output, 'params': resolutions[offset].params })) ){
            promise.then(handlerOk).catch(handlerNok);
         }else{
            var error = new Error('Resolution[{0}] did not return a valid promise'.sprintf(resolutions[offset].id));
            $console.debug(error, promise);
            output[resolutions[offset].id] = error;
            defer.resolve(output);
            $console.info('resolveSequence', results);
         }
      }else{
         $console.info('Resolution sequence terminate successfully', results);
         defer.resolve(output);
      }
   };// handlerOk
   var handlerNok = function (response){
      var rsrcId = resolutions[offset++].id;

      output[rsrcId] = null;
      if ( (offset < resolutions.length) && (true === bBestEffort) && resolutions[offset] ){
         $injector.invoke(resolutions[offset].handler, null, { '$stateParams': $stateParams, 'capabilities': output, 'params': resolutions[offset].params }).then(handlerOk).catch(handlerNok);
      }else if ( true === bBestEffort ){
         $console.debug('Resolution sequence terminate with error', output);
         defer.resolve(output);
      }else{
         $console.debug('Resolution handler[{0}] did not resolve'.sprintf(offset - 1), response);
         defer.resolve(null);
      }
   };// handlerNok

   promise = $injector.invoke(resolutions[offset].handler, null, { '$stateParams': $stateParams, 'capabilities': output, 'params': resolutions[offset].params });
   if ( !$U(promise) ){
      promise.then(handlerOk).catch(handlerNok);
   }else{
      defer.resolve(new Error('First resolution handler did not return a valid promise'));
   }

   return defer.promise;
};// resolveSequence

function loadCss (files){
   for ( var i = 0, leni = files.length; i < leni; i++ ){
      var link = document.createElement('link');

      link.type = 'text/css';
      link.rel  = 'stylesheet';
      link.href = files[i];
      document.getElementsByTagName('head')[0].appendChild(link);
   }
};// loadCss

function getControllerSet2 ($rootScope, $q, mystate, view, set, bHasCss, dependencies){
   var tplpath = '{0}.tpl.html'.sprintf(set);
   var ctrlpath = '{0}.ctrl'.sprintf(set);
   var csspath = '{0}.css'.sprintf(set);
   var myview = mystate.views[view];
   var defer = $q.defer();
   var deps = [ctrlpath];

   $rootScope.$$$viewSets = $rootScope.$$$viewSets || {};
   $rootScope.$$$viewSets[set] = $rootScope.$$$viewSets[set] || {};

   $rootScope.$$$viewTemplateUrl = null;
   bHasCss = $U(bHasCss)?(true):(bHasCss);
   $rootScope.viewSets = $rootScope.viewSets || {};
   $rootScope.viewSets[view] = { templateUrl: null };
   if ( bHasCss ){ loadCss([csspath]); }
   require([ctrlpath], function(ctrl){
      if ( angular.isDefined(ctrl) ){
         if ( !angular.isDefined(view) ){
            mystate.controller = ctrl;
         }else{
            mystate.views[view].controller = ctrl;
         }
         $rootScope.$$$viewSets[set].template = tplpath;
         defer.resolve(ctrl);
      }else{
         $console.warn('Controller[{0}] load error (NULL pointer returned)'.sprintf(ctrlpath), ctrl);
         defer.reject();
      }
   }, function(error){
      $console.error(error);
      defer.reject();
   });
   return defer.promise;
};// getControllerSet2

function createViewSet (sViewName, sModuleKey, bWrapped, bHasCss, options){
   var resolution = { controller: ['$rootScope', '$q', function($rootScope, $q){ return getControllerSet2($rootScope, $q, this, sViewName, sModuleKey, bHasCss, $U(options)?(null):(options.dependencies)); }] };

   if ( bWrapped ){
      return {
         resolve:    resolution,
         controller: angular.noop,
         //template:   '<div class="uxfwk-wrapped-view" data-ng-include="\'{0}.tpl.html\'"></div>'.sprintf(sModuleKey)
         template:   '<div class="uxfwk-wrapped-view" data-ng-if="$root.$$$viewSets[\'{0}\'].template" data-ng-include="$root.$$$viewSets[\'{0}\'].template"></div>'.sprintf(sModuleKey)
      };
   }else{
      return {
         resolve:     resolution,
         controller:  angular.noop,
         templateUrl: '{0}.tpl.html'.sprintf(sModuleKey)
         //template:    '<div data-ng-if="viewSets[\'{0}\'].templateUrl" data-ng-include="viewSets[\'{0}\'].templateUrl" style="height:100%;width:100%"><div>'.sprintf(sViewName)
      };
   }
};// createViewSet

function createStateContext (parent, params, rewriteStateParams){
   var stateContextResolution = ['$stateParams', 'uxfwk.state.context'];

   stateContextResolution.push(function($stateParams, uxfwkStateContext){
      var myStateParams = angular.copy($stateParams);
      var output = { parent: parent, ancestors: angular.copy(uxfwkStateContext) };

      if ( !$U(params) ){ output = angular.extend(output, params); }
      if ( !$U(rewriteStateParams) && !$U(rewriteStateParams.equipmentId) ){ myStateParams.equipmentId = rewriteStateParams.equipmentId; }
      if ( !$U(rewriteStateParams) && !$U(rewriteStateParams.cardId) )     { myStateParams.cardId      = rewriteStateParams.cardId; }
      if ( !$U(rewriteStateParams) && !$U(rewriteStateParams.interfaceId) ){ myStateParams.interfaceId = rewriteStateParams.interfaceId; }
      if ( !$U(rewriteStateParams) && !$U(rewriteStateParams.card) )       { myStateParams.cardId      = '{0}-{1}'.sprintf(myStateParams.equipmentId, rewriteStateParams.card); }
      if ( !$U(rewriteStateParams) && !$U(rewriteStateParams.tp) )         { myStateParams.interfaceId = '{0}-{1}'.sprintf(myStateParams.cardId, rewriteStateParams.tp); }
      if ( !$U(myStateParams.equipmentId) && $U(myStateParams.cardId) ){ myStateParams.cardId = '{0}-0'.sprintf(myStateParams.equipmentId); }
      output.params = myStateParams;      

      return output;
   });
   return stateContextResolution;
};// createStateContext

var statesUtils = {
   getEqpCapabilities:     getEquipmentCapabilities,
   getCrdCapabilities:     getCardContextCapabilities,
   getRscCapabilities:     getResourceCapabilities,
   createViewSet:          createViewSet,
   createStateContext:     createStateContext,
   resolveSequence:        resolveSequence,
   rmCoreCardCapabilities: getCardCapabilities,
   resourceCapabilities:   resourceCapabilities,
p:null};

var states = [];

return function (statesLoaders){
   var loaders = {};
   for ( var i = 0, leni = statesLoaders.length; i < leni; i++ ){
      states.push.apply(states, statesLoaders[i](statesUtils));
   }
   return states;
};
});
