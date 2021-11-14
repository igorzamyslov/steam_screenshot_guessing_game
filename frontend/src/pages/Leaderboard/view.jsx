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

    this.navigateToMenu = createNavigationHandler(
      props.history,
      routes.menuPage
    );
  }

  componentDidMount() {
    SSGGService.getLeaderboard()
      .then((response) => {
        this.setState({ userScores: response.body });
      })
      .catch(() => {
        this.navigateToMenu();
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
            <button className="primary-button" onClick={this.navigateToMenu}>
              Back to Menu
            </button>
          </div>
          <ShareBlock />
        </div>
      </MainTemplate>
    );
  }
}

export default AboutPage;
