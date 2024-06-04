"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const rate_limit_1 = __importDefault(require("./config/rate-limit"));
const request_logger_1 = __importDefault(require("./middleware/request-logger"));
const home_route_1 = __importDefault(require("./routes/home-route"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const not_found_handler_1 = __importDefault(require("./middleware/not-found-handler"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./config/logger"));
const auth_route_1 = __importDefault(require("./routes/auth-route"));
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || '3000', 10);
const mongoUri = process.env.MONGO_URI || '';
app.use(rate_limit_1.default);
app.use(request_logger_1.default);
app.use(express_1.default.json());
app.use('/', home_route_1.default);
app.use('/auth', auth_route_1.default);
app.use(not_found_handler_1.default);
app.use(error_handler_1.default);
const startServer = async () => {
    try {
        logger_1.default.info('Connecting to database...');
        await mongoose_1.default.connect(mongoUri);
        logger_1.default.info('Connected to database');
        app.listen(port, () => {
            logger_1.default.info(`App is running on port: ${port}`);
        });
    }
    catch (error) {
        logger_1.default.error('Error connecting with db ', error);
        process.exit(1);
    }
};
startServer();
