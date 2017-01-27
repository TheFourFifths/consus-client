import { searchStudent } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

export default class OmnibarController {
    static getStudent(id) {
        return searchStudent(id).then(student =>{
            Dispatcher.handleAction("STUDENT_FOUND", student);
            hashHistory.push('/student');
        }).catch(e => {
            Dispatcher.handleAction("ERROR", {
                error: e.message
            });
        });
    }

    static throwInvalidCharacterError() {
        Dispatcher.handleAction("ERROR", {
            error: "Please only enter Alphanumeric Characters."
        });
    }
}
