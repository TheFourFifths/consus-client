import { Store } from 'consus-core/flux';
import CartStore from './cart-store';

let student = null;

class StudentStore extends Store{
    hasOverdueItems(){
        return false;
    }

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
        itemAddresses: data.itemAddresses,
        hasOverdueItem: store.hasOverdueItems()
    };
    store.emitChange();
});

store.registerHandler('NO_STUDENT_FOUND', () => {
    student = null;
    store.emitChange();
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    student.itemAddresses = student.itemAddresses.concat(CartStore.getItems().map(item => item.address));
    store.emitChange();
});

store.registerHandler('CHECKIN_SUCCESS', data => {
    student.itemAddresses.splice(student.itemAddresses.indexOf(data.itemAddress), 1);
    store.emitChange();
});

export default store;
