import request from 'request';

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

//////////////////////
export function checkIn(studentId, itemAddress){
    return post('checkin', {
        studentId,
        itemAddress
    });//.then(data => {
    //     Dispatcher.handleAction('CHECKIN_SUCCESS', {
    //         itemAddress,
    //         modelName: data.modelName
    //     });
    // }).catch(error => {
    //     Dispatcher.handleAction('ERROR', {
    //         error
    //     });
    // });
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
// =======
//     post('checkout', params).then(() => {
//         Dispatcher.handleAction('CHECKOUT_SUCCESS');
//     }).catch(error => {
//         if (error === 'Student has overdue item'){
//             Dispatcher.handleAction('OVERRIDE_REQUIRED');
//         }else if(error === 'Invalid Admin'){
//             Dispatcher.handleAction('INVALID_CODE');
//         }else{
//             Dispatcher.handleAction('ERROR', {
//                 error
//             });
//         }
//     });
// }
//
// export function createItem(modelAddress) {
//     return post('item', {
//         modelAddress
//     }).then(data => {
//         Dispatcher.handleAction('ITEM_CREATED', data);
//         hashHistory.push('/items');
//     });
// >>>>>>> 599aeb0558f48e2c69d35eb9a6da77fde0e204b4
}

export function createModel(name, description, manufacturer, vendor, location, isFaulty, faultDescription, price, count) {
    return post('model', {
        name,
        description,
        manufacturer,
        vendor,
        location,
        isFaulty,
        faultDescription,
        price,
        count
    });
}

export function deleteItem(itemAddress){
    return del('item', { itemAddress });
}

export function getAllItems() {
    return get('item/all', {});
// =======
// export function searchItemForCheckout(address) {
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
//
// export function searchModel(address) {
//     return get('model', {
//         address
//     })
//     .then(data => {
//         Dispatcher.handleAction('MODEL_FOUND', data);
//     }).catch(() => {
//         Dispatcher.handleAction('NO_MODEL_FOUND');
//     });
// }
//
// export function searchStudent(id) {
//     get('student', {
//         id
//     }).then(data => {
//         Dispatcher.handleAction('STUDENT_FOUND', data);
//         hashHistory.push('/student');
//     }).catch(() => {
//         Dispatcher.handleAction('ERROR', {
//             error: 'An invalid student ID was scanned. The student could not be found.'
//         });
//     });
// }
//
// export function justGetAllModels() {
//     get('model/all', {}
//     ).then(data => {
//         Dispatcher.handleAction('MODELS_RECEIVED', data);
//     });
// >>>>>>> 599aeb0558f48e2c69d35eb9a6da77fde0e204b4

}

export function getAllModels() {
    return get('model/all', {});
}

export function searchItem(address) {
    return get('item', {address});
}

export function searchModel(address) {
    return get('model', {address});
// =======
// export function getModelsForNewItem() {
//     get('model/all', {}
//     ).then(data => {
//         Dispatcher.handleAction('MODELS_RECEIVED', data);
//         hashHistory.push('/items/new');
//     });
// }
// export function deleteItem(item){
//     return del('item', {
//         itemAddress: item.address,
//         modelAddress: item.modelAddress
//     }).then(data => {
//         data.itemAddress = item.address;
//         Dispatcher.handleAction('ITEMS_RECEIVED', data);
//         Dispatcher.handleAction('ITEM_DELETED', data);
//     }).catch(data => {
//         Dispatcher.handleAction('ERROR', {
//             error: data
//         });
//     });
// >>>>>>> 599aeb0558f48e2c69d35eb9a6da77fde0e204b4
}

export function searchStudent(id) {
    return get('student', {id});
}

