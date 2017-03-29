import { uploadStudents } from '../../lib/api-client';
import { Dispatcher } from 'consus-core/flux';

export default class StudentFileUploadFormController {

    static uploadStudents(file){
        if (!StudentFileUploadFormController.validateFile(file)){
            return;
        }
        let reader =  new FileReader();
        reader.onload = function () {
            return uploadStudents(reader.result).then(() =>{
                Dispatcher.handleAction('STUDENTS_UPLOADED', {});
            }).catch(error => {
                Dispatcher.handleAction('ERROR', {
                    error: error
                });
            });
        };
        reader.readAsBinaryString(file);

    }

    static validateFile(file) {
        let supportedExtensions = ['xls', 'xlsx', 'xlsm'];
        if (file === undefined || file === null){
            Dispatcher.handleAction('FILE_UNSUPPORTED', {});
            return false;
        }
        if (supportedExtensions.indexOf(file.name.split('.').pop().toLowerCase()) < 0){
            Dispatcher.handleAction('FILE_UNSUPPORTED', {});
            return false;
        }
        return true;
    }
}
