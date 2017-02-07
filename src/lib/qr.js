import qr from 'qr-image';

export function getDataUri(text, pixelsPerSquare = 10) {
    return 'data:image/png;base64,' + qr.imageSync(text, {
        size: pixelsPerSquare,
        margin: 0
    }).toString('base64');
}
