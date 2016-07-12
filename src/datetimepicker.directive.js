'use strict';

var m = angular.module('bootstrap.datetimepicker', []);

// Default configuration options.
m.value('bootstrapDateTimePickerConfig', {
  keepInvalid: false
});

m.directive('bootstrapDatetimepicker', ['$parse', '$window', 'bootstrapDateTimePickerConfig', function($parse, $window, bootstrapDateTimePickerConfig) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '=',
      baseDate: '=',
      bootstrapDatetimepicker: '='
    },
    priority: 1,
    link: function(scope, element, attrs, ngModel) {
      var config = angular.copy(bootstrapDateTimePickerConfig);

      ngModel.$render = function() {
        var date = ngModel.$modelValue;
        if (!angular.isDefined(date)) {
          return;
        }
        if (date !== null && !angular.isDate(date)) {
          throw new Error('ngModel must be a Date object.');
        }
        if (!element.is(':focus') && !invalidInput()) {
          element.data('DateTimePicker').date(date);
        }
        if (date === null) {
          resetInput();
        }
      };

      scope.$watch('ngModel', function() {
        ngModel.$render();
      }, true);

      // Dynamically update the datetimepicker options...
      scope.$watch('bootstrapDatetimepicker', function() {
        element.data('DateTimePicker').options(angular.extend(config, scope.bootstrapDatetimepicker ? scope.bootstrapDatetimepicker : {}));
        ngModel.$render();
      }, true);

      // Initialize widget.
      element.datetimepicker(
        angular.extend(config, scope.bootstrapDatetimepicker ? scope.bootstrapDatetimepicker : {})
      );

      var resetInput = function(){
        element.data('DateTimePicker').date(null);
      };

      var invalidInput = function() {
        return element.val().trim() && ngModel.$modelValue === null;
      };

      element.on('$destroy', function() {
          element.data('DateTimePicker').destroy();
      });

      if (element.is('input')) {
        ngModel.$parsers.unshift(function(viewValue) {
          // We let the widget handle all input changes, which we listen for via the 'dp.change' event.
          // Return the value to update ngModel with.
          return element.data('DateTimePicker').date().toDate();
        });

        // Widget already updates the input element value, disable the $formatters.
        ngModel.$formatters = [];
        ngModel.$validators.datetime = function(modelValue) {
          return (!attrs.required && !element.val().trim()) ? true : modelValue !== null;
        };
      }

      element.on('dp.change', function (e) {
        scope.$evalAsync(function() {
          scope.ngModel = e.date.toDate();
        });
      });
    }
  };
}]);
