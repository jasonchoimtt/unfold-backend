import Sequelize from 'sequelize';
import _ from 'lodash';
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
    instanceMethods: {
        getMeta() {
            let spec = _.find(sources, x => x.type === this.type);
            if (!spec)
                throw new Error('Invalid source type');

            return spec.getMeta(this.config);
        },
        mergeConfig() {
            return _.extend(this.getMeta(), this.toJSON());
        },
    },
    classMethods: {
        sources,
    },
});
