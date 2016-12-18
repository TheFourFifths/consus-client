import { assert } from 'chai';
import MockServer from '../../util/mock-server';
import { changePort, checkIn, checkOutItems } from '../../../.dist/lib/api-client';
import util from 'util';

describe('API Client', () => {

    before(() => {
        changePort(8080);
    });

    it('checkIn', () => {
        let response = {
            status: 'success',
            data: {
                itemAddress: 'iGwEZUvfA',
                modelName: 'Resistor'
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
        });
    });

    it('checkOutItems', () => {
        let response = {
            status: 'success'
        };
        return MockServer.listen({
            port: 8080,
            method: 'post',
            endpoint: '/api/checkout',
            response
        }).then(() => {
            return checkOutItems('123456', ['iGwEZUvfA', 'iGwEZVHHE']);
        }).then(data => {
            assert.isUndefined(data);
            MockServer.validate({
                studentId: '123456',
                itemAddresses: ['iGwEZUvfA', 'iGwEZVHHE']
            });
        });
    });

});
