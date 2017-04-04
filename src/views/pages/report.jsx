import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import ListenerComponent from '../../lib/listener-component.jsx';
import OverdueItemReportPage from '../reports/overdue.jsx';

export default class ReportPage extends ListenerComponent {

    constructor() {
        super();
        this.state.reportType = 'overdue';
    }

    render() {
        return (
            <div id="ReportPage">
                {this.renderReport()}
            </div>
        )
    }

    renderReport(){
        switch(this.state.reportType){
            case 'overdue':
                return <OverdueItemReportPage />;
        }
    }

}
