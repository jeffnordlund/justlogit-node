"use strict";

const https = require('https');

const ROOT_LOGGING_HOST = 'addto.justlog.it';
const ROOT_LOGGING_PATH = '/v1/log/';

class HttpInterface {

    static async get(loggingtoken, logtype, querystring) {
        return new Promise(async (success, failure) => {
            try {
                const path = ROOT_LOGGING_PATH + loggingtoken + '/' + logtype + '?' + querystring;
                const options = {
                    hostname: ROOT_LOGGING_HOST,
                    path: path,
                    port: 443
                }
                const request = https.get(options, (res) => {
                    let response = '',
                        status = res.statusCode;

                    res.on('data', (d) => {
                        response += d;
                    });

                    res.on('end', () => {
                        if (status === 200 || status === 204) {
                            success(null);
                        }
                        else {
                            // call failed
                            throw 'Logging call failed';
                        }
                    });
                });

                request.on('error', (err) => {
                    // failure(err);
                    throw err;
                });
            }
            catch(e) {
                failure(e);
            }
        });
    }

    static async post(loggingtoken, logtype, data) {
        return new Promise(async (success, failure) => {
            try {
                let json = (typeof data === 'string') ? data : JSON.stringify(data);
                const path = ROOT_LOGGING_PATH + loggingtoken + '/' + logtype;
                
                const options = {
                    hostname: ROOT_LOGGING_HOST,
                    path: path,
                    port: 443,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length' : json.length
                    }
                };
                
                const request = https.request(options, (res) => {
                    let response = '',
                        status = res.statusCode;

                    res.on('data', (d) => {
                        response += d;
                    });

                    res.on('end', () => {
                        if (status === 200 || status === 204) {
                            success(null);
                        }
                        else {
                            // call failed
                            throw 'Logging call failed';
                        }
                    });
                });

                request.on('error', (err) => {
                    // failure(err);
                    throw err;
                });

                request.write(json);
                request.end();
            }
            catch(e) {
                failure(e);
            }
        });
    }
}

module.exports = HttpInterface;