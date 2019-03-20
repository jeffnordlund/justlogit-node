JustLog.IT Node Library
=====================
Simple library that wraps the JustLog.IT logging methods to simplify implementation in
your applciation.

## Installation
npm install justlogit --save

## Requirements
Make sure you have set up a JustLog.IT account and set up your application for logging.  You
will need to the application logging token to run this library.

## Methods
logError(obj);

logPerformance(method, timing, [user], [details]);

logEvent(name, description, [user]);

logInformation(method, details, [user]);


## Usage
var Logger = require('justlogit');

var logger = new Logger('<logging token>');

var errorObject = {};

errorObject.message = '';

errorObject.stack = '';

errorObject.details = '';

errorObject.user = ''; // optional

logger.logError(errorObject);
