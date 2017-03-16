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

export function call(endpoint, method, qs, json) {
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

function patch(endpoint, qs, data) {
    return call(endpoint, 'PATCH', qs, data);
}

//////////////////////
export function checkIn(studentId, itemAddress){
    return post('checkin', {
        studentId,
        itemAddress
    });
}

export function checkInModel(studentId, modelAddress, quantity){
    return post('checkin/model', {
        studentId,
        modelAddress,
        quantity
    });
}

export function checkOutContents(studentId, equipmentAddresses, code){
    let params = {
        studentId,
        equipmentAddresses
    };
    if (typeof code !== 'undefined') {
        params.adminCode = code;
    }
    return post('checkout', params);
}

export function createItem(modelAddress){
    return post('item', { modelAddress });
}

export function createModel(name, description, manufacturer, vendor, location, allowCheckout, price, count) {
    return post('model', {
        name,
        description,
        manufacturer,
        vendor,
        location,
        allowCheckout,
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

export function deleteModel(modelAddress) {
    return del('model', { modelAddress });
}

export function getAllItems() {
    return get('item/all');
}

export function getAllModels() {
    return get('model/all');
}

export function getModelAndItems(address) {
    return get('model/children', {
        modelAddress: address
    });
}

export function getAllStudents() {
    return get('student/all');
}

export function getOverdueItems() {
    return get('item/overdue');
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

export function updateModel(address, name, description, manufacturer, vendor, location, allowCheckout, price, count, changeStock, inStock) {
    return patch('model', { address }, {
        name: name,
        description: description,
        manufacturer: manufacturer,
        vendor: vendor,
        location: location,
        allowCheckout: allowCheckout,
        price: price,
        count: count,
        changeStock: changeStock,
        inStock: inStock
    });
}

export function updateStudent(student){
    return patch('student', {id: student.id}, student);
}

export function uploadStudents(data){
    return post('student', {
        data
    });
}
