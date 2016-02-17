import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

export const Event = sequelize.define('event', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: { notEmpty: true },
    },
    location: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: { notEmpty: true },
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING(255)),
        allowNull: false,
        defaultValue: [],
    },
    description: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: '',
    },
    startedAt: {
        type: Sequelize.DATE,
        field: 'starts_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    endedAt: {
        type: Sequelize.DATE,
        field: 'ends_at',
        allowNull: true, // null = on-going
    },
    timezone: {
        type: Sequelize.DECIMAL(2, 2),
        allowNull: false,
        defaultValue: 0,
    },
    language: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'en-us',
    },
}, {
    underscored: true,
});


