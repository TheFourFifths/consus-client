import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import OverdueItemReportPage from '../reports/overdue.jsx';
import FaultyItemReportPage from '../reports/broken.jsx';
import DelinquentReportPage from '../reports/delinquents.jsx';
import CheckedOutItemReportPage from '../reports/currently-checked-out.jsx';

export default class ReportPage extends ListenerComponent {

    constructor() {
        super();
        this.state.reportType = null;
    }

    switchReport(e) {
        this.setState({
            reportType: e.target.id
        });
    }

    render() {
        return (
            <div id="ReportPage">
                <div className="left no-print">
                    <button className="cool-button" id="overdue" onClick={this.switchReport.bind(this)}>Overdue Report</button>
                    <button className="cool-button" id="delinquents" onClick={this.switchReport.bind(this)}>Delinquent Report</button>
                    <button className="cool-button" id="faulty" onClick={this.switchReport.bind(this)}>Faulty Items</button>
                    <button className="cool-button" id="checked" onClick={this.switchReport.bind(this)}>Checked Out Items</button>
                </div>
                <div className="right no-print">
                    <button className="cool-button" id="print" onClick={window.print}>Print</button>
                </div>
                <br className="clear"/>
                <br />
                {this.renderReport()}
            </div>
        );
    }

    renderReport(){
        switch(this.state.reportType){
        case 'checked':
            return <CheckedOutItemReportPage />;
        case 'delinquents':
            return <DelinquentReportPage />;
        case 'faulty':
            return <FaultyItemReportPage />;
        case 'overdue':
            return <OverdueItemReportPage />;
        default:
            return <p>Please Select A Report Above</p>;
        }
    }
}
