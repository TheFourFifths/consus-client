import request from 'request';

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

// export function createItem(modelAddress) {
//     post('item', {
//         modelAddress: modelAddress
//     });
//     hashHistory.push('/');
// }

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

// export function searchItem(address) {
//     get('item', {
//         address
//     })
//     .then(data => {
//         Dispatcher.handleAction('ITEM_FOUND', data);
//     }).catch(() => {
//         Dispatcher.handleAction('NO_ITEM_FOUND');
//     });
// }

// export function searchItemForCheckout(address) {
//     if(StudentStore.getStudent().hasOverdueItem) {
//         return Dispatcher.handleAction('ERROR', {
//             error:'Student has at least one overdue item.'
//         });
//     }
//     get('item', {
//         address
//     }).then(data => {
//         if (data.status === 'CHECKED_OUT') {
//             return Dispatcher.handleAction('ERROR', {
//                 error: 'This item is already checked out by another student.'
//             });
//         }
//         Dispatcher.handleAction('CHECKOUT_ITEM_FOUND', data);
//     });
// }

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
//////////////////////
export function checkIn(studentId, itemAddress){
    return post('checkin', {
        studentId,
        itemAddress
    });
}

export function checkOutItems(studentId, itemAddresses, code){
    let params = {
        studentId,
        itemAddresses
    };

    if (code) params.adminCode = code;

    return post('checkout', params);
}

export function createItem(modelAddress){
    return post('item', { modelAddress });
}

export function getAllItems() {
    return get('item/all', {});
}

export function getAllModels() {
    return get('model/all', {});
}

export function searchItem(address) {
    return get('item', { address });
}


