import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import { getDataUri } from '../../lib/qr';
import PrinterStore from '../../store/printer-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import Modal from './modal.jsx';

export default class PrinterModal extends ListenerComponent {

    getStores() {
        return [
            PrinterStore
        ];
    }

    getState() {
        return {
            text: PrinterStore.getText()
        };
    }

    close() {
        Dispatcher.handleAction('CLOSE_PRINTER');
    }

    renderImage() {
        if (this.state.text === undefined) {
            return false;
        }
        return (
            <img src={getDataUri(this.state.text)} />
        );
    }

    render() {
        return (
            <Modal active={this.state.text !== undefined} onClose={this.close}>
                {this.renderImage()}
            </Modal>
        )
    }
}
