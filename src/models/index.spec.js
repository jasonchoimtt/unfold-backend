import { sequelize } from './index';
import { wait } from '../spec-utils';


describe('Database operations', () => {
    it('creates the database', wait(async function() {
        await sequelize.drop();
        await sequelize.sync();
    }));
});
