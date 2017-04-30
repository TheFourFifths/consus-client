import React from 'react';
import jsPDF from 'jspdf';
import { getDataUri } from '../../lib/barcode';
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
            addresses: PrinterStore.getAddresses()
        };
    }

    back() {
        PrinterController.close();
    }

    print() {
        let dataUris = this.state.addresses.map(address => getDataUri(address));
        let doc = new jsPDF('l', 'in', [2 + 3/7, 1 + 1/7]);
        dataUris.forEach((dataUri, i) => {
            doc.addImage(dataUri, 'PNG', 0, 0, 2 + 3/7, 1 + 1/7);
            if (i + 1 < dataUris.length) {
                doc.addPage();
            }
        });
        doc.autoPrint();
        doc.save('barcodes.pdf');
    }

    render() {
        return (
            <div id='printer'>
                {this.state.addresses.map(address => {
                    return (
                        <p key={address}>
                            {address}
                            <button onClick={() => PrinterController.remove(address)}>Remove</button>
                        </p>
                    );
                })}
                <button onClick={() => this.print()} className='no-print print'>Print</button>
                <button onClick={this.back} className='no-print cancel'>Back</button>
                <canvas id='canvas'></canvas>
            </div>
        );
    }
}
