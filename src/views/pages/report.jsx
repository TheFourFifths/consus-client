import React from 'react';
import { Dispatcher } from 'consus-core/flux';
import ListenerComponent from '../../lib/listener-component.jsx';
import OverdueItemReportPage from '../reports/overdue.jsx';
import FaultyItemReportPage from '../reports/broken.jsx';

export default class ReportPage extends ListenerComponent {

    constructor() {
        super();
        this.state.reportType = 'faulty';
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
            case 'faulty':
                return <FaultyItemReportPage />;
        }
    }

}
