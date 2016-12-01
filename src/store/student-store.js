import { Store } from 'consus-core/flux';
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
    student = {
        //NOTE: this data is tentative
        id : data.id,
        name: data.name,
        items: data.items,
        hasOverdueItem: store.hasOverdueItems(data.items)
    };
    store.emitChange();
});

store.registerHandler('CLEAR_ALL_DATA', () => {
    student = null;
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    /*API call made from store to update student from server
    after checkout completes, then the store will emit change when
    student is found.*/
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
