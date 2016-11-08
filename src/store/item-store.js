import { Store } from 'consus-core/flux';

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
    getAllItems(){
        return item;
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

store.registerHandler('ITEMS_RECEIVED', data => {
    item = data.items;
    store.emitChange();
});
export default store;
