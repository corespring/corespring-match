import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';
import {Tabs, Tab} from 'material-ui/Tabs';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import ChoiceInput from '../../src/choice-input';
import EditableHTML from './editable-html';
import FeedbackConfig from './feedback-config';

require('./index.less');

injectTapEventPlugin();

class Main extends React.Component {

  constructor(props) {
    super(props);
  }

  _getNumberOfColumnsForLayout(layout) {
    switch (layout) {
      case 'four-columns':
        return 4;
      case 'five-columns':
        return 5;
      default:
        return this.MIN_COLUMNS;
    }
  }

  _addRowToCorrectResponseMatrix(rowId) {
    let createEmptyMatchSet = (length) => {
      return _.range(length).map(function() {
        return false;
      });
    }

    let matchSet = createEmptyMatchSet(this.props.model.columns.length - 1);
    this.props.model.correctResponse.push({
      id: rowId,
      matchSet: matchSet
    });
  }

  _addRow(event) {
    let findFreeRowSlot = () => {
      let slot = 1;
      let rows = _.map(this.props.model.rows, 'id');
      while (_.includes(rows, `row-${slot}`)) {
        slot++;
      }
      return slot;
    };
    let slot = findFreeRowSlot();

    this.props.model.rows.push({
      id: `row-${slot}`,
      labelHtml: `Question text ${slot}`
    });
    this._addRowToCorrectResponseMatrix(`row-${slot}`)
    this.props.onRowsChanged(event, this.props.model.rows);
  }

  _deleteRow(index) {
    this.props.model.rows.splice(index, 1);
    this.props.onRowsChanged(event, this.props.model.rows);
  }

  edit(index) {
    console.log(`edit ${index}`);
  }

  onChange(index, html) {
    this.props.model.rows[index].labelHtml = html;
    this.props.onRowsChanged(event, this.props.model.rows);
  }

  setCorrect(rowId, columnIndex, value) {
    let row = _.find(this.props.model.correctResponse, (row) => {
      return row.id === rowId;
    });
    if (row !== undefined) {
      row.matchSet[columnIndex] = value.selected;
    }
    console.log(this.props.model.correctResponse);
  }

  render() {
    let theme = getMuiTheme({});
    return <MuiThemeProvider muiTheme={theme}>
      <div className="corespring-match-config-root">
        <Tabs>
          <Tab label="Design">
            <p>
              In Choice Matrix, students associate choices in the first column with options in the adjacent 
              rows. This interaction allows for either one or more correct answers. Setting more than one 
              answer as correct allows for partial credit (see the Scoring tab).
            </p>
            <SelectField floatingLabelText="Layout" value={this.props.model.config.layout} onChange={this.props.onLayoutChanged}>
              <MenuItem value="three-columns" primaryText="3 Columns"/>
              <MenuItem value="four-columns" primaryText="4 Columns"/>
              <MenuItem value="five-columns" primaryText="5 Columns"/>
            </SelectField>
            <SelectField floatingLabelText="Response Type" value={this.props.model.config.inputType} onChange={this.props.onInputTypeChanged}>
              <MenuItem value="radio" primaryText="Radio - One Answer"/>
              <MenuItem value="checkbox" primaryText="Checkbox - Multiple Answers"/>
            </SelectField>
            <p>
              Click on the labels to edit or remove. Set the correct answers by clicking each correct
              answer per row.
            </p>
            <table>
              <thead>
                <tr>
                  {
                    this.props.model.columns.map((column, columnIndex) => {
                      return <th key={columnIndex}>
                        <TextField name={`col-${columnIndex}`} value={this.props.model.columns[columnIndex].labelHtml} onChange={this.modelUpdated} />
                      </th>;
                    })
                  }
                </tr>
              </thead>
              <tbody>
                {
                  this.props.model.rows.map((row, rowIndex) => {
                    return <tr key={rowIndex}>
                        <td>
                          <EditableHTML model={row.labelHtml} onChange={this.onChange.bind(this, rowIndex)} />
                        </td>
                        {
                          this.props.model.columns.map((column, columnIndex) => {
                            return <td key={columnIndex}>
                              <ChoiceInput choiceMode={this.props.model.config.inputType} 
                                onChange={this.setCorrect.bind(this, row.id, columnIndex)}
                                selected={this.props.model.correctResponse[rowIndex].matchSet[columnIndex]}/>
                            </td>;
                          })
                        }
                        <td><IconButton onClick={this._deleteRow.bind(this, rowIndex)}><ActionDelete/></IconButton></td>
                      </tr>;
                  })
                }
              </tbody>
            </table>
            <RaisedButton label="+ Add a row" onClick={this._addRow.bind(this)}/>
            <Checkbox label="Shuffle Choices" value={this.props.model.config.shuffle} onCheck={this.props.onShuffleChanged}/>
            <FeedbackConfig/>
          </Tab>
          <Tab label="Scoring">
            <div>
              Scoring!
            </div>
          </Tab>
        </Tabs>
      </div>
    </MuiThemeProvider>;
  }

}

Main.MIN_COLUMNS = 3;

export default Main;