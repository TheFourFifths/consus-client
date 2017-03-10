import { Store } from 'consus-core/flux';
import CartStore from './cart-store';

let student = null;
let students = [];

class StudentStore extends Store{
    hasOverdueItems(items){
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
}

const store = new StudentStore();

store.registerHandler('STUDENT_FOUND', data => {
    student = data;
    student.hasOverdueItem = store.hasOverdueItems(data.items);
    store.emitChange();
});

store.registerHandler("STUDENTS_FOUND", data => {
    students = data;
    students.forEach(student => {
        student.hasOverdueItem = store.hasOverdueItems(student.items);
    });
    store.emitChange();
});

store.registerHandler("STUDENT_UPDATED", student => {
    students[student.id] == student;
    store.emitChange();
})

store.registerHandler('CLEAR_ALL_DATA', () => {
    student = null;
    students = [];
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    student.items = student.items.concat(CartStore.getItems());
    store.emitChange();
});

store.registerHandler('CHECKIN_SUCCESS', data => {
    let index = student.items.findIndex(element => {
        return element.address === data.itemAddress;
    });

    student.items.splice(index, 1);
    store.emitChange();
});

export default store;
