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

    handleSizeChange(e) {
        this.setState({
            size: e.target.value
        });
    }

    close() {
        PrinterController.close();
    }

    print() {
        // Use the global print function
        print();
    }

    render() {
        let imgStyles = {
            width: this.state.size + 'mm',
            height: this.state.size + 'mm'
        };
        return (
            <div id='printer'>
                <span className='no-print'>Width (mm): </span>
                <input type='number'
                    className='no-print'
                    value={this.state.size}
                    onChange={this.handleSizeChange.bind(this)} />
                <br />
                <button onClick={this.print} className='no-print print'>Print</button>
                <button onClick={this.close} className='no-print cancel'>Cancel</button>
                <img src={getDataUri(this.state.text)} style={imgStyles} />
            </div>
        );
    }
}
