import { searchStudent } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
import { hashHistory } from 'react-router';

export default class OmnibarController {
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

    static displayItem(itemAddress) {
        hashHistory.push('/item/' + itemAddress);
    }

    static throwInvalidCharacterError() {
        Dispatcher.handleAction("ERROR", {
            error: "Please only enter Alphanumeric Characters."
        });
    }
}
