import { searchStudent } from '../../lib/api-client';
import { readAddress } from 'consus-core/identifiers';
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
        try {
            if(readAddress(itemAddress).type === 'item') {
                hashHistory.push('/item/' + itemAddress);
            } else {
                Dispatcher.handleAction("ERROR", {
                    error: "Expected an item address but received a model address"
                });
            }
        } catch (f) {
            Dispatcher.handleAction("ERROR", {
                error: "The provided item address is somehow invalid."
            });
        }
    }

    static throwInvalidCharacterError() {
        Dispatcher.handleAction("ERROR", {
            error: "Please only enter Alphanumeric Characters."
        });
    }
}
