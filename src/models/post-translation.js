import Sequelize, { fn, col } from 'sequelize';
import { sequelize } from './sequelize';


export const PostTranslation = sequelize.define('postTranslation', {
    language: {
        type: Sequelize.STRING(31),
        allowNull: false,
        validate: {
            notEmpty: true,
            isLowercase: true,
        },
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: { notEmpty: true },
    },
}, {
    setterMethods: {
        language(value) {
            return this.setDataValue('language', value.toLowerCase());
        },
    },
    indexes: [
        {
            unique: true,
            name: 'postTranslation_post_id_lower_language',
            fields: ['postId', fn('LOWER', col('language'))],
        },
    ],
});
