import { Store } from 'consus-flux';

/* eslint-disable no-unused-vars */
let user = null;
/* eslint-enable no-unused-vars */

class AuthenticationStore extends Store {

    loggedIn() {
        return true;
        // TODO: Add authentication:
        // TODO: return user !== null;
    }

}

const store = new AuthenticationStore();

export default store;
