import 'source-map-support/register';

import axios from 'axios';
import _ from 'lodash';

export default function(logger) {
    return async function request(title, req, options) {
        let output = '';
        let log = line => {
            output += line + '\n';
        };
        let send = () => {
            logger(title, output);
        };

        options = options || {};

        // Remove indent
        req = req.replace(/^\s*\n|\n\s*$/, '');
        req = req.split('\n');
        let indent = req.reduce((min, next) => {
            if (!next.length)
                return min;
            let len = 0;
            while (len < next.length - 1 && next[len] === ' ')
                len += 1;
            return Math.min(min, len);
        }, 100000);
        req = req.map(str => str.substr(indent).replace(/#.*/, ''));

        log(req.join('\n'));

        // Method
        let [, method, url] = /^([A-Za-z]+)\s+(.*)$/.exec(req.shift());
        _.extend(options, {
            method: method.toLowerCase(),
            url: url.trim(),
        });

        // Query string
        let params = '';
        while (req[0].match(/^[?&]/))
            params += req.shift();
        if (params)
            options.url += params;

        // Headers
        let headers = {};
        let match;
        while ((match = /^([-A-Za-z]+):\s*(.*)/.exec(req[0]))) {
            req.shift();
            let [, key, val] = match;
            headers[key] = val.trim();
        }
        options.headers = _.extend(options.headers, headers);

        // Data
        let data = req.join('\n');
        if (data) {
            try {
                // This sets application/json appropriately
                data = JSON.parse(data);
            } catch (err) {
                // Do nothing
            }
            options.data = data;
        }

        // process.stderr.write(JSON.stringify(options, null, 4));

        try {
            let resp = await axios(options);

            log(`HTTP ${resp.status} ${resp.statusText}`);
            log(JSON.stringify(resp.data, null, 4));
            send();
            return resp.data;
        } catch (err) {
            if (err instanceof Error) {
                send();
                throw err;
            }

            log(`HTTP ${err.status} ${err.statusText}`);
            log(JSON.stringify(err.data, null, 4));
            send();
            return err.data;
        }
    };
}
