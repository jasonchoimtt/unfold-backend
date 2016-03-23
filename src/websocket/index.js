import { WebSocketApp } from './base';
import { connection as WebSocketConnection } from 'websocket';


export const app = new WebSocketApp();

/*
 * A testing endpoint.
 */
app.use('/api', function(req, __, next) {
    let conn = req.accept();

    conn.send(JSON.stringify({ data: 'It works!' }));

    conn.close(WebSocketConnection.CLOSE_REASON_NORMAL);
});
