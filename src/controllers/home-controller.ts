import { Request, Response } from 'express';
import logger from '../config/logger';

const init = (req: Request, res: Response) => {
    const message: string = `Recipe sharing service is up and running...`;
    logger.info(message);
    res.status(200).json({ message: message });
}

export { init };