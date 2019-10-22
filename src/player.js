import React from 'react';
import './player.css';

class Player extends React.Component {




    render() {

        return (
            <div>
                <div className="playerCardsArea">{this.props.cards.map(item => <div className="playerCard">{item}</div>)}</div>

            </div>
        )
    }
}

export default Player; 