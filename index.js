var util = require('util');
var growly = require('growly');
var path = require('path');

var MSG_SUCCESS = '%d tests passed in %s.';
var MSG_FAILURE = '%d/%d tests failed in %s.';
var MSG_ERROR = '';
var MSG_SKIPPED = '\n(skipped %d)'

var OPTIONS = {
  success: {
    dispname: 'Success',
    title: 'PASSED - %s',
    icon: path.join(__dirname, 'images/success.png')
  },
  failed: {
    dispname: 'Failure',
    title: 'FAILED - %s',
    icon: path.join(__dirname, 'images/failed.png')
  },
  error: {
    dispname: 'Aborted',
    title: 'ERROR - %s',
    icon: path.join(__dirname, 'images/error.png')
  }
};


var GrowlReporter = function(helper, logger, config) {
  var log = logger.create('reporter.growl');

  var optionsFor = function(type, browser) {
    var prefix = config && config.prefix ? config.prefix : '';
    return helper.merge(OPTIONS[type], {title: prefix + util.format(OPTIONS[type].title, browser)});
  };

  var appendSkipped = function(results, msg) {
    if (results.skipped === 0)
      return msg;
    else
      return msg += util.format(MSG_SKIPPED, results.skipped)
  }

  growly.register('Karma', '', [], function(error) {
    var warning = 'No running version of GNTP found.\n' +
                    'Make sure the Growl service is installed and running.\n' +
                  'For more information see https://github.com/theabraham/growly.';
    if (error) {
      log.warn(warning);
    }
  });

  this.adapters = [];

  this.onBrowserComplete = function(browser) {
    var results = browser.lastResult;
    var time = helper.formatTimeInterval(results.totalTime);
    var msg;

    if (results.disconnected || results.error) {
      return growly.notify(MSG_ERROR, optionsFor('error', browser.name));
    }

    if (results.failed) {
      msg = appendSkipped(results, util.format(MSG_FAILURE, results.failed, results.total - results.skipped, time));
      return growly.notify(msg, optionsFor('failed', browser.name));
    }

    msg = appendSkipped(results, util.format(MSG_SUCCESS, results.success, time));
    growly.notify(msg, optionsFor('success', browser.name));
  };
};

GrowlReporter.$inject = ['helper', 'logger','config.growlReporter'];

// PUBLISH DI MODULE
module.exports = {
  'reporter:growl': ['type', GrowlReporter]
};
