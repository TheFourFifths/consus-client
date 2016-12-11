import { assert } from "chai";
import * as api from "../../../.dist/lib/api-client";
import request from 'request';
import sinon from 'sinon';

describe("api-client", ()=> {
    it("Does the checkin", () => {
        let spy = sinon.spy(request, "post");

        return api.checkIn("123456", "4311234").catch(() => {
            assert.isTrue(spy.called);
            assert.lengthOf(spy.getCall(0).args, 2);
            assert.strictEqual(spy.getCall(0).args[0].uri, 'http://localhost/api/checkin');
        });
    });
});
