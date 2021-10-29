import OptionButton from 'components/OptionButton';
import { Component } from 'react';
import SteamService from 'services/SteamService';
import MainTemplate from 'templates/MainTemplate';
import './style.css';

const messages = {
  loading: 'Steam app loading ...',
  error: 'Error during Steam app loading!',
};

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

class MainPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      screenshotUrl: null,
      message: messages.loading,
      answers: [],
      chosenAnswer: null,
      correctAnswer: null,
      score: 0,
      shownGames: [],
    };
  }

  static selectRandomScreenshot = (app) => {
    return Math.floor(Math.random() * app.screenshots.length);
  };

  componentDidMount () {
    this.loadNextQuiz();
  }

  showMessage = (message) => {
    this.setState({
      currentApp: null,
      currentScreenshot: null,
      message,
    });
  };

  loadNextQuiz = () => {
    this.showMessage(messages.loading);
    SteamService.getQuizRandomAppData()
      .then((response) => {
        const quiz = response.body;
        const { screenshotUrl, answers } = quiz;
        this.setState({ screenshotUrl, answers, message: null });
      })
      .catch(() => {
        this.showMessage(messages.error);
      });
  };

  makeGuess = (answer) => () => {

  };

  render () {
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
        answer={answer}
        className="item"
        blink={chosenAnswer}
        blinkClass={chosenAnswer === correctAnswer ? 'correct' : 'incorrect'}
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
                {shownGames.map((name) => (
                  <a href="#">
                    <li className="shown-game">{name}</li>
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
