import React from 'react';

export default class Toast extends React.Component {

    constructor(props) {
        super(props);
        this.popped = false;
    }

    componentDidMount() {
        setTimeout(() => {
            this.pop();
        }, this.props.timeout);
    }

    pop() {
        if (!this.popped) {
            this.popped = true;
            this.props.onPop();
        }
    }

    render() {
        return (
            <div className='toast' onClick={this.pop.bind(this)}>
                {this.props.children}
            </div>
        );
    }

}
