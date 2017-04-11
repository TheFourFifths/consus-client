import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import StudentStore from '../../store/student-store';
import DelinquentReportController from '../../controllers/reports/delinquents';
import Delinquent from '../components/delinquent.jsx';

export default class DelinquentReportPage extends ListenerComponent {

    componentWillMount(){
        DelinquentReportController.getStudents();
    }

    getStores(){
        return [
            StudentStore
        ];
    }

    getState(){
        return {
            students: StudentStore.getAllDelinquents()
        };
    }

    render() {
        return (
            <div key={Object.keys(this.state.students).length}>
                {Object.keys(this.state.students).map(id => {
                    return(
                         <div key={id}>
                            <Delinquent student={this.state.students[id]} />
                         </div>
                     );
                })}
            </div>
        );
    }

}
