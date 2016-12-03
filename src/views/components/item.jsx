import React from 'react';
import ItemStore from '../../store/item-store';
import { Link } from 'react-router';
import { searchItem } from '../../lib/api-client';

export default class Item extends React.Component {

    constructor(props) {
        super(props);
        if (props.item === undefined)
            this.state = {item: null};
        else
            this.state = {item: props.item};
    }

    componentDidMount() {
        if (this.state.item === null) {
            searchItem(this.props.params.address).then(() => {
                this.setState({
                    item: ItemStore.getItem()
                });
            });
        }
    }

    render() {
        if (this.state.item === null)
            return <i>Item is loading...</i>;
        return (
            <div className='item'>
                <div className="picArea">
                    <img src="../assets/images/placeholder.jpg"/>
                </div>
                <div className="titleArea">
                    <h2>{this.state.item.address}</h2>
                    <Link to={`/model/${this.state.item.modelAddress}`}>View model</Link>
                </div>
                <div className="infoArea">
                    <div className="descriptionArea">
                        <h3>Status</h3>
                        <p>{this.state.item.status}</p>
                    </div>
                    <div className="faultArea">
                        <h3>Fault</h3>
                        {(this.state.item.isFaulty
                                ? <p>{this.state.item.faultDescription}</p>
                                : <p>Item is not faulty.</p>
                        )}
                    </div>
                </div>
                <div className="actionArea">
                    <img src="../assets/images/add.svg"/>
                    <img src="../assets/images/edit.svg"/>
                    <img src="../assets/images/delete.svg"/>
                </div>
                <div className="clear"></div>
            </div>
        );
    }

}
