import request from 'request';
import config from 'config';

let PROTOCOL = config.get('server.protocol');
let HOST = config.get('server.ip');
let PORT = config.get('server.port');

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
            if (response.statusCode !== 200) {
                return reject(body);
            }
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
export function addFault(itemAddress, faultDescription){

    return post('item/fault', {
        itemAddress,
        faultDescription
    });
}

export function addUnserializedModel(modelAddress) {
    return patch('model/instock', {
        modelAddress
    });
}

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

export function checkOutContents(studentId, equipment, code){
    let params = {
        studentId,
        equipment
    };
    if (typeof code !== 'undefined') {
        params.adminCode = code;
    }
    return post('checkout', params);
}

export function createItem(modelAddress){
    return post('item', { modelAddress });
}

export function createModel(name, description, manufacturer, vendor, location, allowCheckout, price, count, photo) {
    return post('model', {
        name,
        description,
        manufacturer,
        vendor,
        location,
        allowCheckout,
        price,
        count,
        photo
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

export function getAllFaultyItems() {
    return get('item/fault/all');
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

export function retrieveItem(itemAddress) {
    return post('item/retrieve', {
        itemAddress
    });
}

export function retrieveModel(studentId, modelAddress) {
    return post('model/retrieve', {
        studentId,
        modelAddress
    });
}

export function saveItem(itemAddress) {
    return post('item/save', {
        itemAddress
    });
}

export function saveModel(studentId, modelAddress) {
    return post('model/save', {
        studentId,
        modelAddress
    });
}

export function removeItemFault(itemAddress) {
    return del('item/fault', {
        itemAddress
    });
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

export function searchStudent(rfid) {
    return get('student', {
        rfid
    });
}

export function updateModel(address, name, description, manufacturer, vendor, location, allowCheckout, price, count, changeStock, inStock, base64Photo) {
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
        inStock: inStock,
        photo: base64Photo
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

export function checkOutContentsLongterm(studentId, equipment, dueDate, professor, code){
    let params = {
        studentId,
        equipment,
        dueDate,
        professor
    };
    if (typeof code !== 'undefined') {
        params.adminCode = code;
    }
    return post('checkout/longterm', params);
}
export function patchItemDueDate(dueDate, itemAddress, studentId){
    return patch('item/duedate', {itemAddress}, {dueDate, studentId});
}

export function createRfidToStudentAssosciation(studentId, rfid){
    let qs = {
        studentId
    };
    let data = {
        rfid
    };
    return patch('student/rfid', qs, data);
}

export function createStudent(studentId, rfid, major, email, name){
    let body = {
        studentId,
        rfid,
        major,
        email,
        name
    };
    return post('student', body);
}
