import moment from 'moment-timezone';

export function getNextDueTimestamp() {
    let timestamp = moment.tz(Date.now(), 'America/Chicago');
    let hour = parseInt(timestamp.format('H'));
    let minute = parseInt(timestamp.format('m'));
    // check for times past 4:50pm
    if (hour > 16 || (hour === 16 && minute >= 50)) {
        // increment to the next day
        timestamp = timestamp.add(1, 'd');
    }
    timestamp.hour(17).minute(0).second(0);
    let dueTime = parseInt(timestamp.format('X'));
    return dueTime;
}
