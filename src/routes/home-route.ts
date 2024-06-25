import express from 'express';
import { init } from '../controllers/home-controller';

const homeRoute = express.Router();

homeRoute.all('/', init);
homeRoute.all('/home', init);

export default homeRoute;