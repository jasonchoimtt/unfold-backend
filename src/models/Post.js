import _ from 'lodash';

import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { PostData } from './PostData';
import { User } from './User';
import { Event } from './Event';


export const Post = sequelize.define('post', _.assign({}, PostData.attributes, {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    caption: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '',
    },
}), {
    underscored: true,
    instanceMethods: {
        toJSON: function() {
            return _.omitBy(this.prototype.toJSON.call(this),
                            x => x.length > 4 && x.substr(0, 4) !== 'data');
        },
    },
});
Post.belongsTo(Event);
Post.belongsTo(User, { as: 'author' });
