define('uxfwk.fgw.summary', ['angularAMD', 'uxfwk'
   , 'uxfwk.require.html!uxfwk.fgw.summary'
   , 'uxfwk.require.lang!fgw.widgets.common'
   , 'widgets/summary/summary.dao'
   , 'uxfwk.fgw.summary.portTermination'
   , 'uxfwk.fgw.summary.switch'
   , 'uxfwk.fgw.wifi.rules'
], function (angularAMD, uxfwk){
   'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;

   angularAMD.directive('uxfwkFgwSummary', ['$compile', '$templateCache', '$timeout'
      , 'uxfwk.summary.dao'
      , 'uxfwk.fgw.wifi.rules'
   , function ($compile, $templateCache, $timeout
      , dao
      , wifiRules
   ){
      var rules = { wifi: {} };
      $console.warn("dao", dao)
      var fnTemplate = $compile($templateCache.get('uxfwk.fgw.summary.html'));

      var controller = ['$scope', function ($scope){
         
         var bypassValue = 0;
         var tmPromise = null;
         
         rules.wifi = wifiRules;
         
         function getData (data){
            dao.get(data)
            .then(function(response){
               $console.warn("CTRL::response", response);
               if ( response.data instanceof AbortHttpRequestError ){
                  // request aborted, abort process
               } else if ( (true === response.success) && !$U(response.data) ){
                  $scope.data = angular.copy(response.data);
               } else {}
            })
            .catch(function(response){
               if ( response instanceof Error ){
                  appUtilities.$rootScope.notifications.alerts.open('error', null, response.message);
               }else{
                  appUtilities.$rootScope.notifications.alerts.open('error', null, response);
               }
            })
            .finally(function(){
               bypassValue = 1;
               tmPromise = $timeout(getData, 10000, true, bypassValue);
            });
         };// ::@getData
         
         uxfwk.map2api(rules.wifi.field, $scope, {}, ['ssid']);
         
         $scope.isCATVVisible = function(value){
            var result = false;
            result = ( !$U(value) ) ? (true) : (false);
            return result;
         };
         
         $scope.isVisible = function(value){
            var result = false;
            result = (1 === value*1) ? (true) : (false);
            return result;
         };
         
         getData(bypassValue);
         
         $scope.$on('$destroy', function(){
            $console.warn("destroy::summary");
            if ( tmPromise ){ $timeout.cancel(tmPromise); tmPromise = null; }
         });
      }];// ::@controller
      
      return{
         scope: {},
         restrict: 'A',
         controller: controller,
         //templateUrl: 'uxfwk.fgw.summary.html',
         compile: function (tElement, tAttrs){

            return function link ($scope, $element, $attrs, $controllers){
               
               $scope.$applyAsync(function (){
                  fnTemplate($scope, function(clone){
                     $element.append(clone);
                  });
               });
            };// endof link
         }// endof compile
      };// endof object
   }]);// endof directive

   angularAMD.directive('translate', ['$parse', function ($parse){

      return{
         scope: false,
         compile: function (tElement, tAttrs){
            var textKey = tAttrs.translate;

            return function link ($scope, $element, $attrs, $controllers){
               var wListenContents = null;


               wListenContents = $scope.$watch(function(){ return $element.text(); }, function(value){
                  if ( value === textKey ){
                     $element.text('');
                  }else{
                     //wListenContents();
                  }
               })


            };// endof link
         }// endof compile
      }
   }]);

});// endof module


