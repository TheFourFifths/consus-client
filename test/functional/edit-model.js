import path from 'path';
import { Application } from 'spectron';
import electron from 'electron-prebuilt';
import { assert } from 'chai';
import MockServer from '../util/mock-server';

describe('Editing a model', function () {

    this.timeout(10000);
    let app;
    let mockServer = new MockServer();
    // the base64 encoding of test/assets/img/photo.jpeg
    let b64SamplePhoto = '/9j/4AAQSkZJRgABAQEASABIAAD//gATQ3JlYXRlZCB3aXRoIEdJTVD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAAPAA8DAREAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUH/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAB3gSPLJ//xAAZEAACAwEAAAAAAAAAAAAAAAADBQAEBhT/2gAIAQEAAQUC0zciivnWhG1Jiu7yT//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8BH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8BH//EACQQAAIBAwIGAwAAAAAAAAAAAAECAwQREgATEBQiMTJRQmGh/9oACAEBAAY/AqRknpqYTVAiaaqF0QYsb+S+venlk22xlaNZYQQkoHyX61RNuYctOJ+18uki37w//8QAHRAAAQQCAwAAAAAAAAAAAAAAAQAhMUERURBhcf/aAAgBAQABPyEyZH5fIDYI9Jy05DmESXRJguVolSpbNfPXH//aAAwDAQACAAMAAAAQgE//xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAEDAQE/EB//xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAECAQE/EB//xAAbEAEBAQACAwAAAAAAAAAAAAABESEAMUFRsf/aAAgBAQABPxBdS10SDSFQa7zgbqThYUpR6dkEefckIrG/c8JtOf/Z';

    before(() => {
        app = new Application({
            path: electron,
            args: ['index.js', '--port=8080']
        });
        return app.start().then(() => {
            return mockServer.start(8080);
        });
    });

    beforeEach(() => {
        mockServer.clearExpectations();
    });

    it('navigates to  model edit page', () => {
        mockServer.expect({
            method: 'get',
            endpoint: '/api/model/all',
            response: {
                status: 'success',
                data: {
                    models: [
                        {
                            address: 'm8y7nEtAe',
                            name: 'Resistor',
                            description: 'V = IR',
                            manufacturer: "Pancakes R' Us",
                            vendor: 'Mouzer',
                            location: 'Shelf 14',
                            isFaulty: false,
                            faultDescription: '',
                            price: 10.5,
                            count: 20,
                            items: [
                                'iGwEZUvfA'
                            ]
                        },
                        {
                            address: 'm8y7nFLsT',
                            name: 'Transistor',
                            description: 'Something used in computers',
                            manufacturer: 'Vroom Industries',
                            vendor: 'Fankserrogatoman Inc',
                            location: 'Shelf 2',
                            isFaulty: false,
                            faultDescription: '',
                            price: 4.00,
                            count: 10,
                            items: [
                                'iGwEZVHHE'
                            ]
                        }
                    ]
                }
            }
        });
        mockServer.expect({
            method: 'get',
            endpoint: '/api/model',
            qs: { address: 'm8y7nEtAe' },
            response: {
                status: 'success',
                data: {
                    address: 'm8y7nEtAe',
                    name: 'Resistor',
                    description: 'V = IR',
                    manufacturer: "Pancakes R' Us",
                    vendor: 'Mouzer',
                    location: 'Shelf 14',
                    isFaulty: false,
                    faultDescription: '',
                    price: 10.5,
                    count: 20,
                    items: [
                        'iGwEZUvfA'
                    ]
                }
            }
        });
        return app.client.click('#view-models').then(() => {
            return app.client.waitForVisible('#models', 5000);
        }).then(() => {
            return app.client.elements('#models .model');
        }).then(elements => {
            assert.lengthOf(elements.value, 2);
            return app.client.click('.model:nth-of-type(1) .actionArea img[src*=edit]');
        }).then(() => {
            return app.client.waitForVisible('.create-model-form', 5000);
        }).then(() => {
            mockServer.validate();
        });
    });

    it('edits a model', () => {
        mockServer.expect({
            method: 'patch',
            endpoint: '/api/model',
            qs: {
                address: 'm8y7nEtAe'
            },
            json: {
                name: 'New model name',
                description: 'New description',
                manufacturer: 'New manuf',
                vendor: 'New van door',
                location: 'The sixties',
                price: '3.14',
                faultDescription: '',
                isFaulty: false,
                photo: b64SamplePhoto
            },
            response: {
                status: 'success',
                data: {
                    address: 'm8y7nEtAe',
                    name: 'New model name',
                    description: 'New description',
                    manufacturer: 'New manuf',
                    vendor: 'New van door',
                    location: 'The sixties',
                    faultDescription: '',
                    isFaulty: false,
                    price: 3.14,
                    count: 20,
                    items: [ 'iGwEZUvfA' ],
                    photo: b64SamplePhoto
                }
            }
        });
        mockServer.expect({
            method: 'get',
            endpoint: '/api/model',
            qs: { address: 'm8y7nEtAe' },
            response: {
                status: 'success',
                data: {
                    address: 'm8y7nEtAe',
                    name: 'New model name',
                    description: 'New description',
                    manufacturer: 'New manuf',
                    vendor: 'New van door',
                    location: 'The sixties',
                    faultDescription: '',
                    isFaulty: false,
                    price: 3.14,
                    count: 20,
                    items: [ 'iGwEZUvfA' ],
                    photo: b64SamplePhoto
                }
            }
        });
        return app.client.getValue('#name input').then(text => {
            assert.include(text, 'Resistor');
            return app.client.setValue('#name input', 'New model name');
        }).then(() => {
            return app.client.getValue('#description textarea');
        }).then(text => {
            assert.include(text, 'V = IR');
            return app.client.setValue('#description textarea', 'New description');
        }).then(() => {
            return app.client.getValue('#manufacturer input');
        }).then(text => {
            assert.include(text, "Pancakes R' Us");
            return app.client.setValue('#manufacturer input', 'New manuf');
        }).then(() => {
            return app.client.getValue('#vendor input');
        }).then(text => {
            assert.include(text, 'Mouzer');
            return app.client.setValue('#vendor input', 'New van door');
        }).then(() => {
            return app.client.getValue('#location input');
        }).then(text => {
            assert.include(text, 'Shelf 14');
            return app.client.setValue('#location input', 'The sixties');
        }).then(() => {
            return app.client.getValue('#price input');
        }).then(text => {
            assert.include(text, '10.5');
            return app.client.setValue('#price input', 3.14);
        }).then(() => {
            let filepath = path.resolve(__dirname, '../assets/img', 'photo.jpeg');
            filepath = 'test/assets/img/photo.jpeg';
            return app.client.chooseFile('#photo input', filepath);
        }).then(() => {
            return app.client.submitForm('.create-model-form input[type=submit]');
        }).then(() => {
            return app.client.waitForVisible('#toasts .toast');
        }).then(() => {
            return app.client.getText('#toasts .toast');
        }).then(text => {
            assert.strictEqual(text, 'New model name (m8y7nEtAe) was updated!');
            return app.client.waitForVisible('.model');
        }).then(() => {
            mockServer.validate();
        });
    });

    after(() => {
        if (app && app.isRunning()) {
            return app.stop().then(() => {
                return mockServer.stop();
            });
        }
    });

});
