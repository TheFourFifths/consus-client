import { Dispatcher } from 'consus-core/flux';
import AuthStore from '../../../.dist/store/authentication-store';
import { assert } from 'chai';

describe('AuthStore', () => {
    it('Should start with no adminCode', () => {
        assert.isNull(AuthStore.getAdminCode());
    });

    it('Should require override if override required', () => {
        Dispatcher.handleAction('OVERRIDE_REQUIRED');
        assert.isTrue(AuthStore.overrideNeeded());
    });

    it('Should not require override if Admin code is hurt', () => {
        Dispatcher.handleAction('OVERRIDE_REQUIRED');
        assert.isTrue(AuthStore.overrideNeeded());
        Dispatcher.handleAction('ADMIN_CODE_ENTERED', {
            adminCode: '2013'
        });
        assert.isFalse(AuthStore.overrideNeeded());
    });

    it('Should clear override required on checkout success', () => {
        Dispatcher.handleAction('STUDENT_FOUND',{
            id: '432345',
            name: 'Poe',
            items: [{address:1},{address:2},{address:3},{address:4}]
        });
        Dispatcher.handleAction('CHECKOUT_SUCCESS');
        Dispatcher.handleAction('OVERRIDE_REQUIRED');
        assert.isTrue(AuthStore.overrideNeeded());
        Dispatcher.handleAction('CHECKOUT_SUCCESS');
        assert.isFalse(AuthStore.overrideNeeded());
    });

    it('Should clear admin code on checkout success', () => {
        Dispatcher.handleAction('ADMIN_CODE_ENTERED', {
            adminCode: '2015'
        });
        assert.strictEqual(AuthStore.getAdminCode(), '2015');
        Dispatcher.handleAction('CHECKOUT_SUCCESS');
        assert.isNull(AuthStore.getAdminCode());
    });

    it('Should clear admin code on code clear', () => {
        Dispatcher.handleAction('ADMIN_CODE_ENTERED', {
            adminCode: '2015'
        });
        assert.strictEqual(AuthStore.getAdminCode(), '2015');
        Dispatcher.handleAction('CLEAR_ADMIN_CODE');
        assert.isNull(AuthStore.getAdminCode());
    });
    
    it("Should reset the states when admin window is called", () => {
        Dispatcher.handleAction('OVERRIDE_REQUIRED');
        assert.isTrue(AuthStore.overrideNeeded());
        Dispatcher.handleAction('CLEAR_ADMIN_WINDOW');
        assert.isFalse(AuthStore.overrideNeeded());
    });
});
