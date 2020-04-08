import React, { Component } from 'react';
import './App.scss';
import Navbar from '../Navbar/Navbar';
import VocabularyList from '../VocabularyList/VocabularyList';
import GameContainer from '../GameContainer/GameContainer';
import { removeHash } from '../../data/helperFuncs';

const options = {};

class App extends Component {
  state = { gameState: 'chooseCharacters' };

  startGame = () => {
    this.setState({gameState: 'game'});
  }

  endGame = () => {
    this.setState({gameState: 'chooseCharacters'});
  }

  traduction = () => {
    this.setState({gameState: 'traduction'});
  }

  componentWillUpdate(nextProps, nextState) {
    // This is primarily for demo site purposes. Hides #footer when game is on.
    if(document.getElementById('footer')) {
      if(nextState.gameState=='chooseCharacters')
        document.getElementById('footer').style.display = "block";
      else
        document.getElementById('footer').style.display = "none";
    }
  }

  componentWillMount() {
    if(document.getElementById('footer'))
      document.getElementById('footer').style.display = "block";
  }

  render() {
    return (
      <div>
        <Navbar
          gameState={this.state.gameState}
          handleEndGame={this.endGame}
          traductionEventFunction={this.traduction}
        />
        {this.state.gameState != "traduction" ? ( 
          <div className="outercontainer">
            <div className="container game">
              <GameContainer
                gameState={this.state.gameState}
                handleStartGame={this.startGame}
                handleEndGame={this.endGame}
              />
            </div>
          </div>
          ) : 
        <div>
          <VocabularyList />
        </div>
      }
      </div>
    )
  }
}

export default App;
