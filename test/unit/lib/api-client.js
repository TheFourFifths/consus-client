import { assert } from 'chai';
import MockServer from '../../util/mock-server';
import {
    changeProtocol,
    changeHost,
    changePort,
    checkIn,
    checkOutItems,
    createItem,
    createModel,
    deleteItem,
    getAllItems
} from '../../../.dist/lib/api-client';

describe('API Client', () => {

    before(() => {
        changeProtocol('http');
        changeHost('localhost');
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

    it('createItem', () => {
        let response = {
            status: 'success',
            data: {
                address: 'iGwEZUvfA',
                modelName: 'Resistor'
            }
        };
        return MockServer.listen({
            port: 8080,
            method: 'post',
            endpoint: '/api/item',
            response
        }).then(() => {
            return createItem('m8y7nEtAe');
        }).then(data => {
            assert.deepEqual(data, response.data);
            MockServer.validate({
                modelAddress: 'm8y7nEtAe'
            });
        });
    });

    it('createModel', () => {
        let response = {
            status: 'success',
            data: {
                address: 'm8y7nEtAe',
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Live',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                isFaulty: false,
                faultDescription: '',
                price: 10.50,
                count: 20
            }
        };
        return MockServer.listen({
            port: 8080,
            method: 'post',
            endpoint: '/api/model',
            response
        }).then(() => {
            return createModel('Resistor', 'V = IR', 'Live', 'Mouzer', 'Shelf 14', false, '', 10.50, 20);
        }).then(data => {
            assert.deepEqual(data, response.data);
            MockServer.validate({
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Live',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                isFaulty: false,
                faultDescription: '',
                price: 10.50,
                count: 20
            });
        });
    });

    it('deleteItem', () => {
        let response = {
            status: 'success',
            data: {
                items: [{
                    address: 'iGwEZVHHE',
                    modelAddress: 'm8y7nEtAe',
                    status: 'AVAILABLE'
                }],
                modelName: 'Resistor'
            }
        };
        return MockServer.listen({
            port: 8080,
            method: 'delete',
            endpoint: '/api/item',
            response
        }).then(() => {
            return deleteItem({
                address: 'iGwEZUvfA',
                modelAddress: 'm8y7nEtAe'
            });
        }).then(data => {
            assert.deepEqual(data, response.data);
            MockServer.validate({
                itemAddress: 'iGwEZUvfA',
                modelAddress: 'm8y7nEtAe'
            });
        });
    });

    it('getAllItems', () => {
        let response = {
            status: 'success',
            data: {
                items: [{
                    address: 'iGwEZVHHE',
                    modelAddress: 'm8y7nEtAe',
                    status: 'AVAILABLE'
                }]
            }
        };
        return MockServer.listen({
            port: 8080,
            method: 'get',
            endpoint: '/api/item/all',
            response
        }).then(() => {
            return getAllItems();
        }).then(data => {
            assert.deepEqual(data, response.data);
            MockServer.validate({});
        });
    });

});
