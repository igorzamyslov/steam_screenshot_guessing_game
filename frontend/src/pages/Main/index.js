import "./style.css";

import OptionButton from "components/OptionButton";
import { Component } from "react";
import SteamService from "services/SteamService";
import MainTemplate from "templates/MainTemplate";
import PropTypes from "prop-types";


import { createNavigationHandler, routes } from "Router";
import { Link } from "react-router-dom";
import LiveHeart from "components/LiveHeart";

const TIMEOUT_BEFORE_NEXT_QUESTION = 600;


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
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      ...cleanState,
      message: messages.loading,
      score: 0,
      lives: 3,
      shownGames: [],
    };
    this.loadingMessageTimeout = null;
    this.navigateToResult = createNavigationHandler(props.history, routes.resultPage)
  }

  static selectRandomScreenshot = (app) => {
    return Math.floor(Math.random() * app.screenshots.length);
  };

  componentDidMount() {
    this.loadNextQuiz();
  }

  componentWillUnmount() {
    clearTimeout(this.loadingMessageTimeout);
  }

  showMessage = (message) => {
    this.setState({ ...cleanState, message });
  };

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
    const shownGames = [...this.state.shownGames, correctAnswer];
    let score = this.state.score
    let lives = this.state.lives
    if (answer === correctAnswer) {
      score = this.state.score + 1;
    } else {
      lives = this.state.lives - 1;
    }

    this.setState({
      chosenAnswer: answer,
      correctAnswer,
      shownGames,
      score,
      lives
    });
    if(lives > 0){
      setTimeout(this.loadNextQuiz, TIMEOUT_BEFORE_NEXT_QUESTION);
    } else {
      setTimeout(this.navigateToResult, TIMEOUT_BEFORE_NEXT_QUESTION);
    }
  };

  renderLives(lives) {
    let res = []
    for (let i = 0; i < 3; i++) {
      const key = `live_heart_${i}`;
      const fill = ((i + 1) <= lives);
      res.push(<LiveHeart className="flex-item" fill={fill} key={key} />)
    }

    return (
      <div className="flex-coulmn-container">
        {res}
      </div>
    );
  }

  renderGames(shownGames) {
    return (
      <ul>
        {shownGames.map(({ appName, url }, i) => (
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
        <div className="flex-container buttons-block">
          {answerOptions}
        </div>
      </div>
    )
  }

  render() {
    const {
      answers,
      screenshotUrl,
      message,
      score,
      lives,
      shownGames,
      chosenAnswer,
      correctAnswer,
    } = this.state;

    return (
      <MainTemplate>
        <div className="dark-back">
          <div className="flex-container">
            <div className="flex-item">
              {this.renderLives(lives)}
              Games:
              {this.renderGames(shownGames)}
            </div>
            <div className="flex-image-item">
              {(message
                ? <p className="flex-item">{message}</p>
                : this.renderQuiz(screenshotUrl, answers, chosenAnswer, correctAnswer))}
            </div>
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
