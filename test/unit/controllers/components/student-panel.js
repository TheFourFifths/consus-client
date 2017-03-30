import { assert } from "chai";
import sinon from 'sinon';
import * as api from '../../../../.dist/lib/api-client';
import StudentPanelController from '../../../../.dist/controllers/components/student-panel';
import { Dispatcher } from 'consus-core/flux';

describe("StudentPanelController",() => {

    let dispatcherSpy, getAllModels, saveItem, saveModel;

    beforeEach(() => {
        dispatcherSpy = sinon.spy(Dispatcher, "handleAction");
        getAllModels = sinon.stub(api, "getAllModels");
        reserveItem = sinon.stub(api, 'saveItem');
    });

    afterEach(() => {
        dispatcherSpy.restore();
        getAllModels.restore();
        saveItem.restore();
        saveModel.restore();
        Dispatcher.handleAction("CLEAR_ALL_DATA");
    });

    it("getModels", () => {
        getAllModels.returns(
            new Promise(resolve => {
                resolve({models:[]});
            })
        );
        return StudentPanelController.getModels().then(() => {
            assert.isTrue(dispatcherSpy.called);
            assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "MODELS_RECEIVED");
        });
    });

    it("countDuplicateModels",() => {
        let models = [{address: 1, name: 'one'}, {address: 2, name: 'two'}, {address: 3, name: 'three'}, {address: 1, name: 'one'}];
        assert.strictEqual(StudentPanelController.countDuplicateModels(models)[0].quantity, 2);
        assert.strictEqual(StudentPanelController.countDuplicateModels(models)[1].quantity, 1);
        assert.strictEqual(StudentPanelController.countDuplicateModels(models)[2].quantity, 1);
    });

    it("reserveItem", () => {
        saveItem.returns(
            new Promise(resolve => {
                resolve({});
            })
        );
        return StudentController.reserveItem('iGwEZUvfA').then(() => {
            assert.isTrue(dispatcherSpy.called);
            assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "SAVE_ITEM");
            assert.deepEqual(dispatcherSpy.getCall(0).args[1], {
                itemAddress: 'iGwEZUvfA'
            });
        });
    });

    it("reserveModel", () => {
        saveModel.returns(
            new Promise(resolve => {
                resolve({});
            })
        );
        return StudentController.reserveModel(123456, 'iGwEZUvfA').then(() => {
            assert.isTrue(dispatcherSpy.called);
            assert.lengthOf(dispatcherSpy.getCall(0).args, 2);
            assert.strictEqual(dispatcherSpy.getCall(0).args[0], "SAVE_MODEL");
            assert.deepEqual(dispatcherSpy.getCall(0).args[1], {
                studentId: 123456,
                itemAddress: 'iGwEZUvfA'
            });
        });
    });

});
