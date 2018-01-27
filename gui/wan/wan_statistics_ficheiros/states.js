/** 
 * @description
 * This file describes all the application states that are valid for FGW GUI module sub-application.
 */
define('packages', ['uxfwk.pack.fgw'], function(package0){'use strict';
   return [package0];
});
define('uxfwk.pack.fgw', ['angularAMD', 'uxfwk'
   , 'uxfwk.require.lang!fgw.widgets.common'
], function (angularAMD, uxfwk){'use strict';
   var $console = uxfwk.$console, $U = uxfwk.$U;
   var module = { name: 'modules', bootstrap: {} };
function vshack(){ vshack.catch(); };// SlickEdit hack, do not remove!!!
 
//module.bootstrap.language = ['pack-fgw/common'];
module.bootstrap.language = [];
module.bootstrap.initialize = ['$rootScope', 'appUtilities', function ($rootScope, appUtilities){

}];// ::bootstrap::initialize

module.bootstrap.stateTree = function (stateUtils){

   function updateStyles (){
      return true;
   };// updateStyles

   return [
   //[#1.0] - The following states are the root states for the rest of the pack state tree
   { name: 'gui', url: '/gui', resolve:{ updateStyles: updateStyles }, 'abstract': true },
   { name: 'gui.home', 
      url: '/home', 
      views:{ 'body-view@': stateUtils.createViewSet('body-view@', 'modules/fgw.home/fgw.home', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.HOME" | translate }}', ncyBreadcrumbParent: 'fgw.home' }
   },
   { name: 'gui.contents', 
      url: '/services', 
      views:{ 'body-view@':{
         template:('<div class="fgw-page-title clearfix">'+
         '<div class="pull-left"><h1><i class="icon fgw-cogs"></i><span data-translate="TEXT.COMMON.TITLE.CONTENTS"></span></h1></div>'+
            '<div class="pull-right" data-ng-if="false"></div>'+
         '</div>'+
         '<div class="fgw-page-content" fgw-resize="content">'+
            '<nav class="fgw-main-tabs">'+
               '<ul class="nav nav-tabs">'+
//                  '<li data-ui-sref-active="active"><a data-ui-sref="gui.contents.home" data-translate="TEXT.COMMON.TABS.CHARACTERISTICS"></a></li>'+
               '</ul>'+
            '</nav>'+
         '<div class="body-bottom-view" data-ui-view="body-bottom-view"></div>'+
         '</div')
      }},
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.CONTENTS" | translate }}', ncyBreadcrumbParent: 'fgw.home' },
      redirectTo: 'gui.contents.home'
   },
   { name: 'gui.contents.home', 
      url: '/home', 
      views:{ 'body-bottom-view@gui.contents': stateUtils.createViewSet('body-bottom-view@gui.contents', 'modules/fgw.contents/fgw.contents.home', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.CONTENTS" | translate }}' }
   },
   { name: 'gui.security', 
      url: '/security',
      views:{ 'body-view@':{
         template:('<div class="fgw-page-title clearfix">'+
            '<div class="pull-left"><h1><i class="icon fgw-shield"></i><span data-translate="TEXT.COMMON.TITLE.SECURITY"></span></h1></div>'+
               '<div class="pull-right" data-ng-if="false"></div>'+
            '</div>'+
            '<div class="fgw-page-content" fgw-resize="content">'+
            '<nav class="fgw-main-tabs">'+
               '<ul class="nav nav-tabs">'+
                  '<li data-ui-sref-active="active"><a data-ui-sref="gui.security.home" data-translate="TEXT.COMMON.TABS.SECURITYSETTINGS"></a></li>'+
                  '<li data-ui-sref-active="active"><a data-ui-sref="gui.security.access" data-translate="TEXT.COMMON.TABS.SECURITYACCESS"></a></li>'+
               '</ul>'+
            '</nav>'+
         '<div class="body-bottom-view" data-ui-view="body-bottom-view"></div>'+
         '</div')
      }},
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.SECURITY" | translate }}', ncyBreadcrumbParent: 'fgw.home' },
      redirectTo: 'gui.security.home'
   },
   { name: 'gui.security.home', 
      url: '/home', 
      views:{ 'body-bottom-view@gui.security': stateUtils.createViewSet('body-bottom-view@gui.security', 'modules/fgw.security/fgw.security.home', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.SECURITY.HOME" | translate }}' }
   },
   { name: 'gui.security.access', 
      url: '/access', 
      views:{ 'body-bottom-view@gui.security': stateUtils.createViewSet('body-bottom-view@gui.security', 'modules/fgw.security/fgw.security.nat', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.SECURITY.ACCESS" | translate }}' }
   },
   { name: 'gui.tools', 
      url: '/tools', 
      views:{ 'body-view@':{
         template:('<div class="fgw-page-title clearfix">'+
            '<div class="pull-left"><h1><i class="icon fgw-configuration"></i><span data-translate="TEXT.COMMON.TITLE.TOOLS"></span></h1></div>'+
               '<div class="pull-right" data-ng-if="false"></div>'+
            '</div>'+
            '<div class="fgw-page-content" fgw-resize="content">'+
               '<nav class="fgw-main-tabs">'+
                  '<ul class="nav nav-tabs">'+
//                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.tools.home" data-translate="TEXT.COMMON.TABS.CHARACTERISTICS"></a></li>'+
                  '</ul>'+
               '</nav>'+
            '<div class="body-bottom-view" data-ui-view="body-bottom-view"></div>'+
            '</div')
      }},
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.TOOLS" | translate }}', ncyBreadcrumbParent: 'fgw.home' },
      redirectTo: 'gui.tools.home'
   },
   { name: 'gui.tools.home', 
      url: '/home', 
      views:{ 'body-bottom-view@gui.tools': stateUtils.createViewSet('body-bottom-view@gui.tools', 'modules/fgw.tools/fgw.tools.home', false, true) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.TOOLS" | translate }}' }
   },
   { name: 'gui.help', 
      url: '/help', 
      views:{ 'body-view@':{
         template:('<div class="fgw-page-title clearfix">'+
            '<div class="pull-left"><h1><i class="icon fgw-book"></i><span data-translate="TEXT.COMMON.TITLE.HELP"></span></h1></div>'+
               '<div class="pull-right" data-ng-if="false"></div>'+
            '</div>'+
            '<div class="fgw-page-content" fgw-resize="content">'+
               '<nav class="fgw-main-tabs">'+
                  '<ul class="nav nav-tabs">'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.help.home"       data-translate="TEXT.FGW.HELP.HOME.COMMON.TITLE.NETWORK"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.help.security"   data-translate="TEXT.FGW.HELP.HOME.COMMON.TITLE.SECURITY"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.help.services"   data-translate="TEXT.FGW.HELP.HOME.COMMON.TITLE.SERVICES"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.help.tools"      data-translate="TEXT.FGW.HELP.HOME.COMMON.TITLE.TOOLS"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.help.myaccount"  data-translate="TEXT.FGW.HELP.HOME.COMMON.TITLE.MYACCOUNT"></a></li>'+
                  '</ul>'+
               '</nav>'+
            '<div class="body-bottom-view" data-ui-view="body-bottom-view"></div>'+
            '</div')
      }},
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.HELP" | translate }}', ncyBreadcrumbParent: 'fgw.home' },
      redirectTo: 'gui.help.home'
   },
   { name: 'gui.help.home', 
      url: '/home', 
      views:{ 'body-bottom-view@gui.help': stateUtils.createViewSet('body-bottom-view@gui.help', 'modules/fgw.help/fgw.help.home', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.HELP.HOME" | translate }}' }
   },
   { name: 'gui.help.security', 
      url: '/security', 
      views:{ 'body-bottom-view@gui.help': stateUtils.createViewSet('body-bottom-view@gui.help', 'modules/fgw.help/fgw.help.security', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.HELP.HOME" | translate }}' }
   },
   { name: 'gui.help.services', 
      url: '/services', 
      views:{ 'body-bottom-view@gui.help': stateUtils.createViewSet('body-bottom-view@gui.help', 'modules/fgw.help/fgw.help.services', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.HELP.HOME" | translate }}' }
   },
   { name: 'gui.help.tools', 
      url: '/tools', 
      views:{ 'body-bottom-view@gui.help': stateUtils.createViewSet('body-bottom-view@gui.help', 'modules/fgw.help/fgw.help.tools', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.HELP.HOME" | translate }}' }
   },
   { name: 'gui.help.myaccount', 
      url: '/myaccount', 
      views:{ 'body-bottom-view@gui.help': stateUtils.createViewSet('body-bottom-view@gui.help', 'modules/fgw.help/fgw.help.myaccount', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.HELP.HOME" | translate }}' }
   },
   { name: 'gui.myaccount', 
      url: '/myaccount', 
      views:{ 'body-view@':{
         template:('<div class="fgw-page-title clearfix">'+
            '<div class="pull-left"><h1><i class="icon fgw-user"></i><span data-translate="TEXT.COMMON.TITLE.MYACCOUNT"></span></h1></div>'+
               '<div class="pull-right" data-ng-if="false"></div>'+
            '</div>'+
            '<div class="fgw-page-content" fgw-resize="content">'+
               '<nav class="fgw-main-tabs">'+
                  '<ul class="nav nav-tabs">'+
//                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.myaccount.home" data-translate="TEXT.COMMON.TABS.CHARACTERISTICS"></a></li>'+
                  '</ul>'+
               '</nav>'+
            '<div class="body-bottom-view" data-ui-view="body-bottom-view"></div>'+
            '</div')
      }},
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.MYACCOUNT" | translate }}', ncyBreadcrumbParent: 'fgw.home' },
      redirectTo: 'gui.myaccount.home'
   },
   { name: 'gui.myaccount.home', 
      url: '/home', 
      views:{ 'body-bottom-view@gui.myaccount': stateUtils.createViewSet('body-bottom-view@gui.myaccount', 'modules/fgw.myaccount/fgw.myaccount.home', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.MYACCOUNT" | translate }}' }
   },
   // Router
   { name: 'gui.router', 
      url: '/fgw', 
      views:{ 'body-view@':{
         template:('<div class="fgw-page-title clearfix">'+
            '<div class="pull-left"><h1><i class="icon fgw-router"></i><span data-translate="TEXT.COMMON.TITLE.ROUTER"></span><span data-translate="TEXT.COMMON.SUBTITLE.ROUTER"></span></h1></div>'+
               '<div class="pull-right" ng-if="false"></div>'+
            '</div>'+
            '<div class="fgw-page-content" fgw-resize="content">'+
               '<nav class="fgw-main-tabs">'+
                  '<ul class="nav nav-tabs">'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.router.home" data-translate="TEXT.COMMON.TABS.CHARACTERISTICS"></a></li>'+
                  '</ul>'+
               '</nav>'+
            '<div class="body-bottom-view" data-ui-view="body-bottom-view"></div>'+
         '</div>')
      }},
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.ROUTER" | translate }}', ncyBreadcrumbParent: 'fgw.home' },
      redirectTo: 'gui.router.home'
   },
   { name: 'gui.router.home', 
      url: '/home', 
      views:{ 'body-bottom-view@gui.router': stateUtils.createViewSet('body-bottom-view@gui.router', 'modules/fgw.router/fgw.router', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.ROUTER.HOME" | translate }}' }
   },
   // WAN
   { name: 'gui.wan', 
      url: '/wan',
      views:{ 'body-view@':{
         template:('<div class="fgw-page-title clearfix">'+
            '<div class="pull-left"><h1><i class="icon fgw-provision"></i><span data-translate="TEXT.COMMON.TITLE.WAN"></span><span data-translate="TEXT.COMMON.SUBTITLE.WAN"></span></h1></div>'+
               '<div class="pull-right" data-ng-if="false"></div>'+
            '</div>'+
            '<div class="fgw-page-content" fgw-resize="content">'+
               '<nav class="fgw-main-tabs">'+
                  '<ul class="nav nav-tabs">'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.wan.home" data-translate="TEXT.COMMON.TABS.CHARACTERISTICS"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.wan.statistics" data-translate="TEXT.COMMON.TABS.STATISTICS"></a></li>'+
                  '</ul>'+
               '</nav>'+
            '<div class="body-bottom-view" data-ui-view="body-bottom-view"></div>'+
         '</div>')
      }},
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.WAN" | translate }}', ncyBreadcrumbParent: 'fgw.home' },
      redirectTo: 'gui.wan.home'
   },
   { name: 'gui.wan.home', 
      url: '/home', 
      views:{ 'body-bottom-view@gui.wan': stateUtils.createViewSet('body-bottom-view@gui.wan', 'modules/fgw.wan/fgw.wan.home', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.WAN.HOME" | translate }}' }
   },
   { name: 'gui.wan.statistics', 
      url: '/statistics', 
      views:{ 'body-bottom-view@gui.wan': stateUtils.createViewSet('body-bottom-view@gui.wan', 'modules/fgw.wan/fgw.wan.statistics', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.WAN.STATISTICS" | translate }}' }
   },
   // LAN
   { name: 'gui.lan',
      url:  '/lan',
      views:{ 'body-view@':{
         template:('<div class="fgw-page-title clearfix">'+
            '<div class="pull-left"><h1><i class="icon fgw-lan"></i><span data-translate="TEXT.COMMON.TITLE.LAN"></span><span data-translate="TEXT.COMMON.SUBTITLE.LAN"></span></h1></div>'+
               '<div class="pull-right" data-ng-if="false"></div>'+
            '</div>'+
            '<div class="fgw-page-content" fgw-resize="content">'+
               '<nav class="fgw-main-tabs">'+
                  '<ul class="nav nav-tabs">'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.lan.home" data-translate="TEXT.COMMON.TABS.CHARACTERISTICS"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.lan.devices" data-translate="TEXT.COMMON.TABS.DEVICES"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.lan.statistics" data-translate="TEXT.COMMON.TABS.STATISTICS"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.lan.staticleases" data-translate="TEXT.COMMON.TABS.STATICLEASES"></a></li>'+
                  '</ul>'+
               '</nav>'+
               '<div class="body-bottom-view" data-ui-view="body-bottom-view"></div>'+
            '</div>')

      }},
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.LAN" | translate }}', ncyBreadcrumbParent: 'fgw.home' },
      redirectTo: 'gui.lan.home'
   },
   { name: 'gui.lan.home', 
      url: '/home', 
      views:{ 'body-bottom-view@gui.lan': stateUtils.createViewSet('body-bottom-view@gui.lan', 'modules/fgw.lan/fgw.lan.home', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.LAN.HOME" | translate }}' }
   },
   { name: 'gui.lan.devices', 
      url: '/devices', 

      views:{ 'body-bottom-view@gui.lan': stateUtils.createViewSet('body-bottom-view@gui.lan', 'modules/fgw.lan/fgw.lan.devices', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.LAN.DEVICES" | translate }}' }
   },
   { name: 'gui.lan.statistics', 
      url: '/statistics', 
      views:{ 'body-bottom-view@gui.lan': stateUtils.createViewSet('body-bottom-view@gui.lan', 'modules/fgw.lan/fgw.lan.statistics', false, true) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.LAN.STATISTICS" | translate }}' }
   },
   { name: 'gui.lan.staticleases', 
      url: '/staticleases', 
      views:{ 'body-bottom-view@gui.lan': stateUtils.createViewSet('body-bottom-view@gui.lan', 'modules/fgw.lan/fgw.lan.staticleases', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.LAN.STATICLEASES" | translate }}' }
   },
   // Wi-fi
   { name: 'gui.wifi', 
      url: '/wifi',
      views:{ 'body-view@':{
         template:('<div class="fgw-page-title clearfix">'+
            '<div class="pull-left"><h1><i class="icon fgw-wifi"></i><span data-translate="TEXT.COMMON.TITLE.WIFI"></span></h1></div>'+
               '<div class="pull-right" ng-if="false"></div>'+
            '</div>'+
            '<div class="fgw-page-content" fgw-resize="content">'+
               '<nav class="fgw-main-tabs">'+
                  '<ul class="nav nav-tabs">'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.wifi.home" data-translate="TEXT.COMMON.TABS.CHARACTERISTICS"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.wifi.macfilter" data-translate="TEXT.COMMON.TABS.MACFILTER"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.wifi.devices" data-translate="TEXT.COMMON.TABS.DEVICES"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.wifi.statistics" data-translate="TEXT.COMMON.TABS.STATISTICS"></a></li>'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.wifi.neighbours24" data-translate="TEXT.COMMON.TABS.NEIGHBOURS24"></a></li>'+
                     '<li data-ng-if="$root.session2.is5GHzWifiSupported" data-ui-sref-active="active"><a data-ui-sref="gui.wifi.neighbours5" data-translate="TEXT.COMMON.TABS.NEIGHBOURS5"></a></li>'+
                  '</ul>'+
               '</nav>'+
            '<div class="body-bottom-view" data-ui-view="body-bottom-view"></div>'+
         '</div>')
      }},
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.WIFI" | translate }}', ncyBreadcrumbParent: 'fgw.home' },
      redirectTo: 'gui.wifi.home'
   },
   { name: 'gui.wifi.home', 
      url: '/home', 
      views:{ 'body-bottom-view@gui.wifi': stateUtils.createViewSet('body-bottom-view@gui.wifi', 'modules/fgw.wifi/fgw.wifi.home', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.WIFI.HOME" | translate }}' }
   },
   { name: 'gui.wifi.macfilter', 
      url: '/macfilter', 
      views:{ 'body-bottom-view@gui.wifi': stateUtils.createViewSet('body-bottom-view@gui.wifi', 'modules/fgw.wifi/fgw.wifi.macfilter', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.WIFI.MACFILTER" | translate }}' }
   },
   { name: 'gui.wifi.devices', 
      url: '/devices', 
      views:{ 'body-bottom-view@gui.wifi': stateUtils.createViewSet('body-bottom-view@gui.wifi', 'modules/fgw.wifi/fgw.wifi.devices', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.WIFI.DEVICES" | translate }}' }
   },
   { name: 'gui.wifi.statistics', 
      url: '/statistics', 
      views:{ 'body-bottom-view@gui.wifi': stateUtils.createViewSet('body-bottom-view@gui.wifi', 'modules/fgw.wifi/fgw.wifi.statistics', false, true) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.WIFI.STATISTICS" | translate }}' }
   },
   { name: 'gui.wifi.neighbours24', 
      url: '/neighbours24', 
      resolve:{ stateContext: ['$stateParams', function($stateParams){ return { context: 'wifi24' }}] },
      views:{ 'body-bottom-view@gui.wifi': stateUtils.createViewSet('body-bottom-view@gui.wifi', 'modules/fgw.wifi/fgw.wifi.neighbours', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.WIFI.NEIGHBOURS" | translate }}' }
   },
   { name: 'gui.wifi.neighbours5', 
      url: '/neighbours5', 
      resolve:{ stateContext: ['$stateParams', function($stateParams){ return { context: 'wifi5' }}] },
      views:{ 'body-bottom-view@gui.wifi': stateUtils.createViewSet('body-bottom-view@gui.wifi', 'modules/fgw.wifi/fgw.wifi.neighbours', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.WIFI.NEIGHBOURS" | translate }}' }
   },
   // Voice
   { name: 'gui.voice', 
      url: '/voice', 
      views:{ 'body-view@':{
         template:('<div class="fgw-page-title clearfix">'+
         '<div class="pull-left"><h1><i class="icon fgw-rdis"></i><span data-translate="TEXT.COMMON.TITLE.VOICE"></span></h1></div>'+
            '<div class="pull-right" data-ng-if="false"></div>'+
         '</div>'+
         '<div class="fgw-page-content" fgw-resize="content">'+
               '<nav class="fgw-main-tabs">'+
                  '<ul class="nav nav-tabs">'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.voice.home" data-translate="TEXT.COMMON.TABS.CHARACTERISTICS"></a></li>'+
                  '</ul>'+
               '</nav>'+
            '<div class="body-bottom-view" data-ui-view="body-bottom-view"></div>'+
         '</div>')
      }},
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.VOICE" | translate }}', ncyBreadcrumbParent: 'fgw.home' },
      redirectTo: 'gui.voice.home'
   },
   { name: 'gui.voice.home', 
      url: '/home', 
      views:{ 'body-bottom-view@gui.voice': stateUtils.createViewSet('body-bottom-view@gui.voice', 'modules/fgw.voice/fgw.voice.home', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.VOICE" | translate }}' }
   },
   { name: 'gui.tv', 
      url: '/tv',
      views:{ 'body-view@':{
         template:('<div class="fgw-page-title clearfix">'+
            '<div class="pull-left"><h1><i class="icon fgw-television"></i><span data-translate="TEXT.COMMON.TITLE.TV"></span></h1></div>'+
               '<div class="pull-right" data-ng-if="false"></div>'+
            '</div>'+
            '<div class="fgw-page-content" fgw-resize="content">'+
               '<nav class="fgw-main-tabs">'+
                  '<ul class="nav nav-tabs">'+
                     '<li data-ui-sref-active="active"><a data-ui-sref="gui.tv.home" data-translate="TEXT.COMMON.TABS.CHARACTERISTICS"></a></li>'+
                  '</ul>'+
               '</nav>'+
            '<div class="body-bottom-view" data-ui-view="body-bottom-view"></div>'+
         '</div>')
      }},
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.TV" | translate }}', ncyBreadcrumbParent: 'fgw.home' },
      redirectTo: 'gui.tv.home'
   },
   { name: 'gui.tv.home', 
      url: '/home', 
      views:{ 'body-bottom-view@gui.tv': stateUtils.createViewSet('body-bottom-view@gui.tv', 'modules/fgw.tv/fgw.tv.home', false, false) },
      data: { ncyBreadcrumbLabel: '{{:: "TEXT.FGW.NAVIGATION.TV" | translate }}' }
   },
   {name:'gui.dummy',url:'/gui/dummy',views:{}}];
};// ::bootstrap::stateTree

return module;
});
