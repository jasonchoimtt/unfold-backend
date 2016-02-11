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
    startsAt: {
        type: Sequelize.DATE,
        field: 'starts_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    endsAt: {
        type: Sequelize.DATE,
        field: 'ends_at',
        allowNull: true, // null = on-going
    },
}, {
    underscored: true,
});


