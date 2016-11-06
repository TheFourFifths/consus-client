import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import { Dispatcher } from 'consus-core/flux';

export default class Modal extends ListenerComponent {

    constructor(props) {
        super(props);
    }

    _deactivateModal() {
        this.props.active = false;
    }

    render() {
        if (!this.props.active) {
            return false;
        }

        return (
            <div className='modal'>
                <div className='modal-content'>
                    {this.props.children}
                    <button type='button' onClick={this._deactiveModal.bind(this)}>Close</button>
                </div>
            </div>
        );
    }

}
