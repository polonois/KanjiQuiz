import React, { Component } from 'react';
import Switch from 'react-toggle-switch';
import { traductionDictionary } from '../../data/traductionDictionary';
import './VocabularyList.scss';
import '../App/App.scss';

/* Class that reads the traduction dictionary and builds returns
   a nice HTML vocabulary table to be displayed*/
class VocabularyList extends Component {

  
  createTables() {
    var cleanDict ={};
    var name;
    for (var key in traductionDictionary) {
      name = key;
      for (var object_key in traductionDictionary[key]) {
        cleanDict.push({key: name,value: traductionDictionary[key][object_key]['characters']});
        //createTable(name, traductionDictionary[key][object_key]["characters"]);
      }
    }
    console.log(cleanDict);
    return cleanDict;
  }

  /*createTable(name, dict) {
    
                  <table className="table-striped">
                    <thead>
                    </thead>

                    <tbody>
                    </tbody>
                  </table>
  }

  createHeaders(name) {
    return (
      <table className="table-striped">
        <thead>
          <tr>
            <th>Kanji</th>
            <th>Prononciation principale</th>
            <th>Prononciation alternative</th>
            <th>Traduction</th>
          </tr>
        </thead>)
  }*/



  render() {
  var cleanDict = this.createTables();
    return (
      <div className="outercontainer">
        <div className="container game">
          <div className="choose-characters">
            <div className="row">
              <div className="col-xs-12">
                <div className="panel panel-default">
                  
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Kanji</th>
                        <th>Prononciation principale</th>
                        <th>Prononciation alternative</th>
                        <th>Traduction</th>
                      </tr>
                    </thead>

                    <tbody>
                        {Object.entries(traductionDictionary["Kanji Communs 1"]
                        ["k_groupe1"]["characters"]).map(([key,value]) => 
                        { return <tr>{value.map((value) =>
                        { return <td>{value}</td>})}
                        <td>{key}</td></tr>}
                        )}
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VocabularyList;
