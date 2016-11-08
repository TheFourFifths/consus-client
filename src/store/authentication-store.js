import { Store } from 'consus-core/flux';

/* eslint-disable no-unused-vars */
let user = null;
/* eslint-enable no-unused-vars */

//Flag to bring up the input model for admin override.
let overrideNeeded = false;

let adminCode = null;

class AuthenticationStore extends Store {

    getAdminCode(){
        return adminCode;
    }

    loggedIn() {
        return true;
        // TODO: Add authentication:
        // TODO: return user !== null;
    }

    overrideNeeded(){
        return overrideNeeded || adminCode !== null;
    }

}

const store = new AuthenticationStore();

store.registerHandler("CHECKOUT_SUCCESS", () => {
    overrideNeeded = false;
    adminCode = null;
    store.emitChange();
});

store.registerHandler("OVERRIDE_REQUIRED", () => {
    console.log("Overridereq");
    console.log(store.overrideNeeded());
    overrideNeeded = true;
    console.log(store.overrideNeeded());
    store.emitChange();
});

store.registerHandler("ADMIN_CODE_ENTERED", data => {
    adminCode = data.adminCode;
    store.emitChange();
});

export default store;
