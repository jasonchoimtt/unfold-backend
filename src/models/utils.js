import { Instance } from 'sequelize';


/**
 * Creates a wrapper of Instance#get in Sequelize, e.g. to hide certain fields.
 *
 * @param {Object -> Object} fn function that modifies the plain object returned
 */
export function plainGetterFactory(fn) {
    /** @this */
    return function(...args) {
        let ret = Instance.prototype.get.apply(this, args);
        if (typeof args[0] === 'object' && args[0].plain)
            ret = fn(ret, args[0]);
        return ret;
    };
}
