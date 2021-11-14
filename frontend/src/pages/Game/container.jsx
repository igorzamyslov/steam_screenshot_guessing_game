import * as gameActions from "@/actions/game";
import { connect } from "react-redux";

import View from "./view";

const mapStateToProps = (state) => ({ ...state.game });
const actions = {
  onCorrectAnswer: gameActions.handleCorrectAnswer,
  onIncorrectAnswer: gameActions.handleIncorrectAnswer,
};
export default connect(mapStateToProps, actions)(View);
