import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import { getDataUri } from '../../lib/qr';
import PrinterController from '../../controllers/pages/printer';
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
            size: 50
        };
    }

    close() {
        PrinterController.close();
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
                Width (mm): <input type='number' value={this.state.size} onChange={this.handleSizeChange.bind(this)} />
                <br />
                <button>Print</button>
                <button onClick={this.close}>Cancel</button>
                <img src={getDataUri(this.state.text)} style={imgStyles} />
            </div>
        );
    }
}
