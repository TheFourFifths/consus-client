import { Store } from 'consus-core/flux';
import CartStore from './cart-store';

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
    store.emitChange();
});

store.registerHandler('CLEAR_ALL_DATA', () => {
    student = null;
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
