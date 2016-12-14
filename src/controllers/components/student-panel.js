import { getAllModels } from '../../lib/api-client';

export default class StudentPanelController{
    static getModels() {
        return getAllModels();
    }
}
