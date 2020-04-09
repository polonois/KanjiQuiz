import React, { Component } from 'react';
import { traductionDictionary } from '../../data/traductionDictionary.js'
import './Navbar.scss';

class Navbar extends Component {
  render() {
    let navbar;
    if (this.props.gameState == "game") {
      navbar = 
        <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
          <div className="container">
            <div id="navbar">
              <ul className="nav navbar-nav">
                <li id="nav-choosecharacters">
                  <a href="javascript:;" onClick={this.props.handleEndGame}>
                    <span className="glyphicon glyphicon-small glyphicon-arrow-left"></span> Retour au menu
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>;
    } else if (this.props.gameState == "chooseCharacters") {
      navbar = 
        <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
          <div className="container">
            <div id="navbar">
              <div className="navbar-header">
                <a className="navbar-brand" href="javascript:;" onClick={this.props.handleEndGame}>
                  Learn-Kanji
                </a>
              </div>
              <ul className="nav navbar-nav">
                <li>
                  <a href="javascript:;" onClick={this.props.traductionEventFunction}>
                    Vocabulaire
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>;
    } else if (this.props.gameState == "traduction") {
      navbar = 
        <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
          <div className="container">
            <div id="navbar">
              <div className="navbar-header">
                <a className="navbar-brand" href="javascript:;" onClick={this.props.handleEndGame}>
                  Learn-Kanji
                </a>
              </div>
              <ul className="nav navbar-nav">
                <li className="active">
                  <a href="javascript:;" onClick={this.props.traductionEventFunction}>
                    Vocabulaire
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>;
    }

    return (
      navbar
    )
  }
}

export default Navbar;
