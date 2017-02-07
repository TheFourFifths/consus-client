import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import { getDataUri } from '../../lib/qr';
import PrinterStore from '../../store/printer-store';
import ListenerComponent from '../../lib/listener-component.jsx';

export default class Printer extends ListenerComponent {

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
    }

    render() {
        return (
            <div id='printer'>
                <img src={getDataUri(this.state.text)} />
            </div>
        );
    }
}
