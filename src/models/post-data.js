import Sequelize from 'sequelize';

import _ from 'lodash';


const attributeList = [
    'rel', 'title', 'content', 'image', 'url',
    'site', 'section', 'author', 'createdAt',
];

export const PostData = {
    attributeList: attributeList,
    attributes: {
        dataRel: {
            type: Sequelize.STRING(31),
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataTitle: {
            type: Sequelize.TEXT,
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataContent: {
            type: Sequelize.TEXT,
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataImage: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataUrl: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataSite: {
            type: Sequelize.STRING(31),
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataSection: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataAuthor: {
            type: Sequelize.JSONB,
            allowNull: true,
        },
        dataCreatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        data: {
            type: Sequelize.JSONB,
            allowNull: true,
            get: function() {
                let out = _.assign({}, this.getDataValue('data'));
                for (let field of attributeList) {
                    let val = this.getDataValue(_.camelCase(`data ${field}`));
                    if (val !== null)
                        out[field] = val;
                }

                return _.some(out, x => x) ? out : null;
            },
            set: function(value) {
                value = value || {};
                for (let field of attributeList)
                    this.setDataValue(_.camelCase(`data ${field}`), value[field]);
                this.setDataValue('data', _.omit(value, ...attributeList));
            },
        },
    },
    TEXT: 'TEXT',
    IMAGE: 'IMAGE',
    EMBED: 'EMBED',
    SPECIAL: 'SPECIAL',
};
