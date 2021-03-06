'use strict';

describe('Bootstrap DateTimePicker', function() {
  beforeEach(module('bootstrap.datetimepicker'));

  describe('basic directive functionality on an input element', function() {
    it('requires use of ngModel', function() {
      inject(function($compile, $rootScope) {
        expect(function() {
          $compile("<input type='text' bootstrap-datetimepicker/>")($rootScope);
        }).toThrow();
      });
    });

    it('should update the datetimepicker date from the model', function() {
      inject(function($compile, $rootScope) {
        var date = new Date(2016, 0, 1);
        var element = $compile("<input type='text' bootstrap-datetimepicker ng-model='date'/>")($rootScope);
        $rootScope.$apply(function() {
          $rootScope.date = date;
        });
        expect(element.data('DateTimePicker').date().toDate()).toEqual(date);
      });
    });

    it('should update the model from the datetimepicker date', function() {
      inject(function($compile, $rootScope) {
        var date = new Date(2016, 0, 1);
        var element = $compile("<input type='text' bootstrap-datetimepicker ng-model='date'/>")($rootScope);
        $rootScope.$apply(function() {
          $rootScope.date = date;
        });
        element.data('DateTimePicker').date(date);
        expect($rootScope.date.getTime()).toEqual(date.getTime());
      });
    });

    it('should update the model and datetimepicker date from user input', function() {
      inject(function($compile, $rootScope) {
        var date = new Date(2016, 0, 1);
        var element = $compile("<input type='text' bootstrap-datetimepicker ng-model='date'/>")($rootScope);
        $rootScope.$apply(function() {
          $rootScope.date = date;
        });

        var inputMoment = moment("2016-01-01 10:10");
        element.val(inputMoment.format('MM/DD/YYYY h:mm A')).trigger('change');

        // Force $digest loop to run.
        $rootScope.$apply(function() {
        });
        expect(element.data('DateTimePicker').date().toDate()).toEqual(inputMoment.toDate());
        expect($rootScope.date.getTime()).toEqual(inputMoment.toDate().getTime());
      });
    });
  });

  describe('timezone functionality', function() {
    it('should update the datetimepicker date from the model', function() {
      inject(function($compile, $rootScope) {
        var options = {
          timeZone: 'Europe/London'
        };
        $rootScope.$apply(function() {
          $rootScope.options = options;
        });

        var date = moment.tz("2016-01-01 05:10", "America/New_York").toDate();
        var element = $compile("<input type='text' bootstrap-datetimepicker='options' ng-model='date'/>")($rootScope);
        $rootScope.$apply(function() {
          $rootScope.date = date;
        });
        expect(element.data('DateTimePicker').date().toDate()).toEqual(date);
        expect(element.val()).toEqual('01/01/2016 10:10 AM');
      });
    });

    it('should update the model from the datetimepicker date', function() {
      inject(function($compile, $rootScope) {
        var options = {
          timeZone: 'Europe/London'
        };
        $rootScope.$apply(function() {
          $rootScope.options = options;
        });

        var date = moment.tz("2016-01-01 05:10", "America/New_York").toDate();
        var element = $compile("<input type='text' bootstrap-datetimepicker='options' ng-model='date'/>")($rootScope);
        $rootScope.$apply(function() {
          $rootScope.date = date;
        });
        element.data('DateTimePicker').date(date);
        expect($rootScope.date.getTime()).toEqual(date.getTime());
        expect(element.val()).toEqual('01/01/2016 10:10 AM');
      });
    });

    it('should dynamically adjust the timezone based on init options', function() {
      inject(function($compile, $rootScope) {
        $rootScope.$apply(function() {
          $rootScope.options = {
            timeZone: 'Europe/London'
          };
        });

        var date = moment.tz("2016-01-01 05:10", "America/New_York").toDate();
        var element = $compile("<input type='text' bootstrap-datetimepicker='options' ng-model='date'/>")($rootScope);
        $rootScope.$apply(function() {
          $rootScope.date = date;
        });
        expect(element.data('DateTimePicker').date().toDate()).toEqual(date);
        expect($rootScope.date.getTime()).toEqual(date.getTime());
        expect(element.val()).toEqual('01/01/2016 10:10 AM');

        // We expect the datetime value formatting to change to reflect the new timezone.
        $rootScope.$apply(function() {
          $rootScope.options = {
            timeZone: 'America/New_York'
          };
        });
        expect(element.data('DateTimePicker').date().toDate()).toEqual(date);
        expect($rootScope.date.getTime()).toEqual(date.getTime());
        expect(element.val()).toEqual('01/01/2016 5:10 AM');

        // Update without changing reference.
        $rootScope.$apply(function() {
          $rootScope.options.timeZone = 'Europe/London';
        });
        expect(element.data('DateTimePicker').date().toDate()).toEqual(date);
        expect($rootScope.date.getTime()).toEqual(date.getTime());
        expect(element.val()).toEqual('01/01/2016 10:10 AM');
      });
    });
  });
});
