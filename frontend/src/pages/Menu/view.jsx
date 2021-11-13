import "./style.scss";

import ShareBlock from "@/components/ShareBlock";
import { createNavigationHandler, routes } from "@/Router";
import LocalStorageService from "@/services/LocalStorageService";
import { Component } from "react";

class MenuPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nick: "",
      nickEditMode: true,
    };

    this.navigateToMain = createNavigationHandler(
      props.history,
      routes.mainPage
    );
    this.navigateToLeaderboard = createNavigationHandler(
      props.history,
      routes.leaderboardPage
    );

    this.saveNickAndNavigate = () => {
      LocalStorageService.saveUsersNick(this.state.nick);
      this.navigateToMain();
    };
  }

  componentDidMount() {
    const nick = LocalStorageService.getUsersNick();
    this.setState({ nick });
  }

  handleChange = (event) => {
    this.setState({ nick: event.target.value });
  };

  renderNickNameBlock() {
    return (
      <div className="nick-form">
        <input
          placeholder="Your nickname"
          className="nick-input"
          type="text"
          maxLength="24"
          value={this.state.nick}
          onChange={this.handleChange}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="main-template">
        <div className="menu-block">
          <div className="logo-container">
            <h1 className="logo-title">STEAM</h1>
            <h1 className="logo-title">SCREENSHOT</h1>
            <h1 className="logo-title">GUESSING</h1>
            <h1 className="logo-title">GAME</h1>
          </div>
          <div className="text-block">{this.renderNickNameBlock()}</div>
          <div>
            <button
              className="play-again-button glow-on-hover"
              onClick={this.saveNickAndNavigate}
            >
              PLAY
            </button>
          </div>
          <div className="leader-board-block">
            <button
              className="primary-button"
              onClick={this.navigateToLeaderboard}
            >
              Leaderboard
            </button>
          </div>
        </div>
        <div className="share-block">
          <ShareBlock />
        </div>
      </div>
    );
  }
}

export default MenuPage;
