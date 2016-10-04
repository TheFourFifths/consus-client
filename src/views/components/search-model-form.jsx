import React from 'react';
import { searchModel } from '../../lib/api-client';

export default class SearchModelForm extends React.Component {

    changeId(e) {
        searchModel(e.target.value);
    }

    render() {
        return (
            <div className='search-model-form'>
                <h1>Search a Model</h1>
                <input type='text' onChange={this.changeId.bind(this)} placeholder='ID' />
            </div>
        );
    }

}
