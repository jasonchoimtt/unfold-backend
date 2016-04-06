/* eslint-disable no-unused-expressions */
import Joi from 'joi';
import { validateLanguageCode, joiLanguageCode } from './validations';


describe('Utility validation functions', function() {
    it('validateLanguageCode', function() {
        expect(validateLanguageCode('zh-hk')).to.equal('zh-hk');
        expect(validateLanguageCode('zh-Hans')).to.equal('zh-hans');
        expect(validateLanguageCode(' zh-hk')).to.equal('zh-hk');
        expect(validateLanguageCode('zh')).to.equal('zh');
        expect(validateLanguageCode('Chinese')).to.be.null;
        expect(validateLanguageCode('hk')).to.be.null;
    });

    it('joiLanguageCode', function() {
        expect(joiLanguageCode().validate('zh-hk').error).to.be.null;
        expect(joiLanguageCode().validate('zh-hk').value).to.equal('zh-hk');
        expect(joiLanguageCode().validate('hk').error).to.be.not.null;
        expect(joiLanguageCode().validate(1).error).to.be.not.null;

        expect(Joi.object({
            language: joiLanguageCode(),
        }).validate({ language: 'zh-hk' }).error).to.be.null;
    });
});
