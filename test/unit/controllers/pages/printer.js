import { assert } from "chai";
import sinon from 'sinon';
import * as router from 'react-router';
import { Dispatcher } from 'consus-core/flux';
import PrinterController from '../../../../.dist/controllers/pages/printer';

describe('PrinterController', () => {

    describe('prompt to print', () => {

        let dispatcherSpy, spy;

        before(() => {
            dispatcherSpy = sinon.spy(Dispatcher, 'handleAction');
            router.hashHistory = {};
        });

        it('Dispatches "PROMPT_TO_PRINT"', () => {
            spy = router.hashHistory.push = sinon.spy();
            PrinterController.promptToPrint('pretend that this is a model address');
            assert.isTrue(dispatcherSpy.calledOnce);
            assert.strictEqual(dispatcherSpy.getCall(0).args.length, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], 'PROMPT_TO_PRINT');
            assert.deepEqual(dispatcherSpy.getCall(0).args[1], {
                text: 'pretend that this is a model address'
            });
            assert.isTrue(spy.called);
        });

        it('Closes', () => {
            spy = router.hashHistory.goBack = sinon.spy();
            PrinterController.close();
            assert.isTrue(spy.called);
        });

        after(() => {
            dispatcherSpy.restore();
        });
    });
});
