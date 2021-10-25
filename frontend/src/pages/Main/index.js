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
          <Row>
            <Col xs={1}>Factorio</Col>
            <Col>
              <img
                key="steam-app-image"
                onClick={this.loadNextApp}
                style={{ maxWidth: '80%', maxHeight: '80%' }}
                src={currentApp.screenshots[currentScreenshot].url}
                alt="The whole purpose of this website"
              />
            </Col>
            <Col xs={1}>High Score</Col>
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
              <Button sm={1} >1. I am button</Button>
            <Button sm={1} >2. I am button two</Button>
            </Col>
            <Col xs={1}></Col>
          </Row>
          <Row>
            <Col xs={1}></Col>
            <Col>
              <Button >3. I am b</Button>
            <Button >4. I am </Button>
            </Col>
            <Col xs={1}></Col>
          </Row>
        </Container>
      ];
    }
    return <MainTemplate>{content}</MainTemplate>;
  }

  main_layout() {

  }

}



export default MainPage;
