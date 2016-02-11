import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { User } from './User';
import { Event } from './Event';


export const Role = sequelize.define('role', {
    type: Sequelize.ENUM('OWNER', 'MODERATOR', 'TRANSLATOR'),
}, {
    underscored: true,
    indexes: [
        { unique: true, fields: ['user_id', 'event_id'] },
    ],
    classMethods: {
        OWNER: 'OWNER',
        MODERATOR: 'MODERATOR',
        TRANSLATOR: 'TRANSLATOR',
    },
});
Role.belongsTo(User);
Role.belongsTo(Event);
