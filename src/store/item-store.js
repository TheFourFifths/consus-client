import { Store } from 'consus-core/flux';
let item = null;

class ItemStore extends Store {
    getItem() {
        return item;
    }
    getAllItems(){
        return item;
    }
}

const store = new ItemStore();

store.registerHandler('ITEM_FOUND', data => {
    item = data;
    store.emitChange();
});

store.registerHandler('NO_ITEM_FOUND', () => {
    item = null;
    store.emitChange();
});

store.registerHandler('CLEAR_ALL_DATA', () => {
    item = null;
    store.emitChange();
});

store.registerHandler('ITEMS_RECEIVED', data => {
    item = data.items;
    store.emitChange();
});
export default store;
