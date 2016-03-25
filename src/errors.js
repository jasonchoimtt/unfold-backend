import _ from 'lodash';


export const defaultErrorMessage = 'Internal server error';

export function errorFactory(name, status = 500, message = defaultErrorMessage) {
    let ret = class extends Error {
        constructor(msg = message) {
            super(msg);
            this.name = name;
            this.status = status;
            this.message = msg;
            this.extras = null;
            this.visible = true;
        }

        toJSON() {
            return _.extend(_.pick(this, 'name', 'status', 'message'), this.extras);
        }
    };
    // ret.name = name;
    return ret;
}


export const ServerError = errorFactory('ServerError');

export const BadRequestError = errorFactory('BadRequestError', 400, 'Bad request');

export const TokenExpiredError = errorFactory('TokenExpiredError', 401, 'Session expired');
export const UnauthorizedError = errorFactory('UnauthorizedError', 401, 'Unauthorized');

export const NotFoundError = errorFactory('NotFoundError', 404, 'Not found');

export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        next(err);
    } else if (err.status && err.visible) {
        res.status(err.status);
        res.send({ error: err });
    } else {
        next(err);
    }
}
