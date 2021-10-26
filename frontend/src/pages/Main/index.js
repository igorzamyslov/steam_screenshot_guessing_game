import { Component } from "react";
import SteamService from "services/SteamService";
import MainTemplate from "templates/MainTemplate";
import "./style.css";

const messages = {
  loading: "Steam app loading ...",
  error: "Error during Steam app loading!",
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
      .then((response) => {
        const currentApp = response.body;
        const currentScreenshot =
          this.constructor.selectRandomScreenshot(currentApp);
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
        <img
          key="steam-app-image"
          onClick={this.loadNextApp}
          style={{ maxWidth: "80%", maxHeight: "80%" }}
          src={currentApp.screenshots[currentScreenshot].url}
          alt="The whole purpose of this website"
        />,
        <a
          key="steam-app-title"
          href={`https://store.steampowered.com/app/${currentApp.id}`}
          target="_blank"
          className="steam-app-title"
          rel="noreferrer"
        >
          {currentApp.name}
        </a>,
      ];
    }
    return <MainTemplate>{content}</MainTemplate>;
  }
}

export default MainPage;
