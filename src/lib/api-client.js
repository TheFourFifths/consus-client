import request from 'request';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';
import AuthStore from '../store/authentication-store';
import StudentStore  from '../store/student-store';

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

export function checkInItem(studentId, itemAddress){
    post('checkin', {
        studentId,
        itemAddress
    }).then(data => {
        Dispatcher.handleAction('CHECKIN_SUCCESS', {
            itemAddress: itemAddress
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
            Dispatcher.handleAction('CLEAR_ADMIN_CODE');
        }else{
            Dispatcher.handleAction('ERROR', {
                error
            });
        }
    });
}

export function createItem(modelAddress) {
    post('item', {
        modelAddress: modelAddress
    });
    hashHistory.push('/');
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
    get('item', {
        address
    })
    .then(data => {
        Dispatcher.handleAction('ITEM_FOUND', {
            address: item.address,
            status: item.status
        });
    }).catch(() => {
        Dispatcher.handleAction('NO_ITEM_FOUND');
    });
}

export function searchItemForCheckout(address) {
    if(StudentStore.getStudent().hasOverdueItem) {
        return Dispatcher.handleAction('ERROR', {
            error:'Student has at least one overdue item.'
        });
    }
    get('item', {
        address
    }).then(data => {
        if (item.status === 'CHECKED_OUT') {
            return Dispatcher.handleAction('ERROR', {
                error: 'This item is already checked out by another student.'
            });
        }
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND', {
            address: item.address,
            status: item.status
        });
    });
}

export function searchModel(id) {
    get('model', {
        id
    })
    .then(data => {
        Dispatcher.handleAction('MODEL_FOUND', {
            id: model.id,
            name: model.name
        });
    }).catch(() => {
        Dispatcher.handleAction('NO_MODEL_FOUND');
    });
}

export function searchStudent(id) {
    get('student', {
        id
    }).then(student => {
        Dispatcher.handleAction('STUDENT_FOUND', {
            //NOTE: data is tentative, more may be required.
            items: student.items,
            id: student.id,
            name: student.name
        });
        hashHistory.push('/student');
    }).catch((e) => {
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

export function getModelsForNewItem() {
    get('model/all', {}
    ).then(data => {
        Dispatcher.handleAction('MODELS_RECEIVED', data);
        hashHistory.push('/items/new');
    });
}
