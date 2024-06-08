"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const user_model_1 = __importDefault(require("../models/user-model"));
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};
const configurePassport = (passport) => {
    passport.use(new passport_jwt_1.Strategy(opts, async (jwtPayload, done) => {
        try {
            const userDoc = await user_model_1.default.findOne({ email: jwtPayload.email });
            if (userDoc) {
                const user = userDoc.toJSON();
                return done(null, user);
            }
            return done(null, false);
        }
        catch (err) {
            console.log(err);
            return done(err, false);
        }
    }));
};
exports.default = configurePassport;
