import { assert } from 'chai';
import { getDataUri } from '../../../.dist/lib/qr';

describe('QR', () => {

    it('gets a data URI', () => {
        let dataUri = getDataUri('pretend that this is an address');
        assert.isString(dataUri);
        assert.strictEqual(dataUri.indexOf('data:image/png;base64,'), 0);
    });

});
