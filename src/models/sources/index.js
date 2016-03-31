import _ from 'lodash';
import { source as twitter } from './twitter';


export const sources = {};

_.forEach([
    twitter,
], x => { sources[x.type] = x; });
