import { Store } from 'consus-flux';

let items = [];

class CartStore extends Store {
    getItems(){
        return items;
    }
}

const store = new CartStore();

store.registerHandler('CHECKOUT_ITEM_FOUND', data => {
    let item = {
        id: data.id,
        status: data.status
    };
    items.push(item);
    store.emitChange();
});


store.registerHandler('CHECKOUT_SUCCESS', () => {
    items = [];
    store.emitChange();
});

export default store;
