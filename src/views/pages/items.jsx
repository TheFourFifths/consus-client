import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ItemStore from '../../store/item-store.js';
import { hashHistory, Link} from 'react-router';
import { viewModel } from '../../lib/api-client.js'
export default class Models extends ListenerComponent {

    constructor() {
        super();

    }
    getStores() {
        return [
            ItemStore
        ];
    }
    getState() {
        return {
            items: ItemStore.getAllItems()
        };
    }
    render() {
        return (
            <div id="item">
                <h1>All Items</h1>
                <button>Make new Item</button>
                {this.state.items.map(((item, key) => {
                    return <div key={key} className="item">
                        <div className="picArea">
                            <img src="../src/imgs/placeholder.jpg" />
                        </div>
                        <div className="titleArea">
                            <h2>{item.address}</h2>
                            <Link to={`/model/${item.address}`} >View model</Link>
                        </div>
                        <div className="infoArea">
                            <div className="descriptionArea">
                            <h3>Status</h3>
                                <p>{item.status}</p>
                            </div>
                            <div className="faultArea">
                                <h3>Fault</h3>
                                {(item.isFaulty
                                        ? <p>{item.faultDescription}</p>
                                        : <p>Item is not faulty.</p>
                                )}
                            </div>
                        </div>
                        <div className="actionArea">
                            <img src="../src/imgs/plus.png" />
                            <img src="../src/imgs/edit.png" />
                            <img src="../src/imgs/trashcan.png" />
                        </div>
                        <div className="clear"> </div>
                    </div>
                }))}
            </div>
        );
    }

}
