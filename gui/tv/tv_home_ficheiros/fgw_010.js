/**
 * 
 */
define('uxfwk.fgw.home.diagram', ['angularAMD', 'uxfwk'
   , 'modules/fgw.home/fgw.home.dao'
], function module (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
angularAMD.directive('uxfwkFgwHomeDiagram', ['$parse', '$compile', '$timeout'
   , 'uxfwk.fgw.home.dao'
, function uxfwkFgwHomeDiagram ($parse, $compile, $timeout
   , dao
){

function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

var getDiagramInfo = function(data){
   var output = {};

   return dao.get(data)
   .then(function(response){
      $console.warn("getDiagramInfo::response", response);
      if ( (true === response.success) && !$U(response.data) ){
         output = angular.copy(response.data);
         return output;
      }
   })
};

return{
   scope: true,
   restrict: 'A',
   templateUrl: 'modules/fgw.home/fgw.home.diagram.html',
   compile: function ($element, $attrs){

      return function link ($scope, $element, $attrs, $controllers){
         var bypassValue = 0;
         var tmPromise = null;
         $scope.data = {};
         $scope.loading = true;
         
         var periodicRefresh = function (data){
            getDiagramInfo(data)
            .then(function(response){
               bypassValue = 1;
               tmPromise = $timeout(periodicRefresh, 10000, true, bypassValue);
               $scope.data = response;
               $scope.loading = false;
               $scope.$emit('loadingComplete');
            })            
         };// endof ::periodicRefresh
         periodicRefresh();
         $console.warn("$scope", $scope);
         
         $scope.$on('$destroy', function(){
            if ( tmPromise ){ $timeout.cancel(tmPromise); tmPromise = null; }
         });
         
      }
   }
}}]);// ::uxfwkFgwHomeDiagram
});//endof module
