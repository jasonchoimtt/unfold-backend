import { sequelize } from './index';


describe('Database operations', function() {
    it('creates the database', async function() {
        await sequelize.drop();
        await sequelize.sync();
    });
});
