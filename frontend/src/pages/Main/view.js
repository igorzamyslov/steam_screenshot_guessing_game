import "./style.css";

import LiveHeart from "components/LiveHeart";
import OptionButton from "components/OptionButton";
import PropTypes from "prop-types";
import { Component } from "react";
import { createNavigationHandler, routes } from "Router";
import SteamService from "services/SteamService";
import MainTemplate from "templates/MainTemplate";
import { TIMEOUT_BEFORE_NEXT_QUESTION } from "config";

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

class MainPage extends Component {
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
    this.navigateToResult = createNavigationHandler(
      props.history,
      routes.resultPage
    );
  }

  static selectRandomScreenshot = (app) => {
    return Math.floor(Math.random() * app.screenshots.length);
  };

  componentDidMount() {
    this.loadNextScreen(undefined, this.props, 0)
  }

  componentDidUpdate(prevProps) {
    this.loadNextScreen(prevProps, this.props)
  }

  showMessage = (message) => {
    this.setState({ ...cleanState, message });
  };

  loadNextScreen = (prevProps, currentProps, timeout = TIMEOUT_BEFORE_NEXT_QUESTION) => {
    // Depending on the current state of the game (lives, score),
    // loads either the next quiz or the results page
    let callback = null;
    if (!prevProps || prevProps.lives !== currentProps.lives) {
      if (currentProps.lives > 0) {
        callback = this.loadNextQuiz
      } else {
        callback = this.navigateToResult
      }
    } else if (prevProps.score !== currentProps.score) {
      callback = this.loadNextQuiz
    }

    if (callback) {
      setTimeout(callback, timeout);
    }
  }

  loadNextQuiz = () => {
    // show loading message after 1 second
    this.loadingMessageTimeout = setTimeout(() => {
      this.showMessage(messages.loading);
    }, 1000);
    SteamService.getQuizRandomAppData()
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

    if (answer === correctAnswer) {
      this.props.onCorrectAnswer(correctAnswer);
    } else {
      this.props.onIncorrectAnswer(correctAnswer);
    }
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

  renderGames(finishedGames) {
    return (
      <ul>
        {finishedGames.map(({ appName, url }, i) => (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            key={`shown-game-${i}`}
          >
            <li className="shown-game">{appName}</li>
          </a>
        ))}
      </ul>
    );
  }

  renderQuiz(screenshotUrl, answers, chosenAnswer, correctAnswer) {
    const answerOptions = answers.map((answer, i) => (
      <OptionButton
        answer={answer}
        chosenAnswer={chosenAnswer}
        correctAnswer={correctAnswer}
        onClick={chosenAnswer ? undefined : this.makeGuess(answer)}
        className="flex-item"
        key={`option_button_${i}`}
      />
    ));

    return (
      <div>
        <img
          className="screenshot"
          src={screenshotUrl}
          alt="The whole purpose of this website"
        />
        <div className="flex-container buttons-block">{answerOptions}</div>
      </div>
    );
  }

  render() {
    const {
      answers,
      screenshotUrl,
      message,
      chosenAnswer,
      correctAnswer,
    } = this.state;

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
        <div className="dark-back">
          <div className="flex-container">
            <div className="flex-item">
              {this.renderLives(lives)}
              Games:
              {this.renderGames(finishedGames)}
            </div>
            <div className="flex-image-item">{content}</div>
            <div className="flex-item">
              Score:
              <h1>{score}</h1>
            </div>
          </div>
        </div>
      </MainTemplate>
    );
  }
}

export default MainPage;
