define('uxfwk.table', ['angularAMD', 'uxfwk', 'uxfwk.ui.button.refresh', 'uxfwk.rm.ui.data.view', 'uxfwk.table.component.data.row'], function(angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
   var table = {};
function vshack (){ vshack.catch(); };// SlickEdit hack, do not remove!!!

function getAttrNormalizedMap ($normalize, $element){
   var output = {};

   if ( $element[0].attributes && $element[0].attributes.length ){
      for ( var i = 0, leni = $element[0].attributes.length; i < leni; ++i ){
         output[$normalize($element[0].attributes[i].nodeName)] = $element[0].attributes[i].nodeValue;
      }
   }
   return output;
};// ::getAttrNormalizedMap

function getAttrNorm ($normalize, $element, attrName, original){
   var attrs = $element[0].attributes;

   for ( var i = 0, leni = attrs.length; i < leni; i++ ){
      if ( attrName == $normalize(attrs[i].nodeName) ){
         if ( original ){
            original.name  = attrs[i].nodeName;
            original.value = attrs[i].value;
         }
         return attrs[i].value;
      }
   }
   return null;
};// ::getAttrNorm


/**
 *  
 * row.properties ($$uxtbl): { 
 *    isNewEntry:  {boolean:false},
 *    isInEdition: {boolean:false},
 *    isSelected:  {boolean:false},
 *    isLoading:   {boolean:false},
 *    isLocked:    {boolean:false},
 *    isGroupMst:  {boolean:false},
 *    isGroupSlv:  {boolean:false},
 *    hasCustom:   {boolean:null},  // if this attribute is defined in row, it will overwrite any table scope attribute
 *    hasDetail:   {boolean:true},
 *    hasEdit:     {boolean:null},  // if this attribute is defined in row, it will overwrite any table scope attribute
 *    hasDelete:   {boolean:null},  // if this attribute is defined in row, it will overwrite any table scope attribute
 *    hasSubmit:   {boolean:null},  // if this attribute is defined in row, it will overwrite any table scope attribute
 *    hasLinkAdd:  {boolean:null},  // if this attribute is defined in row, it will overwrite any table scope attribute
 *    hasLinkRem:  {boolean:null},  // if this attribute is defined in row, it will overwrite any table scope attribute
 *    linkDetail:  {string:null},   // if this attribute is defined in row, it will overwrite any table scope attribute
 * }
 * table.settings: { 
 *    autoRefresh:    { allow: {boolean:false}, callback: null }
 *    columns:        [{ id: {string}, enabled: {boolean}, visible: {boolean} }, ..., {...}]
 *    confirmDeletion:{ allow: {boolean:true} }
 *    customActions:  [{ id: {string}, isDisabled: fn, callback: fn, icon:{string}, btnText:{string} }]
 *    actionAbort:    { allow: {boolean:false}, callback: null }
 *    actionSearch:   { allow: {boolean:false}, callback: null, expanded: {boolean:false} }
 *    bulkCancel:     { allow: {boolean:false}, btnText: {string:'TEXT.UXFWK.TABLE.ACTION.BUTTON.BULKCANCEL'} }
 *    bulkConfig:     { allow: {boolean:false}, btnText: {string:'TEXT.UXFWK.TABLE.ACTION.BUTTON.BULKAPPLY'} }
 *    bulkDeletion:   { allow: {boolean:true},  callback: null, btnText: {string:'TEXT.UXFWK.TABLE.ACTION.BUTTON.BULKDELETION'} }
 *    bulkEdition:    { allow: {boolean:false} }
 *    inlineEdition:  { allow: {boolean:true}  }
 *    inlineConfig:   { allow: {boolean:true},  callback: null }
 *    inlineCreation: { allow: {boolean:false}, callback: null, btnText: {string:'TEXT.UXFWK.TABLE.ACTION.BUTTON.INLINECREATION'}, tooltip: {string:'TEXT.UXFWK.TABLE.ACTION.TOOLTIP.INLINECREATION'} }
 *    inlineDeletion: { allow: {boolean:true},  callback: null }
 *    inlineCancel:   { allow: {boolean:true},  callback: null }
 *    inlineRefresh:  { allow: {boolean:false}, callback: null }
 *    inlineLinkAdd:  { allow: {boolean:false}, callback: null, tooltip: {string:'TEXT.UXFWK.TABLE.ACTION.TOOLTIP.INLINELINKADD'} }
 *    inlineLinkRem:  { allow: {boolean:false}, callback: null, tooltip: {string:'TEXT.UXFWK.TABLE.ACTION.TOOLTIP.INLINELINKREM'} }
 *    formCreation:   { allow: {boolean:false}, callback: null, btnText: {string:'TEXT.UXFWK.TABLE.ACTION.BUTTON.FORMCREATION'}, tooltip: {string:'TEXT.UXFWK.TABLE.ACTION.TOOLTIP.FORMCREATION'} }
 *    exportData:     { allow: {boolean:false}, link:{pdf:null, xls:null, csv:null} }
 *    showColumnAct:  { allow: {boolean:true} },
 *    showColumnSel:  { allow: {boolean:true} },
 *    showColumns:    { allow: {boolean:true} }
 *    showHeader:     { allow: {boolean:true} }
 *    showPages:      { allow: {boolean:true} }
 *    showRefresh:    { allow: {boolean:true}, isDisabled:{function:uxfwk.$false} }
 *    viewTable:      { allow: {boolean:true} },
 *    viewTopology:   { allow: {boolean:false} },
 * } 
 */

/**
 * @author nuno-r-farinha
 */
angularAMD.factory('uxfwkTableService', [function service_uxfwkTable (){
   return{
      defaultSetting:{
         hasColumnSelection:     true, // if true, in first column MUST exist a checkbox to select line
         hasTableFormEdition:    false,// if true, there should exist a button for form edition (possible in bulk)
         hasTableFormClone:      false,// if true, there should exist a button for form clone (possible in bulk)
         hasTableBulkRemove:     true, // if true, there should exist a button for remove (bulk by definition, as many lines may be marked for removal)
         hasColumnAction:        true, // if true, there should exist a last column with actions to be made on line
         hasTableAddInline:      false,// if true, there should exist add-inline button on the actions top bar
         hasTableAddForm:        false,// if true, there should exist add-form button on the actions top bar
         hasTableApplyAll:       true, // if true, there should exist a button for apply all
         hasTableCancelAll:      true, // if true, there should exist a button for cancel all
      pad:null},
      defaultPagination:{
         size:  10,
         index: 1,
         delay: 1000, // delay to be applied before a new rendering and resize is done after page size is set
      pad:null},
      defaultTemplates:{
         headCellSelectColumn: 'shared/uxfwk-table/html/uxfwk.table.head.cell.first.tpl.html',
         bodyCellSelectColumn: 'shared/uxfwk-table/html/uxfwk.table.body.cell.first.tpl.html',
         bodyCellActionColumn: 'shared/uxfwk-table/html/uxfwk.table.body.cell.last.tpl.html',
      pad:null},
      debug:{
         uxfwkTable:                        false,
         uxfwkTableInternalBody:            false,
         uxfwkTableInternalRow:             false,
         uxfwkTableInternalInjectionPoint:  false,
         uxfwkTableInternalBodyRowSelector: false,
         uxfwkTableInternalPagination:      false,
      pad:null},
      utils:{
         getNgAttribute: function (attr){
            return attr.replace(/^data-/,'').camelcase();
         },// getNgAttribute
      pad:null},
   pad:null}
}]);

/**
 * 
 * 
 * @author nuno-r-farinha (08/03/2015)
 */
angularAMD.directive('uxfwkTable', ['uxfwkTableService', '$compile', '$interpolate', '$q', '$uibModal', 'appUtilities', 'uxfwkSession', function uxfwkTable (settings, $compile, $interpolate, $q, $modal, appUtilities, uxfwkSession){
   var $console = appUtilities.$console, $U = appUtilities.$u.$U, $w = appUtilities.$w, $u = appUtilities.$u;
   var uxfwkTable = { scope: {}, link: {}, zpriv: {} };
function vshack (){ vshack.catch(); };// SlickEdit hack to make IDE see usefull functions, after this line all members are visible do IDE

   var defaultPagination = {
      size: 10,
      index: 1,
      total: 0,
      items: 0,
   pad:null};

   function fnDataResetConfigEntry ($scope, indexInPage){
      var store = $scope.controller.store;

      //[#] - If indexInPage is provided, it will only reset the entry in current page
      if ( angular.isDefined(indexInPage) ){
         //var offset = store.pagedata[indexInPage].$$uxtbl.offset;

         //angular.extend(store.currdata[offset], store.initdata[offset]);
      //[#] - Else, will reset every entries in table
      }else{
         alert('reset every single line marked');
      }
   };// fnDataResetConfigEntry

   function fnDataSubmitConfigEntry ($scope, indexInPage){
      var data = [];

      //[#1.0] - Constructs list of data to be modified
      if ( !$u.$U(indexInPage) ){
         if ( indexInPage >= $scope.jsonPagination.data.length ){ throw new RangeError('IndexInPage out of range for current page size[{0}]'.sprintf($scope.jsonPagination.data.length)); }
         data.push($scope.jsonPagination.data[indexInPage]);
      }else{
      }

      //[#2.0] - Waits for promise resolution
      $scope.actionConfigData(data)
         .then(function(responses){
            for ( var i = 0, leni = data.length; i < leni; i++ ){
               if ( true === responses[i].success ){
                  responses[i].data.$$uxtbl.isSelected  = false;
                  responses[i].data.$$uxtbl.isInEdition = false;
               }else{
                  responses[i].data.$$uxtbl.isSelected  = false;
                  responses[i].data.$$uxtbl.isInEdition = true;
               }
            }
            //[#] - This is MANDATORY, it will trigger a body rendering (since it is as if all page has been changed)
            //      Its not the best solution, but the one i could find that will trigger a change detection needed
            //      for angular to render all the page. The principle is: create a new object page as a deep copy of
            //      the old one. To maintain coherence with external controller, total data must be update with the
            //      new copy objects.
            if ( 1 ){
               var old = $scope.jsonPagination.data;

               // creates a deep copy of objects in page
               $scope.jsonPagination.data = angular.copy($scope.jsonPagination.data);
               for ( var i = 0, leni = old.length; i < leni; i++ ){
                  // updates total data with the new copies
                  $scope.jsonData[$scope.jsonData.indexOf(old[i])] = $scope.jsonPagination.data[i];
               }
            }
         })
         .catch(function(){
         });
   };// fnDataSubmitConfigEntry


uxfwkTable.zpriv.openDeleteModelConfirm = function (data){
   var modalInstance = null;

   modalInstance = $modal.open({
      template: (''+
      '<div class="modal-header">'+
         '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="$dismiss()">×</button>'+
         '<h4 class="modal-title" id="deleteTableRecordLabel" data-translate>TEXT.UXFWK.TABLE.MODAL.TITLE.DELETE</h4>'+
      '</div>'+
      '<div class="modal-body">'+
         '<div class="fx-confirm-wrapper">'+
            '<div class="alert alert-warning">'+
               '<div class="fx-alert-icon"><i class="fuxicons fuxicons-warning"></i></div>'+
               ((1 == data.length)?
                  ('<div class="fx-alert-desc"><p data-translate>TEXT.UXFWK.TABLE.MODAL.MESSAGESINGLE</p></div>'):
                  ('<div class="fx-alert-desc"><p data-translate data-translate-values="{ num: ' + data.length + '}">TEXT.UXFWK.TABLE.MODAL.MESSAGEMULTIPLE</p></div>')
               )+
            '</div>'+
         '</div>'+
      '</div>'+
      '<div class="modal-footer">'+
         '<button id="btDeleteTableRecord" type="button" class="btn btn-primary btn-sm" data-ng-click="$close()" data-translate>TEXT.UXFWK.TABLE.MODAL.BUTTON.DELETE</button>'+
         '<button type="button" class="btn btn-default btn-sm" data-dismiss="modal" data-ng-click="$dismiss()" data-translate>TEXT.UXFWK.TABLE.MODAL.BUTTON.CANCEL</button>'+
      '</div>'),
      controller: [function(){}], // dummy controller since no much things are required here
      size: 'sm',
   });
   return modalInstance.result;
};// ::@openDeleteModelConfirm

uxfwkTable.zpriv.tableActionUpdateColumnSelection = function (){
   return this.controller.updateColumnSelection();
};// ::@tableActionUpdateColumnSelection

uxfwkTable.zpriv.tableActionSimpleSearchToggle = function (){
   var $scope = this;

   $scope.settings.actionSearch.expanded = !$scope.settings.actionSearch.expanded;
   if ( !$U($scope.userCtrlSettings) && !$U($scope.userCtrlSettings.actionSearch) ){
      $scope.userCtrlSettings.actionSearch.expanded = $scope.settings.actionSearch.expanded;
   }
};// ::@tableActionSimpleSearchToggle

uxfwkTable.zpriv.bulkActionConfigData = function (){
   var pageData = this.jsonPagination.data;
   var output = [];

   for ( var i = 0, leni = pageData.length; i < leni; ++i ){
      if ( true === pageData[i].$$uxtbl.isInEdition ){
         output.push(pageData[i]);
      }
   }
   if ( !$U(this.settings.bulkConfig.callback) ){
      this.settings.bulkConfig.callback(output);
   }
};// ::@bulkActionConfigData


   function fnDataSubmitRemoveEntries ($scope, indexInPage){
      var data = [];

      //[#1.0] - Constructs list of data to be modified
      if ( !$u.$U(indexInPage) ){
         if ( indexInPage >= $scope.jsonPagination.data.length ){ throw new RangeError('IndexInPage out of range for current page size[{0}]'.sprintf($scope.jsonPagination.data.length)); }
         data.push($scope.jsonPagination.data[indexInPage]);
      }else{
         for ( var i = 0, leni = $scope.jsonData.length; i < leni; i++ ){
            if ( $scope.jsonData[i].$$uxtbl.isSelected ){
               data.push($scope.jsonData[i]);
            }
         }
      }

      //[#2.0] - Waits for promise resolution
      $scope.actionRemoveData(data)
      .then(function(responses){
         //TODO - processing entries with error (those with success are no longer present jsonData)
      })
      .catch(function(error){
      });
   };// fnDataSubmitRemoveEntries

   function fnDataGetCachePage ($scope){
      return $scope.jsonPagination.data;
      //return $scope.controller.store.pagedata;
   };// fnDataGetCachePage

uxfwkTable.zpriv.preLink = function ($scope, $element, $attrs, controller){
   $scope.msCtrl     = controller;
   $scope.controller = controller;
   $scope.headerShow = false;

   //[#1.0] - First, creates a object inside InheritScope
   //$scope.InheritScope = {};
   $scope.InheritScope.UxfwkTable = {};
   //[#1.2] - Creates a link between the InheritScope and its name declared by outsider controller (to make view HTML work with the name of the object)
   $scope[$scope.InheritScopeName] = $scope.InheritScope;

};// ::@preLink

uxfwkTable.zpriv.postLink = function ($scope, $element, $attrs, $ctrls){

   //[#1.0] - merges default values with input options
   $scope.InheritScope.Pagination = angular.extend({}, defaultPagination);
   //$scope.InheritScope.Columns    = {};

   //[#2.0] - sets internal data
   $scope.InheritScope.ready = false;

   //[#3.0] - sets public API
   $element.addClass('uxfwk-table');
   $scope.$emit('resize', true);

   $scope.tableActionUpdateColumnSelection = uxfwkTable.zpriv.tableActionUpdateColumnSelection;
   $scope.bulkActionConfigData = uxfwkTable.zpriv.bulkActionConfigData;
   $scope.tableActionSimpleSearchToggle = uxfwkTable.zpriv.tableActionSimpleSearchToggle;

   $console.debug($scope);
   $scope.console = $console;
   $scope.$U = $U;

   //console.warn($scope);
};// ::@postLink

uxfwkTable.controller = ['$scope', '$element', '$attrs', '$transclude', '$interpolate', 'appUtilities', function controller ($scope, $element, $attrs, $transclude, $interpolate, appUtilities){
   var transcludedContents = null;  // stores original transcluded contents
   var myController = this, that = this;

   //function vshack (){ vshack.catch(); };// SlickEdit hack to make IDE see usefull functions, after this line all members are visible do IDE
   $element = $w($element);

   this.settings   = angular.extend({}, settings.defaultSetting);
   this.templates  = angular.copy(settings.defaultTemplates);
   this.pagination = angular.copy(settings.defaultPagination);
   this.columns    = null;
   this.store = {
      penddata: [],  // pending new data (not yet commited but candidate)
      rnewdata: [],  // recently new data (already commited)
      initdata: [],
      currdata: [],
      ctrldata: [],  // stores data modification
      pagedata: [],
      progcont: 0,   // counts the number of transactions in progress
      errodata: [],  // stores all errors that ocurred on the last transaction
   };// data
   this.pagination.total = 0;

   //[#1.0] - Fundamental step, stores original contents for future process
   $transclude(function(clone, scope){
      myController.scopedTranscludedContents = { content: clone, scope: scope };
      myController.scopedTranscludedContents.scope.$$$$uxTableDirective = $scope;
      myController.scopedTranscludedContents.content.attr('data-ng-non-bindable', '');
      scope.uxfwkTableInternal = $scope;
      //console.info('new transclusion, client scope', scope, 'directive scope', $scope);
   });// $transclude

   //$element.attr('data-ng-non-bindable', null);
   //$transclude(function(clone, scope){
   $transclude($scope, function(clone, scope){
      transcludedContents = clone;
   });// $transclude

   //[#1.1] - Also, registers a destructor of transcluded contents
   $scope.$on('$destroy', function(){
      if ( transcludedContents ){
         myController.scopedTranscludedContents.content.remove();
         myController.scopedTranscludedContents.scope.$destroy();
         transcludedContents.remove();
         transcludedContents = null;
         $console.warn('Transcluded contents and scope were destroyed!!!');
      }
   });

   //[#1.2] - Creates a transcluded getter to be used by sub-directive injection-point
   this.fnGetTranscludedContents = function (){
      return $w(transcludedContents);
   };// fnGetTranscludedContents



   //[#1.4] - Look for info about row link detail (maintained old API for backward compatibility)
   if ( 1 ){
      var tbody = $w(myController.scopedTranscludedContents.content).find('tbody');
      var detail = null;

      if ( $U(detail = getAttrNorm($attrs.$normalize, tbody, 'uxfwkTableRowDetail')) ){
         var rows = tbody.find('tr');

         for ( var i = 0, leni = rows.length; i < leni; i++ ){
            if ( !$U(detail = getAttrNorm($attrs.$normalize, rows.eq(i), 'uxfwkTableLineReadonlyDetail')) ){ $scope.linkRowDetail = detail; break; }
         }
      }else{ $scope.linkRowDetail = detail; }
      if ( !$U(detail) ){
         if ( $U(appUtilities.$state.href(detail)) ){
            $attrs.$set('uxfwkTableRowDetail', detail);
            $attrs.$observe('uxfwkTableRowDetail', function(value){
               detail = $interpolate(value)(myController.scopedTranscludedContents.scope);
               $scope.linkRowDetail = detail;
            });
         }
      }
   }// end of row-detail

   //[#1.5] - Loads table settings
   $scope.ctrlSettings = angular.copy(table.defaultCtrlSettings);
   $scope.settings = $scope.ctrlSettings;
   this.settings = $scope.settings;
   for ( var key in $scope.userCtrlSettings ){
      if ( $scope.userCtrlSettings.hasOwnProperty(key) && !!$scope.userCtrlSettings[key] ){
         angular.extend($scope.ctrlSettings[key], $scope.userCtrlSettings[key] || {});
      }
   }
   //[#1.6] - Backward compatibility of callbacks registering
   if ( !$U($scope.actionConfigData) ){
      $scope.settings.inlineConfig.callback = $scope.actionConfigData;
      $scope.settings.bulkConfig.callback   = $scope.actionConfigData;
      $console.warn('Compatibility action: enabled inline/bulk configuration');
   }
   if ( !$U($scope.actionCreateData) ){
      $scope.settings.inlineCreation.callback = $scope.actionCreateData;
      $scope.settings.formCreation.callback   = $scope.actionCreateData;
      $console.warn('Compatibility action: enabled inline/form creation');
   }
   if ( !$U($scope.actionRemoveData) ){
      $scope.settings.inlineDeletion.callback = $scope.actionRemoveData;
      $scope.settings.bulkDeletion.callback   = $scope.actionRemoveData;
      $console.warn('Compatibility action: enabled inline/bulk deletion');
   }
   $scope.settings.bulkDeletion.callback = $scope.settings.bulkDeletion.callback || $scope.settings.inlineDeletion.callback;

   $scope.$watchGroup([function(){ return uxfwk.$evalKey($scope, ['userCtrlSettings', 'showHeader', 'allow']); }]
      , function(newValues){
         $scope.settings.showHeader.allow = $U(newValues[0])?($scope.settings.showHeader.allow):(newValues[0]);
      }
   );

   $scope.$watch(function(){ return uxfwk.$evalKey($scope, ['userCtrlSettings', 'exportData']); }, function(value){
      if ( angular.isObject(value) ){
         $scope.settings.exportData = angular.copy(value);
      }else{

      }
   });


   $scope.openDeleteModelConfirm = uxfwkTable.zpriv.openDeleteModelConfirm;


   $scope.api = {};
   $scope.api.DataGetCachePage        = fnDataGetCachePage;
   $scope.api.DataSubmitConfigEntry   = fnDataSubmitConfigEntry;
   $scope.api.DataSubmitRemoveEntries = fnDataSubmitRemoveEntries;
   $scope.api.DataResetConfigEntry    = fnDataResetConfigEntry;

   $scope.internal = {};
   $scope.internal.table = table;
   $scope.internal.table.$scope = $scope;
   $scope.internal.table.$utils = appUtilities;
   $scope.internal.table.$compile = $compile;
   $scope.internal.table.$w = $w;
   $scope.rootElement = $w($element);
   $scope.ngServices  = { $compile: $compile, $interpolate: $interpolate };

   $scope.actions = {};
   uxfwk.map2api(table.actions, $scope.actions, { scope: $scope, ctrl: this });
   this.dom = { root: appUtilities.$w($element) };


   /**
    * This is a small detector that will trigger a render event once per digest cycle 
    * (good to schedule things that required to be run everytime a re-render is done).
    */
   this.eventManager = (function(tableController){
      var renderTriggered = { body: false };

      function broadcast (tEventName){
         $scope.$broadcast.apply($scope, arguments);
         tableController.scopedTranscludedContents.scope.$broadcast.apply(tableController.scopedTranscludedContents.scope, arguments);
      };// ::@broadcast

      $scope.$watch(function digest_ended (){
         var eventName = null;
         for ( var p in renderTriggered ){
            if ( renderTriggered.hasOwnProperty(p) && (true === renderTriggered[p]) ){
               eventName = 'uxfwk-table-{0}-render'.sprintf(p);
               $console.debug('{0} render detected'.sprintf(p));
               $scope.$broadcast(eventName, tableController, tableController.dom.root);
               tableController.scopedTranscludedContents.scope.$broadcast(eventName, tableController, tableController.dom.root);
               renderTriggered[p] = false;
            }
         }
      });// ::@digest_ended
      return{
         trigger:   function(area){ renderTriggered[area] = true; },
         broadcast: broadcast,
      p:null};
   })(myController);// ::eventManager

   $scope.$watch(function($scope){ return $scope.jsonData; }, function(value){
      myController.jsonData = value;
      myController.notifications.clean();
   });//endof $watcher::jsonData
   $scope.$watch(function($scope){ return $scope.jsonPagination; }, function(value){
      myController.jsonPagination = value;
      myController.notifications.clean();
   });//endof $watcher::jsonPagination

   myController.updateGlobalFlags = function (){
      var data = $scope.jsonPagination.data;

      myController.flags = myController.flags || {};
      myController.flags.inBulkEdition;// this one is being managed by bulkEdition (at the bottom of this page)
      myController.flags.linesInEdition = false;
      myController.flags.linesSelected  = 0;// { 0: no lines selected, 1: visible lines selected, 2: hidden lines selected (not supported yet) }
      if ( angular.isArray(data) ){
         for ( var i = 0, leni = data.length; i < leni; ++i ){
            if ( angular.isObject(data[i].$$uxtbl) && (true === data[i].$$uxtbl.isInEdition) ){ myController.flags.linesInEdition = true; }
            if ( angular.isObject(data[i].$$uxtbl) && (true === data[i].$$uxtbl.isSelected)  ){ myController.flags.linesSelected  = 1; }
         }
      }
   };// ::updateGlobalFlags

   myController.actionBulkCancel = function (){
      var data = $scope.jsonPagination.data;
      var segment = [];

      if ( angular.isArray(data) && angular.isFunction(myController.settings.inlineCancel.callback) ){
         for ( var i = 0, leni = data.length; i < leni; ++i ){
            if ( angular.isObject(data[i].$$uxtbl) && (true === data[i].$$uxtbl.isInEdition) ){
               data[i].$$uxtbl.isInEdition = false;
               data[i].$$uxtbl.isSelected  = false;
               segment.push(data[i]);
            }
         }
         myController.settings.inlineCancel.callback(segment);
      }
      //$console.warn('CANCEL', myController.settings, angular.isFunction(myController.settings.inlineCancel.callback), segment);
   };// ::actionBulkCancel

   $scope.$watch(function updateGlobalFlags($scope){
      myController.updateGlobalFlags();
   });//endof flags updater






   //[#5.0] API for notifications
   // These API must serve two targets: communication with other directives and communication with its own template (via its scope)
   //[#5.1] Controller method to allow trigger of notifications
   that.notifications = (function(ns){
      var viewValue = { list:null, num:0 };
      var modelValue = {};

      function compileAll (){
         var output = {}, cnt = 1, map = {}, row = null;

         viewValue.list = [];
         for ( var r in modelValue ){
            if ( modelValue.hasOwnProperty(r) && angular.isArray(row = modelValue[r]) && (row.length) ){
               for ( var i = 0, leni = row.length; i < leni; ++i ){
                  if ( !map[row[i].key] ){
                     map[row[i].key] = {
                        severity: angular.lowercase(row[i].severity),
                        cardinal: cnt,
                        message:  row[i].text
                     }
                     viewValue.list.push(map[row[i].key]);
                     output[row[i].key] = {
                        cardinal: cnt
                     }
                     cnt++;
                  }
               }
            }
         }
         viewValue.num = viewValue.list.length;
         return output;
      };// @compileAll

      ns.update = function (row, notifications){
         modelValue['row' + row] = notifications;
         return compileAll();
      };// @update

      ns.clean = function (){
         modelValue = {};
         compileAll();
      };// @clean

      $scope.getNotificationList = function (count){
         if ( 0 === arguments.length ){ return viewValue.list; }
         if ( $U(count) && (viewValue.num >= 3) ){ return true; }
         else if ( count === viewValue.num ){ return true; }
         return null;
      };// @getNotificationList

      return ns;
   })({});// AMD to isolate variables


   $console.info('Table settings', $scope.settings, $scope);
}];// ::controller

uxfwkTable.compile = function ($element, $transclude){
   return {
      pre:  uxfwkTable.zpriv.preLink,
      post: uxfwkTable.zpriv.postLink
   };// return
};// ::compile

uxfwkTable.scope.InheritScope     = '=uxfwkTable';
uxfwkTable.scope.InheritScopeName = '@uxfwkTable';
uxfwkTable.scope.actionGetData    = '=uxfwkTableActionGetData';
uxfwkTable.scope.actionCancelData = '=uxfwkTableActionCancelData';
uxfwkTable.scope.actionConfigData = '=uxfwkTableActionConfigData';
uxfwkTable.scope.actionCreateData = '=uxfwkTableActionCreateData';
uxfwkTable.scope.actionRemoveData = '=uxfwkTableActionRemoveData';
uxfwkTable.scope.textButtonCreate = '@uxfwkTableTextButtonCreate';
uxfwkTable.scope.jsonColumn       = '=uxfwkTableJsonColumn';
uxfwkTable.scope.jsonData         = '=uxfwkTableJsonData';
uxfwkTable.scope.jsonPagination   = '=uxfwkTableJsonPagination';
uxfwkTable.scope.fnGetMetaData    = '=uxfwkTableFnGetMetaData';
uxfwkTable.scope.fnGetPageData    = '=uxfwkTableFnGetPageData';
uxfwkTable.scope.fnFilterData     = '=uxfwkTableFnFilterData';
uxfwkTable.scope.fnSortData       = '=uxfwkTableFnSortData';
uxfwkTable.scope.customTexts      = '=uxfwkTableTexts';
uxfwkTable.scope.userCtrlSettings = '=uxfwkTableCtrlSettings';
uxfwkTable.templateUrl = 'shared/uxfwk-table/html/uxfwk.table.body.tpl.html';
uxfwkTable.transclude = true;
//uxfwkTable.replace  = true;
//uxfwkTable.priority = 1001;
//uxfwkTable.terminal = true;
uxfwkTable.restrict = 'A';
return uxfwkTable;
}])

/**
 * 
 * 
 * @author nuno-r-farinha (08/03/2015)
 */
.directive('uxfwkTableFormFilter', ['$compile', 'appUtilities', function uxfwkTableFormFilter ($compile, appUtilities){
   var uxfwkTableFormFilter = {};
function vshack (){ vshack.catch(); };// SlickEdit hack to make IDE see usefull functions, after this line all members are visible do IDE

   uxfwkTableFormFilter.link = function ($scope, $element, $attrs, $ctrls){
      var contents = appUtilities.$w($ctrls[0].scopedTranscludedContents.content);
      var outscope = $ctrls[0].scopedTranscludedContents.scope;
      var simpleSearch = null;

      for ( var i = 0, leni = contents.length; i < leni; i++ ){
         if ( ('div' === contents.eq(i).tagName()) && ('simple-search' === getAttrNorm($attrs.$normalize, contents.eq(i), 'uxfwkTableSection')) ){
            simpleSearch = contents.eq(i);
            break;
         }
      }
      if ( null != simpleSearch ){
         simpleSearch.removeAttr('data-ng-non-bindable');
         $compile(simpleSearch)(outscope, function(clone, scope){
            $element.append(clone);
         });
      }
   };// uxfwkTableFormFilter::link

   uxfwkTableFormFilter.require = ['^uxfwkTable'];

return uxfwkTableFormFilter;
}])// ::uxfwkTableFormFilter

.directive('uxfwkUiTableActionsPlaceholder', ['$compile', '$parse', function uxfwkUiTableActionsPlaceholder ($compile, $parse){
   var DIRECTIVE = 'uxfwkUiTableActionsPlaceholder';

   return{
      scope: true,
      restrict: 'A',
      require: ['?^uxfwkTable'],
      compile: function ($element, $attrs){
         var fnSettings = $parse($attrs[DIRECTIVE]);

         return function postLink ($scope, $element, $attrs, $controller){
            var settings = fnSettings($scope);
            var tbCtrl = $controller[0];
            var foundContent = false;

            if ( angular.isObject(tbCtrl) ){
               var htContents = angular.element(tbCtrl.scopedTranscludedContents.content);
               var contentsScope = tbCtrl.scopedTranscludedContents.scope.$new();

               for ( var i = 0, leni = htContents.length; i < leni; ++i ){
                  var attrs = getAttrNormalizedMap($attrs.$normalize, htContents.eq(i));
                  
                  if ( angular.isString(attrs.uxfwkUiTableActions) ){
                     var type = attrs.uxfwkUiTableActions;

                     if ( angular.isString(type) && (settings.area === type) ){
                        foundContent = true;
                        $compile(htContents.eq(i).clone())(contentsScope, function(clone, scope){
                           $element.replaceWith(clone);
                           contentsScope.placeholderSettings = settings;
                           scope.$on('$destroy', function(){ clone.remove(); });
                        });
                     }
                  }
               }
               if ( !foundContent ){ $element.remove(); }
            }

         };// endof postLink
      }// endof compile
   };// endof object
}])// ::uxfwkUiTableActionsPlaceholder


/**
 * 
 * 
 * @author nuno-r-farinha
 */
.directive('uxfwkTableInternalActions', ['$log', 'uxfwkTableService', 'uxfwk.dom.wrapper', function uxfwkTable_DirectiveInternalActions ($log, settings, $w){
var uxfwkTable_DirectiveInternalActions = {};
function vshack (){ vshack.catch(); };// SlickEdit hack to make IDE see usefull functions, after this line all members are visible do IDE


   var debug = angular.noop;// debug function

   function fnActionGetClasses ($scope, key){'use strict';
      var hasMarkedEditions = false, hasSelections = false;
      var classes = [];

      if ( $U($scope.jsonData) ){ return ''; }
      for ( var i = 0, leni = $scope.jsonData.length; i < leni; i++ ){
         if ( false === hasSelections )   { hasSelections     = (($scope.jsonData[i].$$uxtbl) && (true === $scope.jsonData[i].$$uxtbl.isSelected)); }
         if ( false === hasMarkedEditions){ hasMarkedEditions = (($scope.jsonData[i].$$uxtbl) && (true === $scope.jsonData[i].$$uxtbl.isSelected) && (true === $scope.jsonData[i].$$uxtbl.isInEdition)); }
      }
      switch ( key ){
         case 'bulk-edit':   { if ( false === hasMarkedEditions ){ classes.push('disabled'); } }; break;
         case 'bulk-clone':  { if ( false === hasMarkedEditions ){ classes.push('disabled'); } }; break;
         case 'delete-all':  { if ( false === hasSelections     ){ classes.push('disabled'); } }; break;
         case 'apply-all':   { if ( false === hasMarkedEditions ){ classes.push('disabled'); } }; break;
         case 'cancel-all':  { if ( false === hasMarkedEditions ){ classes.push('disabled'); } }; break;
      }
      return classes.join(' ');
   };// fnActionGetClasses

   //[#3.0] - This directive requires that main controller already exists
   //         This link is more about event registering than DOM manipulation
   function fnPostLink ($scope, $element, $attrs, $ctrls){'use strict';


      var $element   = $w($element);
      var controller = $ctrls[0];
      var $btns = $element.find('button');

      /*var btnHelperQuery = $btns.eq(19);

      btnHelperQuery.popover({
         html: true,      
         placement: 'left',
         template : '<div class="popover fx-popover-s">'+
         '<div class="arrow"></div>'+
         '<div class="popover-content no-padding"></div>'+
         '</div>',
         content: function () {
            return $(this).next('.query-popover-content').html();
         }
      });*/

      $scope.api.ActionGetClasses = fnActionGetClasses;
      for ( var i = 0, leni = $btns.length; i < leni; i++ ){
         var key = $btns.eq(i).attr('data-uxfwk-table-action');
         var $btn = $btns.eq(i);

         switch ( key ){
            case 'form-edit':{
               if ( true == $scope.controller.settings.hasTableFormEdition ){
                  $btn.on('click', function (event){
                     //$scope.api.DataSubmitConfigEntry($scope);
                     //$scope.$apply();
                  });
               }else{ $btn.hide(); }
            }break;

            case 'form-clone':{
               if ( true == $scope.controller.settings.hasTableFormClone ){
                  $btn.on('click', function (event){
                     //$scope.api.DataSubmitConfigEntry($scope);
                     //$scope.$apply();
                  });
               }else{ $btn.hide(); }
            }break;

            case 'apply-all':{
               if ( true == $scope.controller.settings.hasTableApplyAll ){
                  $btn.on('click', function (event){
                     $scope.api.DataSubmitConfigEntry($scope);
                     $scope.$apply();
                  });
               }else{ $btn.hide(); }
            }break;

            case 'cancel-all':{
               if ( true == $scope.controller.settings.hasTableCancelAll ){
                  $btn.on('click', function (event){
                     $scope.api.DataResetConfigEntry($scope);
                     $scope.$apply();
                  });
               }else{ $btn.hide(); }
            }break;

            case 'add-inline':{
               if ( true == $scope.controller.settings.hasTableAddInline ){
                  $btn.on('click', function (event){
                     $scope.api.DataAddCandidateEntry($scope);
                     $scope.$apply();
                  });
               }else{ $btn.hide(); }
            }break;

            case 'add-form':{
               if ( true == $scope.controller.settings.hasTableAddForm ){
               }else{ $btn.hide(); }
            }break; 

            case 'refresh':{
               $btn.on('click', function (event){
                  if ( $scope.actionGetData ){
                     $scope.actionGetData();
                     $scope.$apply();
                  }
               });
            }break;

            case 'search':{
               break;
               var $as = $element.find('a');
               
               var searchOptionsTable = $w($element).children('div').eq(1).children('div').eq(0);
               var table = $w($element).parent('div').parent('div').children('div').eq(1);
               var internalActionsTableTotal = $w($element).children('div').eq(1);
               var internalActionsTableTotalHeight = internalActionsTableTotal.box().outerHeight;
               var searchOptionsTableHeight = $w($element).children('div').eq(0).box().outerHeight;

               internalActionsTableTotal.removeClass('in');
               table.data('expandedHeight', internalActionsTableTotalHeight + searchOptionsTableHeight);
               $btn.on('click', function (event){
                  if( internalActionsTableTotal.hasClass('in') ){
                     table.animate({paddingTop: searchOptionsTableHeight}, 'slow');
                  }
                  else{
                     table.animate({paddingTop: table.data('expandedHeight') }, 'slow');
                  }
               });
               //$btn.hide();
            }break; 

         }
      }

      $btns = $btn = null;

      return;

      for ( var i = 0, leni = $as.length; i < leni; i++ ){
         var key = $as.eq(i).attr('data-uxfwk-table-action');
         var $a = $as.eq(i);
         
         var btnAdvancedSearch = $as.eq(4);
         var btnSimpleSearch = $as.eq(5);

         switch ( key ){
            case 'advanced-search':{ break;

               var simpleSearchContainerHeight = $w($element).children('div').eq(1).children('div').eq(0).children('div').eq(1);
               var advancedSearchContainerHeight = $w($element).children('div').eq(1).children('div').eq(0).children('div').eq(2);

               $a.on('click', function (event){

                  btnAdvancedSearch.toggleClass('hidden');
                  btnSimpleSearch.toggleClass('hidden');
                  simpleSearchContainerHeight.addClass('hidden');
                  advancedSearchContainerHeight.removeClass('hidden');

                  var internalActionsTableTotalHeight2 = $w($element).children('div').eq(1).box().outerHeight;
                  var searchOptionsTableHeight2 = $w($element).children('div').eq(0).box().outerHeight;
                  
                  table.data('expandedHeight', internalActionsTableTotalHeight2 + searchOptionsTableHeight2);
                  table.animate({paddingTop: (internalActionsTableTotalHeight2 + searchOptionsTableHeight2) }, 'slow');

               });
            }break;
            case 'simple-search':{ break;
               $a.on('click', function (event){
                  
                  btnAdvancedSearch.toggleClass('hidden');
                  btnSimpleSearch.toggleClass('hidden');
                  simpleSearchContainerHeight.removeClass('hidden');
                  advancedSearchContainerHeight.addClass('hidden');
                  
                  table.data('expandedHeight', internalActionsTableTotalHeight + searchOptionsTableHeight);
                  table.animate({paddingTop: (internalActionsTableTotalHeight + searchOptionsTableHeight) }, 'slow');
               });
            }break; 

         }
      }

      $as = $a = null;


   };// fnPostLink

   //[#END]
   return{
      require: ['^uxfwkTable'],
      link:    fnPostLink,
   restrict: 'A'};
}])

.directive("popoverHtmlUnsafePopup", function () {
   return {
     restrict: "EA",
     replace: true,
     scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
     templateUrl: "shared/uxfwk-table/html/popover-html-unsafe-popup.html"
   };
})

.directive("popoverHtmlUnsafe", [ "$uibTooltip", function ($tooltip) {
   return $tooltip("popoverHtmlUnsafe", "popover", "click");
}])

.directive('uxfwkTableAction', ['$log', '$compile', 'uxfwk.dom.wrapper', 'appUtilities', function uxfwkTable_DirectiveAction ($log, $compile, $w, appUtilities){
var $U = appUtilities.$u.$U;
var uxfwkTable_DirectiveAction = {};
var priv = {};
function vshack (){ vshack.catch(); };// SlickEdit hack to make IDE see usefull functions, after this line all members are visible do IDE

   priv.uxfwkTableActionAbortData = function (data){
      var $scope = this;

      //[#1.0] - Check if callback for this actions was defined (error if not)
      if ( $U($scope.settings.actionAbort) || $U($scope.settings.actionAbort.callback) || (true != $scope.settings.actionAbort.allow) ){
         throw new Error('Callback[actionAbort] was not provided, so this action cannot be performed!');
      }
      console.info('adieu', this);

   };// ::uxfwkTableActionAbortData


   function initActionColumn ($scope, $element, $attrs, $ctrls){
      var $tree = $w($element).find('ul').eq(0).parent();
      var $btns = $w($element).find('button');

      $scope.dropDown = { isOpen: false };
      //[#] - needed to avoid premature dropdown close (since there are controls to be modified by user)
      $element.on('click', function($event){
         $event.stopPropagation();
      });// click

      //[#] - but since propagation was canceled by previous event, clicking any of buttons must close dropdown
      for ( var i = 0, leni = $btns.length; i < leni; i++ ){
         if ( 'button' == $btns.eq(i).attr('role') ){
            $btns.eq(i).on('click', function($event){
               $event.preventDefault();
               $event.stopPropagation();
               $scope.dropDown.isOpen = false;
               $scope.$apply();
            })
         }
      }

      function convertHeaderList2JsonList (list){
         var jsonList = [];

         for ( var i = 0, leni = list.length; i < leni; i++ ){
            if ( !list[i].isEnabled ){ continue; }
            jsonList.push({
               id:   list[i].id,
               text: list[i].text,
               state: {
                  // Only defined the selected state on terminal nodes. All the other nodes,
                  // let undefined so that jstree will choose the right state based on children selection.
                  selected: (0 == list[i].children.length)?(list[i].isVisible):(null),
                  opened:   true
               },
               children: convertHeaderList2JsonList(list[i].children)
            });
         }
         return jsonList;
      };// convertHeaderTree2JsonTree

      $tree.jstree({
         'plugins': ['themes', 'checkbox', 'search'],
         'core' : {
            "themes": {
               "name": "default",
               "dots": true,
               "icons": false,
               "multiple" : true
            },
            'data': convertHeaderList2JsonList($ctrls[0].header.tree)
         },
         'checkbox': {
            'keep_selected_style': false
         }
      });
      $ctrls[0].jstreeColumns = $tree.jstree();
      if (1){
         var $searchColumns = $w($element).children('div').eq(0).find('input').eq(0);
         var to = false;
         
         $searchColumns.keyup(function () {
            if(to) { clearTimeout(to); }
            to = setTimeout(function () {
               var v = $searchColumns.val();

               $tree.jstree(true).search(v);
           }, 250);
         });
      };
   };// initActionColumn

   function initActionDelete ($scope, $element, $attrs, $ctrls){
      $element.on('click', function($event){
         $scope.api.DataSubmitRemoveEntries($scope);
         $scope.$apply();
      });
   };// initActionDelete

uxfwkTable_DirectiveAction.link = {};
uxfwkTable_DirectiveAction.link.post = function ($scope, $element, $attrs, $ctrls)
{
   switch ( $attrs['uxfwkTableAction'] ){
      //case 'column': initActionColumn($scope, $element, $attrs, $ctrls); break;
      case 'delete': initActionDelete($scope, $element, $attrs, $ctrls); break;
   }

   $scope.uxfwkTableActionAbortData = priv.uxfwkTableActionAbortData;
};// ::fnPostLink

uxfwkTable_DirectiveAction.require  = ['^uxfwkTable'];
uxfwkTable_DirectiveAction.restrict = 'A';
return uxfwkTable_DirectiveAction;
}])

/**
 * 
 * 
 * @author nuno-r-farinha (08/03/2015)
 */
.directive('uxfwkTableInternalBody', ['$compile', '$interpolate', 'appUtilities', 'uxfwkSession', function uxfwkTableInternalBody ($compile, $interpolate, appUtilities, uxfwkSession){
   var $U = appUtilities.$u.$U, $w = appUtilities.$w, $console = appUtilities.$console;
   var uxfwkTableInternalBody = { link: {}, zpriv: { rowActionAbort:{}, rowActionLink:{}, rowActionDelete:{}, rowActionEdit:{}, rowActionRefresh:{}, rowActionSubmit:{}, tblFormCreation:{}, tblInlineCreation:{}, tblBulkDelete:{} } };
   var debug = angular.noop;
function vshack (){ vshack.catch(); };// SlickEdit hack, do not remove!!!

uxfwkTableInternalBody.zpriv.initializeTableMetadata = function ($scope, $element, $attrs, $ctrl){
   var templateTblHeader = $w($ctrl.scopedTranscludedContents.content.find('thead'));
   var headerMatrix = [], headerTree = [], headerList = [], headerMap = {};
   var clientScope = $ctrl.scopedTranscludedContents.scope;
   var headerRows = null;

   //[#1.0] - Checks for some basic requirements (for a valid table header, and table)
   if ( templateTblHeader.length <= 0 ){ throw new TypeError('Missing [thead] seection on table definition. Initialization aborted!'); }
   if ( (headerRows = templateTblHeader.find('tr')).length <= 0 ){ throw new TypeError('Missing rows on thead definition. Initialization aborted!'); }
   $ctrl.header = { matrix: null, list: null, tree: null, map: null };

   //[#2.0] - Before header tree is construct, a matrix will be needed to check row and col spanning
   //    This matrix will have size [rows x cols] where the major cell will have DOM element and all
   //    merged cells must have either 'up' or 'left' as an indication to where is their master cell.
   if ( 1 ){
      var colspan = null;
      var cells = null;

      //[#2.1] - Sets matrix number of rows
      for ( var i = 0, leni = headerRows.length; i < leni; ++i ){ headerMatrix.push([]); }

      //[#2.2] - Solves first row to get total number of columns
      cells = headerRows.eq(0).children('th');
      for ( var i = 0, leni = cells.length; i < leni; ++i ){
         colspan = (cells.eq(i).attr('colspan')*1) || 1;
         headerMatrix[0].push(0);
         for ( var j = 1; j < colspan; ++j ){ headerMatrix[0].push(null); }
      }
      //[#], now finishes matrix sizing by filling with 0s all the other rows
      for ( var i = 1, leni = headerMatrix.length; i < leni; ++i ){
         for ( var j = 0, lenj = headerMatrix[0].length; j < lenj; ++j ){ headerMatrix[i].push(0); }
      }

      //[#2.3] - Now the dark magic... runs all rows, putting 'up' and 'left' when empty cells merge with previous ones
      for ( var i = 0, leni = headerMatrix.length; i < leni; ++i ){
         cells = headerRows.eq(i).children('th');
         for ( var j = 0, k = 0, lenj = headerMatrix[i].length, lenk = cells.length; (j < lenj) && (k < lenk); ++j ){
            if ( 0 === headerMatrix[i][j] ){
               var colspan = (cells.eq(k).attr('colspan')*1) || 1;
               var rowspan = (cells.eq(k).attr('rowspan')*1) || 1;

               headerMatrix[i][j] = cells.eq(k);
               for ( var m = 1; m < rowspan; ++m ){ headerMatrix[i + m][j] = 'up'; }
               for ( var l = 1; l < colspan; ++l ){
                  headerMatrix[i][j + l] = 'left';
                  for ( var m = 1; m < rowspan; ++m ){ headerMatrix[i + m][j + l] = 'up'; }
               }
               k++;
            }
         }
      }
      $ctrl.header.matrix = headerMatrix;
   };// end of headerMatrix

   //[#3.0] - Now header tree is construct based on previous matrix
   if ( 1 ){
      var k = 0, l = 0;

      //[#] - Now constructs headerTree and headerMap using headerMatrix as a guide
      for ( var i = 0, leni = headerMatrix.length; i < leni; i++ ){
         for ( var j = 0, lenj = headerMatrix[i].length; j < lenj; j++ ){
            var node = null;

            if ( (0 == i) && ('left' != headerMatrix[i][j]) ){
               var columnData = getAttrNorm($attrs.$normalize, headerMatrix[i][j], 'uxfwkTableColumn');

               node = { children: [],
                  dom: headerMatrix[i][j],
               parent: null};

               headerTree.push(node);
               headerMatrix[i][j] = node;
            }else if ( (i > 0) && (String != headerMatrix[i][j].constructor) ){
               var columnData = getAttrNorm($attrs.$normalize, headerMatrix[i][j], 'uxfwkTableColumn');

               for ( k = (i - 1); (k >= 0) && ('up' === headerMatrix[k][j]); k-- );
               for ( l = j; (j >= 0) && ('left' === headerMatrix[k][l]); l-- );
               node = { children: [],
                  dom: headerMatrix[i][j]
               };
               headerMatrix[i][j] = node;
               headerMatrix[k][l].children.push(node);
               headerMatrix[i][j].parent = headerMatrix[k][l];
            }
            if ( !$U(node) ){
               var columnData = getAttrNorm($attrs.$normalize, node.dom, 'uxfwkTableColumn');
               var text = '';

               if ( 0 == node.dom.children().length ){
                  text = $interpolate(node.dom.html())($scope);
               }else{
                  //console.debug($compile(node.dom.children())($scope));
                  //text = ($compile(node.dom.children())($scope)).html();
               }

               node.id         = columnData.replace(/,.*/, '');
               node.text       = text;
               node.isFixed    = !!(-1 != columnData.indexOf(',fixed')) || (!$U(node.parent)?(node.parent.isFixed):(false));
               node.isVisible  = true;
               node.isEnabled  = true;
               node.isSortable = !!node.dom.attr('sort');
               node.filterFrag = node.dom.attr('filter');
               node.hasFilter  = !$U(node.filterFrag);
               node.dom.addClass('col-{0}'.sprintf(node.id));
               node.dom.attr('data-uxfwk-table-colid', node.id);
               headerMap[node.id] = node;
            }
         }
      }
      $ctrl.header.tree = headerTree;
      $ctrl.header.map = headerMap;
   };// end of headerTree

   //[#4.0] - Builds header list based on header tree
   if ( 1 ){
      //[#4.1] - Using a recursive function, is very trivial the conversion from a tree to a list.
      var listHeaders = function (headers, list){
         for ( var i = 0, leni = headers.length; i < leni; ++i ){
            if ( 0 == headers[i].children.length ){
               list.push(headers[i]);
            }else{
               listHeaders(headers[i].children, list);
            }
         }
         return list;
      };// ::listHeaders
      $ctrl.header.list = listHeaders(headerTree, []);
   }

   //[#5.0] - If external column settings was provided, import those settings to metadata storage
   if ( !$U($scope.settings.columns) && ($scope.settings.columns.length > 0) ){

      var updateAncestors = function (node){
         while ( !$U(node.parent) ){
            var visible = false;
            var enabled = false;

            node = node.parent;
            for ( var i = 0, leni = node.children.length; i < leni; ++i ){
               visible |= node.children[i].isVisible;
               enabled |= node.children[i].isEnabled;
            }
            node.isVisible = !!visible;
            node.isEnabled = !!enabled;
         }
      };// ::updateAncestors

      //[#5.1] - firsts thing to do, since external settings were provided, disable all columns
      for ( var i = 0, leni = $ctrl.header.list.length; i < leni; ++i ){ $ctrl.header.list[i].isEnabled = false; }

      //[#5.2] - now use header map to enabled each column base on known IDs
      for ( var i = 0, leni = $scope.settings.columns.length; i < leni; ++i ){
         if ( !$U($scope.settings.columns[i]) && !$U($ctrl.header.map[$scope.settings.columns[i].id]) && !!$scope.settings.columns[i].enabled ){
            $ctrl.header.map[$scope.settings.columns[i].id].isEnabled = true;
            $ctrl.header.map[$scope.settings.columns[i].id].isVisible = $scope.settings.columns[i].visible;
         }else if ( !$U($scope.settings.columns[i]) && $U($ctrl.header.map[$scope.settings.columns[i].id]) ){
            $console.warn('Table column {0} is unknown so it will be ignored'.sprintf($scope.settings.columns[i].id));
         }
      }
      //[#5.3] - now updates each header visibility and enabled based on its children
      for ( var i = 0, leni = $ctrl.header.list.length; i < leni; ++i ){ updateAncestors($ctrl.header.list[i]); }
   }

   $console.debug('Table metadata resulted', $ctrl.header);
};// #::initializeTableMetadata

uxfwkTableInternalBody.zpriv.initializeTableHeaderViews = function ($scope, $attrs, $ctrl, area, placeholder){
   var templateTable = $w($w($ctrl.scopedTranscludedContents.content.children('thead')).parent().clone());
   var headerMatrix = $ctrl.header.matrix;
   var headerTree = $ctrl.header.tree;
   var headerMap = $ctrl.header.map;
   var cellList = [];

   //[#1.0] - Internal recursive function to count colspan of a table header cell
   var colspan = function (node){
      var count = 0; for ( var i = 0, leni = node.children.length; i < leni; ++i ){ if ( node.children[i].isVisible && node.children[i].isEnabled ){ count += colspan(node.children[i]); } }; count = count || 1; return count;
   };// colspan

   //[#2.0] - Clears table body and all not visible header cells, and then empty rows
   if ( 1 ){
      var cells = templateTable.find('th');
      var rows = templateTable.children('thead').children('tr');

      //[#2.1] - Begins by removing tbody, since it is not required for this
      templateTable.find('tbody').remove();
      for ( var i = 0, leni = cells.length; i < leni; ++i ){
         var cellHeader = $w(cells.eq(i));
         var colId = cellHeader.attr('data-uxfwk-table-colid');
         var discard = false;

         discard  = $U(headerMap[colId]) || (true !== headerMap[colId].isVisible) || (true !== headerMap[colId].isEnabled);
         discard |= (('fixed' == area) && !headerMap[colId].isFixed);
         discard |= (('main' == area) && !!headerMap[colId].isFixed);
         discard |= ('right' == area);
         if ( discard ){
            cellHeader.remove();
         }else{
            var mycontents = '';

            cellHeader.addClass('fx-th');
            cellHeader.attr('colspan', colspan(headerMap[colId]));

            mycontents += '<div class="fx-th-container">';
            //[#] Enables sorting
            // By experience of filtering, since this directive do not occupy any space, its even better not
            // to put it on reference table.
            if ( true === headerMap[colId].isSortable ){
               if ( 'full' != area ){
                  mycontents += '<div class="fx-th-label" title="{0}" data-uxfwk-table-head-sort="{1}"><div>{0}</div></div>'.sprintf(headerMap[colId].text, colId);
                  cellHeader.addClass('sorting');
               }else{
                  mycontents += '<div class="fx-th-label"><div>{0}</div></div>'.sprintf(headerMap[colId].text);
                  cellHeader.addClass('sorting_disabled');
               }
            }else{
               cellHeader.addClass('sorting_disabled');
               mycontents += '<div class="fx-th-label" title="{0}">{0}</div>'.sprintf(headerMap[colId].text);
            }

            //[#] Enables filtering
            // The 2nd conditional may be strange but it is paramount! Since there is a reference table...
            // there would be a duplicated phony drop-down on that reference table that would mess with
            // ui-bootstrap plugin... the result, drop down would open and close on the same digest...the
            // same is..would never open. Since header dimensions are the same with or without the directive,
            // the best thing is to not include the directive on reference table (which is the area identified
            // by full).
            if ( true === headerMap[colId].hasFilter ){
               cellHeader.addClass('filter');
               if ( 'full' != area ){ mycontents += '<div data-uxfwk-table-head-filter="{0}" data-fragment="{1}"></div>'.sprintf(colId, headerMap[colId].filterFrag) };
            }else{ cellHeader.addClass('filter_disabled'); }

            mycontents += '</div>';

            cellHeader.html(mycontents);
            cellHeader.append('<div class="col-{0} col-rule" style="position:absolute;top:0px;left:0px;height:1px;"></div>'.sprintf(colId));
            cellList.push(cellHeader);
         }
      }
      //[#2.2] - Adds special columns on first row
      if ( 1 ){
         switch ( area ){
            case 'full':
            case 'fixed':{
               if ( true === $scope.settings.showColumnSel.allow ){
                  rows.eq(0).prepend(angular.element('<th class="fx-th fx-table-actions sorting_disabled uxfwk-table-col-first col-first" role="columnheader" rowspan="{0}"><div data-ng-include="\'{1}\'"></div></th>'.sprintf(rows.length, $ctrl.templates.headCellSelectColumn)));
               }else{
                  rows.eq(0).prepend(angular.element('<th class="fx-th fx-table-actions sorting_disabled uxfwk-table-col-first col-first-dummy" role="columnheader" rowspan="{0}"></th>'.sprintf(rows.length)));
               }
            }; break;
            case 'main':{
               rows.eq(0).append(angular.element('<th class="uxfwk-table-cell-padding" role="columnheader" rowspan="{0}">&nbsp;</th>'.sprintf(rows.length)));
            }; break;
            case 'right':{
               if ( true === $scope.settings.showColumnAct.allow ){
                  rows.eq(0).append(angular.element('<th class="fx-th fx-table-actions sorting_disabled col-last" role="columnheader" data-translate>TEXT.UXFWK.TABLE.ACTIONS</th>'));
               }else{
                  rows.eq(0).append(angular.element('<th class="fx-th fx-table-actions sorting_disabled col-last" role="columnheader">&nbsp;</th>'));
               }
            }; break;
         }
      }

      //[#2.3] - Removes empty rows (some browsers like FF will leave empty space from this rows)
      for ( var i = rows.length - 1; i >= 0; --i ){
         if ( 0 == rows.eq(i).children('th').length ){
            rows.eq(i).remove();
            $console.debug('Removed empty row {0}'.sprintf(i));
            for ( var j = 0; j <= i; ++j ){
               var cells = rows.eq(j).children('th');

               for ( var k = 0, lenk = cells.length; k < lenk; ++k ){
                  var rowspan = (cells.eq(k).attr('rowspan')*1) || 1;

                  if ( ((j - 1) + rowspan) >= i ){
                     cells.eq(k).attr('rowspan', rowspan - 1);
                     $console.debug('Cell{0}{1} rowspan changed from {2} to {3}'.sprintf(j, k, rowspan, rowspan - 1));
                  }
               }
            }
         }
      }
   }

   templateTable.attr('data-ng-non-bindable', null);
   templateTable.addClass('table dataTable uxfwk-table uxfwk-table-{0}'.sprintf(area));
   //[#] In order to pass controllers successfully to directives on compiler, append MUST be done BEFORE compilation!
   placeholder.append(templateTable);
   $compile(templateTable)($ctrl.scopedTranscludedContents.scope, null, { transcludeControllers:{ 'uxfwkTable': $ctrl }})
   if ( 1 ){
      var prev = null, rule = null, box = null;
      var cells = templateTable.find('th');
      var width = null;

      for ( var i = 0, leni = cells.length; i < leni; ++i ){
         if ( !$U(rule = cells.eq(i).querySelector('.col-rule')) && !$U(prev = rule.previous()) ){
            box = cells.eq(i).box(); width = rule.width();
            if ( width > 0 ){ prev.maxWidth(width - (box.padding.left + box.padding.right)); }
         }
      }
   }
   return;
};// #::initializeTableHeaderViews

uxfwkTableInternalBody.zpriv.initializeTableHead = function ($scope, $element, $attrs, $ctrl){
   var infinitePlaceholder = $element.querySelector('.uxfwk-table-component.table-header-infinite-space > .contents');
   var clientScope = $ctrl.scopedTranscludedContents.scope;
   var compiledTemplateHeader = null;
   var templateTblHeader = null;
   var internalTblHeader = null;

   //[#1.0] - Builds header reference, fixed and main compiling them
   infinitePlaceholder.contents().remove();// cleans all DOM on infinite placeholder
   uxfwkTableInternalBody.zpriv.initializeTableHeaderViews($scope, $attrs, $ctrl, 'full',  infinitePlaceholder);
   uxfwkTableInternalBody.zpriv.initializeTableHeaderViews($scope, $attrs, $ctrl, 'fixed', infinitePlaceholder);
   uxfwkTableInternalBody.zpriv.initializeTableHeaderViews($scope, $attrs, $ctrl, 'main',  infinitePlaceholder);
   uxfwkTableInternalBody.zpriv.initializeTableHeaderViews($scope, $attrs, $ctrl, 'right', infinitePlaceholder);

   //[#2.0] - Resizes are only done after current $digest cycle has finished (to let browsers resize
   //    table headers with content).
   clientScope.$applyAsync(function(){
      var referenceTable = null, fixedTable = null, mainTable = null, rightTable = null;
      var tables = infinitePlaceholder.querySelectorAll('.uxfwk-table');
      var referenceCells = null, referenceRows = null;
      var referenceHeight = 0;

      //[#2.1] - Get all reference tables
      if ( 4 !== tables.length ){ return; throw new Error('Unexpected error! There should exist only 4 reference table headers but {0} were found!'.sprintf(tables.length)); }
      referenceTable = infinitePlaceholder.querySelector('.uxfwk-table-full');
      fixedTable     = infinitePlaceholder.querySelector('.uxfwk-table-fixed');
      mainTable      = infinitePlaceholder.querySelector('.uxfwk-table-main');
      rightTable     = infinitePlaceholder.querySelector('.uxfwk-table-right');
      referenceCells = referenceTable.find('th');
      referenceRows  = referenceTable.find('tr');
      referenceHeight= referenceTable.height();
   
      //[#2.2] - Defines the function to be applied on each table header
      var resizeHeader = function (table){
         var areaHeight = table.height();
         var spareHeight = referenceHeight - areaHeight;
         var rows = table.find('tr');
         var inc = ~~(spareHeight / rows.length);
         var count = 0;

         if ( referenceHeight != areaHeight ){
            if ( referenceRows.length != rows.length ){
               $console.debug('Table header requires resizing, [reference({0}) x fixed({1})], and number of rows are distinct, aprox {2} for each row'.sprintf(referenceHeight, areaHeight, inc));
               for ( var i = 0, leni = (rows.length - 1); i < leni; ++i ){
                  rows.eq(i).height(rows.eq(i).height() + inc);
                  count += rows.eq(i).height();
               }
               rows.last().height(referenceHeight - count);
            }else{
               $console.debug('Table header requires resizing, [reference({0}) x fixed({1})], but number of rows are equal, force reference heights'.sprintf(referenceHeight, areaHeight));
               for ( var i = 0, leni = rows.length; i < leni; ++i ){
                  rows.eq(i).height(referenceRows.eq(i).height());
               }
            }
         }else{ $console.debug('Table header matches reference height, no resize is required'); }
         // force cell height by reference
         if ( 1 ){
            var cells = table.find('th');
            for ( var i = 0, leni = cells.length; i < leni; ++i ){
               var j = 0, lenj = referenceCells.length;

               for ( j; (j < lenj) && (cells.eq(i).attr('data-uxfwk-table-colid') != referenceCells.eq(j).attr('data-uxfwk-table-colid')); ++j );
               if ( j < lenj ){ cells.eq(i).height(referenceCells.eq(j).height()); }
            }
         }
         // the following two lines are incredible stupid but was the way to make IE respect the
         // height e calculated on table before it was transposed to final space.
         table.children('thead').height(referenceHeight*0.1);
         table.height(referenceHeight*0.1);
         // a small trick to make chrome span the actions column header for all height available.
         if ( 1 ){
            var cells = table.find('th'); if ( 1 == cells.length ){ cells.eq(0).height(referenceHeight); }
         }
      };// ::resizeHeader

      //[#2.3] - Resize Fixed header if height do not match
      resizeHeader(fixedTable);

      //[#2.4] - Resize Fixed header if height do not match
      resizeHeader(mainTable);
      resizeHeader(rightTable);

      //[#2.5] - Resizes body directive
      if ( 1 ){
         var tableHead = $element.querySelector('.uxfwk-table-head');
         var tableBody = $element.querySelector('.uxfwk-table-body');
         var tableFoot = $element.querySelector('.uxfwk-table-foot');
         var fixedWidth = fixedTable.width();

         //[#2.5.1] - Defines header sizes and contents
         if ( 1 ){
            var headers = tableHead.children('div');

            //[#] - Sets vertical sizes
            tableHead.height(referenceHeight);
            headers.eq(0).height(referenceHeight);
            headers.eq(1).height(referenceHeight);
            headers.eq(2).height(referenceHeight);
            tableBody.dom().style.paddingTop = referenceHeight + 'px';
            //[#] - Sets horizontal sizes
            headers.eq(0).width(fixedWidth);
            headers.eq(1).dom().style.paddingLeft = fixedWidth + 'px';
            //[#] - Sets contents
            headers.eq(0).children('div').html('').append(fixedTable);
            headers.eq(1).children('div').html('').append(mainTable);
            headers.eq(2).children('div').html('').append(rightTable);
         }
         //[#2.5.2] - Defines body sizes and contents
         if ( 1 ){
            var bodies = tableBody.children('div').children('div');

            //[#] - Sets horizontal sizes
            bodies.eq(0).width(fixedWidth);
            bodies.eq(1).dom().style.paddingLeft = fixedWidth + 'px';
         }
         //[#2.5.3] - Defines footer sizes and contents
         if ( 1 ){
            var footers = tableFoot.children('div');

            //[#] - Sets horizontal sizes
            footers.eq(0).width(fixedWidth);
            footers.eq(1).dom().style.paddingLeft = fixedWidth + 'px';
            footers.eq(1).children('div').html('<div style="height:18px;width:{0}px"></div>'.sprintf(mainTable.width() - 1000));
         }
      }
   });// ::$applyAsync

};// #::initializeTableHead

uxfwkTableInternalBody.zpriv.initializeTableBodyViews = function ($scope, $attrs, $ctrl, area, placeholder){
   var templateTable = $w($w($ctrl.scopedTranscludedContents.content.children('tbody')).parent().clone());
   var rowToken = getAttrNorm($attrs.$normalize, templateTable.children('tbody'), 'uxfwkTableLineToken') || 'data';
   var tBody = null, roRow = null, rwRow = null;
   var cellList = [];

   $ctrl.rowDataTokenName = rowToken;
   //[#1.0] - Clears table head and all not visible body cells
   templateTable.find('thead').remove();
   if ( 1 ){
      var rows = templateTable.children('tbody').children('tr');
      var roCells = [], rwCells = [];

      //[#1.1] - Check for template rows
      if ( rows.length > 0 ){
         var legacyRw = getAttrNorm($attrs.$normalize, rows.eq(0), 'uxfwkTableLineReadwriteLine');
         var legacyRo = getAttrNorm($attrs.$normalize, rows.eq(0), 'uxfwkTableLineReadonlyLine');
         var role = getAttrNorm($attrs.$normalize, rows.eq(0), 'uxfwkTableLineRole');

         if ( !$U(legacyRw) || ('rw' == role) ){ rwRow = rows.eq(0); role = 'rw'; }
         else if ( !$U(legacyRo) || ('ro' == role) ){ roRow = rows.eq(0); role = 'ro'; }
         else if ( $U(role) ){ rwRow = rows.eq(0); role = 'rw'; }
         rows.eq(0).data('uxfwkTableLineRole', role);
      }
      if ( rows.length > 1 ){
         var legacyRw = getAttrNorm($attrs.$normalize, rows.eq(1), 'uxfwkTableLineReadwriteLine');
         var legacyRo = getAttrNorm($attrs.$normalize, rows.eq(1), 'uxfwkTableLineReadonlyLine');
         var role = getAttrNorm($attrs.$normalize, rows.eq(1), 'uxfwkTableLineRole');

         if ( !$U(legacyRw) || ('rw' == role) ){ rwRow = rows.eq(1); role = 'rw'; }
         else if ( !$U(legacyRo) || ('ro' == role) ){ roRow = rows.eq(1); role = 'ro'; }
         else if ( $U(role) ){ roRow = rows.eq(1); role = 'ro'; }
         rows.eq(1).data('uxfwkTableLineRole', role);
      }
      if ( $U(roRow) ){ throw new Error('Unexpexted error!! ReadOnly template row was not found!!!'); }
      if ( $U(rwRow) ){ $console.warning('Warning, ReadWrite template row was not found!'); }
      tBody = roRow.parent();
   }

   //[#2.0] - With template rows with the desired cells, some clearance of HTML will be done.
   if ( 1 ){
      tBody.attr('data-uxfwk-table-line-token', null);
      roRow.attr('data-uxfwk-table-line-readonly-line', null);
      roRow.attr('data-ng-non-bindable', null);
   }

   //[#3.0] - Some HTML will be added
   if ( 1 ){
      var rows = tBody.children('tr');
      var cells = roRow.find('td');

      if ( 1 == rows.length ){
         roRow.attr('data-uxfwk-table-data-row', '{ area:\'{0}\', data:\'{1}\' }'.sprintf(area, rowToken));
         roRow.attr('data-ng-repeat', '{0} in uxfwkTableInternal.jsonPagination.data'.sprintf(rowToken));
         roRow.attr('data-uxfwk-table-render-detector','');
      }else{
         rows.eq(0).attr('data-uxfwk-table-data-row', '{ area:\'{0}\', data:\'{1}\' }'.sprintf(area, rowToken));
         rows.eq(0).attr('data-ng-repeat-start', '{0} in uxfwkTableInternal.jsonPagination.data'.sprintf(rowToken));
         rows.eq(0).attr('data-uxfwk-table-render-detector', 'body');
         rows.eq(rows.length - 1).attr('data-uxfwk-table-data-row', '{ area:\'{0}\', data:\'{1}\' }'.sprintf(area, rowToken));
         rows.eq(rows.length - 1).attr('data-ng-repeat-end', '');
         rows.eq(rows.length - 1).attr('data-uxfwk-table-render-detector', 'body');
      }
      for ( var i = 0, leni = rows.length; i < leni; ++i ){
         var headerList = angular.extend([], $ctrl.header.list);// need to copy since i will change it
         var dataNgClass = {};

         if ( getAttrNorm($attrs.$normalize, rows.eq(i), 'ngClass', dataNgClass) ){
            rows.eq(i).attr(dataNgClass.name, dataNgClass.value.replace(/}$/, ', isLoading: {0}.$$uxtbl.isLoading, selected: {0}.$$uxtbl.isSelected, inedition: {0}.$$uxtbl.isInEdition, isLocked: {0}.$$uxtbl.isLocked, uxfwkerror: uxfwkTableInternal.isRowInvalid(this) }'.sprintf(rowToken)));
         }else{
            rows.eq(i).attr('data-ng-class', '{ isLoading: {0}.$$uxtbl.isLoading, selected: {0}.$$uxtbl.isSelected, inedition: {0}.$$uxtbl.isInEdition, isLocked: {0}.$$uxtbl.isLocked, uxfwkerror: uxfwkTableInternal.isRowInvalid(this) }'.sprintf(rowToken));
         }
         if ( 'ro' == rows.eq(i).data('uxfwkTableLineRole') ){
            rows.eq(i).attr('data-ng-if', '!{0}.$$uxtbl.isInEdition'.sprintf(rowToken));
         }else if ( 'rw' == rows.eq(i).data('uxfwkTableLineRole') ){
            rows.eq(i).attr('data-ng-if', '!!{0}.$$uxtbl.isInEdition'.sprintf(rowToken));
         }
         rows.eq(i).attr('data-ng-class-even', '"even"');
         rows.eq(i).attr('data-ng-class-odd', '"odd"');
         switch ( area ){
            case 'fixed':{
               if ( true === $scope.settings.showColumnSel.allow ){
                  rows.eq(i).prepend(angular.element('<td class="uxfwk-table-sel-cell fx-table-actions"><div class="uxfwk-table-col-first" data-ng-include="\'{0}\'"></div></td>'.sprintf($ctrl.templates.bodyCellSelectColumn)));
                  headerList.unshift({ id: 'first', isFixed: true, isEnabled: true, isVisible: true });
               }else{
                  rows.eq(i).prepend(angular.element('<td class="uxfwk-table-sel-cell fx-table-actions"><div class="uxfwk-table-col-first-dummy"></div></td>'));
                  headerList.unshift({ id: 'first', isFixed: true, isEnabled: true, isVisible: true });
               }
            };break;
            case 'main':{
               rows.eq(i).append(angular.element('<td class="uxfwk-table-cell-padding">&nbsp;</td>'));
               headerList.push({ id: 'padding', isFixed: false, isEnabled: true, isVisible: true });
            };break;
            case 'right':{
               if ( false === $scope.settings.showColumnAct.allow ){ rows.eq(i).append(angular.element('<td class="fx-table-actions uxfwk-table-col-last">&nbsp;</td>')); }
               else{ rows.eq(i).append(angular.element('<td class="fx-table-actions col-last uxfwk-table-action-cell" data-ng-include="\'{0}\'"></td>'.sprintf($ctrl.templates.bodyCellActionColumn))); }
               headerList.push({ id: 'last', isFixed: false, isAction: true, isEnabled: true, isVisible: true });
            };break;
         }

         if ( 1 ){
            var cells = rows.eq(i).find('td');

            for ( var j = 0, lenj = cells.length; j < lenj; ++j ){
               var dataNgModelElements = cells.eq(j).querySelectorAll('input[data-ng-model]');
               var discard = false, contents = null;

               if ( j >= headerList.length ){ $console.warn('Warning! ReadOnly template row has more columns than those present at the table header. Discard further cells'); break; }
               if ( $U(headerList[j]) ){ throw new Error('Unexpected error!! Table header column at offset {0} is a NULL object', j); }
               discard |= (!headerList[j].isEnabled || !headerList[j].isVisible);
               discard |= (('fixed' == area) && !headerList[j].isFixed);
               discard |= (('main' == area) && !!headerList[j].isFixed);
               discard |= (('right' == area) && !headerList[j].isAction);
               if ( true == discard ){
                  cells.eq(j).remove();
                  continue;
               }else{ cells.eq(j).attr('data-uxfwk-table-colid', headerList[j].id); }

               for ( var k = 0, lenk = dataNgModelElements.length; k < lenk; ++k ){
                  var dataNgOptions = {};

                  if ( !getAttrNorm($attrs.$normalize, dataNgModelElements.eq(k), 'ngModelOptions', dataNgOptions) ){
                     dataNgModelElements.eq(k).attr('data-ng-model-options', '{ allowInvalid: true }');
                  }else{ dataNgModelElements.eq(k).attr(dataNgOptions.name, dataNgOptions.value.replace(/}$/, ', allowInvalid: true }')); }
               }
               cells.eq(j).addClass('col-{0}'.sprintf(cells.eq(j).attr('data-uxfwk-table-colid')));
               contents = angular.element('<div class="uxfwk-table-readonly-content body-cell-contents col-{0}"><div></div></div>'.sprintf(headerList[j].id));
               contents.children('div').append(cells.eq(j).contents());
               cells.eq(j).append(contents);
               if ( 'rw' == rows.eq(i).data('uxfwkTableLineRole') ){
                  rows.eq(i).attr('data-ng-form', 'formValidator{{ $index }}_{0}'.sprintf(area));
               }
            }
         }
      }
      templateTable.addClass('dataTable uxfwk-table');
   }
   templateTable.attr('data-ng-non-bindable', null);
   //$console.debug('Row template result on area [{0}]'.sprintf(area), $ctrl.scopedTranscludedContents.scope, templateTable.html());
   placeholder.html('').append(templateTable);
   $compile(templateTable)($ctrl.scopedTranscludedContents.scope, null, { transcludeControllers:{ 'uxfwkTable': $ctrl }});
   //placeholder.html('').append($compile(templateTable)($ctrl.scopedTranscludedContents.scope));
   //placeholder.html('').append($compile(templateTable)($scope));
   $scope.rowToken = rowToken;
};// #::initializeTableBodyViews

uxfwkTableInternalBody.zpriv.initializeTableBody = function ($scope, $element, $attrs, $ctrl){
   var tableBodyLeft = $element.querySelector('.uxfwk-table-body-left > div');
   var tableBodyMain = $element.querySelector('.uxfwk-table-body-main > div');
   var tableBodyRigt = $element.querySelector('.uxfwk-table-body-rigt > div');

   uxfwkTableInternalBody.zpriv.initializeTableBodyViews($scope, $attrs, $ctrl, 'fixed', tableBodyLeft);
   uxfwkTableInternalBody.zpriv.initializeTableBodyViews($scope, $attrs, $ctrl, 'main',  tableBodyMain);
   uxfwkTableInternalBody.zpriv.initializeTableBodyViews($scope, $attrs, $ctrl, 'right', tableBodyRigt);
};// #::initializeTableBody

uxfwkTableInternalBody.zpriv.initializeTableEvents = function ($scope, $element, $attrs, $ctrl){
   var tableHeadLeft = $element.querySelector('.uxfwk-table-head-left .uxfwk-table-component.contents');
   var tableHeadMain = $element.querySelector('.uxfwk-table-head-main .uxfwk-table-component.contents');
   var tableFootMain = $element.querySelector('.uxfwk-table-foot-main > div');
   var tableBodyLeft = $element.querySelector('.uxfwk-table-body-left .uxfwk-table-component.contents');
   var tableBodyMain = $element.querySelector('.uxfwk-table-body-main .uxfwk-table-component.contents');
   var tableBodyRigt = $element.querySelector('.uxfwk-table-body-rigt');

   tableFootMain.on('scroll', function (event){
      tableHeadMain.dom().style.left = '-{0}px'.sprintf(event.target.scrollLeft);
      tableBodyMain.dom().style.left = '-{0}px'.sprintf(event.target.scrollLeft);
      $scope.$root.$broadcast('uxfwk-scroll', $element);
   });// ::@scroll

   tableBodyRigt.on('scroll', function (event){
      tableBodyLeft.dom().style.top = '-{0}px'.sprintf(event.target.scrollTop);
      tableBodyMain.dom().style.top = '-{0}px'.sprintf(event.target.scrollTop);
      $scope.$root.$broadcast('uxfwk-scroll', $element);
   });// ::@scroll

   tableBodyLeft.on('wheel', function (event){
      var delta = event.originalEvent.deltaY;
      if ( Math.abs(delta) < 10 ){ delta *= 13; }
      tableBodyRigt.dom().scrollTop = tableBodyRigt.dom().scrollTop + delta;
   });// ::@wheel

   tableBodyMain.on('wheel', function (event){
      var delta = event.originalEvent.deltaY;
      if ( Math.abs(delta) < 10 ){ delta *= 13; }
      tableBodyRigt.dom().scrollTop = tableBodyRigt.dom().scrollTop + delta;
   });// ::@wheel
};// #::initializeTableEvents

uxfwkTableInternalBody.zpriv.updateColumnSelection = function ($scope, $elem, $attrs, $ctrl){
   //var infinitePlaceholder = $elem.querySelector('.uxfwk-table-component.table-header-infinite-space > .contents');
   var jstreeColumns = $ctrl.jstreeColumns;
   var headerList = $ctrl.header.list;

   var updateAncestors = function (node, isVisible){
      while ( !$U(node.parent) ){
         var visible = false;

         node = node.parent;
         for ( var i = 0, leni = node.children.length; i < leni; ++i ){ visible |= node.children[i].isVisible; }
         node.isVisible = !!visible;
      }
   };// ::updateAncestors

   for ( var i = 0, leni = headerList.length; i < leni; ++i ){
      var node = jstreeColumns.get_node(headerList[i].id);

      if ( node ){
         headerList[i].isVisible = node.state.selected;
         updateAncestors(headerList[i], node.state.selected);
      }
   }
   uxfwkTableInternalBody.zpriv.initializeTableHead($scope, $elem, $attrs, $ctrl);
   uxfwkTableInternalBody.zpriv.initializeTableBody($scope, $elem, $attrs, $ctrl);
};// ::@updateColumnSelection


uxfwkTableInternalBody.zpriv.rowActionAbort = (function(){
   return {
      commit: function ($scope){
         var data = [$scope[$scope.uxfwkTableInternal.rowToken]];

         $console.debug('Detect action abort on row[{0}]'.sprintf($scope.$index), $scope.uxfwkTableInternal.settings.actionAbort.callback);
         if ( !$U($scope.uxfwkTableInternal.settings.actionAbort.callback) ){
            $scope.uxfwkTableInternal.settings.actionAbort.callback(data);
         }
         return;
      },
   p:null};
})();// ::@rowActionAbort


 
/**
 * @ngdoc private method
 * @name uxfwk.table.internal.body#isVisible
 * @methodOf uxfwk.table.internal.body
 *
 * @description 
 * Checks if button related to link details on table row should be visible
 * 
 * @param $scope {object} scope where to check for rowActionLink enabled
 *
 * @returns {boolean}
 */
uxfwkTableInternalBody.zpriv.rowActionLink.isVisible = function ($scope){
   var data = $scope[$scope.uxfwkTableInternal.rowToken];
   var isEnabled = null;

   data.$$uxtbl = data.$$uxtbl || {};
   //[#] - First thing, checks if table and entry support info or switch to enable details link
   if ( !$U($scope.uxfwkTableInternal.linkRowDetail) && ('' != $scope.uxfwkTableInternal.linkRowDetail) && $U(data.$$uxtbl.hasDetail) ){ isEnabled = true;
   }else if ( !$U($scope.uxfwkTableInternal.linkRowDetail) && ('' != $scope.uxfwkTableInternal.linkRowDetail) ){ isEnabled = data.$$uxtbl.hasDetail;
   }else if ( !$U(data.$$uxtbl.linkDetail) && ('' != data.$$uxtbl.linkDetail) ){ isEnabled = data.$$uxtbl.hasDetail;
   }else{ return false; }

   //[#] - Second (only if not returned already with fail), checks if current data status allow detail
   return (isEnabled && !data.$$uxtbl.isLoading && !data.$$uxtbl.isInEdition);
};// ::@rowActionLink::isVisible
uxfwkTableInternalBody.zpriv.rowActionLink.link = function ($scope){
   var data = $scope[$scope.uxfwkTableInternal.rowToken];

   data.$$uxtbl = data.$$uxtbl || {};
   return (data.$$uxtbl.linkDetail || $scope.uxfwkTableInternal.linkRowDetail);
};// ::@rowActionLink::link

uxfwkTableInternalBody.zpriv.rowActionSubmit.isVisible = function ($scope){
   var data = $scope[$scope.uxfwkTableInternal.rowToken];
   var output = null;

   data.$$uxtbl = data.$$uxtbl || {};
   if ( !$U(data.$$uxtbl.hasSubmit) ){ output = data.$$uxtbl.hasSubmit; }
   else{ output = (!!$scope.uxfwkTableInternal.settings.inlineConfig.allow && !!data.$$uxtbl.isInEdition && !data.$$uxtbl.isInEdition.isLoading); }
   if ( false === !!$scope.uxfwkTableInternal.settings.inlineEdition.auth ){ return false; }
   return output;
};// ::@rowActionSubmit::isVisible


uxfwkTableInternalBody.zpriv.rowActionDelete.commit = function ($scope){
   var data = [$scope[$scope.uxfwkTableInternal.rowToken]];

   $console.debug('Detect action delete on row[{0}]'.sprintf($scope.$index), $scope.uxfwkTableInternal.settings.inlineDeletion.callback);
   if ( true === $scope.uxfwkTableInternal.settings.confirmDeletion.allow ){
      $scope.uxfwkTableInternal.openDeleteModelConfirm(data)
      .then(function(){
         if ( !$U($scope.uxfwkTableInternal.settings.inlineDeletion.callback) ){
            $scope.uxfwkTableInternal.settings.inlineDeletion.callback(data);
         }
      }).catch(function(){});
   }else{ $scope.uxfwkTableInternal.settings.inlineDeletion.callback(data); }
   return;
};// ::@rowActionDelete::commit
uxfwkTableInternalBody.zpriv.rowActionDelete.isVisible = function ($scope){
   var data = $scope[$scope.uxfwkTableInternal.rowToken];
   var output = null;

   data.$$uxtbl = data.$$uxtbl || {};
   if ( !$U(data.$$uxtbl.hasDelete) ){ output = data.$$uxtbl.hasDelete; }
   else{ output = ($scope.uxfwkTableInternal.settings.inlineDeletion.allow && !data.$$uxtbl.isInEdition && !data.$$uxtbl.isLoading); }
   if ( false === !!$scope.uxfwkTableInternal.settings.inlineDeletion.auth ){ return false; }
   return output;
};// ::@rowActionDelete::isVisible



uxfwkTableInternalBody.zpriv.rowActionEdit.isVisible = function ($scope){
   var data = $scope[$scope.uxfwkTableInternal.rowToken];
   var output = null;

   data.$$uxtbl = data.$$uxtbl || {};
   if ( !$U(data.$$uxtbl.hasEdit) ){ output = data.$$uxtbl.hasEdit; }
   else{ output = ($scope.uxfwkTableInternal.settings.inlineEdition.allow && (!data.$$uxtbl.isInEdition && !data.$$uxtbl.isLoading)); }
   if ( false === !!$scope.uxfwkTableInternal.settings.inlineEdition.auth ){ return false; }
   return output;
};// ::@rowActionEdit::isVisible


uxfwkTableInternalBody.zpriv.rowActionRefresh.commit = function ($scope){
   var data = $scope[$scope.uxfwkTableInternal.rowToken];

   $console.debug('Detect action refresh on row[{0}]'.sprintf($scope.$index), $scope.uxfwkTableInternal.settings.inlineRefresh.callback);
   if ( !$U($scope.uxfwkTableInternal.settings.inlineRefresh.callback) ){
      $scope.uxfwkTableInternal.settings.inlineRefresh.callback([data]);
   }
};// ::@rowActionRefresh::commit



uxfwkTableInternalBody.zpriv.rowActionLinkAdd = {};
uxfwkTableInternalBody.zpriv.rowActionLinkAdd.commit = function ($scope){
   var data = [$scope[$scope.uxfwkTableInternal.rowToken]];

   $console.debug('Detect action link add on row[{0}]'.sprintf($scope.$index), $scope.uxfwkTableInternal.settings.inlineLinkAdd.callback);
   if ( !$U($scope.uxfwkTableInternal.settings.inlineLinkAdd.callback) ){
      $scope.uxfwkTableInternal.settings.inlineLinkAdd.callback(data);
   }else{ $console.warn('Link add callback is not defined') }
};// ::@rowActionLinkAdd::commit
uxfwkTableInternalBody.zpriv.rowActionLinkAdd.isVisible = function ($scope){
   var data = $scope[$scope.uxfwkTableInternal.rowToken];
   var output = null;

   data.$$uxtbl = data.$$uxtbl || {};
   if ( !$U(data.$$uxtbl.hasLinkAdd) ){ output = data.$$uxtbl.hasLinkAdd; }
   else{ output = ($scope.uxfwkTableInternal.settings.inlineLinkAdd.allow && !data.$$uxtbl.isInEdition && !data.$$uxtbl.isLoading); }
   if ( false === !!$scope.uxfwkTableInternal.settings.inlineLinkAdd.auth ){ return false; }
   return output;
};// ::@rowActionLinkAdd::isVisible



uxfwkTableInternalBody.zpriv.rowActionLinkRem = {};
uxfwkTableInternalBody.zpriv.rowActionLinkRem.commit = function ($scope){
   var data = [$scope[$scope.uxfwkTableInternal.rowToken]];

   $console.debug('Detect action link rem on row[{0}]'.sprintf($scope.$index), $scope.uxfwkTableInternal.settings.inlineLinkRem.callback);
   if ( !$U($scope.uxfwkTableInternal.settings.inlineLinkRem.callback) ){
      $scope.uxfwkTableInternal.settings.inlineLinkRem.callback(data);
   }else{ $console.warn('Link rem callback is not defined') }
};// ::@rowActionLinkRem::commit
uxfwkTableInternalBody.zpriv.rowActionLinkRem.isVisible = function ($scope){
   var data = $scope[$scope.uxfwkTableInternal.rowToken];
   var output = null;

   data.$$uxtbl = data.$$uxtbl || {};
   if ( !$U(data.$$uxtbl.hasLinkRem) ){ output = data.$$uxtbl.hasLinkRem; }
   else{ output = ($scope.uxfwkTableInternal.settings.inlineLinkRem.allow && !data.$$uxtbl.isInEdition && !data.$$uxtbl.isLoading); }
   if ( false === !!$scope.uxfwkTableInternal.settings.inlineLinkRem.auth ){ return false; }
   return output;
};// ::@rowActionLinkRem::isVisible



uxfwkTableInternalBody.zpriv.tblFormCreation.commit = function ($scope){
   $console.debug('Detect form creation on table', $scope.settings.formCreation.callback);
   if ( !$U($scope.settings.formCreation.callback) ){
      $scope.settings.formCreation.callback();
   }
};// ::@tblFormCreation::commit
uxfwkTableInternalBody.zpriv.tblFormCreation.isVisible = function ($scope){
   var output = null;

   output = !!$scope.settings.formCreation.allow;
   if ( false === !!$scope.settings.formCreation.auth ){ return false; }
   return output;
};// ::@tblInlineCreation::commit

uxfwkTableInternalBody.zpriv.tblInlineCreation.commit = function ($scope){
   var data = null;

   $console.debug('Detect form creation on table', $scope.settings.inlineCreation.callback);
   if ( !$U($scope.settings.inlineCreation.callback) ){
      if ( !$U(data = $scope.settings.inlineCreation.callback()) ){
         $console.debug('Received data from controller, enabled edit mode (for legacy behaviour)', $scope, data);
         data.$$uxtbl = data.$$uxtbl || {};
         data.$$uxtbl.isInEdition = true;
      }
   }
};// ::@tblInlineCreation::commit
uxfwkTableInternalBody.zpriv.tblInlineCreation.isVisible = function ($scope){
   var output = null;

   output = !!$scope.settings.inlineCreation.allow;
   if ( false === !!$scope.settings.inlineCreation.auth ){ return false; }
   return output;
};// ::@tblInlineCreation::commit


uxfwkTableInternalBody.zpriv.tblBulkDelete.commit = function ($scope){
   var data = [];

   if ( $U($scope.settings.bulkDeletion.callback) ){
      $console.warn('Discard action since no callback was registered');
   }else{
      for ( var i = 0, leni = $scope.jsonData.length; i < leni; ++i ){
         if ( !$U($scope.jsonData[i].$$uxtbl) && (true == $scope.jsonData[i].$$uxtbl.isSelected) ){
            data.push($scope.jsonData[i]);
         }
      }
      $console.debug('Detect bulk deletion on table', $scope.settings.bulkDeletion.callback, data);
      if ( data.length >= 0 ){
         $scope.openDeleteModelConfirm(data)
         .then(function(){
            if ( !$U($scope.settings.bulkDeletion.callback) ){
               $scope.settings.bulkDeletion.callback(data);
            }
         }).catch(function(){});
      }
   }
};// ::@tblBulkDelete::commit
uxfwkTableInternalBody.zpriv.tblBulkDelete.isVisible = function ($scope){
   var output = null;

   output = !!$scope.settings.bulkDeletion.allow;
   if ( false === !!$scope.settings.bulkDeletion.auth ){ return false; }
   return output;
};// ::@rowActionLinkRem::isVisible


uxfwkTableInternalBody.zpriv.isRowInvalid = function ($scope){
   var key = 'formValidator{1}_{0}'.sprintf(null, $scope.$index);
   var data = $scope[$scope.uxfwkTableInternal.rowToken];
   var validator = null;

   data.$$uxtbl = data.$$uxtbl || {};
   if ( !data.$$uxtbl.isInEdition ){
      return false;
   }else if ( $U(data.$$uxtbl.validators) ){
      data.$$uxtbl.validators = {};
      data.$$uxtbl.validators[key.sprintf('fixed')] = false;
      data.$$uxtbl.validators[key.sprintf('main')]  = false;
   }
   if ( !$U(validator = $scope[key.sprintf('fixed')]) ){ data.$$uxtbl.validators[key.sprintf('fixed')] = validator.$invalid; }
   if ( !$U(validator = $scope[key.sprintf('main')]) ) { data.$$uxtbl.validators[key.sprintf('main')]  = validator.$invalid; }

   return (data.$$uxtbl.validators[key.sprintf('fixed')] || data.$$uxtbl.validators[key.sprintf('main')]);
};// #::isRowInvalid

uxfwkTableInternalBody.zpriv.cancelEdition = function ($scope){
   var key = 'formValidator{1}_{0}'.sprintf(null, $scope.$index);
   var data = $scope[$scope.uxfwkTableInternal.rowToken];

   data.$$uxtbl = data.$$uxtbl || {};
   data.$$uxtbl.isInEdition = false;
   data.$$uxtbl.validators  = null;
   if ( !$U($scope.uxfwkTableInternal.settings.inlineCancel.callback) ){
      $scope.uxfwkTableInternal.settings.inlineCancel.callback([data]);
   }
};// #::cancelEdition

uxfwkTableInternalBody.zpriv.rowActionConfigData = function ($scope){
   var key = 'formValidator{1}_{0}'.sprintf(null, $scope.$index);
   var data = $scope[$scope.uxfwkTableInternal.rowToken];
   var scope = $scope;

   $console.debug('Table::rowActionConfigData(send data to client controller)', scope, scope.uxfwkTableInternal.settings.inlineConfig.callback);
   if ( !$U(scope.uxfwkTableInternal.settings.inlineConfig.callback) ){
      scope.uxfwkTableInternal.settings.inlineConfig.callback([data])
      .then(function(responses){
         $console.debug('Table::rowActionConfigData(received promise resolution)', scope, responses);
         if ( !$U(responses) && !$U(responses[0]) && !$U(responses[0].success) && !$U(responses[0].data) && (true === responses[0].success) ){
            responses[0].data.$$uxtbl = responses[0].data.$$uxtbl || {};
            responses[0].data.$$uxtbl.isInEdition = false;
         }
      })
   }
};// #::cancelEdition





uxfwkTableInternalBody.link.pre = function ($scope, $element, $attrs, $ctrls){
   $scope.tableBodyRoot = $w($element);
};// ::link::pre
   
uxfwkTableInternalBody.link.post = function ($scope, $element, $attrs, $ctrls){
   var msCtrl = $ctrls[0];    // my master/main controller
   var $elem = $w($element);  // extends angular.element API

   //[#1] - Bypass directives with no master controller link
   if ( !msCtrl ){ return; }

   //[#2] - Updates internal data retrieved from DOM
   $scope.msCtrl = msCtrl;

   $console.debug('Update columns using scope[{0}]'.sprintf($scope.$id), $scope);
   uxfwkTableInternalBody.zpriv.initializeTableMetadata($scope, $elem, $attrs, $ctrls[0]);
   uxfwkTableInternalBody.zpriv.initializeTableEvents($scope, $elem, $attrs, $ctrls[0]);
   uxfwkTableInternalBody.zpriv.initializeTableHead($scope, $elem, $attrs, $ctrls[0]);
   uxfwkTableInternalBody.zpriv.initializeTableBody($scope, $elem, $attrs, $ctrls[0]);

   $scope.isRowInvalid  = uxfwkTableInternalBody.zpriv.isRowInvalid;
   $scope.cancelEdition = uxfwkTableInternalBody.zpriv.cancelEdition;
   $scope.rowActionConfigData = uxfwkTableInternalBody.zpriv.rowActionConfigData;

   $scope.rowActionAbort    = uxfwkTableInternalBody.zpriv.rowActionAbort;
   $scope.rowActionLink     = uxfwkTableInternalBody.zpriv.rowActionLink;
   $scope.rowActionEdit     = uxfwkTableInternalBody.zpriv.rowActionEdit;
   $scope.rowActionDelete   = uxfwkTableInternalBody.zpriv.rowActionDelete;
   $scope.rowActionRefresh  = uxfwkTableInternalBody.zpriv.rowActionRefresh;
   $scope.rowActionSubmit   = uxfwkTableInternalBody.zpriv.rowActionSubmit;
   $scope.rowActionLinkAdd  = uxfwkTableInternalBody.zpriv.rowActionLinkAdd;
   $scope.rowActionLinkRem  = uxfwkTableInternalBody.zpriv.rowActionLinkRem;
   $scope.tblFormCreation   = uxfwkTableInternalBody.zpriv.tblFormCreation;
   $scope.tblInlineCreation = uxfwkTableInternalBody.zpriv.tblInlineCreation;
   $scope.tblBulkDelete     = uxfwkTableInternalBody.zpriv.tblBulkDelete;



   msCtrl.updateColumnSelection = function (){ uxfwkTableInternalBody.zpriv.updateColumnSelection($scope, $elem, $attrs, $ctrls[0]); }
   $scope.$watch(function(){
      return $scope.userCtrlSettings.columns;
   }, function(value){
      var myCtrl = $ctrls[0];

      if ( !$U(value) ){
         var updateAncestors = function (node){
            while ( !$U(node.parent) ){
               var visible = false;

               node = node.parent;
               for ( var i = 0, leni = node.children.length; i < leni; ++i ){ visible |= node.children[i].isVisible; }
               node.isVisible = !!visible;
            }
         };// ::updateAncestors

         $scope.settings.columns = uxfwk.toArray(value);
         for ( var i = 0, leni = $scope.settings.columns.length; i < leni; ++i ){
            var column = $scope.settings.columns[i];

            if ( angular.isObject(uxfwk.$evalKey(myCtrl, ['header', 'map'])) && angular.isObject(column) ){
               myCtrl.header.map[column.id].isVisible = column.visible;
               updateAncestors(myCtrl.header.map[column.id]);
            }
         }
         uxfwkTableInternalBody.zpriv.initializeTableHead($scope, $elem, $attrs, myCtrl);
         uxfwkTableInternalBody.zpriv.initializeTableBody($scope, $elem, $attrs, myCtrl);
      }
   });

};// ::link::post

uxfwkTableInternalBody.require = ['^uxfwkTable'];
uxfwkTableInternalBody.restrict = 'A';
return uxfwkTableInternalBody;
}])

/**
 * 
 * 
 * @author nuno-r-farinha (08/03/2015)
 */
.directive('tr', ['$compile', 'appUtilities', function uxfwkTableInternalBodyRow ($compile, appUtilities){
   var $U = appUtilities.$u.$U, $w = appUtilities.$w, $console = appUtilities.$console;
   var uxfwkTableInternalBodyRow = { link: {}, zpriv: {} };
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

uxfwkTableInternalBodyRow.zpriv.highlight = function ($scope, index, bHiglight){
   var oldRows = $scope.uxfwkTableInternal.tableBodyRoot.querySelectorAll('tr.onover');

   oldRows.removeClass('onover');
   if ( bHiglight ){
      var tables = $scope.uxfwkTableInternal.tableBodyRoot.querySelectorAll('.uxfwk-table-body tbody');

      tables.eq(0).children('tr').eq(index).addClass('onover');
      tables.eq(1).children('tr').eq(index).addClass('onover');
      tables.eq(2).children('tr').eq(index).addClass('onover');
   }
};// #::highlight

uxfwkTableInternalBodyRow.zpriv.initializeRowEvents = function ($scope, $element, $attrs, $ctrl){

   //[#1.0] - Register the events for mouse move
   $element.on('mousemove', function(event){ uxfwkTableInternalBodyRow.zpriv.highlight($scope, $scope.$index, true); });
   $element.on('mouseout',  function(event){ uxfwkTableInternalBodyRow.zpriv.highlight($scope, $scope.$index, false); });
};// #::initializeRowEvents

uxfwkTableInternalBodyRow.link.post = function ($scope, $element, $attrs, $ctrls){
   if ( $U($ctrls[0]) ){ return; }// bypass tr that do not belong to table directive
   $element = $w($element);

   uxfwkTableInternalBodyRow.zpriv.initializeRowEvents($scope, $element, $attrs, $ctrls);
   //$console.debug($scope);
};// ::link::post

uxfwkTableInternalBodyRow.require = ['?^uxfwkTable'];
uxfwkTableInternalBodyRow.restrict = 'E';
return uxfwkTableInternalBodyRow;
}])// end of uxfwkTableInternalBodyRow

.directive('uxfwkTableInternalPagination', ['$timeout', 'uxfwkTableService', '$log', 'uxfwk.dom.wrapper', function directive_uxfwkTable_internal_pagination ($timeout, settings, $log, $w){
function vshack (){ vshack.catch(); };// SlickEdit hack to make IDE see usefull functions, after this line all members are visible do IDE

   /**
    * 
    * 
    */
   function uxfwkTblGetTotalPages (){
      var size = this.jsonPagination.size;
      var items = null;

      if ( $U(this.jsonData) ){ return 0; }
      items = this.jsonData.length;
      return (~~(items / size) + ((items % size)?(1):(0)));
   };// uxfwkTblGetTotalPages

   /**
    * 
    * 
    */
   function uxfwkTblGetFirstItemInPage (){
      var pagination = this.jsonPagination;

      return (((pagination.page - 1)*pagination.size) + 1);
   };// uxfwkTblGetFirstItemInPage

   /**
    * 
    * 
    */
   function uxfwkTblGetLastItemInPage (){
      var pagination = this.jsonPagination;
      var candidate = pagination.page * pagination.size;
      var items = null;

      if ( $U(this.jsonData) ){ return 0; }
      items = this.jsonData.length;
      return ((items < candidate)?(items):(candidate));
   };// uxfwkTblGetLastItemInPage


   function fnSetPage ($scope, index){
      var pages = $scope.controller.pagination;
      var total = $scope.uxfwkTblGetTotalPages();
      //var total = fnGetTotalItems($scope.jsonData.length, $scope.jsonPagination.size);

      if ( null != index ){
         index = (index > total)?(total):(index);
         index = (index < 1)?(1):(index);
      }else{
         index = total;
      }
      $scope.jsonPagination.page = index;
   };// fnSetPage

   function fnPostLink ($scope, $element, $attrs, $controllers){
      var controller = $controllers[0];
      var pages = controller.pagination;
      var store = controller.store;

      if ( !angular.isDefined(controller) ){ return; }
      $scope.controller = controller;

      $scope.SetPage = function (index){ fnSetPage($scope, index); }
      $scope.uxfwkTblGetFirstItemInPage = uxfwkTblGetFirstItemInPage;
      $scope.uxfwkTblGetLastItemInPage  = uxfwkTblGetLastItemInPage;
      $scope.uxfwkTblGetTotalPages      = uxfwkTblGetTotalPages;

   };// fnPostLink

   return{
      require: ['^uxfwkTable'],
      link:    fnPostLink,
   restrict: 'A'};
}])
;

angularAMD.directive('uxfwkTableRenderDetector', [function uxfwkTableRenderDetector (){
   return {
      restrict: 'EA',
      require:  ['?^uxfwkTable'],
      compile: function (tElement, tAttrs){
         return function link (tScope, tElement, tAttrs, tControllers){
            if ( !$U(tControllers[0]) ){
               tControllers[0].eventManager.trigger(tAttrs.uxfwkTableRenderDetector);
            }
         };
      }
   };
}]);// ::uxfwkTableBodyRenderDetector

angularAMD.directive('uxfwkTableZebra', ['$parse', function uxfwkTableZebra ($parse){
   var uxfwkTableZebra = { i:{}, d:{} };
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

uxfwkTableZebra.d.controller = ['$scope', '$element', '$attrs', function uxfwkTableZebraController ($scope, $element, $attrs){
   this.classes      = $parse($attrs.uxfwkTableZebra)($scope);
   this.classes.odd  = this.classes.odd || 'odd';
   this.classes.even = this.classes.even || 'even';
}];// ::controller
 
return uxfwkTableZebra.d;
}]);// ::uxfwkTableZebra

angularAMD.directive('tr', ['appUtilities', function uxfwkTableZebraTr (appUtilities){
   var uxfwkTableZebraTr = { i:{}, d:{} };
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!

function refreshBodyCell (tElement, tScope){
   var data = tScope[tScope.uxfwkTableInternal.rowToken];
   var uxtbl = null;

   if ( !$U(data) ) {
      uxtbl = data.$$uxtbl || {};
      if ( true === uxtbl.isNewEntry ){ tElement.addClass('newentry'); }
      else{ tElement.removeClass('newentry'); }
   }
};// ::refreshBodyCell

uxfwkTableZebraTr.d.link = function ($scope, $element, $attrs, $ctrls){
   var $myrows = null, $zebra = null, leni = 0, i = 0;

   if ( !$U($ctrls[1]) ){
      $scope.$on('uxfwk-table-body-render', function(){ refreshBodyCell($element, $scope); });
   }
   if ( $U($ctrls) || $U($zebra = $ctrls[0]) ){ return; }
   $element = appUtilities.$w($element);
   $myrows = $element.parent().children('tr');

   for ( i = 0, leni = $myrows.length; (i < leni) && ($myrows.eq(i).dom() != $element.dom()); ++i );
   if ( i < leni ){ $element.addClass((i%2)?($zebra.classes.even):($zebra.classes.odd)); }

};// ::link
uxfwkTableZebraTr.d.require = ['?^uxfwkTableZebra', '?^uxfwkTable'];
return uxfwkTableZebraTr.d;
}]);// ::uxfwkTableZebra::tr

/******************************************************************************* 
 * SORT BEHAVIOUR
 *******************************************************************************/
/**
 * This is the sort behaviour of table directive. It only instanciates some global data specific to sorting. 
 * This data will be shared across table header and table body, and it uses some proprietary events.
 */
angularAMD.directive('uxfwkTableSort', [function uxfwkTableSort (){
   return {
      restrict: 'EA',
      require:  ['^uxfwkTable'],
      controllerAs:'myController',
      controller:['$scope', '$element', '$attrs', function(tScope, tElement, tAttrs){
         var currentSortedColumn = null, currentSortAsc = null;
         var myself = this;

         this.uxfwkTableController = null;

         this.sortColumn = function (columnId){
            if ( currentSortedColumn === columnId ){
               currentSortAsc = !currentSortAsc;
            }else{
               currentSortedColumn = columnId;
               currentSortAsc = true;
            }
            if ( (true === myself.uxfwkTableController.settings.actionSort.allow) && angular.isFunction(myself.uxfwkTableController.settings.actionSort.callback) ){
               myself.uxfwkTableController.settings.actionSort.callback(currentSortedColumn, currentSortAsc);
               myself.uxfwkTableController.scopedTranscludedContents.scope.$apply(function(){});
            }
            myself.uxfwkTableController.eventManager.broadcast('uxfwk-table-sort-refresh-cells', currentSortedColumn, currentSortAsc);
         };// ::sortColumn

         this.onTableBodyRender = function (){
            if ( !$U(currentSortedColumn) ){

               myself.uxfwkTableController.eventManager.broadcast('uxfwk-table-sort-refresh-cells', currentSortedColumn, currentSortAsc);

            }else{ $console.debug('no sort is enabled'); }
         };// ::onTableBodyRender

      }],// ::controller
      link: function (tScope, tElement, tAttrs, tControllers){
         tScope.myController.uxfwkTableController = tControllers[0];
         tScope.$on('uxfwk-table-body-render', tScope.myController.onTableBodyRender);
      },
   };
}]);// ::uxfwkTableSort

/**
 * Directive that appends a listener to each table head cell. This listener is tiggered
 * by a request to update cell status based on current sorted column. Also, a listener 
 * to click event is added to allow user to click and sort any enabled column. On click 
 * event, a sort request is made on global controller. 
 */
angularAMD.directive('uxfwkTableHeadSort', ['appUtilities', function uxfwkTableSortHeadCell (appUtilities){

   function refreshHeadCell (tElement, tSelfColumnId, tTargetColumnId, tAsc){
      var th = tElement.ancestor('th');
      if ( tSelfColumnId !== tTargetColumnId ){
         th.removeClass('sorting_desc');
         th.removeClass('sorting_asc');
      }else if ( true === tAsc ){
         th.removeClass('sorting_desc');
         th.addClass('sorting_asc');
      }else{
         th.removeClass('sorting_asc');
         th.addClass('sorting_desc');
      }
   };// ::refreshHeadCell

   return {
      restrict: 'EA',
      require:  ['?^uxfwkTableSort'],
      link: function ($scope, tElement, tAttrs, tControllers){
         tElement = appUtilities.$w(tElement);
         if ( !$U(tControllers[0]) ){
            tElement.on('click', function($event){ tControllers[0].sortColumn(tAttrs.uxfwkTableHeadSort); });
            $scope.$on('uxfwk-table-sort-refresh-cells', function(tEvent, tColumnId, tAsc){ return refreshHeadCell(tElement, tAttrs.uxfwkTableHeadSort, tColumnId, tAsc); });
         }
      },
   };
}]);// ::uxfwkTableHeadSort

/**
 * Directive that appends a listener to each table body cell. This listener is triggered 
 * by a request to update cell status based on current sorted column.
 */
angularAMD.directive('td', [function uxfwkTableSortBodyCell (){

   /**
    * Listener that updates body cell according to sorted column
    */
   function refreshBodyCell (tElement, tSelfColumnId, tTargetColumnId){
      if ( tSelfColumnId === tTargetColumnId ){ tElement.addClass('sorting_1'); }
      else{ tElement.removeClass('sorting_1'); }
   };// ::refreshBodyCell

   return {
      restrict: 'EA',
      require: ['?^uxfwkTableSort'],
      link: function (tScope, tElement, tAttrs, tControllers){
         if ( !$U(tControllers[0]) ){
            tScope.$on('uxfwk-table-sort-refresh-cells', function(tEvent, tColumnId, tAsc){ return refreshBodyCell(tElement, tAttrs.uxfwkTableColid, tColumnId); });
         }
      }
   };
}]);// ::uxfwkTableBodyRowSort





/**
 * @description 
 * Directive that implements all behaviour related with table header filters. 
 *  
 * @requires 
 * Ancestor uxfwkTable controller.
 */
angularAMD.directive('uxfwkTableHeadFilter', ['$interpolate', '$parse', 'appUtilities', function uxfwkTableHeadFilter ($interpolate, $parse, appUtilities){

   function _init(ctrl, columnId){ ctrl.headFilters = ctrl.headFilters || {}; return (ctrl.headFilters[columnId] = ctrl.headFilters[columnId] || { tableController:ctrl }); }
   function _interpolate(exp){ return ('{0} {1} {2}').sprintf($interpolate.startSymbol(), exp, $interpolate.endSymbol()); }

   function fixOutsideClick ($event){
      $event.preventDefault();
      $event.stopPropagation();
      return false;
   };// ::@fixOutsideClick

   function applyFilter (){ var that = this;
      that.ctrl.isOpen = false;
      if ( angular.isFunction(that.tableController.settings.actionFilter.callback) ){
         that.tableController.settings.actionFilter.callback(that.filterId, true).then(function(){
            that.isApplied = true; appUtilities.$w(that.tElement).ancestor('th').addClass('filter-active');
            that.tableController.eventManager.trigger('body');
         });
      }else{ that.isApplied = true; }
   };// ::@applyFilter

   function cancelFilter (){ var that = this;
      that.ctrl.isOpen = false;
      if ( angular.isFunction(that.tableController.settings.actionFilter.callback) ){
         that.tableController.settings.actionFilter.callback(that.filterId, false).then(function(){
            that.isApplied = false; appUtilities.$w(that.tElement).ancestor('th').removeClass('filter-active');
            that.tableController.eventManager.trigger('body');
         });
      }else{ that.isApplied = false; }
   };// ::@cancelFilter

   var controller = [function(){
      var that = this;

      that.isOpen = false;
   }];// controller

   return {
      scope:    true, // request a new child scope (but beware!! it may be shared by other directives on same element!)
      require:  ['uxfwkTableHeadFilter', '^uxfwkTable'],
      restrict: 'EA',
      controller: controller,
      compile: function ($element, $attrs){

         return function link ($scope, tElement, $attrs, $ctrls){
            $scope.uxfwkTableHeadFilter = $ctrls[0]; 
            $scope.$$$$uxfwkTableHeadFilter = _init($ctrls[1], $attrs.uxfwkTableHeadFilter);
            $scope.$$$$uxfwkTableHeadFilter.ctrl = $scope.uxfwkTableHeadFilter;
            $scope.$$$$uxfwkTableHeadFilter.apply    = applyFilter;
            $scope.$$$$uxfwkTableHeadFilter.cancel   = cancelFilter;
            $scope.$$$$uxfwkTableHeadFilter.fixClick = fixOutsideClick;
            $scope.$$$$uxfwkTableHeadFilter.fragment = $attrs.fragment;
            $scope.$$$$uxfwkTableHeadFilter.filterId = $attrs.uxfwkTableHeadFilter;
            $scope.$$$$uxfwkTableHeadFilter.tElement = tElement;
         };
      },
      template: (''+
      '<div class="fx-th-btns btn-group" data-uib-dropdown dropdown-append-to-body auto-close="outsideClick" is-open="uxfwkTableHeadFilter.isOpen">'+
         '<button type="button" class="btn btn-link btn-link-in-table uxfwk-table-filter-dropdown-clear" data-ng-if="$$$$uxfwkTableHeadFilter.isApplied" data-ng-click="$$$$uxfwkTableHeadFilter.cancel()">'+
            '<i class="glyphicon glyphicon-remove"></i>'+
         '</button>'+
         '<button data-uib-dropdown-toggle type="button" class="dropdown-toggle fx-dropdown-toggle btn btn-link btn-link-in-table uxfwk-table-filter-dropdown-toggle">'+
            '<i class="glyphicon glyphicon-filter"></i>'+
         '</button>'+
         '<div data-uib-dropdown-menu class="dropdown-menu fx-dropdown uxfwk-table-filter-dropdown-menu" role="menu" data-ng-click="$$$$uxfwkTableHeadFilter.fixClick($event)">'+
            '<div id="{0}" class="wrapper" data-ui-include="$$$$uxfwkTableHeadFilter.tableController.settings.templates.filters" fragment="$$$$uxfwkTableHeadFilter.fragment"></div>'+
            '<footer class="fx-dropdown-menu-actions uxfwk-table-filter-dropdown-actions">'+
               '<button role="button" class="btn btn-primary btn-xs" data-ng-click="$$$$uxfwkTableHeadFilter.apply()">apply</button>'+
               '<button role="button" class="btn btn-default btn-xs" data-ng-click="$$$$uxfwkTableHeadFilter.cancel()">cancel</button>'+
            '</footer>'+
         '</div>'+
      '</div>'+
      '').sprintf(_interpolate('::$$$$uxfwkTableHeadFilter.fragment | trim : \'#\''))
   };
}]);// ::uxfwkTableHeadFilter

angularAMD.directive('uxfwkTableBodyRowActionCustom', ['$interpolate', '$parse', function uxfwkTableBodyRowActionCustom ($interpolate, $parse){

   function _interpolate(exp){ return ('{0} {1} {2}').sprintf($interpolate.startSymbol(), exp, $interpolate.endSymbol()); }

   var controller = ['$scope', '$element', '$attrs', function (tScope, tElement, tAttrs){
      var that = this;

      that.tableController = null; // this will be set on link stage

      that.commit = function (){
         var data = null;

         if ( $U(that.tableController) || $U(that.tableController.settings) ){ return null; }// not visible until table controller as been defined on link stage
         if ( !angular.isFunction(that.tableController.settings.inlineCustom.callback) ){ return null; }// callback is not a valid function
         data = tScope[that.tableController.rowDataTokenName];
         that.tableController.settings.inlineCustom.callback([data]).then(function(response){
            return response;
         });
      };// ::commit

      that.isDisabled = function (){
         return false;
      };// ::isDisabled

      that.isVisible = function (){
         var output = null, data = null;

         if ( $U(that.tableController) || $U(that.tableController.settings) ){ return false; }// not visible until table controller as been defined on link stage
         data = tScope[that.tableController.rowDataTokenName];
         if ( true === that.tableController.settings.inlineCustom.allow ){
            if ( $U(data) || $U(data.$$uxtbl) || $U(data.$$uxtbl.hasCustom) ){ output = true; }
            else{ output = data.$$uxtbl.hasCustom; }
         }else{ output = false; }
         if ( false === !!that.tableController.settings.inlineCustom.auth ){ output = false; }
         return output;
      };// ::isVisible

      that.icon = function (){
         if ( $U(that.tableController) || $U(that.tableController.settings) ){ return null; }// not visible until table controller as been defined on link stage
         return that.tableController.settings.inlineCustom.icon;
      };// ::icon

      that.tooltip = function (){
         if ( $U(that.tableController) || $U(that.tableController.settings) ){ return null; }// not visible until table controller as been defined on link stage
         return that.tableController.settings.inlineCustom.tooltip;
      };// ::tooltip

   }];// ::controller

   return{
      scope: true,
      require: ['?^uxfwkTable'],
      restrict: 'A',
      controller: controller,
      controllerAs: 'myController',
      compile: function (tElement, tAttrs){
         var fnParse = $parse(tAttrs.uxfwkTableRowSubmit);

         return function link (tScope, tElement, tAttrs, tControllers){
            if ( !$U(tControllers[0]) ){
               tScope.myController.tableController = tControllers[0];
            }
         };// ::@link
      },
      template:(''+
      '<a id="chk-action-row-linkAdd-{0}" name="chk-action-row-custom" class="btn btn-link btn-link-in-table chk-action-row-linkAdd" title="{1}"'+
         'data-ng-disabled="myController.isDisabled()"'+
         'data-ng-click="myController.commit()"'+
         'data-ng-if="myController.isVisible()">'+
         '<i class="{2}"></i>'+
      '</a>'+
      '').sprintf(_interpolate('$index'), _interpolate(':: myController.tooltip() | translate'), _interpolate('myController.icon()'))
   };//
}]);// ::uxfwkTableBodyRowActionCustom

angularAMD.directive('uxfwkTableBodyRowActionSubmit', ['$interpolate', '$parse', function uxfwkTableRowActionSubmit ($interpolate, $parse){

   function _interpolate(exp){ return ('{0} {1} {2}').sprintf($interpolate.startSymbol(), exp, $interpolate.endSymbol()); }

   function commit (tScope, option){ var that = this, $$uxtbl = that.data.$$uxtbl || {};
      var $tblscope = tScope.$$$$uxTableDirective;
      var fnConfig = null;
      var request = [];

      if ( $U(fnConfig = that.tblController.settings.inlineConfig.callback) ){ $console.warn('No configuration is possible since no config method was provided on table initialization!!!'); return; }
      if ( true === $$uxtbl.isGroupMst ){
         $console.debug('Table::actions::rowSubmit::commit(send bulk configuration request)', request);
         for ( var i = 0, leni = $tblscope.jsonData.length; i < leni; ++i ){
            if ( !$U($tblscope.jsonData[i].$$uxtbl) && (true === $tblscope.jsonData[i].$$uxtbl.isGroupSlv) ){
               request.push($tblscope.jsonData[i]);
            }
         }
         request.push(that.data);
      }else{
         request.push(that.data);
         $console.debug('Table::actions::rowSubmit::commit(send single configuration request)', request);
      }
      fnConfig(request, option).then(function(responses){
         $console.warn('commit', option, $tblscope);
         $console.warn('Table::actions::rowSubmit::commit(reveive data)', responses);
         $tblscope.actions.bulkEdition.refresh();
         $tblscope.actions.bulkSelect.refresh();
      })

   };// ::@commit

   function disabled (tScope){ var that = this, $$uxtbl = that.data.$$uxtbl || {};
      var key = 'formValidator{1}_{0}'.sprintf(null, tScope.$index);
      var validator = null;

      if ( !$$uxtbl.isInEdition ){ return false; }
      else if ( $U($$uxtbl.validators) ){
         $$uxtbl.validators = {};
         $$uxtbl.validators[key.sprintf('fixed')] = false;
         $$uxtbl.validators[key.sprintf('main')]  = false;
      }
      if ( !$U(validator = tScope[key.sprintf('fixed')]) ){ $$uxtbl.validators[key.sprintf('fixed')] = validator.$invalid; }
      if ( !$U(validator = tScope[key.sprintf('main')]) ) { $$uxtbl.validators[key.sprintf('main')]  = validator.$invalid; }

      return ($$uxtbl.validators[key.sprintf('fixed')] || $$uxtbl.validators[key.sprintf('main')]);
   };// ::@disabled

   function visible (){ var that = this, $$uxtbl = that.data.$$uxtbl || {}, output = false;
      if ( !$U($$uxtbl.hasSubmit) ){ output = $$uxtbl.hasSubmit; }
      else{ output = (!!that.tblController.settings.inlineConfig.allow && !!$$uxtbl.isInEdition && !$$uxtbl.isLoading); }
      output = (output && !!$$uxtbl.submitOptions);
      return output;
   };// ::@isVisible

   return{
      scope:    true,
      require:  ['?^uxfwkTable'],
      restrict: 'EA',
      compile: function (tElement, tAttrs){
         var fnParse = $parse(tAttrs.uxfwkTableRowSubmit);

         return function link (tScope, tElement, tAttrs, tControllers){
            if ( !$U(tControllers[0]) ){
               tScope.$$$$uxfwkTableRowSubmit = { tblController: tControllers[0], context: fnParse(tScope) };
               tScope.$$$$uxfwkTableRowSubmit.data = tScope[tScope.uxfwkTableInternal.rowToken];
               tScope.$$$$uxfwkTableRowSubmit.commit   = commit;
               tScope.$$$$uxfwkTableRowSubmit.disabled = disabled;
               tScope.$$$$uxfwkTableRowSubmit.visible  = visible;
            }
         };// ::@link
      },
      template:(''+
      '<span class="btn btn-group btn-link btn-link-in-table chk-action-row-submit dropdown multiple" data-uib-dropdown dropdown-append-to-body '+
         'data-ng-disabled="$$$$uxfwkTableRowSubmit.disabled(this)" data-ng-if="$$$$uxfwkTableRowSubmit.visible()">'+
         '<span data-uib-dropdown-toggle>'+
            '<a class="btn btn-link btn-link-in-table"'+
               'ddata-ng-click="$$$$uxfwkTableRowSubmit.commit(this)">'+
               '<i class="glyphicon glyphicon-ok"></i>'+
            '</a>'+
            '<span data-uib-dropdown-toggle class="dropdown-toggle fx-dropdown-toggle caret"></span>'+
         '<span>'+
         '<ul data-uib-dropdown-menu class="dropdown-menu fx-dropdown fx-dropdown-open-to-left uxfwk-table-row-submit-dropdown-menu" role="menu">'+
            '<li data-ng-repeat="opt in $$$$uxfwkTableRowSubmit.data.$$uxtbl.submitOptions" data-ng-click="$$$$uxfwkTableRowSubmit.commit(this, opt.id)">'+
               '<i data-ng-if="{2}" class="{0}"></i> <span data-translate="{1}"></span>'+
            '</li>'+
         '</ul>'+
      '</span>'+
      '').sprintf(_interpolate('opt.icon'), _interpolate('opt.text'), 'opt.icon')
   };//
}]);// ::uxfwkTableRowSubmit

(function directiveUxfwkTableActionBulkConfig(){angularAMD.directive('uxfwkTableActionBulkConfig', ['$parse', '$interpolate', function ($parse, $interpolate){

function _interpolate(exp){ return ('{0} {1} {2}').sprintf($interpolate.startSymbol(), exp, $interpolate.endSymbol()); }
function template (){
   return ('<span><button class="btn btn-default btn-xs" title="{1}"'+
      ' data-uxfwk-button-auth="myController.authentication()"'+
      ' data-ng-click="myController.submit()"'+
      ' data-ng-if="myController.isVisible()"'+
   '>'+
      '<i class="{2}"></i>&nbsp;<span data-translate="{3}"></span>'+
   '</button></span>').sprintf(null
      , _interpolate(':: {0}.settings.tooltip | translate ')
      , _interpolate('{0}.settings.icon')
      , _interpolate('{0}.settings.text')
   ).sprintf('myController')
};// endof template

var controller = ['$scope', function ($scope){
   var that = this;

   that.settings = {};
   that.tblCtrl = null;
   that.authentication = function (){
      if ( !angular.isObject(uxfwk.$evalKey(that.tblCtrl, ['settings', 'bulkConfig'])) ){ return false; }
      return !!that.tblCtrl.settings.bulkConfig.auth;
   };// ::authentication

   that.isVisible = function (){

      that.tblCtrl.flags = that.tblCtrl.flags || {};
      if ( !angular.isObject(uxfwk.$evalKey(that.tblCtrl, ['settings', 'bulkConfig'])) ){ return false; }
      if ( !that.tblCtrl.settings.bulkConfig.allow ){ return false; }
      return (!!that.tblCtrl.flags.linesInEdition && !that.tblCtrl.flags.inBulkEdition);
   };// ::isVisible

   that.submit = function (){
      switch ( that.settings.mode ){
         case 'cancel':{ that.tblCtrl.actionBulkCancel(); }break;
         case 'apply':{ $scope.bulkActionConfigData(); }break;
      }
   };// ::submit

}];//endof controller

return{
   scope: true,// I was thinking about an isolated scope but it is a bad idea. I need access to parent scope where data is.
   restrict: 'A',
   require: ['uxfwkTableActionBulkConfig', '?^uxfwkTable'],
   controller: controller,
   controllerAs: 'myController',
   compile: function ($element, $attrs){
      var fnMode = $parse($attrs.uxfwkTableActionBulkConfig);

      return function postlink ($scope, $element, $attrs, $controllers){
         var myCtrl = $controllers[0];
         var tbCtrl = $controllers[1];

         //[#1.0] This button MUST be descendent of table directive
         if ( !angular.isObject(tbCtrl) ){ return; }
         //[#2.0] Passes ascendent directive to my controller
         myCtrl.tblCtrl = tbCtrl;
         //[#3.0] Instantiates some data based on the mode of the directive
         myCtrl.settings = { mode: fnMode($scope) };
         switch ( myCtrl.settings.mode ){
            case 'cancel':{
               myCtrl.settings.tooltip = 'TEXT.UXFWK.TABLE.CANCELALL';
               myCtrl.settings.text = 'TEXT.UXFWK.TABLE.CANCELALL';
               myCtrl.settings.icon = 'glyphicon glyphicon-remove';
            }break;
            case 'apply':{
               myCtrl.settings.tooltip = 'TEXT.UXFWK.TABLE.APPLYALL';
               myCtrl.settings.text = 'TEXT.UXFWK.TABLE.APPLYALL';
               myCtrl.settings.icon = 'glyphicon glyphicon-ok';
            }break;
         }

      };// endof postlink

   },//endof compile
   template: template()
}}])})();//endof directiveUxfwkTableActionBulkConfig

(function directiveUxfwkTableRowActionEdit(){angularAMD.directive('uxfwkTableRowActionEdit', [function (){

var controller = ['$scope', function ($scope){
   var that = this;

   that.tblCtrl = null;

}];//endof controller
 
return{
   scope: true,// I was thinking about an isolated scope but it is a bad idea. I need access to parent scope where data is.
   restrict: 'A',
   require: ['uxfwkTableRowActionEdit', '?^uxfwkTable'],
   controller: controller,
   controllerAs: 'myController',
   compile: function ($element, $attrs){

      return function postlink ($scope, $element, $attrs, $controllers){
         var myCtrl = $controllers[0];
         var tbCtrl = $controllers[1];

         //[#1.0] This button MUST be descendent of table directive
         if ( !angular.isObject(tbCtrl) ){ return; }
         //[#2.0] Passes ascendent directive to my controller
         myCtrl.tblCtrl = tbCtrl;

      };// endof postlink

   }//endof compile
   //template: template()
}}])})();//endof directiveUxfwkTableRowActionEdit

(function directiveUxfwkTableRowSelection(){angularAMD.directive('uxfwkTableRowSelection', [function (){

var controller = ['$scope', function ($scope){
   var that = this;

   that.tblCtrl = null;

   that.isDisabled = function (){
      var data = $scope.$data || {};

      data.$$uxtbl = data.$$uxtbl || {};
      if ( !angular.isObject(that.tblCtrl) ){ return true; }
      if ( !angular.isObject(that.tblCtrl.flags) ){ return true; }
      if ( that.tblCtrl.flags.linesInEdition ){ return true; }// if inline edition mode enabled, block this checkbox
      if ( data.$$uxtbl.isLoading ){ return true; }
      return false;
   };// ::isDisabled

}];//endof controller
 
return{
   scope: true,
   restrict: 'A',
   priority: 1001,
   require: ['uxfwkTableRowSelection', '?^uxfwkTable'],
   controller: controller,
   controllerAs: 'myController',
   compile: function ($element, $attrs){

      return function postlink ($scope, $element, $attrs, $controllers){
         var myCtrl = $controllers[0];
         var tbCtrl = $controllers[1];

         //[#1.0] This button MUST be descendent of table directive
         if ( !angular.isObject(tbCtrl) ){ return; }
         //[#2.0] Passes ascendent directive to my controller
         myCtrl.tblCtrl = tbCtrl;

      };// endof postlink

   }//endof compile
   //template: template()
}}])})();//endof directiveUxfwkTableRowSelection

table.defaultCtrlSettings = (function(){return {
   columns: [], customActions:[],
   autoRefresh:    { allow: false, callback: null },
   actionAbort:    { allow: false, callback: null },
   actionFilter:   { allow: false, callback: null },
   actionSearch:   { allow: false, callback: null, expanded: false },
   actionSort:     { allow: false, callback: null },
   bulkCancel:     { allow: false, btnText: 'TEXT.UXFWK.TABLE.ACTION.BUTTON.BULKCANCEL' },
   bulkConfig:     { allow: false, callback: null, btnText: 'TEXT.UXFWK.TABLE.ACTION.BUTTON.BULKAPPLY' },
   bulkDeletion:   { allow: true,  callback: null, btnText: 'TEXT.UXFWK.TABLE.ACTION.BUTTON.BULKDELETION' },
   bulkEdition:    { allow: false },
   confirmDeletion:{ allow: true  },
   exportData:     { allow: false, link:{pdf:null, xls:null, csv:null} },
   inlineEdition:  { allow: true  },
   inlineCancel:   { allow: true,  callback: null },
   inlineConfig:   { allow: true,  callback: null, options:null },
   inlineCreation: { allow: false, btnText: 'TEXT.UXFWK.TABLE.ACTION.BUTTON.INLINECREATION', tooltip: 'TEXT.UXFWK.TABLE.ACTION.TOOLTIP.INLINECREATION' },
   inlineCustom:   { allow: false, callback: null, tooltip: null, icon: null },
   inlineDeletion: { allow: true  },
   inlineRefresh:  { allow: false, callback: null},
   inlineLinkAdd:  { allow: false, callback: null, tooltip: 'TEXT.UXFWK.TABLE.ACTION.TOOLTIP.INLINELINKADD' },
   inlineLinkRem:  { allow: false, callback: null, tooltip: 'TEXT.UXFWK.TABLE.ACTION.TOOLTIP.INLINELINKREM' },
   formCreation:   { allow: false, btnText: 'TEXT.UXFWK.TABLE.ACTION.BUTTON.FORMCREATION', tooltip: 'TEXT.UXFWK.TABLE.ACTION.TOOLTIP.FORMCREATION' },
   showColumnAct:  { allow: true  },
   showColumnSel:  { allow: true  },
   showColumns:    { allow: true  },
   showHeader:     { allow: true  },
   showPages:      { allow: true  },
   showRefresh:    { allow: true,  isDisabled: uxfwk.$false },
   templates:      { filters:null },
   viewTable:      { allow: true  },
   viewTopology:   { allow: false },
p:null};})();


/**
 * 'zz' prefix on function name (not member name) is only for those functions that need to self-reference. 
 * Function name SHOULD NOT BE USED anywhere else to invoke the function. Module variable 'table' will be 
 * linked to directive $scope.internal.table (so that every function bellow can be accessed inside directive 
 * $scope). Prefix 'zz' is only required to let IDE put those references after all other declarations (so 
 * this is only for IDE reasons). 
 * These functions are defined here to ease IDE tagging system for auto-completion (since inside directive 
 * it would be function definitions inside function definitions...).
 */
table.actions = {};

table.actions.bulkDeletion = {};
/**
 * @description 
 * Bulk delete button may only be enabled if there ARE NO new lines AND there are are marked lines
 * MUST be exists selected lines.
 * 
 * @author nuno-r-farinha
 */
table.actions.bulkDeletion.isDisabled = function ($scope){
   var output = true;

   if ( $U($scope.jsonData) ){ return false; }
   for ( var i = 0, leni = $scope.jsonData.length; i < leni; i++ ){
      if ( $scope.jsonData[i].$$uxtbl ){
         if ( true == $scope.jsonData[i].$$uxtbl.isSelected ){ output = false; }       // its a candidate reason to enable the button
         if ( true == $scope.jsonData[i].$$uxtbl.isInEdition ){ output = true; break; }// if a line is in edition mode, then no bulk deletion is allowed
      }
   }
   return output;
};// table:actions:bulkDeletion::isDisabled

/**
 * 
 */
table.actions.refresh = (function (field, locals){
   var $tblscope = locals.scope;
   var $tblctrl = locals.ctrl;

   field.commit = function (){
      $tblscope.actionGetData().then(function(){
         $tblscope.actions.bulkEdition.finish();
      })
   };// ::@commit

});// ::actions::refresh

/**
 * 
 */
table.actions.rowSubmit = (function (field, locals){
   var $tblscope = locals.scope;
   var $tblctrl = locals.ctrl;

   field.commit = function ($scope){
      var data = $scope[$scope.uxfwkTableInternal.rowToken];
      var uxtbl = data.$$uxtbl;
      var fnConfig = null;
      var request = [];

      if ( $U(fnConfig = $scope.uxfwkTableInternal.settings.inlineConfig.callback) ){ $console.warn('No configuration is possible since no config method was provided on table initialization!!!'); return; }
      if ( true === uxtbl.isGroupMst ){
         $console.debug('Table::actions::rowSubmit::commit(send bulk configuration request)', request);
         for ( var i = 0, leni = $tblscope.jsonData.length; i < leni; ++i ){
            if ( !$U($tblscope.jsonData[i].$$uxtbl) && (true === $tblscope.jsonData[i].$$uxtbl.isGroupSlv) ){
               request.push($tblscope.jsonData[i]);
            }
         }
         request.push(data);
      }else{
         request.push(data);
         $console.debug('Table::actions::rowSubmit::commit(send single configuration request)', request);
      }
      fnConfig(request).then(function(responses){
         $console.debug('Table::actions::rowSubmit::commit(reveive data)', responses);
         $tblscope.actions.bulkEdition.refresh();
         $tblscope.actions.bulkSelect.refresh();
      })
   };// ::commit

});// ::actions::rowSubmit

/**
 * 
 */
table.actions.rowCancel = (function (field, locals){
   var $tblscope = locals.scope;
   var $tblctrl = locals.ctrl;

   field.commit = function ($scope){
      var data = $scope[$scope.uxfwkTableInternal.rowToken];
      var uxtbl = data.$$uxtbl || {};
      var fnCallback = null;

      fnCallback = $scope.uxfwkTableInternal.settings.inlineCancel.callback;
      if ( true === uxtbl.isGroupMst ){
         for ( var i = 0, leni = $tblscope.jsonData.length; i < leni; ++i ){
            if ( !$U($tblscope.jsonData[i].$$uxtbl) && ((true === $tblscope.jsonData[i].$$uxtbl.isGroupMst) || (true === $tblscope.jsonData[i].$$uxtbl.isGroupSlv)) ){
               $tblscope.jsonData[i].$$uxtbl.isInEdition = false;
               $tblscope.jsonData[i].$$uxtbl.isGroupMst  = false;
               $tblscope.jsonData[i].$$uxtbl.isGroupSlv  = false;
               $tblscope.jsonData[i].$$uxtbl.isSelected  = false;
               $tblscope.jsonData[i].$$uxtbl.isLocked    = false;
               if ( !$U(fnCallback) ){ fnCallback([$tblscope.jsonData[i]]); }
            }
         }
         $tblscope.actions.bulkEdition.finish();
      }else{
         data.$$uxtbl.isInEdition = false;
         data.$$uxtbl.isSelected  = false;
         if ( !$U(fnCallback) ){ fnCallback([data]); }
      }
   };// ::commit

});// ::actions::rowCancel

/**
 * 
 */
table.actions.bulkEdition = (function (field, locals){
   var currentGroup = { master:null, slaves:[], watcherDestroyer:null, masterCopy:{} };
   var $scope = locals.scope;
   var $ctrl = locals.ctrl;

   function isPrivateProperty (name){
      return !$U(name.match(/^\$.*/g));
      $console.warn(name, name.match(/^\$\$\$[^\$]*/g));
   };// ::@isPrivateProperty

   function applyDiff (diffs, a){
      for ( var p in diffs ){
         if ( diffs.hasOwnProperty(p) ){
            if ( angular.isObject(diffs[p]) ){
               a[p] = a[p] || {};
               applyDiff(diffs[p], a[p]);
            }else if ( angular.isArray(diffs[p]) ){
            }else{ a[p] = diffs[p]; }
         }
      }
   };// ::@applyDiff
      
   function mergeDiff (a, b){
      var output = {}, d = null;

      for ( var p in a ){
         if ( a.hasOwnProperty(p) && !angular.isFunction(a[p]) ){
            if ( true === isPrivateProperty(p) ){ continue; }
            else if ( $U(b) ){ output[p] = a[p]; }
            else if ( angular.isObject(a[p]) ){ if ( !$U(d = mergeDiff(a[p], b[p])) ){ output[p] = d; } }
            else if ( angular.isArray(a[p]) ){}
            else if ( $U(b[p]) ){ output[p] = a[p]; }
            else if ( a[p] != b[p] ){ output[p] = a[p]; }
            //else{ $console.warn('I dont know what to do with this object...', a[p]); }
         }
      }
      if ( uxfwk.isEmpty(output) ){ return null; }
      return output;
   };// ::@mergeDiff

   function broadcastMasterChanges (){
      var diffs = null;

      if ( $U(currentGroup.masterCopy) ){ currentGroup.masterCopy = angular.copy(currentGroup.master); }
      diffs = mergeDiff(currentGroup.master, currentGroup.masterCopy);
      if ( !$U(diffs) ){
         for ( var i = 0, leni = currentGroup.slaves.length; i < leni; ++i ){
            applyDiff(diffs, currentGroup.slaves[i]);
            //angular.extend(currentGroup.slaves[i], diffs);
         }
         currentGroup.masterCopy = angular.copy(currentGroup.master);
         $scope.$applyAsync(function(){
            //$console.warn(currentGroup, diffs);
         });
      }
   };// ::@broadcastMasterChanges

   /**
    * VISIBLE 
    * - ONLY visible if bulk edition enabled on table settings 
    */
   field.isVisible = function (){
      return ($scope.settings.bulkEdition.allow && !$ctrl.flags.linesInEdition);
   };// ::isVisible
   /**
    * DISABLED 
    * - If no entry is selected (only current page)
    *   (the same as: only enabled if one line is selected)
    * - If a bulk edition is already enabled
    */
   field.isDisabled = function (){ var i = 0, leni = 0, data = $scope.jsonPagination.data;
      for ( i = 0, leni = data.length; (i < leni) && ($U(data[i].$$uxtbl) || (true !== data[i].$$uxtbl.isSelected)); ++i );
      return (!(i < leni) || !$U(currentGroup.master));
   };// ::isDisabled
   /**
    * COMMIT
    */
   field.commit = function (){ var i = 0, leni = 0, data = $scope.jsonPagination.data;
      if ( !$U(currentGroup.watcherDestroyer) ){ currentGroup.watcherDestroyer(); }
      currentGroup.master = null; currentGroup.slaves = [];
      for ( i = 0, leni = data.length; (i < leni); ++i ){
         if ( !$U(data[i].$$uxtbl) && (true === data[i].$$uxtbl.isSelected) ){
            if ( $U(currentGroup.master) ){
               currentGroup.master = data[i];
               currentGroup.masterCopy = angular.copy(currentGroup.master);
               currentGroup.master.$$uxtbl.isInEdition = true;
               currentGroup.master.$$uxtbl.isGroupMst  = true;
            }else{
               data[i].$$uxtbl.isLocked   = true;
               data[i].$$uxtbl.isGroupSlv = true;
               currentGroup.slaves.push(data[i]);
            }
         }
      }
      currentGroup.watcherDestroyer = $scope.$watch(broadcastMasterChanges);
      $ctrl.flags.inBulkEdition = true;
   };// ::commit
   /**
    * FINISH
    */
   field.finish = function (){
      if ( !$U(currentGroup.watcherDestroyer) ){ currentGroup.watcherDestroyer(); }
      currentGroup.master = null;
      currentGroup.slaves = [];
      currentGroup.masterCopy = null;
      $scope.actions.bulkSelect.refresh();
      $ctrl.flags.inBulkEdition = false;
   };// ::finish
   /**
    * REFRESH
    */
   field.refresh = function (){ var i = 0, leni = 0, data = $scope.jsonPagination.data;
      currentGroup.slaves = [];
      currentGroup.master = null; currentGroup.masterCopy = null;
      for ( i = 0, leni = data.length; i < leni; ++i ){
         if ( !$U(data[i].$$uxtbl) && ((true === data[i].$$uxtbl.isGroupMst) || (true === data[i].$$uxtbl.isGroupSlv)) ){
            if ( $U(currentGroup.master) ){
               currentGroup.master = data[i];
               currentGroup.masterCopy = angular.copy(currentGroup.master);
               currentGroup.master.$$uxtbl.isInEdition = true;
               currentGroup.master.$$uxtbl.isGroupMst  = true;
               currentGroup.master.$$uxtbl.isLocked    = false;
            }else{
               data[i].$$uxtbl.isInEdition = false;
               data[i].$$uxtbl.isGroupSlv  = true;
               data[i].$$uxtbl.isLocked    = true;
               currentGroup.slaves.push(data[i]);
            }
         }
      }
      $console.debug('Table::actions::bulkEdition::refresh(group updated)', currentGroup);
   };// ::refresh

});// ::bulkEdition

/**
 * 
 */
table.actions.bulkSelect = (function (field, locals){
   var $tblscope = locals.scope;
   var $tblctrl = locals.ctrl;

   function refreshMaster (){
      var data = $tblscope.jsonPagination.data;
      var output = true;

      for ( var i = 0, leni = data.length; (i < leni) && (true === output); ++i ){
         data[i].$$uxtbl = data[i].$$uxtbl || {};
         output &= !!data[i].$$uxtbl.isSelected;
         output = !!output;
      }
      field.master.value = !!output;
   };// ::@refreshMaster

   field.master = {};
   field.master.value = false;

   field.master.toggle = function (){
      var data = $tblscope.jsonPagination.data;

      for ( var i = 0, leni = data.length; i < leni; ++i ){
         data[i].$$uxtbl = data[i].$$uxtbl || {};
         data[i].$$uxtbl.isSelected = !!this.value;
      }
   };// ::master::toggle

   field.line = {};
   field.line.toggle = function (){
      refreshMaster();
   };// ::line::toggle

   field.refresh = function (){
      refreshMaster();
   };// ::refresh

});// ::actions::bulkSelect


});
