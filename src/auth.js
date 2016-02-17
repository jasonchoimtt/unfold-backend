import * as jwt from 'jsonwebtoken';

import { Config } from './config';
import { User } from './models';
import { UnauthorizedError, TokenExpiredError } from './errors';
import { fromCallback } from './utils';


export async function parse(token) {
    return await fromCallback(jwt.verify)(token, Config.jwtKey, Config.jwtOptions);
}

export /* promise */ function stringify(session) {
    return new Promise(resolve => {
        jwt.sign(session, Config.jwtKey, Config.jwtOptions, resolve);
    });
}

export function authMiddleware(req, res, next) {
    let token = req.get('Authorization');
    if (token) {
        try {
            let session = parse(token);
            req.session = session;
        } catch (err) {
            if (err.name === 'TokenExpiredError')
                return next(new TokenExpiredError());
            else
                return next(new UnauthorizedError());
        }
    }
    return next();
}

export function requireLogin(req, res, next) {
    if (!req.session)
        return next(new UnauthorizedError());
    else
        return next();
}

function createSession(user) {
    return {
        user: user.toJSON(),
    };
}

export async function authenticate(username, password) {
    let user = await User.findById(username);
    if (!user || !await user.checkPassword(password))
        throw new UnauthorizedError();
    let token = await stringify(createSession(user));
    let exp = jwt.decode(token).exp;
    return { token, exp };
}

export async function renew(token) {
    let session = await parse(token);
    token = await stringify(session);
    let exp = jwt.decode(token).exp;
    return { token, exp };
}
