import { assert } from 'chai';
import MockServer from '../../util/mock-server';
import {
    changeProtocol,
    changeHost,
    changePort,
    checkIn,
    checkOutContents,
    createItem,
    createModel,
    deleteItem,
    getAllItems,
    getAllModels,
    searchItem,
    searchModel,
    searchStudent
} from '../../../.dist/lib/api-client';

describe('API Client', () => {

    let mockServer = new MockServer();

    before(() => {
        changeProtocol('http');
        changeHost('localhost');
        changePort(8080);
        return mockServer.start(8080);
    });

    beforeEach(() => {
        mockServer.clearExpectations();
    });

    after(() => {
        mockServer.stop();
    });

    it('checkIn', () => {
        let response = {
            status: 'success',
            data: {
                itemAddress: 'iGwEZUvfA',
                modelName: 'Resistor'
            }
        };
        mockServer.expect({
            method: 'post',
            endpoint: '/api/checkin',
            request: {
                studentId: '123456',
                itemAddress: 'iGwEZUvfA'
            },
            response
        });
        return checkIn('123456', 'iGwEZUvfA').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('checkOutContents', () => {
        let response = {
            status: 'success'
        };
        mockServer.expect({
            method: 'post',
            endpoint: '/api/checkout',
            request: {
                studentId: '123456',
                equipmentAddresses: ['iGwEZUvfA', 'iGwEZVHHE']
            },
            response
        });
        return checkOutContents('123456', ['iGwEZUvfA', 'iGwEZVHHE']).then(data => {
            assert.isUndefined(data);
            mockServer.validate();
        });
    });

    it('checkOutContents (with code)', () => {
        let response = {
            status: 'success'
        };
        mockServer.expect({
            method: 'post',
            endpoint: '/api/checkout',
            request: {
                studentId: '123456',
                equipmentAddresses: ['iGwEZUvfA', 'iGwEZVHHE'],
                adminCode: 'abcdef'
            },
            response
        });
        return checkOutContents('123456', ['iGwEZUvfA', 'iGwEZVHHE'], 'abcdef').then(data => {
            assert.isUndefined(data);
            mockServer.validate();
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
        mockServer.expect({
            method: 'post',
            endpoint: '/api/item',
            request: {
                modelAddress: 'm8y7nEtAe'
            },
            response
        });
        return createItem('m8y7nEtAe').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
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
                price: 10.50,
                allowCheckout: true,
                count: 20
            }
        };
        mockServer.expect({
            method: 'post',
            endpoint: '/api/model',
            request: {
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Live',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                price: 10.50,
                allowCheckout: true,
                count: 20
            },
            response
        });
        return createModel('Resistor', 'V = IR', 'Live', 'Mouzer', 'Shelf 14', true, 10.50, 20).then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
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
        mockServer.expect({
            method: 'delete',
            endpoint: '/api/item',
            request: {
                itemAddress: 'iGwEZUvfA',
                modelAddress: 'm8y7nEtAe'
            },
            response
        });
        return deleteItem({
            address: 'iGwEZUvfA',
            modelAddress: 'm8y7nEtAe'
        }).then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
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
        mockServer.expect({
            method: 'get',
            endpoint: '/api/item/all',
            request: {},
            response
        });
        return getAllItems().then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('getAllModels', () => {
        let response = {
            status: 'success',
            data: {
                models: [{
                    address: 'm8y7nEtAe',
                    name: 'Resistor',
                    description: 'V = IR',
                    manufacturer: 'Pancakes R Us',
                    vendor: 'Mouzer',
                    location: 'Shelf 14',
                    isFaulty: false,
                    faultDescription: '',
                    price: 10.50,
                    count: 20
                }]
            }
        };
        mockServer.expect({
            method: 'get',
            endpoint: '/api/model/all',
            request: {},
            response
        });
        return getAllModels().then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('searchItem', () => {
        let response = {
            status: 'success',
            data: {
                item: {
                    address: 'iGwEZUvfA',
                    modelAddress: 'm8y7nEtAe',
                    status: 'AVAILABLE'
                }
            }
        };
        mockServer.expect({
            method: 'get',
            endpoint: '/api/item',
            request: {
                address: 'iGwEZUvfA'
            },
            response
        });
        return searchItem('iGwEZUvfA').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('searchModel', () => {
        let response = {
            status: 'success',
            data: {
                model: {
                    address: 'm8y7nEtAe',
                    name: 'Resistor',
                    description: 'V = IR',
                    manufacturer: 'Pancakes R Us',
                    vendor: 'Mouzer',
                    location: 'Shelf 14',
                    isFaulty: false,
                    faultDescription: '',
                    price: 10.50,
                    count: 20
                }
            }
        };
        mockServer.expect({
            method: 'get',
            endpoint: '/api/model',
            request: {
                address: 'm8y7nEtAe'
            },
            response
        });
        return searchModel('m8y7nEtAe').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('searchStudent', () => {
        let response = {
            status: 'success',
            data: {
                student: {
                    id: '123456',
                    name: 'John von Neumann',
                    items: []
                }
            }
        };
        mockServer.expect({
            method: 'get',
            endpoint: '/api/student',
            request: {
                id: '123456'
            },
            response
        })
        return searchStudent('123456').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

});
