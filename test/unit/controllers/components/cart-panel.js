import CartController from '../../../../.dist/controllers/components/cart-panel';
import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import { Dispatcher } from 'consus-core/flux';

describe("Cart Controller", () => {

    it('should check in an item', () => {
        let checkIn = sinon.stub(api, "checkIn");
        let spy = sinon.spy(Dispatcher, "handleAction");

        checkIn.returns(
            new Promise(resolve =>{
                resolve({itemAddress:"123456"});
            })
        );
        Dispatcher.handleAction("STUDENT_FOUND",{items:[{itemAddress:"123456"}]});


        return CartController.checkInItem('123456','123456').then(() => {
            assert.isTrue(spy.called);
            assert.strictEqual(spy.getCall(1).args.length,2);
            assert.strictEqual(spy.getCall(1).args[0],"CHECKIN_SUCCESS");

            checkIn.restore();
        });


    });

});
