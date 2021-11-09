import "./style.css";

import { Component } from "react";
import { createNavigationHandler, routes } from "@/Router";
import MainTemplate from "@/templates/MainTemplate";

import ShareBlock from "@/components/ShareBlock";

class AboutPage extends Component {
  constructor(props) {
    super(props);
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
          <h2 className="title">About SSGG.fun</h2>
          <div className="text-block">
            <p>
              This website is a hobby project and is not affiliated with Valve
              or Steam.
            </p>
            <p>Steam and the Steam logo are trademarks of Valve Corporation.</p>
            <p>All other trademarks are property of their respective owners.</p>
            <p>You can support our project or just enjoy it!</p>
          </div>
          <div>
            <button className="play-button" onClick={this.navigateToMain}>
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
