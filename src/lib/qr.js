import qr from 'qr-image';

export function getDataUri(text, pixelsPerSquare = 10) {
    return 'data:image/png;base64,' + qr.imageSync(text, {
        size: pixelsPerSquare
    }).toString('base64');
}
