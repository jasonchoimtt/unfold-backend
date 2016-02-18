import _ from 'lodash';

import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { PostData } from './post-data';
import { User } from './user';
import { Event } from './event';
import { plainGetterFactory } from './utils';


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
        get: plainGetterFactory(x => _.omitBy(x, y => y.length > 4 && x.substr(0, 4) !== 'data')),
    },
});
Post.belongsTo(Event);
Post.belongsTo(User, { as: 'author' });
