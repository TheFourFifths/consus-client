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
            text: PrinterStore.getText(),
            size: 10
        };
    }

    close() {
        Dispatcher.handleAction('CLOSE_PRINTER');
    }

    handleSizeChange(e) {
        this.setState({
            size: e.target.value
        });
    }

    render() {
        let imgStyles = {
            width: this.state.size + 'mm',
            height: this.state.size + 'mm'
        }
        return (
            <div id='printer'>
                Width (mm):
                <input type='number' value={this.state.size} onChange={this.handleSizeChange.bind(this)} />
                <img src={getDataUri(this.state.text)} style={imgStyles} />
            </div>
        );
    }
}
