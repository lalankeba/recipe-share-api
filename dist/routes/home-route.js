"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const home_controller_1 = require("../controllers/home-controller");
const homeRoute = express_1.default.Router();
homeRoute.get('/', home_controller_1.init);
homeRoute.get('/home', home_controller_1.init);
exports.default = homeRoute;
