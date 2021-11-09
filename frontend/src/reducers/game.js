import * as actionTypes from "@/actions/types";
import { MAX_LIVES } from "@/config";

const defaultState = {
  score: 0,
  lives: MAX_LIVES,
  finishedGames: [],
};

export default function reduce(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.CORRECT_ANSWER:
      return {
        ...state,
        score: state.score + 1,
        finishedGames: state.finishedGames.concat([action.payload]),
      };
    case actionTypes.INCORRECT_ANSWER:
      return {
        ...state,
        lives: state.lives - 1,
        finishedGames: state.finishedGames.concat([action.payload]),
      };
    case actionTypes.RESET_GAME:
      return { ...defaultState };
    default:
      return state;
  }
}
