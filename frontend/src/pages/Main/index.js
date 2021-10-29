import "./style.css";

import OptionButton from "components/OptionButton";
import { Component } from "react";
import SteamService from "services/SteamService";
import MainTemplate from "templates/MainTemplate";

/*
{
  "screenshotUrl": "string",
  "answers": [
    {
      "appId": 0,
      "appMame": "string",
      "url": "string",
      "correct": true
    }
  ]
}
*/

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
  constructor(props) {
    super(props);
    this.state = {
      ...cleanState,
      message: messages.loading,
      score: 0,
      shownGames: [],
    };
  }

  static selectRandomScreenshot = (app) => {
    return Math.floor(Math.random() * app.screenshots.length);
  };

  componentDidMount() {
    this.loadNextQuiz();
  }

  showMessage = (message) => {
    this.setState({ ...cleanState, message });
  };

  loadNextQuiz = () => {
    this.showMessage(messages.loading);
    SteamService.getQuizRandomAppData()
      .then((response) => {
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
    setTimeout(this.loadNextQuiz, 3000);
  };

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

    const answerOptions = answers.map((answer, i) => (
      <OptionButton
        key={`option_button_${i}`}
        label={answer.appName}
        className="item"
        blink={[chosenAnswer, correctAnswer].includes(answer)}
        blinkClass={answer === correctAnswer ? "correct" : "incorrect"}
        onClick={this.makeGuess(answer)}
      />
    ));

    let content;
    if (message) {
      content = <p>{message}</p>;
    } else {
      content = (
        <div className="dark-back">
          <div className="container">
            <div className="item">
              Games:
              <ul>
                {shownGames.map(({ appId, appName }) => (
                  <a
                    href={`https://store.steampowered.com/app/${appId}`}
                    target="_blank"
                  >
                    <li className="shown-game">{appName}</li>
                  </a>
                ))}
              </ul>
            </div>
            <div className="image-item">
              <img
                className="screenshot"
                src={screenshotUrl}
                alt="The whole purpose of this website"
              />
              <div className="container buttons-block">{answerOptions}</div>
            </div>
            <div className="item">
              Score:
              <h1>{score}</h1>
            </div>
          </div>
        </div>
      );
    }
    return <MainTemplate>{content}</MainTemplate>;
  }
}

export default MainPage;
