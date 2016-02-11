import Sequelize from 'sequelize';
import { sequelize } from './sequelize';


export const User = sequelize.define('user', {
    id: {
        type: Sequelize.STRING(31),
        allowNull: false,
        unique: true,
        primaryKey: true,
        validate: { is: /^A-Za-z0-9_$/ },
    },
    firstName: {
        type: Sequelize.STRING(255),
        field: 'first_name',
        allowNull: false,
        validate: { notEmpty: true },
    },
    lastName: {
        type: Sequelize.STRING(255),
        field: 'last_name',
        allowNull: false,
        validate: { notEmpty: true },
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
        allowNull: false,
    },
}, {
    underscored: true,
});

