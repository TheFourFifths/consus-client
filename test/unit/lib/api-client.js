import { assert } from 'chai';
import MockServer from '../../util/mock-server';
import { changePort, checkIn } from '../../../.dist/lib/api-client';
import util from 'util';

describe('API Client', () => {

    before(() => {
        changePort(8080);
    });

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
            port: 8080,
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
        }).catch(e = util.inspect);
    });

});
