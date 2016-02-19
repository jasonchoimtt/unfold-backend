import _ from 'lodash';

import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { PostData } from './post-data';
import { User } from './user';
import { plainGetterFactory } from './utils';


export const Post = sequelize.define('post', _.assign({}, PostData.attributes, {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    caption: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '',
    },
}), {
    instanceMethods: {
        get: plainGetterFactory(x =>
                _.omitBy(x, (v, k) => k.length > 4 && k.substr(0, 4) === 'data')),
    },
    validate: {
        notEmpty() {
            if (!this.caption && !this.data)
                throw new Error('Either caption or data must be provided');
        },
    },
});

Post.belongsTo(User, {
    as: 'author',
    foreignKey: { name: 'authorId' },
});
