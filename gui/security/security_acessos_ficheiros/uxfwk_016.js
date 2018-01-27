'use strict';
define(['angularAMD'], function uxfwk_collapse (angularAMD){

angularAMD.provider('$collapse1', function() {

    var defaults = this.defaults = {
      animation: 'am-collapse',
      disallowToggle: false,
      allowMultiple: true,
      activeClass: 'in',
      startCollapsed: true
    };

    var controller = this.controller1 = function($scope, $element, $attrs) {
      var self = this;

      // Attributes options
      self.$options = angular.copy(defaults);
      angular.forEach(['animation', 'disallowToggle', 'activeClass', 'startCollapsed'], function (key) {
        if(angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });

      self.$toggles = [];
      self.$targets = [];

      self.$viewChangeListeners = [];

      self.$registerToggle = function(element) {
        self.$toggles.push(element);
      };
      self.$registerTarget = function(element) {
        self.$targets.push(element);
      };

      self.$targets.$active = 0;//!self.$options.startCollapsed ? 0 : -1;
      self.$setActive = $scope.$setActive = function(value) {
        self.$targets.$active = value;
        /*
        if(!self.$options.disallowToggle) {
          self.$targets.$active = self.$targets.$active === value ? -1 : value;
        } else {
          self.$targets.$active = value;
        }
        */
        self.$viewChangeListeners.forEach(function(fn) {
          fn();
        });
      };

    };

    this.$get = function() {
      var $collapse = {};
      $collapse.defaults = defaults;
      $collapse.controller = controller;
      return $collapse;
    };

  });

  angularAMD.directive('uxfwkCollapse', function($window, $animate, $collapse1) {

    var defaults = $collapse1.defaults;

    return {
      restrict: "A",
      require: ['?ngModel', 'uxfwkCollapse'],
      controller: ['$scope', '$element', '$attrs', $collapse1.controller],
      link: function postLink(scope, element, attrs, controllers) {

        //console.log(controllers);
        var ngModelCtrl = controllers[0];
        var uxfwkCollapseCtrl = controllers[1];

        element.addClass('uxfwk-collapse');
        if(ngModelCtrl) {

          // Update the modelValue following
          uxfwkCollapseCtrl.$viewChangeListeners.push(function() {
            ngModelCtrl.$setViewValue(uxfwkCollapseCtrl.$targets.$active);
          });

          // modelValue -> $formatters -> viewValue
          ngModelCtrl.$formatters.push(function(modelValue) {
            // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
            if (uxfwkCollapseCtrl.$targets.$active !== modelValue * 1) {
              uxfwkCollapseCtrl.$setActive(modelValue * 1);
            }
            return modelValue;
          });

        }

      }
    };

  });

  angularAMD.directive('uxfwkCollapseToggle', function() {

    return {
      restrict: "A",
      require: ['^?ngModel', '^uxfwkCollapse'],
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var uxfwkCollapseCtrl = controllers[1];

        // Add base attr
        element.attr('data-toggle', 'collapse');

        // Push pane to parent uxfwkCollapse controller
        uxfwkCollapseCtrl.$registerToggle(element);
        element.on('click', function() {
          if( element.parent().hasClass('fx-first') ){
            angular.element(document.getElementsByClassName('uxfwk-form')[0]).toggleClass('fx-first-is-collapsed');
          }
          element.parent().toggleClass("collapsed");
          var index = attrs.uxfwkCollapseToggle || uxfwkCollapseCtrl.$toggles.indexOf(element);
          uxfwkCollapseCtrl.$setActive(index * 1);
          scope.$apply();
        });

      }
    };

  });

  angularAMD.directive('uxfwkCollapseTarget', function($animate) {

    return {
      restrict: "A",
      require: ['^?ngModel', '^uxfwkCollapse'],
      // scope: true,
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var uxfwkCollapseCtrl = controllers[1];

        // Add base class
        element.addClass('collapse');

        // Add animation class
        if(uxfwkCollapseCtrl.$options.animation) {
          element.addClass(uxfwkCollapseCtrl.$options.animation);
        }

        // Push pane to parent uxfwkCollapse controller
        uxfwkCollapseCtrl.$registerTarget(element);

        function render() {
          var index = uxfwkCollapseCtrl.$targets.indexOf(element);
          var active = uxfwkCollapseCtrl.$targets.$active;

          var toggles =  uxfwkCollapseCtrl.$toggles[index];
          var caret = toggles.find('i');

          if ( index === active ){
            $animate[element.hasClass(uxfwkCollapseCtrl.$options.activeClass) ? 'removeClass' : 'addClass'](element, uxfwkCollapseCtrl.$options.activeClass);
            $animate[toggles.find('i').hasClass('collapse') ? 'removeClass' : 'addClass'](caret, 'collapse');
          }

          if (element.hasClass(uxfwkCollapseCtrl.$options.activeClass)){
            //$animate[toggles.find('i').hasClass('collapse') ? 'removeClass' : 'addClass'](caret, 'collapse');
            $animate[toggles.find('i').addClass('collapse')];
          }
          else
            $animate[toggles.find('i').removeClass('collapse')];

        }

        uxfwkCollapseCtrl.$viewChangeListeners.push(function() {
          render();
        });
        render();

      }
    };
  });
});

