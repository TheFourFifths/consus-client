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
    getAllItems,
    getAllModels,
    searchItem,
    searchModel,
    searchStudent
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

    it('checkOutItems (with code)', () => {
        let response = {
            status: 'success'
        };
        return MockServer.listen({
            port: 8080,
            method: 'post',
            endpoint: '/api/checkout',
            response
        }).then(() => {
            return checkOutItems('123456', ['iGwEZUvfA', 'iGwEZVHHE'], 'abcdef');
        }).then(data => {
            assert.deepEqual(data, response.data);
            MockServer.validate({
                studentId: '123456',
                itemAddresses: ['iGwEZUvfA', 'iGwEZVHHE'],
                adminCode: 'abcdef'
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
        return MockServer.listen({
            port: 8080,
            method: 'get',
            endpoint: '/api/model/all',
            response
        }).then(() => {
            return getAllModels();
        }).then(data => {
            assert.deepEqual(data, response.data);
            MockServer.validate({});
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
        return MockServer.listen({
            port: 8080,
            method: 'get',
            endpoint: '/api/item',
            response
        }).then(() => {
            return searchItem('iGwEZUvfA');
        }).then(data => {
            assert.deepEqual(data, response.data);
            MockServer.validate({
                address: 'iGwEZUvfA'
            });
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
        return MockServer.listen({
            port: 8080,
            method: 'get',
            endpoint: '/api/model',
            response
        }).then(() => {
            return searchModel('m8y7nEtAe');
        }).then(data => {
            assert.deepEqual(data, response.data);
            MockServer.validate({
                address: 'm8y7nEtAe'
            });
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
        return MockServer.listen({
            port: 8080,
            method: 'get',
            endpoint: '/api/student',
            response
        }).then(() => {
            return searchStudent('123456');
        }).then(data => {
            assert.deepEqual(data, response.data);
            MockServer.validate({
                id: '123456'
            });
        });
    });

});
