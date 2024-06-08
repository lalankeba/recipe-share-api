import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import IJwtPayload from '../interfaces/i-jwt-payload';
import userModel, { UserDocument } from '../models/user-model';
import IUser from '../interfaces/i-user';

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
};

const configurePassport = (passport: PassportStatic) => {
    passport.use(
        new JwtStrategy(opts, async (jwtPayload: IJwtPayload, done) => {
            try {
                const userDoc: UserDocument | null = await userModel.findOne({ email: jwtPayload.email });
                if (userDoc) {
                    const user: IUser = userDoc.toJSON();
                    return done(null, user);
                }
                return done(null, false);
            } catch (err) {
                console.log(err);
                return done(err, false);
            }
        })
    );
}

export default configurePassport;