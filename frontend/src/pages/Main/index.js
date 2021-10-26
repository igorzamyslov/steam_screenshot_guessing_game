import { Component } from 'react';
import SteamService from 'services/SteamService';
import MainTemplate from 'templates/MainTemplate';
import './style.css';
import Button from 'react-bootstrap/Button';
import { Container, Row, Col } from 'react-bootstrap';


const messages = {
  loading: 'Steam app loading ...',
  error: 'Error during Steam app loading!',
};

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentApp: null,
      currentScreenshot: null,
      message: messages.loading,
      answerOptions: {
        opt1: "Factorio",
        opt2: "Battlefield Overwatch",
        opt3: "Divinity Original Sin 2",
        opt4: "Doom",
      }
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
    SteamService.getRandomAppData()
      .then(response => {
        const currentApp = response.body;
        const currentScreenshot = this.constructor.selectRandomScreenshot(
          currentApp);
        this.setState({ currentApp, currentScreenshot, message: null });
      })
      .catch(() => {
        this.showMessage(messages.error);
      });
  };

  render() {
    const { currentApp, currentScreenshot, message } = this.state;
    let content;
    if (message && !currentApp) {
      content = <p key="message">{message}</p>;
    } else {
      content = [
        <Container>
          <Row className='main-row'>
            <Col lg={1}>Factorio</Col>
            <Col lg={10}>
              <img
                className="screenshot"
                key="steam-app-image"
                onClick={this.loadNextApp}
                src={currentApp.screenshots[currentScreenshot].url}
                alt="The whole purpose of this website"
              />
            </Col>
            <Col lg={1}>High Score</Col>
          </Row>
          <Row>
            <a
              key="steam-app-title"
              href={`https://store.steampowered.com/app/${currentApp.id}`}
              target="_blank"
              className="steam-app-title"
              rel="noreferrer"
            >
              {currentApp.name}
            </a>
          </Row>
          <Row>
            <Col xs={1}></Col>
            <Col className='input-block-level'>
              <Button sm={1} >{this.state.answerOptions.opt1}</Button>
            <Button sm={1} >{this.state.answerOptions.opt2}</Button>
            </Col>
            <Col xs={1}></Col>
          </Row>
          <Row>
            <Col xs={1}></Col>
            <Col>
              <Button >{this.state.answerOptions.opt3}</Button>
            <Button >{this.state.answerOptions.opt4}</Button>
            </Col>
            <Col xs={1}></Col>
          </Row>
        </Container>
      ];
    }
    return <MainTemplate>{content}</MainTemplate>;
  } 
}


export default MainPage;
