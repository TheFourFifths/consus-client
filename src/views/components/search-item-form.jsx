import React from 'react';
import { searchItem } from '../../lib/api-client';

export default class SearchItemForm extends React.Component {

    changeId(e) {
        searchItem(e.target.value);
    }

    render() {
        return (
            <div className='search-item-form'>
                <h1>Search an Item</h1>
                <input type='text' onChange={this.changeId.bind(this)} placeholder='ID' />
            </div>
        );
    }

}
