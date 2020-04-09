import React, { Component } from 'react';
import Switch from 'react-toggle-switch';
import { kanaDictionary } from '../../data/kanaDictionary';
import './ChooseCharacters.scss';
import CharacterGroup from './CharacterGroup';

class ChooseCharacters extends Component {
  state = {
    errMsg : '',
    selectedGroups: this.props.selectedGroups,
    showAlternatives: [],
    showSimilars: [],
    startIsVisible: true
  }

  componentDidMount() {
    this.testIsStartVisible();
    window.addEventListener('resize', this.testIsStartVisible);
    window.addEventListener('scroll', this.testIsStartVisible);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.testIsStartVisible);
    window.removeEventListener('scroll', this.testIsStartVisible);
  }

  componentDidUpdate(prevProps, prevState) {
    this.testIsStartVisible();
  }

  testIsStartVisible = () => {
    if(this.startRef) {
      const rect = this.startRef.getBoundingClientRect();
      if(rect.y > window.innerHeight && this.state.startIsVisible)
        this.setState({ startIsVisible: false });
      else if(rect.y <= window.innerHeight && !this.state.startIsVisible)
        this.setState({ startIsVisible: true });
    }
  }

  scrollToStart() {
    if(this.startRef) {
      const rect = this.startRef.getBoundingClientRect();
      const absTop = rect.top + window.pageYOffset;
      const scrollPos = absTop - window.innerHeight + 50;
      window.scrollTo(0, scrollPos > 0 ? scrollPos : 0);
    }
  }

  getIndex(groupName) {
    return this.state.selectedGroups.indexOf(groupName);
  }

  isSelected(groupName) {
    return this.getIndex(groupName) > -1 ? true : false;
  }

  removeSelect(groupName) {
    if(this.getIndex(groupName)<0)
      return;
    let newSelectedGroups = this.state.selectedGroups.slice();
    newSelectedGroups.splice(this.getIndex(groupName), 1);
    this.setState({selectedGroups: newSelectedGroups});
  }

  addSelect(groupName) {
    this.setState({errMsg: '', selectedGroups: this.state.selectedGroups.concat(groupName)});
  }

  toggleSelect = groupName => {
    if(this.getIndex(groupName) > -1)
      this.removeSelect(groupName);
    else
      this.addSelect(groupName);
  }

  /*selectMultiple(arr) {
    let newSelectedGroups = this.state.selectedGroups.slice();
    var i;
    for (i = 0; i < arr.length; i++) {
    const thisKana = kanaDictionary[arr[i]];
    Object.keys(thisKana).forEach(groupName => {
        newSelectedGroups.push(groupName);
    });
    }
    this.setState({errMsg: '', selectedGroups: newSelectedGroups});
  }*/

  /*selectMultipleNone(arr) {
    let newSelectedGroups = [];
    console.log(this.state.selectedGroups);
      var i;
      for (i = 0;i < arr.length; i++) {
    this.state.selectedGroups.forEach(groupName => {
      let mustBeRemoved = false;
      Object.keys(kanaDictionary[arr[i]]).forEach(removableGroupName => {
        if(removableGroupName === groupName)
          mustBeRemoved = true;
      });
      if(!mustBeRemoved)
        newSelectedGroups.push(groupName);
    });}
    this.setState({selectedGroups: newSelectedGroups});
  }*/

  selectAll(whichKana, altOnly=false, similarOnly=false) {
    const thisKana = kanaDictionary[whichKana];
    let newSelectedGroups = this.state.selectedGroups.slice();
    Object.keys(thisKana).forEach(groupName => {
      if(!this.isSelected(groupName) && (
        (altOnly && groupName.endsWith('_a')) ||
        (similarOnly && groupName.endsWith('_s')) ||
        (!altOnly && !similarOnly)
      ))
        newSelectedGroups.push(groupName);
    });
    this.setState({errMsg: '', selectedGroups: newSelectedGroups});
  }

  selectNone(whichKana, altOnly=false, similarOnly=false) {
    let newSelectedGroups = [];
    this.state.selectedGroups.forEach(groupName => {
      let mustBeRemoved = false;
      Object.keys(kanaDictionary[whichKana]).forEach(removableGroupName => {
        if(removableGroupName === groupName && (
          (altOnly && groupName.endsWith('_a')) ||
          (similarOnly && groupName.endsWith('_s')) ||
          (!altOnly && !similarOnly)
        ))
          mustBeRemoved = true;
      });
      if(!mustBeRemoved)
        newSelectedGroups.push(groupName);
    });
    this.setState({selectedGroups: newSelectedGroups});
  }

  toggleAlternative(whichKana, postfix) {
    let show = postfix == '_a' ? this.state.showAlternatives : this.state.showSimilars;
    const idx = show.indexOf(whichKana);
    if(idx >= 0)
      show.splice(idx, 1);
    else
      show.push(whichKana)
    if(postfix == '_a')
      this.setState({showAlternatives: show});
    if(postfix == '_s')
      this.setState({showSimilars: show});
  }

  getSelectedAlternatives(whichKana, postfix) {
    return this.state.selectedGroups.filter(groupName => {
      return groupName.startsWith(whichKana == 'hiragana' ? 'h_' : 'k_') &&
        groupName.endsWith(postfix);
    }).length;
  }

  getAmountOfAlternatives(whichKana, postfix) {
    return Object.keys(kanaDictionary[whichKana]).filter(groupName => {
      return groupName.endsWith(postfix);
    }).length;
  }

  alternativeToggleRow(whichKana, postfix, show) {
    let checkBtn = "glyphicon glyphicon-small glyphicon-"
    let status;
    if(this.getSelectedAlternatives(whichKana, postfix) >= this.getAmountOfAlternatives(whichKana, postfix))
      status = 'check';
    else if(this.getSelectedAlternatives(whichKana, postfix) > 0)
      status = 'check half';
    else
      status = 'unchecked'
    checkBtn += status

    return <div
      key={'alt_toggle_' + whichKana + postfix}
      onClick={() => this.toggleAlternative(whichKana, postfix)}
      className="choose-row"
    >
      <span
        className={checkBtn}
        onClick={ e => {
          if(status == 'check')
            this.selectNone(whichKana, postfix == '_a', postfix == '_s');
          else if(status == 'check half' || status == 'unchecked')
            this.selectAll(whichKana, postfix == '_a', postfix == '_s');
          e.stopPropagation();
        }}
      ></span>
      {
        show ? <span className="toggle-caret">&#9650;</span>
          : <span className="toggle-caret">&#9660;</span>
      }
      {
        postfix == '_a' ? 'Alternative characters (ga · ba · kya..)' :
          'Look-alike characters'
      }
    </div>
  }

  showGroupRows(whichKana, showAlternatives, showSimilars = false) {
    const thisKana = kanaDictionary[whichKana];
    let rows = [];
    Object.keys(thisKana).forEach((groupName, idx) => {
      if(groupName == "h_group11_a" || groupName == "k_group13_a")
        rows.push(this.alternativeToggleRow(whichKana, "_a", showAlternatives));
      if(groupName == "k_group11_s")
        rows.push(this.alternativeToggleRow(whichKana, "_s", showSimilars));

      if((!groupName.endsWith("a") || showAlternatives) &&
        (!groupName.endsWith("s") || showSimilars)) {
        rows.push(<CharacterGroup
          key={idx}
          groupName={groupName}
          selected={this.isSelected(groupName)}
          characters={thisKana[groupName].characters}
          handleToggleSelect={this.toggleSelect}
        />);
      }
    });

    return rows;
  }

  startGame() {
    if(this.state.selectedGroups.length < 1) {
      this.setState({ errMsg: 'Choose at least one group!'});
      return;
    }
    this.props.handleStartGame(this.state.selectedGroups);
  }

  render() {
    var names = Object.keys(kanaDictionary);
    var name_list_1 = [];
    var name_list_2 = [];
    var dict_length = names.length;
    for (var i = 0; i < dict_length; i++) {
      if (i < dict_length/2)
        name_list_1.push(names[i]);
      else
        name_list_2.push(names[i]);
    }
    return (
      <div className="choose-characters">
        <div className="row">
          <div className="col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body welcome">
                <h4>Bienvenue sur Learn-Kanji !</h4>
                <p>Choisissez les catégories de kanji que vous souhaitez étudier, 
                  4 mini-jeux sont disponibles :</p>
                <ul>
                  <li>Trouvez les kanji correspondant aux kana.</li>
                  <li>Trouvez les kana correspondant aux kanji.</li>
                  <li>Écrivez la traduction du mot écrit en kana</li>
                  <li>Écrivez la traduction du mot écrit en kanji</li>
                </ul>
                <p className="ganbatte">頑張って！</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">

          <div className="col-sm-6">
            {name_list_1.map((name) => {
            return <div className="panel panel-default">
              <div className="panel-heading panel-choose">{name}</div>
              <div className="panel-body selection-areas">
                {this.showGroupRows(name)}
              </div>
            </div>
            })}
          </div>

          <div className="col-sm-6">
            {name_list_2.map((name) => {
            return <div className="panel panel-default">
              <div className="panel-heading panel-choose">{name}</div>
              <div className="panel-body selection-areas">
                {this.showGroupRows(name)}
              </div>
            </div>
            })}
          </div>

          <div className="col-sm-3 col-xs-12 pull-right">
            <span className="pull-right lock">Un seul niveau &nbsp;
              {
                this.props.isLocked &&
                  <input className="stage-choice" type="number" min="1" max="4" maxLength="1" size="1"
                    onChange={(e)=>this.props.lockStage(e.target.value, true)}
                    value={this.props.stage}
                  />
              }
              <Switch onClick={()=>this.props.lockStage(1)} on={this.props.isLocked} /></span>
          </div>
          <div className="col-sm-offset-3 col-sm-6 col-xs-12 text-center">
            {
              this.state.errMsg != '' &&
                <div className="error-message">{this.state.errMsg}</div>
            }
            <button ref={c => this.startRef = c} className="btn btn-danger startgame-button" onClick={() => this.startGame()}>Commencer !</button>
          </div>
          <div className="down-arrow"
            style={{display: this.state.startIsVisible ? 'none' : 'block'}}
            onClick={(e) => this.scrollToStart(e)}
          >
            Jeu
          </div>
        </div>
      </div>
    );
  }
}

export default ChooseCharacters;
