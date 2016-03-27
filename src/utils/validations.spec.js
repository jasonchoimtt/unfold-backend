import Joi from 'joi';
import { validateLanguageCode, joiLanguageCode } from './validations';


describe('Utility validation functions', function() {
    it('validateLanguageCode', function() {
        expect(validateLanguageCode('zh-hk')).to.equal('zh-HK');
        expect(validateLanguageCode(' zh-hk')).to.equal('zh-HK');
        expect(validateLanguageCode('zh')).to.equal('zh');
        expect(validateLanguageCode('Chinese')).to.be.null; // eslint-disable-line
        expect(validateLanguageCode('hk')).to.be.null; // eslint-disable-line
    });

    it('joiLanguageCode', function() {
        expect(joiLanguageCode().validate('zh-hk').error).to.be.null; // eslint-disable-line
        expect(joiLanguageCode().validate('zh-hk').value).to.equal('zh-hk');
        expect(joiLanguageCode().validate('hk').error).to.be.not.null; // eslint-disable-line
        expect(joiLanguageCode().validate(1).error).to.be.not.null; // eslint-disable-line

        expect(Joi.object({ // eslint-disable-line
            language: joiLanguageCode(),
        }).validate({ language: 'zh-hk' }).error).to.be.null;
    });
});
