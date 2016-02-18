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
    underscored: true,
    indexes: [
        { unique: true, fields: ['user_id', 'event_id'] },
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
        field: 'user_id',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});
