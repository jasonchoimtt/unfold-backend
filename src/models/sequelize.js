import Sequelize from 'sequelize';

import { Config } from '../config';


export const sequelize = new Sequelize(Config.database);
