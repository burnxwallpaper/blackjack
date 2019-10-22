import React from 'react';
import './dealer.css'

class Dealer extends React.Component {

    displayCard(arr) {
        let newArr = arr.map(item => <div className="secondCard">{item}</div>)

        if (newArr.length === 2 || newArr.length === 1) {
            if (this.props.winState !== "pending" || this.props.gameStatus === "checking17" || this.props.gameStatus === "End") {

                return arr.map(item => <div className="revealAllCards">{item}</div>);
            }
            //cover first card
            newArr[0] = <div className="firstCard"></div>
            return newArr
        }


        return arr.map(item => <div className="revealAllCards">{item}</div>)


    }

    render() {

        return (
            <div>
                <div className="dealerCardsArea">
                    {this.displayCard(this.props.cards)}
                </div>


            </div>
        )
    }
}

export default Dealer;
