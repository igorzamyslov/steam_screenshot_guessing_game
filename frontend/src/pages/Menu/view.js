import "./../../styles/style.css";
import "./style.css"
import {Component} from "react";
import {createNavigationHandler, routes} from "Router";

import ShareBlock from "../../components/ShareBlock";

class MenuPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nick: "Player1"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSaveNick = this.handleSaveNick.bind(this);

        this.navigateToMain = createNavigationHandler(
            props.history,
            routes.mainPage
        );
        this.navigateToLeaderboard = createNavigationHandler(
            props.history,
            routes.leaderboardPage
        );

    }

    handleChange(event) {
        this.setState({nick: event.target.value});
        console.log(this.state.nick)
    }

    handleSaveNick(event) {
        this.setState({nick: event.target.value});
    }

    render() {
        return (
            <div className="main-template">
                <div className="main-block">
                    <div className="logo-container">
                        <h1 className="logo-title">STEAM</h1>
                        <h1 className="logo-title">SCREENSHOT</h1>
                        <h1 className="logo-title">GUESSING</h1>
                        <h1 className="logo-title">GAME</h1>
                    </div>
                    <div className="text-block">
                        <div>Nickname:</div>
                        <div className="nick-form" >
                            <input className="nick-input" type="text" value={this.state.nick} onChange={this.handleChange} />
                            <button className="save-nick-button">Save</button>
                        </div>
                    </div>
                    <div>
                        <button className="play-button" onClick={this.navigateToMain}>
                            Play
                        </button>
                    </div>
                    <div>
                        <button className="play-button" onClick={this.navigateToLeaderboard}>
                            Leaderboard
                        </button>
                    </div>
                    <ShareBlock/>
                </div>
            </div>
        );
    }
}

export default MenuPage;
