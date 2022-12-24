
'use strict';

const util = require('util');
const winston = require('winston');
const morgan = require('morgan');
const { Papertrail } = require('winston-papertrail');

const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
const ENVIRONMENT = process.env.NODE_ENV || "development";
const PROGRAM_LOG_FILE = process.env.LOG_FILE || "aria2-backend-app.log";
const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";

const winstonPapertrail = new Papertrail({
    host: "logs2.papertrailapp.com",
    port: 22947
});

const utilFormat = (enableColor) => {
    const printFormat = winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level} ${message}`);
    const format = winston.format.combine(winston.format.timestamp({ format: TIMESTAMP_FORMAT }), {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transform: (info) => {
            const args = info[Symbol.for('splat')] || [];
            info.message = util.formatWithOptions({ colors: enableColor }, info.message, ...args);
            info.level = `[${info.level.toUpperCase()}]`;
            return info;
        },
    });
    return enableColor
        ? winston.format.combine(format, winston.format.colorize(), printFormat)
        : winston.format.combine(format, printFormat);
};

const logger = winston.createLogger({
    level: LOG_LEVEL,

    transports: [
        new winston.transports.Console({
            format: utilFormat(true),
        }),
        new winston.transports.File({
            filename: PROGRAM_LOG_FILE,
            format: utilFormat(false),
        }),
    ],
});

logger.add(winstonPapertrail);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.log = (message, ...args) => logger.info(message, ...args);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.info = (message, ...args) => logger.info(message, ...args);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.warn = (message, ...args) => logger.warn(message, ...args);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (message, ...args) => logger.error(message, ...args);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.debug = (message, ...args) => logger.debug(message, ...args);

const addNonEmptyValue = (str, result) => {
    if(str === undefined || `${str}`.trim().length === 0) {
        result.push("???");
    }
    result.push(str);
}

const morganMiddleware = morgan(function (tokens, req, res) {
    const result = [];
    addNonEmptyValue(req.headers['x-forwarded-for'] || req.socket.remoteAddress, result);
    addNonEmptyValue(tokens.method(req, res), result);
    addNonEmptyValue(tokens.url(req, res), result);
    addNonEmptyValue(tokens.status(req, res), result);
    addNonEmptyValue(tokens.res(req, res, 'content-length'), result);
    addNonEmptyValue('-', result);
    addNonEmptyValue(tokens['response-time'](req, res), result);
    addNonEmptyValue('ms', result);

    let msg = result.join(' ');

    logger.http(msg);
    //return msg;
    return null;
});

module.exports = {
    logger: logger,
    morganMiddleware: morganMiddleware
};

