import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { sources } from './sources';


export const Source = sequelize.define('source', {
    type: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: { notEmpty: true },
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    config: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
    },
}, {
    indexes: [
        { unique: true, fields: ['type', 'eventId'] },
    ],
    classMethods: {
        sources,
    },
});
