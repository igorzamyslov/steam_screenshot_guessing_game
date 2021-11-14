import "./style.scss";

import GamesList from "@/components/GamesList";
import ScoreBoard from "@/components/ScoreBoard";
import ShareBlock from "@/components/ShareBlock";
import { createNavigationHandler, routes } from "@/Router";
import LocalStorageService from "@/services/LocalStorageService";
import SSGGService from "@/services/SSGGService";
import MainTemplate from "@/templates/MainTemplate";
import { Component } from "react";

class ResultPage extends Component {
  constructor(props) {
    super(props);
    let queryParams = new URLSearchParams(props.location.search);
    this.score = queryParams.get("score") || 0;
    this.name = LocalStorageService.getUsersNick();
    this.state = {
      userScores: [],
    };
    this.navigateToMain = createNavigationHandler(
      props.history,
      routes.gamePage
    );

    this.navigateToLeaderboard = createNavigationHandler(
        props.history,
        routes.leaderboardPage
    );
  }

  componentDidMount() {
    if (this.name && this.score > 0 && this.props.finishedGames.length > 0) {
      SSGGService.updateLeaderboard(this.name, this.score).then(() => {
        SSGGService.getLeaderboard().then((response) => {
          this.setState({ userScores: response.body });
        });
      });
    } else {
      SSGGService.getLeaderboard().then((response) => {
        this.setState({ userScores: response.body });
      });
    }
  }

  handlePlayAgainPress = () => {
    this.props.onPlayAgainPress();
    this.navigateToMain();
  };

  render() {
    const { finishedGames } = this.props;
    const { userScores } = this.state;
    return (
      <MainTemplate>
        <div className="vertical-container">
          <div className="score-block">
            <h2 className="title">Your score:</h2>
            <h1 className="final-score">{this.score}</h1>
            <div className="game-list-block">
              {finishedGames.length > 0 && <h2 className="title">Games:</h2>}
              <GamesList games={finishedGames} />
            </div>
            <div>
              <button
                className="play-again-button glow-on-hover"
                onClick={this.handlePlayAgainPress}
              >
                Play again
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
            {userScores && (
              <center>
                <ScoreBoard userScores={userScores} />
              </center>
            )}
          </div>
          <div className="bottom-share-block">
            <ShareBlock />
          </div>
        </div>
      </MainTemplate>
    );
  }
}

export default ResultPage;
