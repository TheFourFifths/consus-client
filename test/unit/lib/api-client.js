import { assert } from 'chai';
import MockServer from '../../util/mock-server';
import { checkIn } from '../../../.dist/lib/api-client';

describe('API Client', () => {

    it('checkIn', () => {
        let response = {
            status: 'success',
            data: {
                status: 'success',
                data: {
                    itemAddress: 'iGwEZUvfA',
                    modelName: 'Resistor'
                }
            }
        };
        return MockServer.listen({
            method: 'post',
            endpoint: '/api/checkin',
            response
        }).then(() => {
            return checkIn('123456', 'iGwEZUvfA');
        }).then(data => {
            assert.deepEqual(data, response.data);
            MockServer.validate({
                studentId: '123456',
                itemAddress: 'iGwEZUvfA'
            });
        });
    });

});
