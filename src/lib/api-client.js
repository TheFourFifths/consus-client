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
            alert(body);
            if (body.status === 'success') {
                resolve(body);
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
                resolve(body);
            } else {
                reject(body.message);
            }
        });
    });
}

export function checkOutItems(studentId,items){
    post('checkout',{
        studentId,
        items
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
    .then(body => {
        Dispatcher.handleAction('ITEM_FOUND',{
            id: body.item.id,
            status: body.item.status
        });
    }).catch(() => {
        Dispatcher.handleAction('NO_ITEM_FOUND');
    });
}

export function searchItemForCheckout(id){
    get('item',{
        id
    }).then(body => {
        Dispatcher.handleAction('CHECKOUT_ITEM_FOUND',{
            id: body.item.id,
            status: body.item.status
        });
    });
}

export function searchModel(id) {
    get('model', {
        id
    })
    .then(body => {
        Dispatcher.handleAction('MODEL_FOUND',{
            id: body.model.id,
            name: body.model.name
        });
    }).catch(() => {
        Dispatcher.handleAction('NO_MODEL_FOUND');
    });
}

export function searchStudent(id){
    get('student',{
        id
    }).then(body => {
        console.log(body);
        Dispatcher.handleAction('STUDENT_FOUND',{
            //NOTE: data is tentative, more may be required.
            items: body.data.model.itemAddresses,
            id: body.data.model.id,
            name: body.data.model.name
        });
        console.log(7);
        hashHistory.push('/student');
    }).catch(() => {
        console.log(3);
        Dispatcher.handleAction('NO_STUDENT_FOUND');
        console.log(4);
    });
}
