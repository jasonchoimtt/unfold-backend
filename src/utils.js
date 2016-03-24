import _ from 'lodash';
import bodyParser from 'body-parser';
import pathToRegexp from 'path-to-regexp';

import { BadRequestError } from './errors';


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


/**
 * Creates a matcher that matches a host or pathname.
 *
 * e.g. :blog.blogspot.:tld
 *      /:profile/posts/:id
 *
 * Note that ports are not supported, i.e. the following will not work:
 *      :foo.google.com:80
 *
 * @param {String} pattern
 * @param {String} separator Either '/' or '.'
 * @return {Object} An object with method `match(str)`
 */
export function matcher(pattern, separator = '/') {
    let keys = [];

    // Need global match
    separator = separator === '/' ? /\//g : /\./g;

    pattern = pattern.replace(separator, '/');
    if (pattern[0] !== '/')
        pattern = '/' + pattern;

    let regexp = pathToRegexp(pattern, keys);
    return {
        match(str) {
            str = str.replace(separator, '/');
            if (str[0] !== '/')
                str = '/' + str;

            let match = regexp.exec(str);
            if (!match)
                return null;

            return _.chain([keys.map(x => x.name), match.slice(1)])
                .unzip()
                .filter(x => typeof x[1] !== 'undefined')
                .fromPairs()
                .value();
        },
    };
}
