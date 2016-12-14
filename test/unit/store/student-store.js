import { Dispatcher } from 'consus-core/flux';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';

describe('StudentStore', () => {

    beforeEach(() => {
        return Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without a student', () => {
        assert.isNull(StudentStore.getStudent());
    });

    it('should get the student', () => {
        Dispatcher.handleAction('STUDENT_FOUND',{
            id: '432345',
            name: 'Poe',
            items: []
        });
        let student = StudentStore.getStudent();
        assert.strictEqual(student.id,'432345');
        assert.strictEqual(student.name,'Poe');
    });

    it('should handle a student not being found', () => {
        Dispatcher.handleAction('NO_STUDENT_FOUND');
        assert.strictEqual(StudentStore.getStudent(), null);
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

    it("should add item to student's list on checkout success", () => {
        Dispatcher.handleAction("STUDENT_FOUND", {
            id: "32423",
            name: "Poe",
            items: []
        });

        Dispatcher.handleAction("CHECKOUT_ITEM_FOUND", {
            address: "123",
            status: "AVAILABLE"
        });

        Dispatcher.handleAction("CHECKOUT_SUCCESS");

        let student = StudentStore.getStudent();

        assert.strictEqual(student.items[0].address, "123");
    });

    it("Should know if the student has an overdue item", () => {
        //Test that it will find an overdue item
        Dispatcher.handleAction('STUDENT_FOUND',{
            id: '432432432423432432432432432',
            name: 'Poe',
            items: [{
                address: 1,
                timestamp: 0
            }]
        });

        let student = StudentStore.getStudent();

        assert.strictEqual(student.items.length, 1);
        assert(student.hasOverdueItem);

        //Test that it will not say an item is overdue if it's not.
        Dispatcher.handleAction('STUDENT_FOUND',{
            id: '432432432423432432432432432',
            name: 'Poe',
            items: [{
                address: 1,
                timestamp: new Date().getTime() + 100000
            }]
        });

        student = StudentStore.getStudent();

        assert.strictEqual(student.items.length, 1);
        assert.isFalse(student.hasOverdueItem);
    });

});
