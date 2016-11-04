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

export function checkOutItems(studentId, itemAddresses){
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

export function createModel(id, name) {
    post('model', {
        id,
        name
    });
}

export function searchItem(id) {
    get('item', {
        id
    })
    .then(data => {
        Dispatcher.handleAction('ITEM_FOUND', {
            id: data.item.id,
            status: data.item.status
        });
    }).catch(() => {
        Dispatcher.handleAction('NO_ITEM_FOUND');
    });
}

export function searchItemForCheckout(address){
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

export function searchStudent(id){
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
        Dispatcher.handleAction('ERROR', {
            error: 'An invalid student ID was scanned. The student could not be found.'
        });
    });
}
