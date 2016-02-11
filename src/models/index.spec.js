import { sequelize } from './index';


function resolve(fn) {
    return function(done) {
        fn().then(done, done.fail);
    };
}

describe('Database operations', () => {
    it('creates the database', resolve(async function() {
        await sequelize.drop();
        await sequelize.sync();
    }));
});
