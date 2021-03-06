import { Store } from 'consus-core/flux';

let item = null;
let items = [];
let overdueItems = [];
let faultyItems = [];

class ItemStore extends Store {
    isOverdue(item){
        let now = Math.floor(Date.now() / 1000);
        return item.timestamp < now;
    }
    getItem() {
        return item;
    }
    getItemByAddress(address) {
        return items.find(item => item.address === address);
    }
    getAllItems(){
        return items;
    }
    getCheckedOutItems(){
        return items.filter(item => item.status === "CHECKED_OUT");
    }
    getFaultyItems(){
        return faultyItems;
    }
    getOverdueItems(){
        return overdueItems;
    }
}

const store = new ItemStore();

store.registerHandler('ITEM_FOUND', data => {
    item = data;
    store.emitChange();
});

store.registerHandler('FAULTY_ITEMS_RECEIVED', data => {
    faultyItems = data.items;
    store.emitChange();
});

store.registerHandler("OVERDUE_ITEMS_RECEIVED", data => {
    overdueItems = data.items;
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

store.registerHandler('ITEM_CREATED', data => {
    items.push(data.item);
    store.emitChange();
});

store.registerHandler('STUDENT_FOUND', data => {
    items = data.items;
    for(let item of data.items) {
        item.isOverdue = store.isOverdue(item);
    }
    store.emitChange();
});
export default store;
