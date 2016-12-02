import React from 'react';

const TIME_UNTIL_POP = 5000; // 5 seconds

export default class Toast extends React.Component {

    constructor(props) {
        super(props);
        this.popped = false;
    }

    componentDidMount() {
        setTimeout(() => {
            this.pop();
        }, TIME_UNTIL_POP);
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
