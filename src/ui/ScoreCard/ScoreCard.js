import './ScoreCard.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import gameActions from '../../redux/gameState.js'
import { getFieldDisplayValue, showFieldValue, isFieldTaken, canClickOnField, getNumberFieldSum, getNonNumberFieldSum, getBonus, getGameScore, showBonus } from '../../redux/gameState.js'
import yana from '../../logic/yahtzeeAnalysis.js'
import { createAscendingArray } from '../../logic/util.js'

import ScoreField from '../ScoreField/ScoreField.js'

class ScoreCard extends Component {
  getFieldTitle(ind) {
    if (ind < yana.numSides) {
      switch(ind) {
        case 0: return "Ones"
        case 1: return "Twos"
        case 2: return "Threes"
        case 3: return "Fours"
        case 4: return "Fives"
        case 5: return "Sixes"
      }
    } else {
      switch(ind - yana.numSides) {
        case 0: return "Three of a kind"
        case 1: return "Four of a kind"
        case 2: return "Full house"
        case 3: return "Small straight"
        case 4: return "Large straight"
        case 5: return "Chance"
        case 6: return "Yahtzee"
      }
    }
    throw 'Cannot obtain field title for field ' + ind + '.'
  }

  getScoreField(fieldIndex) {
    const gs = this.props.gameState
    return (
      <ScoreField
        key={fieldIndex}
        title={this.getFieldTitle(fieldIndex)}
        type="field"
        value={getFieldDisplayValue(gs, fieldIndex)}
        available={!isFieldTaken(gs, fieldIndex)}
        clickable={canClickOnField(gs, fieldIndex)}
        showValue={showFieldValue(gs, fieldIndex)}
        callOnClick={canClickOnField(gs, fieldIndex) ? () => this.props.clickField(fieldIndex) : null}
      />
    )
  }

  render() {
    const gs = this.props.gameState
    return (
      <div className="scoreCard">
        <div className="columnContainer">
          <div className="column1">
            {createAscendingArray(0, yana.numSides-1).map((ind) => (
              this.getScoreField(ind)
            ))}
            <ScoreField title="Sum" type="meta" value={getNumberFieldSum(gs)} />
            <ScoreField title="Bonus" type="meta" showValue={showBonus(gs)} value={getBonus(gs)} />
          </div>
          <div className="column2">
            {createAscendingArray(yana.numSides, yana.numFields-1).map((ind) => (
              this.getScoreField(ind)
            ))}
            <ScoreField title="Sum" type="meta" value={getNonNumberFieldSum(gs)} addClass="nonDiceSum" />
          </div>
        </div>
        <ScoreField title="Final score" type="meta" value={getGameScore(gs)} />
      </div>
    )
  }
}

export default connect(
  function mapStateToProps(state) {
    return {
      gameState: state.gameState,
    }
  },
  function mapDispatchToProps(dispatch) {
    return {
      clickField: (ind) => dispatch(gameActions.clickField(ind)),
    }
  }
)(ScoreCard)