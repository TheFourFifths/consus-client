import { assert } from 'chai';
import MockServer from '../../util/mock-server';
import {
    addFault,
    addUnserializedModel,
    changeProtocol,
    changeHost,
    changePort,
    checkIn,
    checkInModel,
    checkOutContents,
    createItem,
    createModel,
    deleteItem,
    getAllItems,
    getAllModels,
    getModelAndItems,
    getAllStudents,
    getOverdueItems,
    retrieveItem,
    retrieveModel,
    saveItem,
    saveModel,
    removeItemFault,
    searchItem,
    searchModel,
    searchStudent,
    updateStudent,
    updateModel,
    deleteModel,
    uploadStudents,
    checkOutContentsLongterm
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

    it('addFault', () => {
        let res = {
            status: "success",
            data: {}
        }

        mockServer.expect({
            method: "post",
            endpoint: "item/fault",
            json: {
                itemAddress: "iGwEZUvfA",
                faultDescription: "description"
            },
            response: res
        });
        return addFault("iGwEZUvfA", "description").then(returned => {
            assert.deepEqual(returned, res.data);
            mockServer.validate();
        });
    });

    it('addUnserializedModel', () => {
        let response = {
            status: 'success',
            data: {
                address: 'm8y7nEtAe',
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Live',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                allowCheckout: true,
                price: 10.50,
                count: 20,
                inStock: 20
            }
        };
        mockServer.expect({
            method: 'patch',
            endpoint: 'model/instock',
            qs: {
                modelAddress: 'm8y7nEtAe'
            },
            response
        });
        return addUnserializedModel('m8y7nEtAe').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
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
            endpoint: 'checkin',
            json: {
                studentId: 123456,
                itemAddress: 'iGwEZUvfA'
            },
            response
        });
        return checkIn(123456, 'iGwEZUvfA').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('checkInModel', () => {
        let response = {
            status: 'success',
            data: {
                modelAddress: 'm8y7nEtAe',
                modelName: 'Name',
                quantity: 4
            }
        };
        mockServer.expect({
            method: 'post',
            endpoint: 'checkin/model',
            json: {
                studentId: 123456,
                modelAddress: 'm8y7nEtAe',
                quantity: 4
            },
            response
        });
        return checkInModel(123456, 'm8y7nEtAe', 4).then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        })
    });

    it('checkOutContents', () => {
        let response = {
            status: 'success'
        };
        mockServer.expect({
            method: 'post',
            endpoint: 'checkout',
            json: {
                studentId: 123456,
                equipment: [
                    {
                        address: 'iGwEZUvfA'
                    },
                    {
                        address: 'iGwEZVHHE'
                    }
                ]
            },
            response
        });
        let equipment = [
            {
                address: 'iGwEZUvfA'
            },
            {
                address: 'iGwEZVHHE'
            }
        ];
        return checkOutContents(123456, equipment).then(data => {
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
            endpoint: 'checkout',
            json: {
                studentId: 123456,
                equipment: [
                    {
                        address: 'iGwEZUvfA'
                    },
                    {
                        address: 'iGwEZVHHE'
                    }
                ],
                adminCode: 'abcdef'
            },
            response
        });
        let equipment = [
            {
                address: 'iGwEZUvfA'
            },
            {
                address: 'iGwEZVHHE'
            }
        ];
        return checkOutContents(123456, equipment, 'abcdef').then(data => {
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
            endpoint: 'item',
            json: {
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
                isFaulty: false,
                faultDescription: '',
                price: 10.50,
                count: 20
            }
        };
        mockServer.expect({
            method: 'post',
            endpoint: 'model',
            json: {
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
            endpoint: 'item',
            qs: {
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
            endpoint: 'item/all',
            qs: {},
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
            endpoint: 'model/all',
            qs: {},
            response
        });
        return getAllModels().then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('getModelAndItems', () => {
        let response = {
            status: 'success',
            data: {
                model: {
                    address: "m8y7nEtAe",
                    name: "Resistor",
                    description: "V = IR",
                    manufacturer: "Pancakes R Us",
                    vendor: "Mouzer",
                    location: "Shelf 14",
                    isFaulty: false,
                    faultDescription: "",
                    price: 10.50,
                    count: 20
                },
                items: [{
                    address: 'iGwEZVHHE',
                    modelAddress: 'm8y7nEtAe',
                    status: 'AVAILABLE'
                }]
            }
        }
        mockServer.expect({
            method: 'get',
            endpoint: 'model/children',
            qs: {
                modelAddress: 'm8y7nEtAe'
            },
            response
        });
        return getModelAndItems('m8y7nEtAe').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('getAllStudents', () => {
        let response = {
            "status":"success",
            "data":[
                {
                    "id":111111,
                    "name":"Boaty McBoatface",
                    "status":"C - Current",
                    "email":"mcboatfaceb@msoe.edu",
                    "major":"Hyperdimensional Nautical Machines Engineering",
                    "items":[
                        {
                            "address":"iGwEZVeaT",
                            "modelAddress":"m8y7nFLsT",
                            "status":"CHECKED_OUT",
                            "isFaulty":false,
                            "faultDescription":"",
                            "timestamp":0,
                            "student":{
                                "name":"Boaty McBoatface",
                                "id":111111
                            }
                        }
                    ]
                },
                {
                    "id":123456,
                    "name":"John von Neumann",
                    "status":"C - Current",
                    "email":"neumannJ@msoe.edu",
                    "major":"Software Engineering",
                    "items":[]
                }
            ]
        };
        mockServer.expect({
            method: 'get',
            endpoint: 'student/all',
            qs: {},
            response
        });
        return getAllStudents().then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('getOverdueItems', () => {
        let response = {
            status: 'success',
            data: {
                items: [{
                    address: 'iGwEZVHHE',
                    modelAddress: 'm8y7nEtAe',
                    status: 'CHECKED_OUT'
                }]
            }
        };
        mockServer.expect({
            method: 'get',
            endpoint: 'item/overdue',
            response
        });
        return getOverdueItems().then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('retrieveItem', () => {
        let response = {
            status: 'success'
        };
        mockServer.expect({
            method: 'post',
            endpoint: 'item/retrieve',
            json: {
                itemAddress: 'iGwEZVHHE'
            },
            response
        });
        return retrieveItem('iGwEZVHHE').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('retrieveModel', () => {
        let response = {
            status: 'success'
        };
        mockServer.expect({
            method: 'post',
            endpoint: 'model/retrieve',
            json: {
                studentId: 123456,
                modelAddress: 'm8y7nEtAe'
            },
            response
        });
        return retrieveModel(123456, 'm8y7nEtAe').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('saveItem', () => {
        let response = {
            status: 'success'
        };
        mockServer.expect({
            method: 'post',
            endpoint: 'item/save',
            json: {
                itemAddress: 'iGwEZVHHE'
            },
            response
        });
        return saveItem('iGwEZVHHE').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('saveModel', () => {
        let response = {
            status: 'success'
        };
        mockServer.expect({
            method: 'post',
            endpoint: 'model/save',
            json: {
                studentId: 123456,
                modelAddress: 'm8y7nEtAe'
            },
            response
        });
        return saveModel(123456, 'm8y7nEtAe').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('removeItemFault', () => {
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
            method: 'delete',
            endpoint: 'item/fault',
            qs: {
                itemAddress: 'iGwEZUvfA'
            },
            response
        });

        return removeItemFault('iGwEZUvfA').then(data => {
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
            endpoint: 'item',
            qs: {
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
            endpoint: 'model',
            qs: {
                address: 'm8y7nEtAe'
            },
            response
        });
        return searchModel('m8y7nEtAe').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('deleteModel', () => {
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
            method: 'delete',
            endpoint: 'model',
            qs: {
                modelAddress: 'm8y7nEtAe'
            },
            response
        });
        return deleteModel('m8y7nEtAe').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('searchStudent', () => {
        let response = {
            status: 'success',
            data: {
                student: {
                    id: 123456,
                    name: 'John von Neumann',
                    items: []
                }
            }
        };
        mockServer.expect({
            method: 'get',
            endpoint: 'student',
            qs: {
                id: '123456'
            },
            response
        });
        return searchStudent(123456).then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('uploadStudents', () => {
        let response = {
            status: 'success',
        };
        mockServer.expect({
            method: 'post',
            endpoint: 'student',
            json: {
                data: '123456'
            },
            response
        });
        return uploadStudents('123456').then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('updateModel', () => {
        let response = {
            status: 'success',
            data: {
                address: 'm8y7nEtAe',
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Pancakes R Us',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                allowCheckout: false,
                price: 10.50,
                count: 20,
                items: [ "iGwEZUvfA", "iGwEZVHHE", "iGwEZVeaT"]
            }
        };
        mockServer.expect({
            method: 'patch',
            endpoint: 'model',
            qs: {
                address: 'm8y7nEtAe'
            },
            json: {
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Pancakes R Us',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                allowCheckout: false,
                price: 10.50
            },
            response
        });
        return updateModel(
            'm8y7nEtAe',
            'Resistor',
            'V = IR',
            'Pancakes R Us',
            'Mouzer',
            'Shelf 14',
            false,
            10.50
        ).then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('updateStudent', () => {
        let response = {
            status: 'success',
            data: {
                student: {
                    id: 123456,
                    name: 'John von Neumann',
                    items: []
                }
            }
        };
        mockServer.expect({
            method: 'patch',
            endpoint: 'student',
            qs: {
                id: '123456'
            },
            json: {
                id: 123456,
                name: 'This dude'
            },
            response
        });
        return updateStudent({id:123456, name:"This dude"}).then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });

    it('checkOutContents (with code)', () => {
        let response = {
            status: 'success'
        };
        let equipment = [
            {
                address: 'iGwEZUvfA'
            },
            {
                address: 'iGwEZVHHE'
            }
        ];
        mockServer.expect({
            method: 'post',
            endpoint: 'checkout',
            json: {
                studentId: 123456,
                equipment,
                adminCode: 'abcdef'
            },
            response
        });
        return checkOutContents(123456, equipment, 'abcdef').then(data => {
            assert.isUndefined(data);
            mockServer.validate();
        });
    });

    it('checkOutContentsLongterm', () => {
        let response = {
            status: 'success'
        };
        let today = new Date();
        let equipment = [
            {
                address: 'iGwEZUvfA'
            },
            {
                address: 'iGwEZVHHE'
            }
        ];
        mockServer.expect({
            method: 'post',
            endpoint: 'checkout/longterm',
            json: {
                studentId: 123456,
                equipment,
                dueDate: today.toDateString(),
                professor: 'professor',
                adminCode: 123456
            },
            response
        });
        return checkOutContentsLongterm(123456, equipment, today.toDateString(), 'professor', 123456).then(data => {
            assert.deepEqual(data, response.data);
            mockServer.validate();
        });
    });
});
