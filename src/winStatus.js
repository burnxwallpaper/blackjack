import React from 'react';
import './winStatus.css';

class winStatus extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (

            <div className="winStatus">Boom! {this.props.winStatus}</div>

        )
    }


}

export default winStatus;
