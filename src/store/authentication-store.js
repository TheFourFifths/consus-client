import { Store } from 'consus-flux';

let user = null;

class AuthenticationStore extends Store {

    loggedIn() {
        return true;
        // TODO: Add authentication:
        // TODO: return user !== null;
    }

}

const store = new AuthenticationStore();

export default store;
