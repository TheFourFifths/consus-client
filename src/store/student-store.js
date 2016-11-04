import { Store } from 'consus-core/flux';
import CartStore from './cart-store';

let student = null;

class StudentStore extends Store{
    getStudent() {
        return student;
    }
}

const store = new StudentStore();

store.registerHandler('STUDENT_FOUND', data => {
    student = {
        //NOTE: this data is tentative
        id : data.id,
        name: data.name,
        itemAddresses: data.itemAddresses
    };
    store.emitChange();
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    student.itemAddresses = student.itemAddresses.concat(CartStore.getItems().map(item => item.address));
    store.emitChange();
});

store.registerHandler('CLEAR_ALL_DATA', () => {
    student = null;
    store.emitChange();
});

export default store;
