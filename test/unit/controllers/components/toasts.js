import { assert } from "chai";
import sinon from 'sinon';
import ToastsController from '../../../../.dist/controllers/components/toasts';
import { Dispatcher } from 'consus-core/flux';

describe("ToastsController",() => {
    describe("popToast",() => {
        it('Dispatches "POP_TOAST" with id when called.', () => {
            let spy = sinon.spy(Dispatcher, "handleAction");

            ToastsController.popToast("123");

            assert.isTrue(spy.called);
            assert.lengthOf(spy.getCall(0).args, 2);
            assert.strictEqual(spy.getCall(0).args[0], "POP_TOAST");
            assert.strictEqual(spy.getCall(0).args[1].id, "123");
            spy.restore();
        });
        after(() => {
            Dispatcher.handleAction("CLEAR_ALL_DATA");
        });
    });
});
