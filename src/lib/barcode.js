import jsbarcode from 'jsbarcode';

export function getDataUri(text) {
    jsbarcode('#canvas', text, {
        width: 3,
        font: 'helvetica',
        fontOptions: 'bold'
    });
    return document.getElementById('canvas').toDataURL();
}
