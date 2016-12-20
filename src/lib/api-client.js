import request from 'request';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';
import AuthStore from '../store/authentication-store';

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

function del(endpoint, data) {
    let options = {
        uri: 'http://localhost/api/' + endpoint,
        method: 'DELETE',
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

export function checkInItem(studentId, itemAddress){
    post('checkin', {
        studentId,
        itemAddress
    }).then(data => {
        Dispatcher.handleAction('CHECKIN_SUCCESS', {
            itemAddress,
            modelName: data.modelName
        });
    }).catch(error => {
        Dispatcher.handleAction('ERROR', {
            error
        });
    });
}

export function checkOutItems(studentId, itemAddresses){
    let params = {
        studentId,
        itemAddresses
    };

    let code = AuthStore.getAdminCode();

    if (code) params.adminCode = code;

    post('checkout', params).then(() => {
        Dispatcher.handleAction('CHECKOUT_SUCCESS');
    }).catch(error => {
        if (error === 'Student has overdue item'){
            Dispatcher.handleAction('OVERRIDE_REQUIRED');
        }else if(error === 'Invalid Admin'){
            Dispatcher.handleAction('INVALID_CODE');
        }else{
            Dispatcher.handleAction('ERROR', {
                error
            });
        }
    });
}

export function createItem(modelAddress) {
    return post('item', {
        modelAddress
    }).then(data => {
        Dispatcher.handleAction('ITEM_CREATED', data);
        hashHistory.push('/items');
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
        Dispatcher.handleAction('ERROR', {
            error: 'The server was not able to create the item. Is the server down?'
        });
    });
}

export function searchItem(address) {
    return get('item', {
        address
    })
    .then(data => {
        Dispatcher.handleAction('ITEM_FOUND', data);
    }).catch(() => {
        Dispatcher.handleAction('NO_ITEM_FOUND');
    });
}

export function searchItemForCheckout(address) {
    get('item', {
        address
    }).then(data => {
        if (data.status === 'CHECKED_OUT') {
            return Dispatcher.handleAction('ERROR', {
                error: 'This item is already checked out by another student.'
            });
        }
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND', data);
    });
}

export function searchModel(address) {
    return get('model', {
        address
    })
    .then(data => {
        Dispatcher.handleAction('MODEL_FOUND', data);
    }).catch(() => {
        Dispatcher.handleAction('NO_MODEL_FOUND');
    });
}

export function searchStudent(id) {
    get('student', {
        id
    }).then(data => {
        Dispatcher.handleAction('STUDENT_FOUND', data);
        hashHistory.push('/student');
    }).catch(() => {
        Dispatcher.handleAction('ERROR', {
            error: 'An invalid student ID was scanned. The student could not be found.'
        });
    });
}

export function justGetAllModels() {
    get('model/all', {}
    ).then(data => {
        Dispatcher.handleAction('MODELS_RECEIVED', data);
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

export function getModelsForNewItem() {
    get('model/all', {}
    ).then(data => {
        Dispatcher.handleAction('MODELS_RECEIVED', data);
        hashHistory.push('/items/new');
    });
}

export function deleteItem(item){
    return del('item', {
        itemAddress: item.address,
        modelAddress: item.modelAddress
    }).then(data => {
        data.itemAddress = item.address;
        Dispatcher.handleAction('ITEMS_RECEIVED', data);
        Dispatcher.handleAction('ITEM_DELETED', data);
    }).catch(data => {
        Dispatcher.handleAction('ERROR', {
            error: data
        });
    });
}
