import { Store } from 'consus-flux';

let item = null;

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

}

const store = new ItemStore();

store.registerHandler('ITEM_FOUND', data => {
    item = {
        id: data.id,
        status: data.status
    };
    store.emitChange();
});

store.registerHandler('NO_ITEM_FOUND', () => {
    item = null;
    store.emitChange();
});

export default store;
