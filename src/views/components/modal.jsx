import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';

export default class Modal extends ListenerComponent {

    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.active) {
            return false;
        }

        return (
            <div className="modal">
                <div className="modal-content">
                    <h1>Yo, Friend! You made some oopses!</h1>
                    {this.props.children}
                </div>
            </div>
        );
    }

}
