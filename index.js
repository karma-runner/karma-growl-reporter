var util = require('util');
var growly = require('growly');
var path = require('path');

var MSG_SUCCESS = '%d tests passed in %s.';
var MSG_FAILURE = '%d/%d tests failed in %s.\n\n%s';
var MAX_ERROR_MESSAGE_LENGTH = 50;
var MAX_FAILURE_MESSAGES = 7;
var MSG_ERROR = '';

var OPTIONS = {
  success: {
    dispname: 'Success',
    label: 'success',
    title: 'PASSED - %s',
    icon: path.join(__dirname, 'images/success.png')
  },
  newSuccess: {
    dispname: 'New Success',
    label: "new_success",
    title: 'PASSED - %s',
    icon: path.join(__dirname, 'images/success.png')
  },
  failed: {
    dispname: 'Failure',
    label: 'failure',
    title: 'FAILED - %s',
    icon: path.join(__dirname, 'images/failed.png')
  },
  error: {
    dispname: 'Aborted',
    label: 'aborted',
    title: 'ERROR - %s',
    icon: path.join(__dirname, 'images/error.png')
  }
};


var GrowlReporter = function(baseReporterDecorator, helper, logger, config) {
  var log = logger.create('reporter.growl');

  baseReporterDecorator(this);

  var optionsFor = function(type, browser) {
    var prefix = config && config.prefix ? config.prefix : '';
    return helper.merge(OPTIONS[type], {title: prefix + util.format(OPTIONS[type].title, browser)});
  };

  var allNotifications = Object.keys(OPTIONS).map(function(key) {
    return OPTIONS[key];
  });
  growly.register('Karma', '', allNotifications, function(error) {
    var warning = 'No running version of GNTP found.\n' +
	                'Make sure the Growl service is installed and running.\n' +
                  'For more information see https://github.com/theabraham/growly.';
    if (error) {
      log.warn(warning);
    }
  });

  var currentFailedResults = [];

  this.adapters = [];

  var lastResultWasSuccess = false;

  this.specFailure = function(browser, result) {
      console.log("specFailure");
      currentFailedResults.push(result);
  }

  function formatFailedResult(result) {
      var testName = result.suite.join("/") + ":" + result.description;
      var message = result.log[0].match(".*");
      if (message.length > MAX_ERROR_MESSAGE_LENGTH) {
          message = message.slice(0, MAX_ERROR_MESSAGE_LENGTH - 3) + "...";
      }
      return testName + "\n  " + message;

  }
  function formatManyFailedResults(failedResults) {
      var result = failedResults
          .splice(0, MAX_FAILURE_MESSAGES)
          .map(formatFailedResult).join("\n\n");
      if (failedResults.length > MAX_FAILURE_MESSAGES) {
          result += "\n\n ... and " + (failedResults.length - MAX_FAILURE_MESSAGES) + " more failures";
      }
      return result;

  }

  this.onBrowserComplete = function(browser) {
    var failedResults = currentFailedResults;
    currentFailedResults = [];
    var results = browser.lastResult;
    var time = helper.formatTimeInterval(results.totalTime);

    if (results.disconnected || results.error) {
      lastResultWasSuccess = false;
      return growly.notify(MSG_ERROR, optionsFor('error', browser.name));
    }

    if (results.failed) {
      lastResultWasSuccess = false;
      var failureMessages = formatManyFailedResults(failedResults);
      return growly.notify(util.format(MSG_FAILURE, results.failed, results.total, time, failureMessages),
          optionsFor('failed', browser.name));
    }
    var lastResult = lastResultWasSuccess;
    lastResultWasSuccess = true;
    if (lastResult) {
      return growly.notify(util.format(MSG_SUCCESS, results.success, time), optionsFor('success',
          browser.name));
    } else {
      return growly.notify(util.format(MSG_SUCCESS, results.success, time), optionsFor('newSuccess',
          browser.name));
    }

  };
};

GrowlReporter.$inject = ['baseReporterDecorator', 'helper', 'logger','config.growlReporter'];

// PUBLISH DI MODULE
module.exports = {
  'reporter:growl': ['type', GrowlReporter]
};
