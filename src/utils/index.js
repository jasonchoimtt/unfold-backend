import bodyParser from 'body-parser';

import { BadRequestError } from '../errors';


export * from './matcher';
export * from './validations';
export * from './logger';


export function fromCallback(fn, method) {
    if (method)
        fn = fn[method].bind(fn);

    return function(...args) {
        return new Promise((resolve, reject) => {
            return fn(...args, function(err, datum) {
                if (err) reject(err);
                else resolve(datum);
            });
        });
    };
}

export function catchError(fn) {
    return function(req, res, next) {
        let ret = fn(req, res, next);
        if (ret && typeof ret.then !== 'undefined' && typeof ret.catch !== 'undefined')
            ret.catch(err => { next(err); });
    };
}

let jsonParser = bodyParser.json();

export function parseJSON(req, res, next) {
    let _next = err => {
        if (err)
            next(err);
        else if (!req.body)
            next(new BadRequestError());
        else
            next();
    };
    jsonParser(req, res, _next);
}
