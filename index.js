var util = require('util');
var growly = require('growly');
var path = require('path');

var MSG_SUCCESS = '%d tests passed in %s.';
var MSG_FAILURE = '%d/%d tests failed in %s.';
var MSG_ERROR = '';

var OPTIONS = {
  success: {
    dispname: 'Success',
    title: 'Success\n%s',
    icon: path.join(__dirname, 'images/success.png')
  },
  failed: {
    dispname: 'Failure',
    title: 'Failure\n%s',
    icon: path.join(__dirname, 'images/failed.png')
  },
  error: {
    dispname: 'Aborted',
    title: 'Error\n%s',
    icon: path.join(__dirname, 'images/error.png')
  },
  specFailed: {
    dispname: 'Spec Failed',
    title: 'Spec Failed\n%s',
    icon: path.join(__dirname, 'images/failed.png')
  }
};


var GrowlReporter = function(baseReporterDecorator, helper, logger, config, formatError) {
  var log = logger.create('reporter.growl');

  baseReporterDecorator(this);


  var optionsFor = function(type, browser) {
    var prefix = config && config.prefix ? config.prefix : '';
    return helper.merge(OPTIONS[type], {title: prefix + util.format(OPTIONS[type].title, browser)});
  };

  // Register w/ growl service.
  growly.register('Karma', '', [], function(error) {
    var warning = 'No running version of GNTP found.\n' +
	                'Make sure the Growl service is installed and running.\n' +
                  'For more information see https://github.com/theabraham/growly.';
    if (error) {
      log.warn(warning);
    }
  });

/*
  this.adapters = [function(msg) {
    growly.notify(msg, {title: 'Karma'});
  }];
  */
this.adapters = [];

  this.onBrowserComplete = function(browser) {
    var results = browser.lastResult;
    var time = helper.formatTimeInterval(results.totalTime);

    if (results.failed || results.error) {
      return growly.notify(util.format(MSG_FAILURE, results.failed, results.total, time),
          optionsFor('failed', browser.name));
    }

    growly.notify(util.format(MSG_SUCCESS, results.success, time), optionsFor('success',
        browser.name));
  };

  if (config.reportEachFailure){
    this.specFailure = function(browser, result) {
      var specName = result.suite.join(' ') + ' ' + result.description;
      var msg = util.format('%s: FAILED\n', specName);

      result.log.forEach(function(log) {
        msg += formatError(log, '\t');
      });

      growly.notify(msg, optionsFor('specFailed', browser.name));
    };
  }

};

GrowlReporter.$inject = ['baseReporterDecorator', 'helper', 'logger','config.growlReporter', 'formatError'];

// PUBLISH DI MODULE
module.exports = {
  'reporter:growl': ['type', GrowlReporter]
};
