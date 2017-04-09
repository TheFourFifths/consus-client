import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import ListenerComponent from '../../lib/listener-component.jsx';
import OverdueItemReportPage from '../reports/overdue.jsx';
import DelinquentReportPage from '../reports/delinquents.jsx';

export default class ReportPage extends ListenerComponent {

    constructor() {
        super();
        this.state.reportType = 'delinquents';
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
            case 'delinquents':
                return <DelinquentReportPage />;
        }
    }

}
