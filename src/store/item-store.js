import { Store } from 'consus-flux';

let item = null;
let items = [];

class ItemStore extends Store {

    getItem() {
        if (item === null) {
            return item;
        }
        return {
            id: item.id,
            status: item.status
        };
    }

    getAllItems(){
        return items;
    }

}

const store = new ItemStore();

store.registerHandler('ITEM_FOUND', data => {
    item = {
        id: data.id,
        status: data.status
    };
    items.push(item);
    store.emitChange();
});

store.registerHandler('NO_ITEM_FOUND', () => {
    item = null;
    store.emitChange();
});

store.registerHandler('CHECKOUT_SUCCESS', () => {
    items = [];
    item = null;
    store.emitChange();
});

export default store;
