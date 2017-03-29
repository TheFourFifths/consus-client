import { Store } from 'consus-core/flux';
import CartStore from './cart-store';

let student = null;
let students = {};

class StudentStore extends Store {

    hasOverdueItems(items) {
        return items.some(element => {
            let now = Math.floor(Date.now() / 1000);
            return element.timestamp < now;
        });
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

export default store;
