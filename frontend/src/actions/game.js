import * as types from "./types";

export const handleCorrectAnswer = (payload) => ({
  type: types.CORRECT_ANSWER,
  payload,
});
export const handleIncorrectAnswer = (payload) => ({
  type: types.INCORRECT_ANSWER,
  payload,
});
export const resetGame = () => ({ type: types.RESET_GAME });
