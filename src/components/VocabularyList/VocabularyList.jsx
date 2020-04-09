import React, { Component, Fragment } from 'react';
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
        cleanDict[name] = traductionDictionary[key][object_key]['characters'];
      }
    }
    // console.log(cleanDict);
    return cleanDict;
  }

  render() {
  var cleanDict = this.createTables();
    return (
      <div className="outercontainer">
        <div className="container game">
          <div className="choose-characters">
            <div className="row">
              {Object.entries(cleanDict).map(function([name, values])
              {return <div className="col-xs-12">
                <div className="panel panel-success">
                  <div className="panel-heading">
                    <h3 className="panel-title-custom">{name}</h3>
                  </div>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Kanji</th>
                        <th>Prononciation 1</th>
                        <th>Prononciation 2</th>
                        <th>Traduction</th>
                      </tr>
                    </thead>

                    <tbody>
                        {Object.entries(values).map(function([key,value])
                        { return <tr>{value.map(function(value1)
                        { return <td className="boldTd">{value1}</td>})}
                        <td>{key}</td></tr>}
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
              })}

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VocabularyList;
