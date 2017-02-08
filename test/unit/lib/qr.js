import { assert } from 'chai';
import { getDataUri } from '../../../.dist/lib/qr';

describe('QR', () => {

    it('gets a data URI', () => {
        assert.isString(getDataUri('pretend that this is an address'));
    });

});
