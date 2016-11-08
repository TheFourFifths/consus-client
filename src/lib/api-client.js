import request from 'request';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

function get(endpoint, data) {
    let options = {
        uri: 'http://localhost/api/' + endpoint,
        method: 'GET',
        qs: data
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            body = JSON.parse(body);
            if (body.status === 'success') {
                resolve(body.data);
            } else {
                reject(body.message);
            }
        });
    });
}

function post(endpoint, data) {
    let options = {
        uri: 'http://localhost/api/' + endpoint,
        method: 'POST',
        json: data
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (body.status === 'success') {
                resolve(body.data);
            } else {
                reject(body.message);
            }
        });
    });
}

export function checkInItem(studentId, itemAddress) {
    post('checkin', {
        studentId,
        itemAddress
    }).then(data => {
        Dispatcher.handleAction('CHECKIN_SUCCESS', {
            itemAddress: data.itemAddress
        });
    }).catch(data => {
        Dispatcher.handleAction('ERROR', {
            error: data.error
        });
    });
}

export function checkOutItems(studentId, itemAddresses) {
    post('checkout', {
        studentId,
        itemAddresses
    }).then(() => {
        Dispatcher.handleAction('CHECKOUT_SUCCESS');
    }).catch(() => {
        Dispatcher.handleAction('CHECKOUT_FAILED');
    });
}

export function createItem(id) {
    post('item', {
        id
    });
}

export function createModel(name, description, manufacturer, vendor, location, isFaulty, faultDescription, price, count) {
    post('model', {
        name: name,
        description: description,
        manufacturer: manufacturer,
        vendor: vendor,
        location: location,
        isFaulty: isFaulty,
        faultDescription: faultDescription,
        price: price,
        count: count
    }).then(data => {
        Dispatcher.handleAction('MODEL_CREATED', data);
        hashHistory.push("/models");

    }).catch(() => {
        //Todo pop-up a modal explaining server is down
    });
}

export function searchItem(address) {
    get('item', {
        address
    })
    .then(data => {
        Dispatcher.handleAction('ITEM_FOUND', {
            address: data.item.address,
            status: data.item.status
        });
    }).catch(() => {
        Dispatcher.handleAction('NO_ITEM_FOUND');
    });
}

export function searchItemForCheckout(address) {
    get('item', {
        address
    }).then(data => {
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND', {
            address: data.item.address,
            status: data.item.status
        });
    });
}

export function searchModel(id) {
    get('model', {
        id
    })
    .then(data => {
        Dispatcher.handleAction('MODEL_FOUND', {
            id: data.model.id,
            name: data.model.name
        });
    }).catch(() => {
        Dispatcher.handleAction('NO_MODEL_FOUND');
    });
}

export function searchStudent(id) {
    get('student', {
        id
    }).then(data => {
        Dispatcher.handleAction('STUDENT_FOUND', {
            //NOTE: data is tentative, more may be required.
            itemAddresses: data.student.itemAddresses,
            id: data.student.id,
            name: data.student.name
        });
        hashHistory.push('/student');
    }).catch(() => {
        Dispatcher.handleAction('NO_STUDENT_FOUND');
    });
}

export function getAllModels() {
    get('model/all', {}
    ).then(data => {
        Dispatcher.handleAction('MODELS_RECEIVED', data);
        hashHistory.push('/models');
    });
}

export function getAllItems() {
    get('item/all', {}
    ).then(data => {
        Dispatcher.handleAction('ITEMS_RECEIVED', data);
        hashHistory.push('/items');
    });
}
