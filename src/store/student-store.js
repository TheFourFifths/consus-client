import { Store } from 'consus-core/flux';
import CartStore from './cart-store';
import { searchStudent } from '../lib/api-client';

let student = null;

class StudentStore extends Store{
    hasOverdueItems(items){
        return items.some(element => {
            return element.timestamp <= new Date().getTime();
        });
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

store.registerHandler('CLEAR_ALL_DATA', () => {
    student = null;
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    student.items = student.items.concat(CartStore.getItems());
    store.emitChange();//This isn't needed but you guys wanted it.
    searchStudent(student.id);
});

store.registerHandler('CHECKIN_SUCCESS', data => {
    let index = student.items.findIndex(element => {
        return element.address === data.itemAddress;
    });

    student.items.splice(index, 1);
    store.emitChange();
});

export default store;
