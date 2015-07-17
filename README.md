# karma-growl-reporter

> Report test results using [Growl](http://growl.info/).

## Installation

**At first, make sure you have Growl for [Mac][1] / [Windows][2] / [Linux][3].**
This plugin uses [growly](https://github.com/theabraham/growly), which uses the Growl Network Transport Protocol (GNTP), which was implemented in Growl since version 1.3, so you must have an appropriate version of Growl installed for this plugin to work.

The easiest way is to keep `karma-growl-reporter` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-growl-reporter": "~0.1"
  }
}
```

You can simple do it by:
```bash
npm install karma-growl-reporter --save-dev
```

###

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['progress', 'growl'],
    
    /* Optionally add the following parameters */
    growlReporter: {
      prefix: 'Production ',  // Prefix to add to the start of notifications. Defaults to nothing
      suppressRepeatedSuccess: true,  // If true, will suppress success messages when following a 
                                      // previous successful run. Defaults to false;
    },
  });
};
```

You can pass list of reporters as a CLI argument too:
```bash
karma start --reporters growl,dots
```

#### Message Prefix (Optional)
Adds a prefix to the growl message to help differentiate which tests have passed or failed. This is especially usefull if you are running multiple auto-watch instances of karma in parallel.

**karma-unit.conf**
```javascript
module.exports = function(config){
    config.set({
        reporters: ['progress','growl'],
        growlReporter:{
            prefix:'UNIT TESTS-'
        }
   });
};
```
**karma-production.conf**
```javascript
module.exports = function(config){
    config.set({
        reporters: ['progress','growl'],
        growlReporter:{
            prefix:'PRODUCTION TESTS-'
        }
   });
};
```

![screen shot 2013-08-24 at 2 37 18 pm](https://f.cloud.github.com/assets/4082216/1021228/e59eae5c-0ced-11e3-8e2f-c726911368f5.png)


----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
[1]: http://growl.info/
[2]: http://www.growlforwindows.com/
[3]: http://karmanebula.com/technically-borked/2012/1/1/install-growl-for-linux-and-gntp-send-on-ubuntu-1110.html
