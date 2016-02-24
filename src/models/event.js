import Sequelize from 'sequelize';
import { sequelize } from './sequelize';

import { Role } from './role';
import { Post } from './post';


export const Event = sequelize.define('event', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
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
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    endedAt: {
        type: Sequelize.DATE,
        allowNull: true, // null = on-going
    },
    timezone: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 0,
    },
    language: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'en-us',
    },
}, {
    getterMethods: {
        url() {
            return `/api/event/${this.id}`;
        },
    },
    instanceMethods: {
        async hasUserWithRole(instance, type) {
            let id = typeof instance.where === 'function' ? instance.where() : instance;
            if (Array.isArray(type))
                type = { $in: type };

            let ret = await this.getRoles({
                where: {
                    userId: id,
                    type: type,
                },
            });
            return !!ret.length;
        },
    },
    defaultScope: {
        include: [{ model: Role, as: 'roles' }],
    },
    scopes: {
        brief: {
            attributes: { exclude: 'description' },
        },
    },
});

Event.hasMany(Role, {
    as: 'roles',
    foreignKey: {
        name: 'eventId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

Event.hasMany(Post, {
    as: 'posts',
    foreignKey: {
        name: 'eventId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});
