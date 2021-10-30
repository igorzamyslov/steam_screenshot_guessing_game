import "./style.css";

import OptionButton from "components/OptionButton";
import { Component } from "react";
import SteamService from "services/SteamService";
import MainTemplate from "templates/MainTemplate";
import { withRouter } from "react-router";
import PropTypes from "prop-types";


import {
  BrowserRouter as Router,
  Link,
  useHistory
} from "react-router-dom";
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
      shownGames: [],
    };
    this.loadingMessageTimeout = null;
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
    const score = this.state.score + (answer === correctAnswer);
    this.setState({
      chosenAnswer: answer,
      correctAnswer,
      shownGames,
      score,
    });
    setTimeout(this.loadNextQuiz, TIMEOUT_BEFORE_NEXT_QUESTION);
  };

  navigateToResult() {
    // DOESNT WORK GOD KNOWS WHY
    // routerHistory = useHistory();
    this.history.push("/result");
  }

  render() {
    const {
      answers,
      screenshotUrl,
      message,
      score,
      shownGames,
      chosenAnswer,
      correctAnswer,
    } = this.state;

    const { match, location, history } = this.props;

    const answerOptions = answers.map((answer, i) => (
      <OptionButton
        answer={answer}
        chosenAnswer={chosenAnswer}
        correctAnswer={correctAnswer}
        onClick={this.makeGuess(answer)}
        className="flex-item"
        key={`option_button_${i}`}
      />
    ));

    let content;
    if (message) {
      content = <p className="flex-item">{message}</p>;
    } else {
      content = (
        <img
          className="screenshot"
          src={screenshotUrl}
          alt="The whole purpose of this website"
        />
      );
    }
    return (
      <MainTemplate>
        <div className="dark-back">
          <div className="flex-container">            
            <div className="flex-item">
            <div className="flex-coulmn-container">
              <LiveHeart className="flex-item" />
              <LiveHeart className="flex-item"/>
              <LiveHeart className="flex-item"/>
            </div>
              Games:
              <ul>
                {shownGames.map(({ appName, url }) => (
                  <a href={url} target="_blank" rel="noreferrer">
                    <li className="shown-game">{appName}</li>
                  </a>
                ))}
              </ul>
            </div>
            <div className="flex-image-item">
              {content}
              <div className="flex-container buttons-block">
                {answerOptions}
              </div>
            </div>
            <div className="flex-item">
              <Link to="/result">Score:</Link>
              <h1 onClick={this.navigateToResult} >{score}</h1>
            </div>
          </div>
        </div>
      </MainTemplate>
    );
  }
}

export default MainPage;
