if (process.env.NODE_ENV !== 'production')
    require('source-map-support/register');

import yargs from 'yargs';
import _ from 'lodash';


let parser = yargs
    .usage('Usage: $0 <command> [options]')
    .help('help').alias('help', 'h')
    .strict()
    .env('UNFOLD')
    .demand(1);

let commands = {};

function register(module) {
    _.forEach(module, (spec, name) => {
        parser = spec.register(parser);
        commands[name] = spec.run.bind(spec);
    });
}
register(require('./user'));
register(require('./fixtures'));



export function main(...raw) {
    let argv = parser.parse(raw);
    let command = argv._.shift();

    if (!commands[command]) {
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }

    let promise = commands[command](argv);
    if (promise) {
        promise.then(() => {
            process.exit(0);
        }, err => {
            if (!(err instanceof Error) && err.headers && err.data) {
                console.error(`${err.status} ${err.statusText}`);
                console.error(_.map(err.headers, (v, k) => `${k}: ${v}`).join('\n'));
                console.error(err.data);
            } else {
                console.error(err && err.stack || err);
            }
            process.exit(1);
        });
    }
}

if (require.main === module) {
    main(...process.argv);
}
