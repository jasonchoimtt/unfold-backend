import _ from 'lodash';

import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { PostData } from './post-data';
import { plainGetterFactory } from './utils';


export const Tick = sequelize.define('tick', _.extend({
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
}, PostData.attributes), {
    instanceMethods: {
        get: plainGetterFactory(x =>
                _.omitBy(x, (v, k) => k.length > 4 && k.substr(0, 4) === 'data')),
    },
});
