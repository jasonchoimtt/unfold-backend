import _ from 'lodash';

import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { PostData } from './post-data';
import { PostTranslation } from './post-translation';
import { User } from './user';
import { plainGetterFactory } from './utils';


export const Post = sequelize.define('post', _.assign({}, PostData.attributes, {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    caption: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '',
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING(255)),
        allowNull: false,
        defaultValue: [],
    },
}), {
    getterMethods: {
        translations() {
            return this._translations;
        },
    },
    setterMethods: {
        /**
         * Setter method for when related PostTranslation is fetched.
         */
        translations(value) {
            // use this._translations since it is not persisted in database as
            // a field
            this._translations = _.chain(value)
                .map(x => [x.language, x])
                .fromPairs()
                .value();
            return this._translations;
        },
    },
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

Post.hasMany(PostTranslation, {
    as: 'translations',
    foreignKey: {
        name: 'postId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});
