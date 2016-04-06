import _ from 'lodash';
import languageTags from 'language-tags';
import Joi from 'joi';
import { BadRequestError } from '../errors';


/**
 * Validates an IETF language tag.
 * Returns a properly formated language code (e.g. zh-Hans), or null.
 *
 * See https://en.wikipedia.org/wiki/IETF_language_tag .
 */
export function validateLanguageCode(code) {
    let tag = languageTags(code);
    return tag.valid() ? code.trim().toLowerCase() : null;
}

export function joiLanguageCode() {
    return function() {
        return this._test('languageCode', undefined, (value, state, options) => {
            let cleaned = validateLanguageCode(value);

            if (!cleaned) // Using any.unknown to avoid patching Joi directly
                return this.createError('any.unknown', { value }, state, options);

            return null;
        });
    }.call(Joi.string());
}

export function validateOrThrow(value, schema, options) {
    let result = Joi.validate(value, schema, options);
    if (!result.error)
        return result.value;

    let err = new BadRequestError(result.error.details.map(e => e.message).join('\n'));
    err.extras = {
        details: _.fromPairs(result.error.details.map(e => [e.path, e.message])),
    };
    throw err;
}
