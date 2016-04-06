import querystring from 'querystring';
import assert from 'assert';
import _ from 'lodash';
import { Builder, Parser } from 'xml2js';
import { client as baseClient } from '../scraper/common/client';
import { Provider } from '../scraper/common/base';
import { Config } from '../config';
import { fromCallback } from '../utils';


let tokenProvider;

const OAUTH_URL = 'https://datamarket.accesscontrol.windows.net/v2/OAuth2-13';
const TRANSLATE_ARRAY_URL = 'http://api.microsofttranslator.com/V2/Http.svc/TranslateArray';

export const client = baseClient.create({
    async requestHandler(config) {
        let token = await tokenProvider.get();

        config = _.extend({}, config);
        config.headers = _.defaults({
            'Authorization': `Bearer ${token}`,
        }, config.headers);

        try {
            return await this.raw.request(config);
        } catch (err) {
            // TODO: check the error
            tokenProvider.invalidate(token);
            throw err;
        }
    },
});

tokenProvider = new Provider(async function() {
    let { data } = await client.raw.post(OAUTH_URL, querystring.stringify({
        client_id: Config.dataMarket.clientId,
        client_secret: Config.dataMarket.clientSecret,
        grant_type: 'client_credentials',
        scope: 'http://api.microsofttranslator.com/',
    }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    // returns JSON

    if (!data.access_token)
        throw new Error('invalid response');

    // TODO: use data.expires_in

    return data.access_token;
});

const xmlBuilder = new Builder({ headless: true });
const xmlParser = new Parser();
const parseXML = fromCallback(xmlParser, 'parseString');

// Microsoft Translator API hates standard, but we do, so we rectify it
const languageMap = {
    'zh-hans': 'zh-CHS',
    'zh-hant': 'zh-CHT',
};
const languageRMap = _.invert(languageMap);

/**
 * Translates the given text / html to the specified language.
 * @param {String} text
 * @param {Object} options
 * @param {String} options.to The language to translate to. Use an IETF
 * language tag.
 * @param {String} [options.from] The language the text is in. Will be detected
 * if omitted.
 * @param {String} [options.contentType=text/html] The format of the text. One
 * of text/html, text/plain and text/xml.
 */
export async function translate(text, options) {
    options.to = options.to.toLowerCase();
    options.from = options.from && options.from.toLowerCase();

    const xmlns1 = 'http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2';
    const xmlns2 = 'http://schemas.microsoft.com/2003/10/Serialization/Arrays';

    let body = xmlBuilder.buildObject({
        'TranslateArrayRequest': { // tags must be sorted!
            'AppId': '', // Not used with OAuth
            'From': _.get(languageMap, options.from, options.from) || null,
            'Options': {
                'ContentType': {
                    _: options.contentType || 'text/html',
                    $: { xmlns: xmlns1 },
                },
            },
            'Texts': {
                'string': [{
                    _: text,
                    $: { xmlns: xmlns2 },
                }],
            },
            'To': _.get(languageMap, options.to, options.to),
        },
    });
    let resp = await client.post(TRANSLATE_ARRAY_URL, body, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });

    assert(resp.headers['content-type'].toLowerCase().match(/application\/xml/));
    let data = await parseXML(resp.data);

    // Microsoft decided that they would send a 200 OK for internal server error
    // (which is also used for bad requests) so we catch it here
    assert(!data.html, 'Request error: ' + resp.data);

    let entry = data['ArrayOfTranslateArrayResponse']['TranslateArrayResponse'][0];

    return {
        from: _.get(languageRMap, entry['From'][0], entry['From'][0]),
        to: options.to,
        content: entry['TranslatedText'][0],
    };
}
