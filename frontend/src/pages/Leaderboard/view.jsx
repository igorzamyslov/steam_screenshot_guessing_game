import "./style.css";

import ScoreBoard from "@/components/ScoreBoard";
import ShareBlock from "@/components/ShareBlock";
import { createNavigationHandler, routes } from "@/Router";
import SSGGService from "@/services/SSGGService";
import MainTemplate from "@/templates/MainTemplate";
import { Component } from "react";

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userScores: [],
    };

    this.navigateToMain = createNavigationHandler(
      props.history,
      routes.mainPage
    );
  }

  componentDidMount() {
    SSGGService.getLeaderboard()
      .then((response) => {
        this.setState({ userScores: response.body });
      })
      .catch(() => {
        this.navigateToMain();
      });
  }

  render() {
    return (
      <MainTemplate>
        <div className="main-block">
          <h1 className="title">Leaders</h1>
          <div className="scores-block">
            <ScoreBoard userScores={this.state.userScores} />
          </div>
          <div>
            <button className="primary-button" onClick={this.navigateToMain}>
              Play the game
            </button>
          </div>
          <ShareBlock />
        </div>
      </MainTemplate>
    );
  }
}

export default AboutPage;
