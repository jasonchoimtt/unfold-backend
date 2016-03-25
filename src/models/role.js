import Sequelize from 'sequelize';
import _ from 'lodash';
import { sequelize } from './sequelize';

import { User } from './user';


let types = ['OWNER', 'MODERATOR', 'CONTRIBUTOR', 'TRANSLATOR'];

export const Role = sequelize.define('role', {
    type: {
        type: Sequelize.ENUM(...types),
        allowNull: false,
        defaultValue: 'OWNER',
    },
}, {
    indexes: [
        { unique: true, fields: ['userId', 'eventId'] },
    ],
    classMethods: _.extend({
        types,
    } , _.fromPairs(types.map(x => [x, x]))),
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
