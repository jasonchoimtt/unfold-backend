import urllib from 'url';
import pathToRegexp from 'path-to-regexp';
import _ from 'lodash';


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
function matcher(pattern, separator = '/') {
    let keys = [];
    let regexp = pathToRegexp(pattern.replace(separator, '/'), keys);
    return {
        match(str) {
            let match = regexp.exec(str.replace(separator, '/'));
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

const protocolRegexp = /^(https?:)?\/\/([^/]+)(\/.*)?$/;

// Exported for unit testing
export class Route {
    constructor(url, handler) {
        let match = protocolRegexp.exec(url);
        if (!match)
            throw new Error('Invalid URL format');

        let [, protocol, host, pathname] = match;

        this.protocol = protocol ? new RegExp(`^${protocol}$`) : /^https?:$/;
        this.host = matcher(host, '.');
        this.pathname = matcher(pathname, '/');

        this.handler = handler;
    }

    match(parsed) {
        if (typeof parsed === 'string')
            parsed = urllib.parse(parsed);

        if (!this.protocol.test(parsed.protocol))
            return false;

        let host = this.host.match(parsed.host);
        if (!host)
            return false;

        let pathname = this.pathname.match(parsed.pathname);
        if (!pathname)
            return false;

        return _.extend(host, pathname);
    }
}

export class Dispatcher {
    constructor() {
        this.routes = [];
    }

    define(url, handler) {
        this.routes.push(new Route(url, handler));
    }

    async dispatch(url, job) {
        let parsed = urllib.parse(url);

        let current = -1;
        let ctx;
        let next = async () => {
            current += 1;
            if (current >= this.routes.length)
                throw new Error('No route found');

            let route = this.routes[current];
            let match = route.match(parsed);
            if (!match)
                await next();
            await route.handler(_.extend({ params: match }, ctx),
                                job);
        };
        ctx = _.extend({
            url: url,
            next: next,
        }, parsed);

        await next();
    }
}
