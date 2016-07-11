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
        if (!date) {
          throw new Error('No ngModel value provided.');
        }
        if (!element.is(':focus') && !invalidInput()) {
          element.data('DateTimePicker').date(date);
        }
        if (date === null) {
          resetInput();
        }

        // TODO: The widget also updates the input element value (previously, it didn't format it according to the chosen timezone).
        //element.val(ngModel.$viewValue || '');
      };

      scope.$watch('ngModel', function() {
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
          // Widget has input change listener, but angular seems to stop propagation, so we update the date here...
          element.data('DateTimePicker').date(viewValue);

          // Return the value to update ngModel with.
          return element.data('DateTimePicker').date().toDate();
        });

        // TODO: Widget already updates the input element value...
        // The formatters are applied in reverse order, so add ours last.
        ngModel.$formatters.push(function(date) {
          // Format model with the configured timezone.
          var tz = element.data('DateTimePicker').options().timeZone;
          if (tz) {
            return moment(date).tz(tz).format('MM/DD/YYYY h:mm A');
          }
          return moment(date).format('MM/DD/YYYY h:mm A');
        });
        ngModel.$validators.datetime = function(modelValue) {
          return (!attrs.required && !element.val().trim()) ? true : modelValue !== null;
        };
      }

      // TODO: Widget already updates the input element value...
      element.on('dp.change', function (e) {
        scope.$evalAsync(function() {
          var tz = element.data('DateTimePicker').options().timeZone;
          var value;
          if (tz) {
            value = e.date.tz(tz).format('MM/DD/YYYY h:mm A');
          } else {
            value = e.date.format('MM/DD/YYYY h:mm A');
          }
          ngModel.$setViewValue(value);
        });
      });
    }
  };
}]);
