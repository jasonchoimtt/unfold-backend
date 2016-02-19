import _ from 'lodash';

// import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { PostData } from './post-data';
import { Event } from './event';
import { plainGetterFactory } from './utils';


export const Tick = sequelize.define('tick', PostData.attributes, {
    instanceMethods: {
        get: plainGetterFactory(x =>
                _.omitBy(x, (v, k) => k.length > 4 && k.substr(0, 4) === 'data')),
    },
});
Tick.belongsTo(Event);
