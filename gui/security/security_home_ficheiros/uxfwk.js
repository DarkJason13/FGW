/**
 * @ngdoc directive 
 * @description 
 * This directive works as a controller enabling communication across the three vertical sections of table body. 
 * It uses 'data' as the nexus point to join each segment in a single data "controller". This allows for other
 * directives to augment data row behaviour.
 * This directive works by the following description: 
 * <ul> 
 *  <li>it listens to any change of 'data' storage;</li>
 *  <li>it extends each 'data' with a private object which will store a single controller -> this is the nexus</li>
 *  <li>each directive controller provides the following methods (all linked to data on nexus):</li>
 *   <ul>
 *    <li><b>getAllForms:</b> returns a map of all forms controllers that are registered in this nexus;</li>
 *   </ul>
 * </ul>
 *  
 * @author nuno-r-farinha
 */
define('uxfwk.table.component.data.row', ['angularAMD', 'uxfwk', 'uxfwk.data.cache.manager'], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U, lkey = 'uxfwk.table.directive.data.row::';
   var debug = $console.debug.bind($console, lkey), error = $console.error.bind($console, lkey);
   var info = $console.info.bind($console, lkey), warn = $console.warn.bind($console, lkey);
   var log = $console.log.bind($console, lkey);
   var DIRECTIVE = 'uxfwkTableDataRow';

function cacheBuilder (dataCacheMng){
   return function (data){
      return dataCacheMng.cache(data, {
         notificationMap: null,
         notifications:   [],
         forms:           {},
      }, lkey, false);
   };
};// @cacheBuilder

angularAMD.factory('uxfwk.table.data.row', ['uxfwk.data.cache.manager', function(dataCacheMng){

   var fnCache = cacheBuilder(dataCacheMng);

   return function (data){
      var nexus = fnCache(data);

      return{
         setNotification: function (severity, messageKey, messageText, field){
            if ( 0 === arguments.length ){ nexus.notifications = []; }
            else{
               nexus.notifications.push({
                  severity: angular.lowercase(severity),
                  field:    field,
                  text:     messageText,
               key:messageKey});
               //[#] This step is very important! It changes the array reference making
               // all watchers on this array, triggering changes everytime array content
               // changes.
               nexus.notifications = angular.copy(nexus.notifications);
            }
            if ( angular.isFunction(nexus.notify) ){ nexus.notify(); }
         },// ::setNotification
      'p':null};
   };//endof service
}]);//endof service

angularAMD.directive(DIRECTIVE, ['$parse', 'uxfwk.data.cache.manager', function directive ($parse, dataCacheMng){
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

   var fnCache = cacheBuilder(dataCacheMng);

   function controller (that, $scope, $element, $attrs){

      that.getAllForms = function (){
         return ($scope.nexus || {}).forms;
      };// ::getAllForms

      that.notifications = (function(ns){

         ns.getSeverity = function (field){
            var nexus = $scope.nexus || {};
            return ((nexus.notificationMap || {})[field] || {}).severity;
         };// ::getSeverity

         ns.getList = function (field){
            return (($scope.nexus || {}).notificationMap || {})[field];
         };// ::getList

         return ns;
      })({});//


   };// @controller

   return{
      restrict: 'A',
      controller: uxfwk.$controller(),
      require: [DIRECTIVE, '?^uxfwkTable', '?form', '?ngForm'],
      compile: function ($element, $attrs){
         var fnSettings = $parse($attrs[DIRECTIVE]);

         return function postLink ($scope, $element, $attrs, $controllers){
            var frmCtrl = $controllers[2] || $controllers[3];
            var tblCtrl = $controllers[1];
            var myCtrl = $controllers[0];
            var myscope = null, settings = null;

            //[#1.0] This directive should bootstrap only if it is in true context of a table
            if ( !tblCtrl ){ return; }
            //[#1.1] Check some constraints mandatory on settings
            if ( !angular.isObject(settings = fnSettings($scope)) ){ throw new ArgumentError('Invalid or NULL {settings} object'); }
            if ( !angular.isString(settings.area) ){ throw new ArgumentError('Invalid or NULL {settings.area} property'); }
            if ( !angular.isString(settings.data) ){ throw new ArgumentError('Invalid or NULL {settings.data} property'); }

            //[#2.0] Creates the true scope (isolated) and controller
            myscope = $scope.$new(true);
            myscope.settings = settings;
            controller(myCtrl, myscope, $element, $attrs);

            //[#3.0] Watcher over data-row, so that nexus data is created everytime this object changes
            $scope.$watch(function(){ return $scope[myscope.settings.data] }, function (value, oldValue){

               if ( !value || (value != oldValue) ){ return; }

               //[#3.1] Creates or links nexus data from cache service
               myscope.nexus = fnCache(value);

               //[#3.2] If form controller is present, registers it in nexus
               if ( frmCtrl ){ myscope.nexus.forms[myscope.settings.area] = frmCtrl; }

               //[#3.3] Adds APIs to nexus
               myscope.nexus.notify = function (){
                  var field = null, map = null, sev = null;

                  if ( tblCtrl && tblCtrl.notifications ){
                     myscope.nexus.notificationMap = {};
                     map = tblCtrl.notifications.update($scope.$index, myscope.nexus.notifications);
                     if ( !uxfwk.isEmpty(map) && (myscope.nexus.notifications.length > 0) ){
                        for ( var i = 0, leni = myscope.nexus.notifications.length; i < leni; ++i ){
                           field = myscope.nexus.notifications[i].field;
                           myscope.nexus.notificationMap[field] = myscope.nexus.notificationMap[field] || [];
                           myscope.nexus.notificationMap[field].push({ severity:myscope.nexus.notifications[i].severity, cardinal:map[myscope.nexus.notifications[i].key].cardinal });
                           switch ( sev ){
                              case 'warning':{ if ( ['error'].indexOf(myscope.nexus.notifications[i].severity) >= 0 ){ sev = myscope.nexus.notifications[i].severity; } }break;
                              case 'info':   { if ( ['warning', 'error'].indexOf(myscope.nexus.notifications[i].severity) >= 0 ){ sev = myscope.nexus.notifications[i].severity; } }break;
                              default: sev = myscope.nexus.notifications[i].severity; break;
                           }
                        }
                        if ( myscope.nexus.notificationMap[field] ){
                           myscope.nexus.notificationMap[field].sort(function(a,b){ return uxfwk.$sortNumber((a || {}).cardinal, (b || {}).cardinal); });
                           myscope.nexus.notificationMap[field].severity = sev;
                        }
                     }
                  }
               };// @notify
               myscope.nexus.notify();

            });// $watcher on settings.data

            //[#4.0] Watcher over notifications array to update element attributes
            $scope.$watch(function(){ return (myscope.nexus || {}).notifications; }, function (value){
               if ( angular.isArray(value) && (value.length > 0) ){
                  $element.addClass('uxfwk-table-row-has-notifications');
               }else{
                  $element.removeClass('uxfwk-table-row-has-notifications');
               }
            });// $watcher over notifications

            //[#5.0] On scope destruction, removes binds from nexus data
            $scope.$on('$destroy', function (){
               if ( myscope.nexus && myscope.nexus.forms && angular.isString(myscope.settings.area) ){
                  delete myscope.nexus.forms[myscope.settings.area];
               }
            });// destruction

         };//endof postLink
      }// endof compile
   };// endof object
}]);// endof directive

angularAMD.directive('uxfwkTableColid', ['$parse', function directive ($parse){

   return{
      restrict:'A',
      require: ['?^'+DIRECTIVE],
      compile: function ($element, $attrs){
         var mykey = 'uxfwkTableColid';

         return function postLink ($scope, $element, $attrs, $controllers){
            var dataRowCtrl = $controllers[0];
            var labels = null;

            if ( dataRowCtrl ){
               $scope.$watch(function(){
                  if ( dataRowCtrl.notifications ){ return dataRowCtrl.notifications.getList($attrs[mykey]); }
                  return null;
               }, function (value){
                  var myclass = null, html = '';

                  if ( angular.isArray(value) ){
                     myclass = value.severity;
                     switch ( value.severity ){
                        case 'error': $element.addClass(myclass = 'danger'); break;
                        default: $element.addClass(value.severity); break;
                     }
                     if ( labels ){ labels.remove(); }
                     for ( var i = 0, leni = value.length; i < leni; ++i ){ html += '<span class="fx-tr-{0}">{1}</span>'.sprintf(myclass, value[i].cardinal); }
                     if ( html.length > 0 ){
                        $element.children('div').eq(0).append(angular.element(html));
                        $element.children('div').eq(0).addClass('fx-pos-rel');
                     }
                  }
               });
            }
         };//endof postLink
      }// endof compile
   };// endof object
}]);// endof directive



});// endof module
