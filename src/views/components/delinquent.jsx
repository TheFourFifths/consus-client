import React from 'react';
export default class Delinquent extends React.Component {
    render() {
        return (
            <div className='student'>
                <div className="titleArea">
                    <h2>{this.props.student.name}</h2>
                    <h3>{this.props.student.id}</h3>
                </div>
                <div className="infoArea">
                    <div className="editableInfo">
                        <span className="inline email">
                            <h5>Email:</h5>
                            <span>{this.props.student.email}</span>
                        </span>
                        <span className="inline rfid">
                            <span>Number of late returns: </span>
                            <span>{this.props.student.overdueCheckins.length}</span>
                            <br /><br />
                            <span>{this.props.student.hasOverdueItem?
                                <span>STUDENT HAS OVERDUE ITEM</span>:
                                <i>Student doesn't currently have overdue item</i>
                            }</span>
                        </span>
                        <span className="clear"></span>
                    </div>
                </div>
            </div>
        );
    }
}
