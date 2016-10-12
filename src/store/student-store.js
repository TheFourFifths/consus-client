import { Store } from 'consus-flux';

let student = null;

class StudentStore extends Store{
    getStudent() {
        return student;
    }
}

const store = new StudentStore();

store.registerHandler('STUDENT_FOUND', data => {
    student = {
        //TODO: Relevant Data
        id : data.id,
        name: data.name,
        items: data.items
    };
    store.emitChange();
});

store.registerHandler('NO_STUDENT_FOUND', () => {
    student = null;
    store.emitChange();
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    student = null;
    store.emitChange();
});

export default store;
