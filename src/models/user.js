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
        validate: { is: /^[A-Za-z0-9_]+$/ },
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: { notEmpty: true },
    },
    firstName: {
        type: Sequelize.STRING(255),
        field: 'first_name',
        allowNull: true,
        validate: { notEmpty: true },
    },
    lastName: {
        type: Sequelize.STRING(255),
        field: 'last_name',
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
        field: 'date_of_birth',
        allowNull: true,
    },
}, {
    underscored: true,
    getterMethods: {
        active: function() {
            return this.password !== null && this.email !== null;
        },
    },
    instanceMethods: {
        get: plainGetterFactory(x => _.omit(x, 'password')),

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

