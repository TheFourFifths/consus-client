import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';

let addresses = [];

class PrinterStore extends Store{

    getAddresses() {
        return clone(addresses);
    }

}

const store = new PrinterStore();

store.registerHandler('CLEAR_ALL_DATA', () => {
    addresses = [];
    store.emitChange();
});

store.registerHandler('ADD_ADDRESS', data => {
    addresses.push(data.address);
    store.emitChange();
});

store.registerHandler('REMOVE_ADDRESS', data => {
    addresses.splice(addresses.indexOf(data.address), 1);
    store.emitChange();
});

export default store;
