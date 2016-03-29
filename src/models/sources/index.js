import _ from 'lodash';
import { source as twitterUser } from './twitter-user';


export const sources = {};

_.forEach([
    twitterUser,
], x => { sources[x.type] = x; });
