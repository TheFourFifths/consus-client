import { Store } from 'consus-core/flux';
import { searchItem } from '../lib/api-client.js';
let item = null;

class ItemStore extends Store {
    getItem() {
        return item;
    }
    getAllItems(){
        return item;
    }
    searchItemByAddress(address){
        return searchItem(address);
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

store.registerHandler('ITEMS_RECEIVED', data => {
    item = data.items;
    store.emitChange();
});
export default store;
