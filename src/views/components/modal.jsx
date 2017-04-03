import React from 'react';

export default class Modal extends React.Component {

    render() {
        if (!this.props.active) {
            return false;
        }

        return (
            <div className='modal'>
                <div className='modal-content'>
                    {this.props.children}
                    <div className='modal-buttons'>
                        <button type='button'
                                className={this.props.btnClass ? this.props.btnClass : 'default-btn'}
                                onClick={this.props.onClose}
                                disabled={this.props.acceptDisabled === undefined ?  false : this.props.acceptDisabled}>
                            {this.props.buttonText ? this.props.buttonText : 'OK'}
                        </button>
                        {this.props.buttons}
                    </div>
                </div>
            </div>
        );
    }

}
