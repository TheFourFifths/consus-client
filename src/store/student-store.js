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
    };
    store.emitChange();
});

store.registerHandler('NO_STUDENT_FOUND', () => {
    student = null;
    store.emitChange();
});

export default store;
