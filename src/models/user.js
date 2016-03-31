import Sequelize, { fn, col, where } from 'sequelize';
import { sequelize } from './sequelize';

import * as bcrypt from 'bcrypt';
import _ from 'lodash';
import { fromCallback } from '../utils';
import { plainGetterFactory } from './utils';


export const User = sequelize.define('user', {
    id: {
        type: Sequelize.STRING(31),
        allowNull: false,
        unique: true,
        primaryKey: true,
        validate: { is: /^[A-Za-z][A-Za-z0-9_]{4,31}$/ },
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: { notEmpty: true },
    },
    name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        validate: { notEmpty: true },
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull: true,
        validate: { isEmail: true },
    },
    verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    profile: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
    },
}, {
    indexes: [
        { unique: true, name: 'users_lower_id',fields: [fn('LOWER', col('id'))] },
    ],
    getterMethods: {
        active() {
            return this.password !== null && this.email !== null;
        },

        url() {
            return `/api/user/${this.id}`;
        },
    },
    instanceMethods: {
        get: plainGetterFactory((obj, options) => {
            let attributes;

            if (options.attributeSet === 'session') {
                attributes = ['id', 'name', 'isAdmin'];

            } else {
                attributes = ['id', 'name', 'createdAt', 'profile'];
                if (options.attributeSet === 'private')
                    attributes = attributes.concat(['email', 'dateOfBirth']);
            }

            return _.pick(obj, attributes);
        }),

        async setPassword(plaintext) {
            let salt = await fromCallback(bcrypt.genSalt)(10);
            let ciphertext = await fromCallback(bcrypt.hash)(plaintext, salt);
            this.password = ciphertext;
        },

        async checkPassword(plaintext) {
            // always returns false if this.passwprd === ''
            return await fromCallback(bcrypt.compare)(plaintext, this.password);
        },
    },
    classMethods: {
        /**
         * Find User by ID in a case-insensitive manner.
         */
        findById(id, options) {
            if (Buffer.isBuffer(id))
                id = id.toString('utf8');
            options = _.defaults({
                where: where(fn('LOWER', col('id')), id.toLowerCase()),
            }, options);

            return this.findOne(options);
        },
    },
});

