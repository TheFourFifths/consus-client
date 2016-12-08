import CartController from '../../../../.dist/controllers/components/cart-panel';
import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';

describe("Cart Controller", () => {

    it('should check in an item', function(done){
        let checkIn = sinon.stub(api, "checkIn");
        let spy = sinon.spy(Dispatcher, "handleAction");

        checkIn.onCall(0).returns(Promise.resolve({address:"123456"}));

        Dispatcher.handleAction("STUDENT_FOUND",{items:[]});

        CartController.checkInItem('123456','123456').then(() => {
            assert.isTrue(spy.called);
            assert.strictEqual(spy.spyCall.args[0].length,2);
            assert.strictEqual(spy.spyCall.args[0][1],"CHECKIN_SUCCESS");

            checkIn.restore();
        });


    });

});
