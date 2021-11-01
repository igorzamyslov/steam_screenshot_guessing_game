import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import MainPage from "./view";
import * as gameActions from "actions/game";

const mapStateToProps = (state) => ({ ...state.game })

const actions = {
    onCorrectAnswer: gameActions.handleCorrectAnswer,
    onIncorrectAnswer: gameActions.handleIncorrectAnswer,
    resetGame: gameActions.resetGame,
}
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainPage)
