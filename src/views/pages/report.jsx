import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import OverdueItemReportPage from '../reports/overdue.jsx';
import DelinquentReportPage from '../reports/delinquents.jsx';

export default class ReportPage extends ListenerComponent {

    constructor() {
        super();
        this.state.reportType = 'delinquents';
    }

    switchReport(e) {
        this.setState({
            reportType: e.target.id
        });
    }

    render() {
        return (
            <div id="ReportPage">
                <div>
                    <button id="overdue" onClick={this.switchReport.bind(this)}>Overdue Report</button>
                    <button id="delinquents" onClick={this.switchReport.bind(this)}>Delinquent Report</button>
                </div>
                {this.renderReport()}
            </div>
        );
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
