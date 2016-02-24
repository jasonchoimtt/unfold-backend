import Sequelize from 'sequelize';
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
        validate: { is: /^[A-Za-z][A-Za-z0-9_]*$/ },
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: { notEmpty: true },
    },
    firstName: {
        type: Sequelize.STRING(255),
        allowNull: true,
        validate: { notEmpty: true },
    },
    lastName: {
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
    dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true,
    },
}, {
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
            let attributes = ['id', 'firstName', 'lastName', 'createdAt'];
            if (options.attributeSet === 'private')
                attributes = attributes.concat(['email', 'dateOfBirth']);
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
});

