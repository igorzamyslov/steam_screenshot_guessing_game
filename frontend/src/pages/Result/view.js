import "./style.css";

import ShareBlock from "components/ShareBlock";
import { Component } from "react";
import { createNavigationHandler, routes } from "Router";
import MainTemplate from "templates/MainTemplate";

import GamesList from "../../components/GamesList";

class ResultPage extends Component {
  constructor(props) {
    super(props);
    let queryParams = new URLSearchParams(props.location.search);
    const score = queryParams.get("score") || 0;
    this.state = {
      score: score,
      shownGames: [],
    };
    this.navigateToMain = createNavigationHandler(
      props.history,
      routes.mainPage
    );
  }

  handlePlayAgainPress = () => {
    this.props.onPlayAgainPress();
    this.navigateToMain();
  };

  render() {
    const { finishedGames } = this.props;
    return (
      <MainTemplate>
        <div className="score-block">
          <h2>Your score:</h2>
          <h1>{this.state.score}</h1>
          <button
            className="play-again-button glow-on-hover"
            onClick={this.handlePlayAgainPress}
          >
            Play again
          </button>
          <div>
            <ShareBlock />
          </div>
          <GamesList games={finishedGames} />
        </div>
      </MainTemplate>
    );
  }
}

export default ResultPage;
