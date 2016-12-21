import { Store } from 'consus-core/flux';
import CartStore from './cart-store';

let student = null;

class StudentStore extends Store{
    hasOverdueItems(items){
        return items.some(element => {
            let now = Math.floor(Date.now() / 1000);
            return element.timestamp < now;
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
    student.items = student.items.concat(CartStore.getContents());
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
