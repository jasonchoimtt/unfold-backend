import _ from 'lodash';

// import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { PostData } from './post-data';
import { Event } from './event';
import { plainGetterFactory } from './utils';


export const Tick = sequelize.define('tick', PostData.attributes, {
    underscored: true,
    instanceMethods: {
        get: plainGetterFactory(x => _.omitBy(x, y => y.length > 4 && x.substr(0, 4) !== 'data')),
    },
});
Tick.belongsTo(Event);
