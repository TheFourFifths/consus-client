import { Dispatcher } from 'consus-flux';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';

describe('StudentStore', () => {

    //TODO: Swap out tests to use new handler format

    it('should instantiate without a student', () => {
        assert.strictEqual(StudentStore.getStudent(), null);
    });

    it('should update the student', () => {
        Dispatcher.handleAction('STUDENT_FOUND',{
            id: '432345',
            name: 'Poe',
            items: [1,2,3,4,5]
        });
        let student = StudentStore.getStudent();
        assert.strictEqual(student.id,'432345');
        assert.strictEqual(student.name,'Poe');
    });

    it('should handle a student not being found', () => {
        Dispatcher.handleAction('NO_STUDENT_FOUND');
        assert.strictEqual(StudentStore.getStudent(),null);
    });

    it('should clear out the student when checkout succeeds',()=>{
        //First put student in the store
        Dispatcher.handleAction('STUDENT_FOUND',{
            id: '432345',
            name: 'Poe',
            items: [1,2,3,4,5]
        });

        Dispatcher.handleAction('CHECKOUT_SUCCESS');
        assert.strictEqual(StudentStore.getStudent(),null);
    });
});
