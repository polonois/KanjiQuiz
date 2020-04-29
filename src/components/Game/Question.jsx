import React, { Component } from 'react';
import { kanaDictionary  } from '../../data/kanaDictionary';
import { traductionDictionary } from '../../data/traductionDictionary';
import { quizSettings } from '../../data/quizSettings';
import { findTraductionAtKanjiKey, findRomajisAtKanaKey, removeFromArray, arrayContains, shuffle, cartesianProduct } from '../../data/helperFuncs';
import './Question.scss';

class Question extends Component {
  state = {
    previousQuestion: [],
    previousAnswer: '',
    currentAnswer: '',
    currentQuestion: [],
    answerOptions: [],
    stageProgress: 0
  }
    // this.setNewQuestion = this.setNewQuestion.bind(this);
    // this.handleAnswer = this.handleAnswer.bind(this);
    // this.handleAnswerChange = this.handleAnswerChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  // }

        getRandomKanji(amount, include, exclude, KanjiOrHiragana) {
                let randomizedKanji = [];

                if (KanjiOrHiragana == 1) {
                        randomizedKanji = this.askableKanaTradKeys.slice();
                        let doppleKanji = []
                        for (var i = 0 ; i < this.askableKanaTradKeys.length; i++) {
                                for (var j = 0 ; j < this.askableKanaTradKeys.length, j != i ; j++) {
                                        if (this.askableKanaTradKeys[j].localeCompare(this.askableKanaTradKeys[i]) == 0) {
                                                doppleKanji.push(this.askableKanaTradKeys[i]);
                                                // console.log(doppleKanji);
                                        }
                                }
                        }
                        for (var w = 0; w < doppleKanji.length ; w++) {
                                while (arrayContains(doppleKanji[w], randomizedKanji)) {
                                        randomizedKanji = removeFromArray(doppleKanji[w], randomizedKanji);
                                }
                        }
                }
                else {
                        randomizedKanji = this.askableKanjiKeys.slice();        
                }
                // console.log(randomizedKanji);

                if(exclude && exclude.length > 0) {
                        randomizedKanji = removeFromArray(exclude, randomizedKanji);
                }
                
                if(include && include.length > 0) {
                        // we arrive here when we're deciding answer options (included = currentQuestion)

      // remove included kana
      randomizedKanji = removeFromArray(include, randomizedKanji);
      shuffle(randomizedKanji);

      // cut the size to make looping quicker
      randomizedKanji = randomizedKanji.slice(0,20);

      // let's remove kanas that have the same answer as included
      let searchFor = findRomajisAtKanaKey(include, traductionDictionary, this.props.decidedGroups)[0];
      randomizedKanji = randomizedKanji.filter(character => {
        return searchFor!=findRomajisAtKanaKey(character, traductionDictionary, this.props.decidedGroups)[0];
      });

      // now let's remove "duplicate" kanas (if two kanas have same answers)
      let tempRandomizedKanji = randomizedKanji.slice();
      randomizedKanji = randomizedKanji.filter(r => {
        let dupeFound = false;
        searchFor = findRomajisAtKanaKey(r, traductionDictionnary, this.props.decidedGroups)[0];
        tempRandomizedKanji.shift();
        tempRandomizedKanji.forEach(w => {
          if(findRomajisAtKanaKey(w, traductionDictionnary, this.props.decidedGroups)[0]==searchFor)
            dupeFound = true;
        });
        return !dupeFound;
      });

      // alright, let's cut the array and add included to the end
      randomizedKanji = randomizedKanji.slice(0, amount-1); // -1 so we have room to add included
      randomizedKanji.push(include);
      shuffle(randomizedKanji);
    }
    else {
      shuffle(randomizedKanji);
      randomizedKanji = randomizedKanji.slice(0, amount);
    }
    return randomizedKanji;

        }

  getRandomKanas(amount, include, exclude) {
    let randomizedKanas = this.askableKanaKeys.slice();
    //console.log(randomizedKanas)

    if(exclude && exclude.length > 0) {
      // we're excluding previous question when deciding a new question
      randomizedKanas = removeFromArray(exclude, randomizedKanas);
    }

    if(include && include.length > 0) {
      // we arrive here when we're deciding answer options (included = currentQuestion)

      // remove included kana
      randomizedKanas = removeFromArray(include, randomizedKanas);
      shuffle(randomizedKanas);

      // cut the size to make looping quicker
      randomizedKanas = randomizedKanas.slice(0,20);

      // let's remove kanas that have the same answer as included
      let searchFor = findRomajisAtKanaKey(include, kanaDictionary, this.props.decidedGroups)[0];
      randomizedKanas = randomizedKanas.filter(character => {
        return searchFor!=findRomajisAtKanaKey(character, kanaDictionary, this.props.decidedGroups)[0];
      });

      // now let's remove "duplicate" kanas (if two kanas have same answers)
      let tempRandomizedKanas = randomizedKanas.slice();
      randomizedKanas = randomizedKanas.filter(r => {
        let dupeFound = false;
        searchFor = findRomajisAtKanaKey(r, kanaDictionary, this.props.decidedGroups)[0];
        tempRandomizedKanas.shift();
        tempRandomizedKanas.forEach(w => {
          if(findRomajisAtKanaKey(w, kanaDictionary, this.props.decidedGroups)[0]==searchFor)
            dupeFound = true;
        });
        return !dupeFound;
      });

      // alright, let's cut the array and add included to the end
      randomizedKanas = randomizedKanas.slice(0, amount-1); // -1 so we have room to add included
      randomizedKanas.push(include);
      shuffle(randomizedKanas);
    }
    else {
      shuffle(randomizedKanas);
      randomizedKanas = randomizedKanas.slice(0, amount);
    }
    return randomizedKanas;
  }

  setNewQuestion() {
    if(this.props.stage==1 || this.props.stage==2)
      this.currentQuestion = this.getRandomKanas(1, false, this.previousQuestion);
                else if(this.props.stage == 4)
                        this.currentQuestion = this.getRandomKanji(1, false, this.previousQuestion, 0);
    else
                        this.currentQuestion = this.getRandomKanji(1, false, this.previousQuestion, 1);
    this.setState({currentQuestion: this.currentQuestion});
    this.setAnswerOptions();
    this.setAllowedAnswers();
    // console.log(this.currentQuestion);
  }

  setAnswerOptions() {
    this.answerOptions = this.getRandomKanas(3, this.currentQuestion[0], false);
    this.setState({answerOptions: this.answerOptions});
     //console.log(this.answerOptions);
  }

  setAllowedAnswers() {
     //console.log(this.currentQuestion);
    this.allowedAnswers = [];
    if(this.props.stage==1 )
      this.allowedAnswers = findRomajisAtKanaKey(this.currentQuestion, kanaDictionary, this.props.decidedGroups)
    else if (this.props.stage==4)
      this.allowedAnswers = findTraductionAtKanjiKey(this.currentQuestion, traductionDictionary, 0, this.props.decidedGroups)
    else if(this.props.stage==2)
      this.allowedAnswers = this.currentQuestion;
    else if(this.props.stage==3) {
                        this.allowedAnswers = findTraductionAtKanjiKey(this.currentQuestion, traductionDictionary, 1, this.props.decidedGroups)
    }
     //console.log(this.allowedAnswers);
  }

  handleAnswer = answer => {
    if(this.props.stage<=2) document.activeElement.blur(); // reset answer button's :active
    this.previousQuestion = this.currentQuestion;
    this.setState({previousQuestion: this.previousQuestion});
    this.previousAnswer = answer;
    this.setState({previousAnswer: this.previousAnswer});
    this.previousAllowedAnswers = this.allowedAnswers;
    if(this.isInAllowedAnswers(this.previousAnswer))
      this.stageProgress = this.stageProgress+1;
    else
      this.stageProgress = this.stageProgress > 0 ? this.stageProgress - 1 : 0;
    this.setState({stageProgress: this.stageProgress});
    if(this.stageProgress >= quizSettings.stageLength[this.props.stage] && !this.props.isLocked) {
      setTimeout(() => { this.props.handleStageUp() }, 300);
    }
    else
      this.setNewQuestion();
  }

  initializeCharacters() {
                this.askableKanji = {};
                this.askableKanjiKeys = [];
                this.askableKanaTradKeys = [];
    this.askableKanas = {};
    this.askableKanaKeys = [];
    this.askableRomajis = [];
    this.previousQuestion = '';
    this.previousAnswer = '';
    this.stageProgress = 0;
                Object.keys(traductionDictionary).forEach(whichKana => {
                        Object.keys(traductionDictionary[whichKana]).forEach(groupName => {
                                if(arrayContains(groupName, this.props.decidedGroups)) {
                                        this.askableKanji = Object.assign(this.askableKanji, traductionDictionary[whichKana][groupName]['characters']);
                                                Object.keys(traductionDictionary[whichKana][groupName]['characters']).forEach(key => {
                                                        this.askableKanjiKeys.push(traductionDictionary[whichKana][groupName]['characters'][key][0]);
                                                        this.askableKanaTradKeys.push(traductionDictionary[whichKana][groupName]['characters'][key][1]);
          });
        }
      });
    });
    Object.keys(kanaDictionary).forEach(whichKana => {
      // console.log(whichKana); // 'hiragana' or 'katakana'
      Object.keys(kanaDictionary[whichKana]).forEach(groupName => {
        // console.log(groupName); // 'h_group1', ...
        // do we want to include this group?
        if(arrayContains(groupName, this.props.decidedGroups)) {
          // let's merge the group to our askableKanas
          this.askableKanas = Object.assign(this.askableKanas, kanaDictionary[whichKana][groupName]['characters']);
          Object.keys(kanaDictionary[whichKana][groupName]['characters']).forEach(key => {
            // let's add all askable kana keys to array
            this.askableKanaKeys.push(key);
            this.askableRomajis.push(kanaDictionary[whichKana][groupName]['characters'][key][0]);
          });
        }
      });
    });
    // console.log(this.askableKanas);
  }

  getAnswerType() {
    if(this.props.stage==2) return 'kana';
    else return 'romaji';
  }

  getShowableQuestion() {
    if(this.getAnswerType()=='kana')
      return findRomajisAtKanaKey(this.state.currentQuestion, kanaDictionary, this.props.decidedGroups)[0];
    else return this.state.currentQuestion;
  }

  getPreviousResult() {
    let resultString='';
    // console.log(this.previousAnswer);
    if(this.previousQuestion=='') {
      if (this.props.stage==1) {
        resultString = <div className="previous-result none">
          Trouvez les kanji correspondant aux kana suivants :
        </div>
      } else if (this.props.stage==2) {
        resultString = <div className="previous-result none">
          Trouvez les kana correspondant aux kanji suivants :
        </div>
      } else if (this.props.stage==3) {
        resultString = <div className="previous-result none">
          Écrivez la traduction des mots suivants :
        </div>
      } else if (this.props.stage==4) {
        resultString = <div className="previous-result none">
          Écrivez la traduction des mots suivants :
        </div>
      }
    }
    else {
      let rightAnswer = (
        this.props.stage==2 ?
          findRomajisAtKanaKey(this.previousQuestion, kanaDictionary, this.props.decidedGroups)[0]
          : this.previousQuestion.join('')
        )+' = '+ this.previousAllowedAnswers;

      if(this.isInAllowedAnswers(this.previousAnswer))
        resultString = (
          <div className="previous-result correct" title="Correct answer!">
            <span className="pull-left glyphicon glyphicon-none"></span>{rightAnswer}<span className="pull-right glyphicon glyphicon-ok"></span>
          </div>
        );
      else
        resultString = (
          <div className="previous-result wrong" title="Wrong answer!">
            <span className="pull-left glyphicon glyphicon-none"></span>{rightAnswer}<span className="pull-right glyphicon glyphicon-remove"></span>
          </div>
        );
    }
    return resultString;
  }

  isInAllowedAnswers(previousAnswer) {
    // console.log(previousAnswer);
    // console.log(this.allowedAnswers);
    if(this.props.stage == 3 || this.props.stage == 4) {
      let prepo = ["le", "la", "les", "du","des", "un", "une", "l"];
      // Remove optional information parentheses and split with the comma
      let answers = this.previousAllowedAnswers.toString().replace(/ \(.*?\)|\(.*?\)/g,'').split(/, |,/);
      previousAnswer = previousAnswer.replace(/[ ]+$/g, '');
      for (var i = 0 ; i < answers.length ; i++) {
        let good_answer_prepo = false;
        let answer_prepo = false;
        let words = answers[i].split(/\'|\ /);
        let refinedAnswer = previousAnswer.split(/\'|\ /);
        //console.log(refinedAnswer);
        //console.log(words);
        for (var j= 0; j < prepo.length ; j++) {
          if(!prepo[j].localeCompare(words[0])) {
            good_answer_prepo = true;
          }
          if(!prepo[j].localeCompare(refinedAnswer[0])) {
            answer_prepo = true;
          }
        }
        //console.log(good_answer_prepo);
        //console.log(answer_prepo);
        if (good_answer_prepo && answer_prepo) {
          words = words.slice(1);
          refinedAnswer = refinedAnswer.slice(1);
          if (words.toString().localeCompare(refinedAnswer.toString()) == 0) {
            return true;
          }
        }
        if (!good_answer_prepo && answer_prepo) {
          refinedAnswer = refinedAnswer.slice(1);
          if (words.toString().localeCompare(refinedAnswer.toString()) == 0) {
            return true;
          }
        }
        if (good_answer_prepo && !answer_prepo) {
          words = words.slice(1);
          if (words.toString().localeCompare(refinedAnswer.toString()) == 0) {
            return true;
          }
        }
        if (!good_answer_prepo && !answer_prepo) {
          if (words.toString().localeCompare(refinedAnswer.toString()) == 0) {
            return true;
          }
        }
      }
      return false;
    } else {
      if(arrayContains(previousAnswer, this.previousAllowedAnswers))
        return true;
      else return false;
    }
  }

  handleAnswerChange = e => {
    this.setState({currentAnswer: e.target.value});
  }

  handleSubmit = e => {
    e.preventDefault();
    if(this.state.currentAnswer!='') {
      this.handleAnswer(this.state.currentAnswer);
      this.setState({currentAnswer: ''});
    }
  }

  componentWillMount() {
    this.initializeCharacters();
  }

  componentDidMount() {
    this.setNewQuestion();
  }

  render() {
    let btnClass = "btn btn-default answer-button";
    if ('ontouchstart' in window)
      btnClass += " no-hover"; // disables hover effect on touch screens
    let stageProgressPercentage = Math.round((this.state.stageProgress/quizSettings.stageLength[this.props.stage])*100)+'%';
    let stageProgressPercentageStyle = { width: stageProgressPercentage }
    return (
      <div className="text-center question col-xs-12">
        {this.getPreviousResult()}
        <div className="big-character">{this.getShowableQuestion()}</div>
        <div className="answer-container">
          {
            this.props.stage<3 ?
              this.state.answerOptions.map((answer, idx) => {
                return <AnswerButton answer={answer}
                  className={btnClass}
                  groups={this.props.decidedGroups}
                  key={idx}
                  answertype={this.getAnswerType()}
                  handleAnswer={this.handleAnswer} />
              })
            : <div className="answer-form-container">
                <form onSubmit={this.handleSubmit}>
                  <input autoFocus className="answer-input" type="text" value={this.state.currentAnswer} onChange={this.handleAnswerChange} />
                </form>
              </div>
          }
        </div>
        <div className="progress">
          <div className="progress-bar progress-bar-info"
            role="progressbar"
            aria-valuenow={this.state.stageProgress}
            aria-valuemin="0"
            aria-valuemax={quizSettings.stageLength[this.props.stage]}
            style={stageProgressPercentageStyle}
          >
          <span>Niveau {this.props.stage} {this.props.isLocked?' (verrouillé)':''}</span>
          </div>
        </div>
      </div>
    );
  }

}

class AnswerButton extends Component {
  getShowableAnswer() {
    if(this.props.answertype=='romaji') {
      return findRomajisAtKanaKey(this.props.answer, kanaDictionary, this.props.groups)[0];
    }
    else return this.props.answer;
  }

  render() {
    return (
      <button className={this.props.className} onClick={()=>this.props.handleAnswer(this.getShowableAnswer())}>{this.getShowableAnswer()}</button>
    );
  }
}
export default Question;
