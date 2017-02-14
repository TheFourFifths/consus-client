import React from 'react';

export default class Student extends React.Component {

    render() {
        return (
            <div className='student'>
                <div className="titleArea">
                    <h2>{this.props.student.id}</h2>
                </div>
                <div className="infoArea">
                    <div className="descriptionArea">
                        <h3>Items</h3>
                    </div>
                </div>
                <div className="actionArea">
                    <img src="../assets/images/add.svg"/>
                    <img src="../assets/images/edit.svg"/>
                    <img src="../assets/images/delete.svg"/>
                </div>
                <div className="clear"></div>
            </div>
        );
    }

}
