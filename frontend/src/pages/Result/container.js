import * as gameActions from "actions/game";
import { connect } from "react-redux";

import View from "./view";

const mapStateToProps = (state) => ({ ...state.game });
const actions = { onPlayAgainPress: gameActions.resetGame };
export default connect(mapStateToProps, actions)(View);
