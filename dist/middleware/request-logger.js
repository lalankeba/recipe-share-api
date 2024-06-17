"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
const requestLogger = (req, res, next) => {
    const ipAddress = getIpAddress(req);
    logger_1.default.info(`From: ${ipAddress} ${req.method} ${req.url}`);
    next();
};
const getIpAddress = (req) => {
    let ipAddress = req.ip || '';
    if (req.headers['x-forwarded-for']) {
        const xForwardedFor = req.headers['x-forwarded-for'];
        ipAddress = xForwardedFor.split(',').shift()?.trim() || ipAddress;
    }
    else if (req.socket && req.socket.remoteAddress) {
        ipAddress = req.socket.remoteAddress;
    }
    // Handle IPv6-mapped IPv4 addresses
    if (ipAddress.startsWith('::ffff:')) {
        ipAddress = ipAddress.split('::ffff:')[1];
    }
    return ipAddress;
};
exports.default = requestLogger;
