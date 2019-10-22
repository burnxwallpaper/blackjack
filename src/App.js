import React from 'react';
import ReactDOM from 'react-dom'
import Player from './player';
import Dealer from './dealer';
import './bootstrap.css'
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: [],
      gameStatus: "End",
      winState: "pending",

      player: {
        playerScore: 0,
        playerCards: []
      },
      dealer: {
        dealerScore: 0,
        dealerCards: []
      }
    }
    this.giveCards = this.giveCards.bind(this);
    this.giveDealerCards = this.giveDealerCards.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
    this.winCheck = this.winCheck.bind(this);

  }
  shuffleDeck() {
    this.removal()
    this.renderBtn()
    let newDeck = []
    for (let j = 0; j < 4; j++) {
      for (let i = 2; i < 11; i++) { newDeck.push(i) }
      newDeck.push("A", "J", "Q", "K")
    }

    this.setState(state => {
      state.deck = newDeck;
      state.gameStatus = "Inprogress";
      state.winState = "pending";
      //player
      state.player.playerCards = [];
      state.player.playerScore = 0;
      //dealer
      state.dealer.dealerCards = [];
      state.dealer.dealerScore = 0;
    }, this.gameStart)

  }

  gameStart() {
    this.giveCards();
    setTimeout(this.giveCards, 300);
    this.giveDealerCards();
    setTimeout(this.giveDealerCards, 300);
  }

  drawCard() {
    let currentDeck = this.state.deck;
    let randomNumer = Math.floor(Math.random() * currentDeck.length)
    let cardDrawed = currentDeck[randomNumer];
    currentDeck.splice(randomNumer, 1);
    this.setState(state => {
      state.deck = currentDeck;
    });
    return cardDrawed;
  }

  giveCards() {
    let cardDrawed = this.drawCard()
    this.setState(
      (state => state.player.playerCards = [...state.player.playerCards, cardDrawed])
    )

  }
  giveDealerCards() {
    let cardDrawed = this.drawCard()
    this.setState(
      state => state.dealer.dealerCards = [...state.dealer.dealerCards, cardDrawed])

  }
  // calculate score with the consideration of "A"
  scoreCalculation(cardsonHands) {
    let totalScore = 0;
    let totalScoreAce = 0;
    let trueScore = 0;
    if (cardsonHands.includes("A")) {
      for (let i = 0; i < cardsonHands.length; i++) {
        totalScoreAce += this.engtoNum(cardsonHands[i])
      }
      totalScoreAce += 10
    }
    for (let i = 0; i < cardsonHands.length; i++) {
      totalScore += this.engtoNum(cardsonHands[i])
    }
    if (totalScoreAce < 22 && totalScoreAce > totalScore) {
      trueScore = totalScoreAce
    } else {
      trueScore = totalScore
    }
    return trueScore;
  }
  //Translate letter to score, A=1
  engtoNum(Card) {
    let score = 0;
    if (Card === "J" || Card === "Q" || Card === "K") {
      score = 10;
    } else if (Card === "A") {
      score = 1;
    } else {
      score = Card;
    }
    return score;
  }
  //Instant lose if player score>21
  check21() {
    let playerScore = this.scoreCalculation(this.state.player.playerCards);

    if (playerScore > 21 && this.state.gameStatus === "Inprogress") {
      this.setState(state => {
        state.gameStatus = "End";
        return 0;
      })
    }
  }
  //Enter settlement stage
  winCheck() {
    this.removeBtn()
    this.setState(state => state.gameStatus = "checking17")
  }

  componentDidUpdate() {
    let playerScore = this.scoreCalculation(this.state.player.playerCards);
    let dealerScore = this.scoreCalculation(this.state.dealer.dealerCards);

    this.check21();



    if (this.state.gameStatus === "checking17") {

      if (dealerScore < 17 && dealerScore <= playerScore && playerScore <= 20) {
        setTimeout(this.giveDealerCards, 500);
      } else {
        this.setState(state => state.gameStatus = "End")
      }
    }
    if (this.state.gameStatus === "End") {
      this.removeBtn()
      if (playerScore > dealerScore && playerScore <= 21) {
        this.setState((state => state.winState = "playerWin"), this.playerWin())
      } else if (dealerScore > 21) {
        this.setState((state => state.winState = "playerWin"), this.playerWin())
      } else if (playerScore === dealerScore) {
        this.setState((state => state.winState = "draw"), this.draw())
      } else {
        this.setState((state => state.winState = "dealerWin"), this.dealerWin())

      }
      this.setState(state => state.gameStatus = "tureEnd")
    }
  }

  //the following functions are button render and removal
  playerWin() {
    let playwin = <div><div className="winState"><div className="badge badge-warning">Player Win!</div></div> <button className="playAgain btn btn-primary" onClick={this.shuffleDeck}>Play Again?</button></div>
    ReactDOM.render(playwin, document.getElementById("endGameState"))
  }

  dealerWin() {
    let dealerwin = <div><div className="winState"><div className="badge badge-danger">Dealer Win!</div></div> <button className="playAgain btn btn-primary" onClick={this.shuffleDeck}>Play Again?</button></div>
    ReactDOM.render(dealerwin, document.getElementById("endGameState"))
  }

  draw() {
    let draw = <div><div className="winState"><div className="badge badge-light">Draw!</div></div> <button className="playAgain btn btn-primary" onClick={this.shuffleDeck}>Play Again?</button></div>
    ReactDOM.render(draw, document.getElementById("endGameState"))
  }

  play() {
    let draw = <div></div>
    ReactDOM.render(draw, document.getElementById("endGameState"))
  }
  //remove end game statement and Playagain button 
  removal() {
    let removal = <div></div>
    ReactDOM.render(removal, document.getElementById("endGameState"))

  }
  //remove Hit and Stand button
  removeBtn() {
    let removeBtn = <div></div>
    ReactDOM.render(removeBtn, document.getElementById("button"))
  }

  renderBtn() {
    let btn = <div><button className="btn btn-warning" onClick={this.giveCards}>Hit</button><button className="btn btn-danger" onClick={this.winCheck}>Stand</button></div>
    ReactDOM.render(btn, document.getElementById("button"))
  }


  render() {
    let playerCards = this.state.player.playerCards;
    let dealerCards = this.state.dealer.dealerCards;
    let playerScore = this.scoreCalculation(playerCards);
    let dealerScore = this.scoreCalculation(dealerCards);
    let winState = this.state.winState
    return (
      <div className="App">
        <div className="gambleDesk">
          <div className="headerArea ">

            <div className="badge badge-dark ">~~Blackjack~~</div>
          </div>
          <div className="dealerSign">
            <div class="dropdown rules">
              <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Rules
              </button>
              <div class="dropdown-menu" >
                <ol>
                  <li>Larger score(S) win </li>
                  <li>Player (S) > 21 : dealer win</li>
                  <li>Player (S) = 21 : player win</li>
                  <li>A (S): 1 or 11</li>
                  <li>J , Q , K (S) : 10</li>
                  <li>Hit : get card</li>
                  <li>Stand : check result </li>
                  <li>Dealer hit until (S) >= 17 or (S)>player </li>
                </ol>
              </div>
            </div><div class="badge badge-secondary">Dealer</div></div>
          <div className="dealerArea"><Dealer cards={dealerCards} winState={winState} gameStatus={this.state.gameStatus} /></div>
          <div className="playerArea">
            <div className="playerCardsArea"><Player cards={playerCards} /></div>
            <div className="endGameState" id="endGameState">
              <div id="play" className="btn btn-primary play" onClick={this.shuffleDeck}>Play</div>
            </div>

          </div>


          <div className="playerSign">
            < div className="badge badge-secondary">Player</div>
            <br></br>
            <div id="button">

            </div>
          </div>
          <div className="controlPanel">
            <div className="badge badge-dark">Backstage</div>
            <div >Deck Cards Left: {this.state.deck.length}</div>
            <div>Dealer Cards: {dealerCards.map(item => <div className="deck">{item}</div>)}</div>
            <div>Player Cards: {playerCards.map(item => <div className="deck">{item}</div>)}</div>
            <div>Dealer score: {dealerScore}</div>
            <div>Player score: {playerScore}</div>
            <div >Deck: {this.state.deck.map(item => <div className="deck">{item}</div>)}</div>
          </div>
        </div>
      </div >
    );
  }
}

export default App;
