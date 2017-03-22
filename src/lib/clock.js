import config from 'config';
import moment from 'moment-timezone';

export function getNextDueTimestamp() {
    let timestamp = moment.tz(Date.now(), config.get('timezone'));
    let hour = parseInt(timestamp.format('H'));
    let minute = parseInt(timestamp.format('m'));
    // check for times past 4:50pm
    let dueHour = config.get('checkin.due_hour'),
        dueMin  = config.get('checkin.due_minute');
    if (hour >= dueHour || (hour === dueHour && minute >= dueMin)) {
        // increment to the next day
        timestamp = timestamp.add(1, 'd');
    }
    timestamp.hour(dueHour).minute(dueMin).second(0);
    let dueTime = parseInt(timestamp.format('X'));
    return dueTime;
}
