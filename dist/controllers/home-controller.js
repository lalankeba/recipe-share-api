"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const init = (req, res) => {
    const message = `Recipe sharing service is up and running...`;
    logger_1.default.info(message);
    res.status(200).json({ message: message });
};
exports.init = init;
