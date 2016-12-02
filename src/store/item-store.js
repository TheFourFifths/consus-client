import { Store } from 'consus-core/flux';
let item = null;
let items = [];
class ItemStore extends Store {
    getItem() {
        return item;
    }
    getAllItems(){
        return items;
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
    items = [];
    store.emitChange();
});

store.registerHandler('ITEMS_RECEIVED', data => {
    items = data.items;
    store.emitChange();
});
export default store;
