import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    let ipAddress = getIpAddress(req);
    logger.info(`From: ${ipAddress} ${req.method} ${req.url}`);
    next();
}

const getIpAddress = (req: Request) => {
    let ipAddress: string = req.ip || '';

    if (req.headers['x-forwarded-for']) {
        const xForwardedFor = req.headers['x-forwarded-for'] as string;
        ipAddress = xForwardedFor.split(',').shift()?.trim() || ipAddress;
    } else if (req.socket && req.socket.remoteAddress) {
        ipAddress = req.socket.remoteAddress;
    }
    
    // Handle IPv6-mapped IPv4 addresses
    if (ipAddress.startsWith('::ffff:')) {
        ipAddress = ipAddress.split('::ffff:')[1];
    }
    return ipAddress;
}

export default requestLogger;