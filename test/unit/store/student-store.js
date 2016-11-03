import { Dispatcher } from 'consus-core/flux';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';

describe('StudentStore', () => {
    it('should instantiate without a student', () => {
        assert.isNull(StudentStore.getStudent());
    });

    it('should get the student', () => {
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

    it("should remove an item from a student's list when it's checked in", () =>{
        //Set Up Test State
        Dispatcher.handleAction('STUDENT_FOUND',{
            id: '432345',
            name: 'Poe',
            items: [{address:1},{address:2},{address:3},{address:4}]
        });
        let student = StudentStore.getStudent();
        //validate test state
        assert.strictEqual(student.items.length,4);

        Dispatcher.handleAction('CHECKIN_SUCCESS',{
            itemAddress: 4
        });

        student = StudentStore.getStudent();

        assert.strictEqual(student.items.length, 3);
        assert.strictEqual(student.items.indexOf(4), -1);
    });
});
