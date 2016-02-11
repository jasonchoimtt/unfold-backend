import _ from 'lodash';

// import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { PostData } from './PostData';
import { Event } from './Event';


export const Tick = sequelize.define('tick', PostData.attributes, {
    underscored: true,
    instanceMethods: {
        toJSON: function() {
            return _.omitBy(this.prototype.toJSON.call(this),
                            x => x.length > 4 && x.substr(0, 4) !== 'data');
        },
    },
});
Tick.belongsTo(Event);
