(function(newfiles){'use strict';

   function extend (destination, sources){
      destination = destination || {};
      for ( var i = 0, leni = sources.length; i < leni; ++i ){
         for ( var p in sources[i] ){
            if ( sources[i].hasOwnProperty(p) ){ destination[p] = sources[i][p]; }
         }
      }
      return destination;
   };// @extend

// Este ficheiro deve de alguma forma passar a ser gerado no momento do empacotamento de forma automática.
// Deve existir um conjunto de dados de configuracao do produto que seja usado para criar o conteúdo (ou parte) deste ficheiro.
require.config({
   baseUrl: '',
   waitSeconds: 30,
   // alias libraries paths
   paths: extend({
      'jsplumb':                    'shared/jsPlumb-2.1.0-db0dec3/js/jsplumb',
      'd3':                         'shared/d3-3.5.5/js/d3.min',
      'nvd3':                       'shared/nvd3-1.7.1/js/nv.d3.min',
      'adf':                        'basepack/angular-dashboard-framework-0.11.0/js/angular-dashboard-framework',
      'adf.provider':               'basepack/angular-dashboard-framework-0.11.0/js/provider',
      'adf.structures.base':        'basepack/angular-dashboard-framework-0.11.0/js/angular-dashboard-framework-base',
      //'angular-ui-select':          'shared/ui-select/js/select.min',
      'angular-ui-select':          'shared/angular-ui-select-0.11.2/js/select.min',
      'angular-xml':                'shared/angular-xml-1.0.6/angular-xml.min',
      'ui.mask':                    'external/angular-ui-mask-1.8.7/angular-ui-mask-1.8.7.min',
      //
      'uxfwk':                         'internal/uxfwk/js/uxfwk',
      'uxfwk.dom':                     'internal/uxfwk/js/uxfwk.dom',
      'uxfwk.http':                    'internal/uxfwk/js/uxfwk.http',
      'uxfwk.string':                  'internal/uxfwk/js/uxfwk.string',
      'uxfwk.dao.reader':              'internal/uxfwk/js/uxfwk.dao.reader',
      'uxfwk.ui.button.refresh':       'internal/uxfwk/js/uxfwk.ui.button.refresh',
      'uxfwk.data.cache.manager':      'internal/uxfwk/js/uxfwk.data.cache.manager',
      'uxfwk.directive.validate':      'internal/uxfwk/js/uxfwk.directive.validate',
      'uxfwk.validate.collection':     'internal/uxfwk/js/uxfwk.validate.service.collection',
      'uxfwk.validate.directive.hints':'internal/uxfwk/js/uxfwk.validate.directive.hints',
      'uxfwk.component.input':         'internal/uxfwk/js/uxfwk.component.input',
      'uxfwk.rm.cache.data.manager':   'internal/uxfwk/js/uxfwk.rm.cache.data.manager',
      'uxfwk.table':                   'internal/uxfwk-table/js/uxfwk.table',
      'uxfwk.ui.table.bulk.actions':   'internal/uxfwk-table/js/uxfwk.table.bulk.actions',
      'uxfwk.table.data.manager':      'internal/uxfwk-table/js/uxfwk.table.data.manager',
      'uxfwk.table.component.data.row':'internal/uxfwk-table/js/uxfwk.table.directive.data.row',
      //'uxfwk.dropdown':             'shared/uxfwk-dropdown-1.0.0/js/uxfwk.dropdown',
      'uxfwk.tooltip':                 'internal/uxfwk-dropdown/js/uxfwk.tooltip',
      'uxfwk.rm.ui.data.view':         'internal/uxfwk-rm-ui-data-view/uxfwk.rm.ui.data.view',
      'uxfwk.collapse':                'internal/uxfwk/js/uxfwk.collapse',
      'uxfwk.ipv4':                    'internal/uxfwk/js/uxfwk.ipv4',
      //'uxfwk.select':               'shared/uxfwk-select/js/uxfwk.select',

      // common modules
      'uxfwk.time.utils.settings':        'widgets/time.utils/uxfwk.settings',
      'uxfwk.ui.clock':                   'widgets/time.utils/uxfwk.ui.clock',
      'uxfwk.time.utils.ui.time':         'widgets/time.utils/uxfwk.ui.time',
      'uxfwk.core.misc.dao':              'pack-rm/modules/core/core.misc.dao',
      'uxfwk.logout.dao':                 'widgets/header/logout.dao',

      'header':                           'widgets/header/header.ctrl',
      'breadcrumb':                       'widgets/breadcrumb/breadcrumb.ctrl',
      'leftnavbar':                       'widgets/leftnavbar/leftnavbar.ctrl',
      'footer':                           'widgets/footer/footer.ctrl',
      //'tree':                             'partials/jstree/jstree.ctrl',
      'tabnavigation':                    'widgets/tabnavigation/tabnavigation.directive',

      'uxfwk.pack.fgw': 'states',
      'packages': 'states'
   }, newfiles),
   // Add angular modules that does not support AMD out of the box, put it in a shim
   shim: {
      //'uxfwk':                      ['angular', 'fuxi', 'uxfwk.string', 'uxfwk.collapse', 'uxfwk.tooltip'/*, 'uxfwk.dropdown'*/],
      'angular-ui-select':          ['angular']
   },
   // kick start application
   //deps: ['index', 'uxfwk', 'header', 'breadcrumb', 'footer', 'uxfwkmoreinfo', 'tabnavigation', 'angular-cookies', 'uxfwk.directive.validate', 'uxfwk.validate.directive.hints', 'uxfwk.component.input']
   deps: ['index', 'uxfwk', 'uxfwk.directive.validate', 'uxfwk.validate.directive.hints']
});
})
([{
   'uxfwk.fgw.summary.portTermination':            'widgets/summary/summary.portTermination',
   'uxfwk.fgw.summary.switch':                     'widgets/summary/summary.switch',
   'uxfwk.fgw.summary':                            'widgets/summary/summary',
   'module.fgw.widgets':                           'widgets/common',
   'uxfwk.fgw.warningmodal.deleteEntry':           'widgets/common/warningmodal.deleteEntry',
   'uxfwk.fgw.home.diagram':                       'modules/fgw.home/fgw.home.diagram',
   'module.fgw.home':                              'modules/fgw.home',
   'module.fgw.myaccount':                         'modules/fgw.myaccount',
   'module.fgw.help':                              'modules/fgw.help',
   'uxfwk.fgw.tools.warningmodal':                 'modules/fgw.tools/fgw.tools.warningmodal',
   'uxfwk.fgw.tools.restore.modal':                'modules/fgw.tools/fgw.tools.restore.modal.tpl',
   'module.fgw.tools':                             'modules/fgw.tools',
   'module.fgw.contents':                          'modules/fgw.contents',
   'uxfwk.fgw.contents.modal':                     'modules/fgw.contents/fgw.contents.modal',
   'module.fgw.security':                          'modules/fgw.security',
   'uxfwk.fgw.security.parentalmodal':             'modules/fgw.security/fgw.security.parentalmodal',
   'uxfwk.fgw.security.urlmodal':                  'modules/fgw.security/fgw.security.urlmodal',
   'uxfwk.fgw.security.portforwardmodal':          'modules/fgw.security/fgw.security.portforwardmodal',
   'uxfwk.fgw.security.portactivationmodal':       'modules/fgw.security/fgw.security.portactivationmodal',
   'uxfwk.fgw.security.deleteModal':               'modules/fgw.security/fgw.security.deleteModal',
   'module.fgw.router':                            'modules/fgw.router',
   'module.fgw.lan':                               'modules/fgw.lan',
   'uxfwk.fgw.lan.staticleasesmodal':              'modules/fgw.lan/fgw.lan.staticleasesmodal',
   'module.fgw.wan':                               'modules/fgw.wan',
   'module.fgw.wifi':                              'modules/fgw.wifi',
   'uxfwk.fgw.wifi.macmodal':                      'modules/fgw.wifi/fgw.wifi.macmodal',
   'uxfwk.fgw.wifi.common':                        'modules/fgw.wifi/fgw.wifi.common',
   'uxfwk.fgw.wifi.rules':                         'modules/fgw.wifi/fgw.wifi.rules',
   'module.fgw.voice':                             'modules/fgw.voice',
   'module.fgw.tv':                                'modules/fgw.tv',
   'uxfwk.fgw.tools.restore.modal':                'modules/fgw.tools/fgw.tools.restore.modal.ctrl'
},{
   'modernizr':                  'basepack/pack.bootstrap.min',
   'jquery':                     'basepack/pack.bootstrap.min',
   'jquery-select2':             'basepack/pack.bootstrap.min',
   'bootstrap':                  'basepack/pack.bootstrap.min',
   'fuxi':                       'basepack/pack.bootstrap.min',
   'text':                       'basepack/pack.bootstrap.min',
   'angular':                    'basepack/pack.angular.min',
   'ngAnimate':                  'basepack/pack.angular.min',
   'ngCookies':                  'basepack/pack.angular.min',
   'ngSanitize':                 'basepack/pack.angular.min',
   'pascalprecht.translate':     'basepack/pack.angular.min',
   'angularAMD':                 'basepack/pack.angular.min',
   'ngload':                     'basepack/pack.angular.min',
   'ui.bootstrap':               'basepack/pack.angular.ui.min',
   'ui.layout':                  'basepack/pack.angular.ui.min',
   'ui.router':                  'basepack/pack.angular.ui.min',
   'ui.select2':                 'basepack/pack.angular.ui.min',
   'ui.tree':                    'basepack/pack.angular.ui.min',
   'ui.utils':                   'basepack/pack.angular.ui.min',

   'uxfwk.require.css':          'components/uxfwk-require/uxfwk.require.css',
   'uxfwk.require.html':         'components/uxfwk-require/uxfwk.require.html',
   'uxfwk.require.lang':         'components/uxfwk-require/uxfwk.require.lang'
}]);
