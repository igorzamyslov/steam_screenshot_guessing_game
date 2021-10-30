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
      lives: 3,
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
    if(lives<=0){
      setTimeout(this.navigateToResult, TIMEOUT_BEFORE_NEXT_QUESTION);
      
      return ;
    }
    setTimeout(this.loadNextQuiz, TIMEOUT_BEFORE_NEXT_QUESTION);
  };

  navigateToResult = () => { 
    // DOESNT WORK GOD KNOWS WHY
    // routerHistory = useHistory();
    console.log(this)
    this.history.push("/result");
  }

  renderLives(lives) {
    let res = []
    for (let i = 0; i < lives; i++) {
      res.push(<LiveHeart className="flex-item" fill={true} />)
    }
    for (let i = 0; i < (3 - lives); i++) {
      res.push(<LiveHeart className="flex-item" fill={false} />)
    }
    return res
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
                {this.renderLives(lives)}
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
