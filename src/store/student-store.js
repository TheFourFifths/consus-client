import { Store } from 'consus-core/flux';
import CartStore from './cart-store';

let student = null;
let students = {};
let idAssociation = {};

class StudentStore extends Store {

    hasOverdueItems(items) {
        return items.some(element => {
            let now = Math.floor(Date.now() / 1000);
            return element.timestamp < now;
        });
    }

    getAllDelinquents(){
        let returned = {};
        Object.keys(students).filter(studentId => {
            let student = students[studentId];
            return student.hasOverdueItem || student.overdueCheckins.length > 0;
        }).forEach(studentId => returned[studentId] = students[studentId]);
        return returned;
    }

    getAllStudents(){
        return students;
    }

    getStudent() {
        return student;
    }

    getStudentById(studentId){
        return students[studentId];
    }

    getAssociationData(){
        return idAssociation;
    }

}

const store = new StudentStore();

store.registerHandler('STUDENT_FOUND', data => {
    student = data;
    students[student.id] = student;
    student.hasOverdueItem = store.hasOverdueItems(data.items);
    store.emitChange();
});

store.registerHandler("STUDENTS_FOUND", data => {
    data.forEach(student => {
        student.hasOverdueItem = store.hasOverdueItems(student.items);
        students[student.id] = student;
    });
    store.emitChange();
});

store.registerHandler("STUDENT_UPDATED", student => {
    students[student.id] = student;
    store.emitChange();
});

store.registerHandler('CLEAR_ALL_DATA', () => {
    student = null;
    students = {};
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    student.items = student.items.concat(CartStore.getContents());
    store.emitChange();
});

store.registerHandler('CHECKIN_SUCCESS', data => {
    if (student !== null) {
        let index = student.items.findIndex(element => {
            return element.address === data.itemAddress;
        });

        student.items.splice(index, 1);
    }
    store.emitChange();
});

store.registerHandler('RETRIEVE_ITEM', data => {
    student.items.find(i => i.address === data.itemAddress).status = 'CHECKED_OUT';
    store.emitChange();
});

store.registerHandler('RETRIEVE_MODEL', data => {
    student.models.find(m => m.address === data.modelAddress).status = 'CHECKED_OUT';
    store.emitChange();
});

store.registerHandler('SAVE_ITEM', data => {
    student.items.find(i => i.address === data.itemAddress).status = 'SAVED';
    store.emitChange();
});

store.registerHandler('SAVE_MODEL', data => {
    student.models.find(m => m.address === data.modelAddress).status = 'SAVED';
    store.emitChange();
});

store.registerHandler('CREATE_STUDENT', data => {
    idAssociation = data;
    store.emitChange();
});

export default store;
