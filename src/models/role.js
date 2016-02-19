import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { User } from './user';


export const Role = sequelize.define('role', {
    type: {
        type: Sequelize.ENUM('OWNER', 'MODERATOR', 'CONTRIBUTOR', 'TRANSLATOR'),
        allowNull: false,
        defaultValue: 'OWNER',
    },
}, {
    indexes: [
        { unique: true, fields: ['userId', 'eventId'] },
    ],
    classMethods: {
        OWNER: 'OWNER',
        MODERATOR: 'MODERATOR',
        CONTRIBUTOR: 'CONTRIBUTOR',
        TRANSLATOR: 'TRANSLATOR',
    },
    defaultScope: {
        include: [User],
    },
});

Role.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});
