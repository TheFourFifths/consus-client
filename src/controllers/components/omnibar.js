import { searchStudent } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

let warnBeforeExiting = false;

export default class OmnibarController {

    static setWarnBeforeExiting(bool){
        warnBeforeExiting = bool;
    }

    static getWarning(){
        return warnBeforeExiting;
    }

    static leavePage(){
        hashHistory.push('/');
    }

    static getStudent(id) {
        if (typeof id === 'string') {
            id = parseInt(id);
        }
        return searchStudent(id).then(student =>{
            Dispatcher.handleAction("STUDENT_FOUND", student);
            hashHistory.push('/student');
        }).catch(() => {
            Dispatcher.handleAction("ERROR", {
                error: "An invalid student ID was scanned. The student could not be found."
            });
        });
    }

    static throwInvalidCharacterError() {
        Dispatcher.handleAction("ERROR", {
            error: "Please only enter Alphanumeric Characters."
        });
    }
}
