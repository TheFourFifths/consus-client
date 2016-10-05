import request from 'request';
import { Dispatcher } from 'consus-flux';

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
        Dispatcher.handleAction({
            type: 'ITEM_FOUND',
            data: {
                id: body.item.id,
                status: body.item.status
            }
        });
    })
    .catch(message => {
        Dispatcher.handleAction({
            type: 'NO_ITEM_FOUND',
        });
    });
}

export function searchModel(id) {
    get('model', {
        id
    })
    .then(body => {
        Dispatcher.handleAction({
            type: 'MODEL_FOUND',
            data: {
                id: body.model.id,
                name: body.model.name
            }
        });
    })
    .catch(message => {
        Dispatcher.handleAction({
            type: 'NO_MODEL_FOUND',
        });
    });
}

export function searchStudent(id){
    get('TODO',{
        id
    }).then(body => {
        Dispatcher.handleAction({
            type: 'STUDENT_FOUND',
            data: {
                //TODO: Relevant Data
            }
        })
    }).catch(message => {
        Dispatcher.handleAction({
            type:'NO_STUDENT_FOUND'
        })
    })
}
