define('uxfwk.fgw.tools.restore.modal', ['angularAMD', 'uxfwk'
, 'uxfwk.require.lang!fgw.tools.common'
], function module (angularAMD, uxfwk){'use strict';
var $console = uxfwk.$console, $U = uxfwk.$U;
var common = {};
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

angularAMD.factory('uxfwk.fgw.tools.restore.modal', ['$uibModal'
   , '$filter'
   , 'appUtilities'
, function ($uibModal
   , $filter
   , appUtilities){
   var fnTranslate = $filter('translate');

   var controller = ['$scope', function($scope){
      var that = this, zpriv = {}, dao = {}, common = {}, solution = "fgw";
   
      // [#] - Boot
      (function _init(){
         that.validators = {};
         that.loadInProgress = true;
         that.criticalError = null;
         that.dependenciesResolved = false;
         that.data = {};
      })();// ::_init

      //[#2.0] - Request additional dependencies (if no critical error occurs)
      if ( !that.criticalError ){
         var $injector = angular.element(document).injector();
         var deps = [];

         that.loadInProgress = true;
         //[#2.1] - Request javascript dependencies
         deps.push('modules/{0}.tools/{0}.tools.dao'.sprintf(solution));
         require(deps, function(){

            // Inject dependencies
            dao.tools  = $injector.get('uxfwk.{0}.tools.dao'.sprintf(solution));

            //[#2.2] - Request language files
            appUtilities.$translatePartialLoader.addPart('{0}.tools.common'.sprintf(solution));
            appUtilities.$translate.refresh()
               .then(function(){
                  zpriv.validators();
                  //[#2.3] - Finally, sets resolution as concluded
                  that.dependenciesResolved = true;
                  that.loadInProgress = false;
               })
               .catch(function(){
                  that.criticalError = new Error('Undefined behaviour');
               });
         }, function(response){ that.criticalError = response; });
      }//[END#2.0]
      $console.info('SCOPE _initialize', that);
      
      /**
       * @name actionCancelData
       * @desc Makes request for the restore with a given file
       * @returns void
       */
      that.actionRestore = function(data){
         that.loadInProgress = true;
         return dao.tools.restore(that.data)
            .then(function(response){
               if ( response instanceof AbortHttpRequestError ){}
               else if ( true === response.success ){ $scope.$close(response.data); }
               else{ $scope.$root.notifications.alerts.open('error', null, response.errors); }
            })
            .finally(function(){ that.loadInProgress = false; });
      };// ::actionRestore

      /**
       * @name actionCancelData
       * @desc Dismiss modal
       * @returns void
       */
      that.actionCancelData = function () { $scope.$dismiss('cancel'); };

      zpriv.validators = function(){
         that.validators.file = (function(){ var field = {};
            field.isRequired = uxfwk.$true;// ::isRequired
            return field;
         })();

         that.validators.submit = (function(){ var field = {};
            field.isDisabled = function(){ return !angular.isObject(that.data.file); };// ::isDisabled
            return field;
         })();
      };
      
   }];// ::controller

   return function (devicesData){
      return $uibModal.open({
         ariaLabelledBy: 'modal-title',
         ariaDescribedBy: 'modal-body',
         templateUrl: 'modules/fgw.tools/fgw.tools.restore.modal.tpl.html',
         controller: controller,
         controllerAs: 'fgwToolsRestoreModal',
         resolve: {
            devicesData: function () {
               return devicesData;
            }
         }
      }).result;
   }
}]);

angularAMD.directive('uxfwkFgwToolsRestoreInputFile', ['$parse', function uxfwkFgwToolsRestoreInputFile($parse){
   var directive = {};
   // directive.controller = ['$scope', function($scope){ var that = this; }];
   // directive.controllerAs = "uxfwkFgwToolsRestoreInputFile";
   directive.scope = true;// ::scope
   directive.compile = function($elem, $attrs){
      var fnData = $parse($attrs.uxfwkFgwToolsRestoreInputFile);
      return {
         pre: function($scope, $elem, $attrs, $controller){
            $scope.data = fnData($scope) || {};

            var inputText  = $elem.children().eq(0);
            var inputFile  = $elem.children().children().children();

            // [#] - Bind click to input field and trigger click on input type file field
            inputText.bind('click', function(e){ inputFile.trigger('click'); });

            // [#] - Bind change to input type file field
            inputFile.bind("change", function (e) {
               var reader = new FileReader();
               reader.onload = function(loadEvent){
                  $scope.$apply(function(){
                     $scope.data.file = {
                        // lastModified: e.target.files[0].lastModified,
                        // lastModifiedDate: e.target.files[0].lastModifiedDate,
                        name: e.target.files[0].name,
                        // size: e.target.files[0].size,
                        // type: e.target.files[0].type,
                        data: loadEvent.target.result
                     }
                  });
               };// ::onload
               if (angular.isObject(e.target.files[0]) ){ reader.readAsDataURL(e.target.files[0]); }
               else { $scope.$apply(function(){ $scope.data.file = null; }); }
            });
         },
         post: function(){}
      }
   };
   return directive;
}]);// uxfwkFgwToolsRestoreInputFile

});
