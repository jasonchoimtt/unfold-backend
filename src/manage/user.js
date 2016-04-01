import _read from 'read';
import { fromCallback } from '../utils';
import { User } from '../models';


const read = fromCallback(_read);

export const createAdmin = {
    async run(argv) {
        let { username, password } = argv;

        if (!username)
            username = await read({ prompt: 'Username: ' });
        if (!password)
            password = await read({ prompt: 'Password: ', silent: true });

        let user = User.build({ id: username });
        if (argv.force)
            user = await User.findById(username);

        user.isAdmin = true;

        await user.setPassword(password);
        await user.save();
    },

    register(yargs) {
        return yargs.command('createAdmin', 'Create a privileged account', yargs => {
            return yargs
                .help('help').alias('help', 'h')
                .env('UNFOLD')
                .option('username', {
                    alias: 'u',
                    nargs: 1,
                    describe: 'Username of the account',
                })
                .option('password', {
                    alias: 'p',
                    nargs: 1,
                    describe: 'Password of the account',
                })
                .option('force', {
                    alias: 'f',
                    nargs: 0,
                    describe: 'Update the user if it exists',
                });
        });
    },
};
