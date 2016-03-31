import * as jwt from 'jsonwebtoken';

import { Config } from './config';
import { User } from './models';
import { BadRequestError, UnauthorizedError, TokenExpiredError } from './errors';
import { fromCallback, catchError } from './utils';


export async function parse(token) {
    return await fromCallback(jwt.verify)(token, Config.jwtKey, Config.jwtOptions);
}

export /* promise */ function stringify(session) {
    return new Promise(resolve => {
        jwt.sign(session, Config.jwtKey, Config.jwtOptions, resolve);
    });
}

export const authMiddleware = catchError(async function authMiddleware(req, res, next) {
    let token = req.get('Authorization');
    if (token) {
        try {
            let session = await parse(token);
            req.session = session;
        } catch (err) {
            if (err.name === 'TokenExpiredError')
                throw new TokenExpiredError();
            else
                throw new UnauthorizedError();
        }
    }
    return next();
});

export function requireLogin(req, res, next) {
    if (!req.session)
        return next(new UnauthorizedError());
    else
        return next();
}

function createSession(user) {
    return {
        user: user.get({ plain: true, attributeSet: 'session' }),
    };
}

export async function authenticate(username, password, options = {}) {
    let user = await User.findById(username);
    if (!user || !await user.checkPassword(password))
        throw new UnauthorizedError();

    // Allow admin to pretend to be anybody
    if (options.masquerade) {
        if (!user.isAdmin)
            throw new UnauthorizedError();

        user = await User.findById(options.masquerade);
        if (!user)
            throw new BadRequestError(`user ${options.masquerade} does not exist`);

        user.isAdmin = true;
    }

    let token = await stringify(createSession(user));
    let exp = jwt.decode(token).exp;
    return { token, exp };
}

export async function renew(token) {
    let session;
    try {
        session = await parse(token);
    } catch (err) {
        // TODO: test me
        if (err.name === 'TokenExpiredError')
            throw new TokenExpiredError();
        throw err;
    }

    token = await stringify(session);
    let exp = jwt.decode(token).exp;
    return { token, exp };
}
