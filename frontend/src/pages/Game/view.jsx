import "./style.css";

import GamesList from "@/components/GamesList";
import LiveHeart from "@/components/LiveHeart";
import OptionButton from "@/components/OptionButton";
import { TIMEOUT_BEFORE_NEXT_QUESTION } from "@/config";
import { createNavigationHandler, routes } from "@/Router";
import SSGGService from "@/services/SSGGService";
import MainTemplate from "@/templates/MainTemplate";
import PropTypes from "prop-types";
import { Component } from "react";
import ym from "react-yandex-metrika";

const messages = {
  loading: "Steam app loading ...",
  error: "Error during Steam app loading!",
};

const cleanState = {
  screenshotUrl: null,
  message: null,
  answers: [],
  chosenAnswer: null,
  correctAnswer: null,
};

class GamePage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...cleanState,
      message: messages.loading,
    };
    this.loadingMessageTimeout = null;
    this.navigateToResult = (score) => {
      ym("reachGoal", "finishedGame", { score: score });
      return createNavigationHandler(props.history, routes.resultPage, {
        score,
      });
    };
  }

  static selectRandomScreenshot = (app) => {
    return Math.floor(Math.random() * app.screenshots.length);
  };

  componentDidMount() {
    this.loadNextScreen(undefined, this.props, 0);
  }

  componentDidUpdate(prevProps) {
    this.loadNextScreen(prevProps, this.props);
  }

  componentWillUnmount() {
    clearTimeout(this.loadingMessageTimeout);
  }

  showMessage = (message) => {
    this.setState({ ...cleanState, message });
  };

  loadNextScreen = (
    prevProps,
    currentProps,
    timeout = TIMEOUT_BEFORE_NEXT_QUESTION
  ) => {
    // Depending on the current state of the game (lives, score),
    // loads either the next quiz or the results page
    let callback = null;
    if (!prevProps || prevProps.lives !== currentProps.lives) {
      if (currentProps.lives > 0) {
        callback = this.loadNextQuiz;
      } else {
        callback = this.navigateToResult(currentProps.score);
      }
    } else if (prevProps.score !== currentProps.score) {
      callback = this.loadNextQuiz;
    }

    if (callback) {
      setTimeout(callback, timeout);
    }
  };

  loadNextQuiz = () => {
    // show loading message after 1 second
    this.loadingMessageTimeout = setTimeout(() => {
      this.showMessage(messages.loading);
    }, 1000);
    SSGGService.getQuizRandomAppData()
      .then((response) => {
        clearTimeout(this.loadingMessageTimeout);
        const quiz = response.body;
        const { screenshotUrl, answers } = quiz;
        this.setState({ ...cleanState, screenshotUrl, answers });
      })
      .catch(() => {
        this.showMessage(messages.error);
      });
  };

  makeGuess = (answer) => () => {
    const correctAnswer = this.state.answers.find((a) => a.correct);
    this.setState({ chosenAnswer: answer, correctAnswer });

    const isGuessCorrect = answer === correctAnswer;
    const callback = isGuessCorrect
      ? this.props.onCorrectAnswer
      : this.props.onIncorrectAnswer;
    callback({
      name: correctAnswer.appName,
      url: correctAnswer.url,
      correct: isGuessCorrect,
    });
  };

  renderLives(lives) {
    let res = [];
    for (let i = 0; i < 3; i++) {
      const key = `live_heart_${i}`;
      const fill = i + 1 <= lives;
      res.push(<LiveHeart className="flex-item" fill={fill} key={key} />);
    }

    return <div className="flex-column-container">{res}</div>;
  }

  renderQuiz(screenshotUrl, answers, chosenAnswer, correctAnswer) {
    let prefixes = ["A", "B", "C", "D"];
    const answerOptions = answers.map((answer, i) => (
      <OptionButton
        prefix={prefixes[i]}
        answer={answer}
        chosenAnswer={chosenAnswer}
        correctAnswer={correctAnswer}
        onClick={chosenAnswer ? undefined : this.makeGuess(answer)}
        className="flex-item"
        key={`option_button_${i}`}
      />
    ));

    return [
      <img
        className="screenshot"
        src={screenshotUrl}
        alt="The whole purpose of this website"
        key="quiz-image"
      />,
      <div
        className="flex-item flex-container buttons-block"
        key="quiz-answers"
      >
        {answerOptions}
      </div>,
    ];
  }

  render() {
    const { answers, screenshotUrl, message, chosenAnswer, correctAnswer } =
      this.state;

    const { finishedGames, score, lives } = this.props;

    let content;
    if (message) {
      content = <p className="flex-item">{message}</p>;
    } else {
      content = this.renderQuiz(
        screenshotUrl,
        answers,
        chosenAnswer,
        correctAnswer
      );
    }

    return (
      <MainTemplate>
        <div className="flex-container main">
          <div className="flex-item answers-block">
            {this.renderLives(lives)}
            Score:
            <h1>{score}</h1>
            Games:
            <div className="games-list-block">
              <GamesList games={finishedGames} />
            </div>
          </div>
          <div className="flex-item image-block">{content}</div>
        </div>
      </MainTemplate>
    );
  }
}

export default GamePage;
