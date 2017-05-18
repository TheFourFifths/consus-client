import { Store } from 'consus-core/flux';

//Flag to bring up the input model for admin override.
let overrideNeeded = false;

let adminCode = null;

class AuthenticationStore extends Store {

    getAdminCode(){
        return adminCode;
    }

    overrideNeeded(){
        return overrideNeeded && adminCode === null;
    }

}

const store = new AuthenticationStore();

store.registerHandler('CHECKOUT_SUCCESS', () => {
    overrideNeeded = false;
    adminCode = null;
    store.emitChange();
});

store.registerHandler('OVERRIDE_REQUIRED', () => {
    overrideNeeded = true;
    store.emitChange();
});

store.registerHandler('ADMIN_CODE_ENTERED', data => {
    adminCode = data.adminCode;
    store.emitChange();
});

store.registerHandler('INVALID_CODE', () => {
    adminCode = null;
    store.emitChange();
});

store.registerHandler('CLEAR_ADMIN_WINDOW', () => {
    adminCode = null;
    overrideNeeded = false;
    store.emitChange();
});

store.registerHandler("CLEAR_ALL_DATA", () => {
    overrideNeeded = false;
    adminCode = null;
    store.emitChange();
});

export default store;
