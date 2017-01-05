import request from 'request';

let PROTOCOL = 'http';
let HOST = 'localhost';
let PORT = 80;

export function changeProtocol(protocol) {
    PROTOCOL = protocol;
}

export function changeHost(host) {
    HOST = host;
}

export function changePort(port) {
    PORT = port;
}

function call(endpoint, method, qs, json) {
    let options = {
        uri: `${PROTOCOL}://${HOST}:${PORT}/api/${endpoint}`,
        method
    };
    if (typeof qs !== 'undefined') {
        options.qs = qs;
    }
    if (typeof json !== 'undefined') {
        options.json = json;
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (typeof body === 'string') {
                body = JSON.parse(body);
            }
            if (body.status === 'success') {
                resolve(body.data);
            } else {
                reject(body.message);
            }
        });
    });
}

function del(endpoint, data) {
    return call(endpoint, 'DELETE', data);
}

function get(endpoint, data) {
    return call(endpoint, 'GET', data);
}

function post(endpoint, data) {
    return call(endpoint, 'POST', undefined, data);
}

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
    if (typeof code !== 'undefined') {
        params.adminCode = code;
    }
    return post('checkout', params);
}

export function createItem(modelAddress){
    return post('item', { modelAddress });
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

export function deleteItem(item){
    return del('item', {
        itemAddress: item.address,
        modelAddress: item.modelAddress
    });
}

export function getAllItems() {
    return get('item/all');
}

export function getAllModels() {
    return get('model/all');
}

export function searchItem(address) {
    return get('item', {
        address
    });
}

export function searchModel(address) {
    return get('model', {
        address
    });
}

export function searchStudent(id) {
    return get('student', {
        id
    });
}

export function uploadStudents(data){
    return get('model/all');
}
