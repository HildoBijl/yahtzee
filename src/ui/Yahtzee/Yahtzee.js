import './Yahtzee.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import gameActions from '../../redux/gameState.js'
import { getFieldDisplayValue, showFieldValue, isFieldTaken, canClickOnField, canClickOnDice, canRollDice, getNumberFieldSum, getNonNumberFieldSum, getBonus, getGameScore, showBonus, isGameFinished } from '../../redux/gameState.js'
import yana from '../../logic/yahtzeeAnalysis.js'

import RollBoard from '../RollBoard/RollBoard.js'
import ScoreCard from '../ScoreCard/ScoreCard.js'

class Yahtzee extends Component {
  componentDidMount() {
    document.onkeydown = this.handleKeyPress.bind(this)
  }

  // handleKeyPress is called when a key is pressed. It figures out whether something needs to be done and, if so, makes the appropriate calls.
  handleKeyPress(event) {
    const gs = this.props.gameState

    // Is it an enter or space?
    if (event.key === ' ' || event.key === 'Enter') {
      if (canRollDice(gs)) {
        this.props.rollDice()
        event.preventDefault()
        return
      }
      if (isGameFinished(gs)) {
        this.props.resetGame()
        event.preventDefault()
        return
      }
    }
    
    // Is it a number? And do we either still have rolls left or was the ctrl key pressed? In that case, we should select the corresponding dice.
    const keyAsInt = parseInt(event.key)
    if (canClickOnDice(gs) && keyAsInt >= 1 && keyAsInt <= yana.numSides && gs.rollsLeft > 0 && !event.ctrlKey) {
      this.props.pressNumber(keyAsInt)
      event.preventDefault()
      return
    }

    // Is it a field we need to select?
    const fieldIndex = this.getFieldFromKey(event.key)
    if (fieldIndex != -1 && canClickOnField(gs, fieldIndex)) {
      this.props.clickField(fieldIndex)
      event.preventDefault()
      return
    }
  }
  
  // getFieldFromKey receives a key that was pressed and returns which field should be selected (0 through the number of fields). In case no field is matched, it returns -1.
  getFieldFromKey(key) {
    // Check the number fields first.
    const keyAsInt = parseInt(key)
    if (keyAsInt >= 1 && keyAsInt <= yana.numSides)
      return keyAsInt - 1
    
    // Check the other fields second.
    switch (key) {
      case "t":
        return yana.numSides + 0
      case "f":
        return yana.numSides + 1
      case "h":
        return yana.numSides + 2
      case "s":
        return yana.numSides + 3
      case "l":
        return yana.numSides + 4
      case "c":
        return yana.numSides + 5
      case "y":
        return yana.numSides + 6
      default: // Haven't found any field.
        return -1
    }
  }

  render() {
    return (
      <div className="yahtzee">
        <RollBoard />
        <ScoreCard />
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
      rollDice: () => dispatch(gameActions.rollDice()),
      clickField: (fieldIndex) => dispatch(gameActions.clickField(fieldIndex)),
      pressNumber: (number) => dispatch(gameActions.pressNumber(number)),
      resetGame: () => dispatch(gameActions.resetGame()),
    }
  }
)(Yahtzee)