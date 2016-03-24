import { WebSocketApp } from './base';
import { connection as WebSocketConnection } from 'websocket';

import { eventStream } from './event';


export const app = new WebSocketApp();

/*
 * A testing endpoint.
 */
app.use('/api', function(req, __, next) {
    let conn = req.accept();

    conn.send(JSON.stringify({ data: 'It works!' }));

    conn.close(WebSocketConnection.CLOSE_REASON_NORMAL);
});

app.use(eventStream.pattern, eventStream);

app.use(function errorHandler(err, req, __, next) {
    if (err.status && err.visible) {
        req.reject(err.status, err.name);
    } else {
        next(err);
    }
});
