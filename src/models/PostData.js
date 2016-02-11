import Sequelize from 'sequelize';

import _ from 'lodash';


const attributeList = ['content', 'image', 'link', 'source', 'author', 'postedAt'];

export const PostData = {
    attributeList: attributeList,
    attributes: {
        dataContent: {
            type: Sequelize.TEXT,
            field: 'data_content',
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataImage: {
            type: Sequelize.STRING(255),
            field: 'data_image',
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataLink: {
            type: Sequelize.STRING(255),
            field: 'data_link',
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataSource: {
            type: Sequelize.STRING(31),
            field: 'data_source',
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataAuthor: {
            type: Sequelize.STRING(255),
            field: 'data_author',
            allowNull: true,
            validate: { notEmpty: true },
        },
        dataPostedAt: {
            type: Sequelize.DATE,
            field: 'data_posted_at',
            allowNull: true,
        },
        data: {
            type: Sequelize.JSONB,
            field: 'data_extra',
            allowNull: true,
            get: function() {
                let out = _.assign({}, this.getDataValue('data'));
                for (let field of attributeList)
                    out[field] = this.getDataValue(_.camelCase(`data ${field}`));

                return _.some(out, x => x) ? out : null;
            },
            set: function(value) {
                for (let field of attributeList)
                    this.setDataValue(_.camelCase(`data ${field}`), value[field]);
                this.setDataValue('data', _.omit(value, ...attributeList));
            },
        },
    },
};
