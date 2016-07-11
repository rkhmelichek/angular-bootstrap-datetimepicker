//jshint strict: false
module.exports = function(config) {
  config.set({
    basePath: '..',

    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/moment/moment.js',
      'bower_components/moment-timezone/builds/moment-timezone-with-data.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',

      'bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js',
      'src/datetimepicker.directive.js',

      'test/*.spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],  //, 'Firefox'

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
    ]
  });
};
