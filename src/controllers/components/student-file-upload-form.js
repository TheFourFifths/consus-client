import { uploadStudents } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';
export default class StudentFileUploadFormController {

    static uploadStudents(data){
        return uploadStudents(data).then(() =>{
            console.log('done');
        }).catch(error => {
            Dispatcher.handleAction('ERROR', { error });
        });
    }
}
