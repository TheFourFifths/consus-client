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
                    <button type='button'
                            onClick={this.props.onClose}
                            disabled={this.props.acceptDisabled === undefined ?  false : this.props.acceptDisabled}>
                        {this.props.buttonText ? this.props.buttonText : 'Close'}
                    </button>
                </div>
            </div>
        );
    }

}
