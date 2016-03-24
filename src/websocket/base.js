import { server as WebSocketServer } from 'websocket';
import { matcher } from '../utils';


// TODO: merge with scraper code
export class Route {
    constructor(pattern, handler) {
        this.matcher = pattern && matcher(pattern);
        this.handler = handler;
    }

    match(path) {
        return this.matcher ? this.matcher.match(path) : {};
    }
}


/**
 * Express-like routing mechanism for WebSocket.
 */
export class WebSocketApp {
    constructor(options) {
        this.options = options;
        this.routes = [];
    }

    dispatch(req) {
        // TODO: check req.origin

        req.accept = req.accept.bind(req, null, req.origin);

        let i = 0;
        let error = null;
        let next = err => {
            if (err)
                error = err;

            for (; i < this.routes.length; i++) {
                let match = this.routes[i].match(req.resource);
                if (match && this.routes[i].handler.length === (error ? 4 : 3)) {
                    req.params = match;

                    let args = (error ? [error] : []).concat([req, null, next]);
                    Promise.resolve().then(
                        this.routes[i].handler.bind(this.routes[i], ...args));
                    i += 1;
                    return;
                }
            }
            req.reject(404, 'Not found');
        };

        next();
    }

    use(pattern, fn) {
        if (typeof pattern === 'function')
            this.routes.push(new Route(null, pattern));
        else
            this.routes.push(new Route(pattern, fn));
    }

    attach(server) {
        let wsServer = new WebSocketServer({ httpServer: server });

        wsServer.on('request', this.dispatch.bind(this));
    }
}

