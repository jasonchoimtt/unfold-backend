import { server as WebSocketServer } from 'websocket';
import { matcher } from '../utils';


// TODO: merge with scraper code
export class Route {
    constructor(pattern, handler) {
        this.matcher = matcher(pattern);
        this.handler = handler;
    }

    match(path) {
        return this.matcher.match(path);
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
        let next = () => {
            for (; i < this.routes.length; i++) {
                let match = this.routes[i].match(req.resource);
                if (match) {
                    req.params = match;
                    Promise.resolve().then(
                        this.routes[i].handler.bind(this.routes[i], req, null, next));
                    return;
                }
            }
            req.reject(); // TODO: reject with sth meaningful
        };

        next();
    }

    use(pattern, fn) {
        this.routes.push(new Route(pattern, fn));
    }

    attach(server) {
        let wsServer = new WebSocketServer({ httpServer: server });

        wsServer.on('request', this.dispatch.bind(this));
    }
}

