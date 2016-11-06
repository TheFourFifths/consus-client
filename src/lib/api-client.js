import request from 'request';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';
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
            itemAddress: data.itemAddress
        });
    }).catch(error => {
        Dispatcher.handleAction('ERROR', {
            error
        });
    });
}

export function checkOutItems(studentId, itemAddresses, adminCode){
    let params = {
        studentId,
        itemAddresses
    };

    if (adminCode) params.adminCode = adminCode;

    post('checkout', params).then(() => {
        Dispatcher.handleAction('CHECKOUT_SUCCESS');
    }).catch(error => {
        if (error === 'Student has overdue item'){
            //TODO Handle action for override modal.
        }else {
            Dispatcher.handleAction('ERROR', {
                error
            });
        }
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
    if(!StudentStore.getStudent().hasOverdueItem) {
        get('item', {
            address
        }).then(data => {
            Dispatcher.handleAction('CHECKOUT_ITEM_FOUND', {
                address: data.item.address,
                status: data.item.status
            });
        });
    } else {
        //TODO Handle action for override modal.
    }
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
            items: data.student.items,
            id: data.student.id,
            name: data.student.name
        });
        hashHistory.push('/student');
    }).catch(() => {
        Dispatcher.handleAction('NO_STUDENT_FOUND');
    });
}
