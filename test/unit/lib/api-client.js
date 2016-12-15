import { assert } from 'chai';
import * as api from '../../../.dist/lib/api-client';
import { mockServer, validateServer } from '../../util/server';

describe('api-client', () => {

    it.only('#checkin', () => {
        return mockServer({
            method: 'post',
            endpoint: '/api/checkin',
            expectedRequest: {
                studentId: '123456',
                itemAddress: '43211234'
            },
            response: {
                status: 'success'
            }
        }).then(() => {
            return api.checkIn('123456', '43211234').then(response => {
                assert.isUndefined(response);
            });
        }).then(validateServer);
    });

});
