import "./style.css";

import ScoreBoard from "@/components/ScoreBoard";
import ShareBlock from "@/components/ShareBlock";
import { createNavigationHandler, routes } from "@/Router";
import MainTemplate from "@/templates/MainTemplate";
import { Component } from "react";

class AboutPage extends Component {
  constructor(props) {
    super(props);
    var userScores = [
      {
        nick: "Nagibator",
        score: 17,
        rank: 1,
      },
      {
        nick: "Ubivator",
        score: 5,
        rank: 2,
      },
      {
        nick: "Dominator",
        score: 3,
        rank: 3,
      },
    ];

    this.state = {
      userScores: userScores,
    };

    this.navigateToMain = createNavigationHandler(
      props.history,
      routes.mainPage
    );
    this.navigateToMain = createNavigationHandler(
      props.history,
      routes.mainPage
    );
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
