import express from 'express';
import { init } from '../controllers/home-controller';

const homeRoute = express.Router();

homeRoute.get('/', init);
homeRoute.get('/home', init);

export { homeRoute };