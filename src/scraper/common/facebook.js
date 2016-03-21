import _ from 'lodash';
import { Provider } from './base';
import { client as baseClient } from '../common/client';
import { Config } from '../../config';


export const endpoint = 'https://graph.facebook.com/v2.5';

let tokenProvider;

export const client = baseClient.create({
    baseURL: endpoint,
    async requestHandler(config) {
        let token = await tokenProvider.get();

        config = _.extend({}, config);
        config.params = _.defaults({ access_token: token }, config.params);

        try {
            return await this.raw.request(config);
        } catch (err) {
            if (!(err instanceof Error) && err.data && err.data.error.code === 190)
                tokenProvider.invalidate(token);
            throw err;
        }
    },
});

tokenProvider = new Provider(async function() {
    let { data } = await client.raw.get('https://graph.facebook.com/oauth/access_token', {
        params: {
            client_id: Config.facebook.appId,
            client_secret: Config.facebook.appSecret,
            grant_type: 'client_credentials',
        },
    });

    let match = /^access_token=(.*)$/.exec(data);
    if (!match)
        throw new Error('invalid response');

    return match[1];
});

export { tokenProvider };
