import "./style.css";
import './layout.css'
import { Container, Row, Col } from 'react-bootstrap';

import { Component } from "react";
import Button from "react-bootstrap/Button";
import SteamService from "services/SteamService";
import MainTemplate from "templates/MainTemplate";
import OptionButton from "pages/Main/OptionButton"

const messages = {
  loading: "Steam app loading ...",
  error: "Error during Steam app loading!",
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
  constructor(props) {
    super(props);
    this.state = {
      screenshotUrl: null,
      message: messages.loading,
      answers: [],
    };
  }

  static selectRandomScreenshot = (app) => {
    return Math.floor(Math.random() * app.screenshots.length);
  };

  componentDidMount() {
    this.loadNextApp();
  }

  showMessage = (message) => {
    this.setState({
      currentApp: null,
      currentScreenshot: null,
      message,
    });
  };

  loadNextApp = () => {
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

  render() {
    const { answers, screenshotUrl, message } = this.state;
    let content;

    const answerOptions = answers.map((answer, i) => (
      <OptionButton key={`option_button_${i}`} answer={answer} blink btnClass="correct" />
    ))

    if (message && answerOptions.length !== 0) {
      content = <p key="message">{message}</p>;
    } else {
      content = (
        <div className = "dark-back">
          <div className="container">
            <div className="item">Games:</div>
            <div className="image-item">
              <img
                className="screenshot"
                key="steam-app-image"
                onClick={this.loadNextApp}
                src={screenshotUrl}
                alt="The whole purpose of this website"
              />
            </div>
            <div className="item">High Score</div>
          </div>
          <div className="container buttons-block">   
            {answerOptions}                        
          </div>
        </div>
      );
    }
    return <MainTemplate>{content}</MainTemplate>;
  }
}

export default MainPage;
