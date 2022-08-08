import "./style.css";

import {createNavigationHandler, routes} from "@/Router";
import SSGGService from "@/services/SSGGService";
import MainTemplate from "@/templates/MainTemplate";
import {Component} from "react";
import data from "./midjourney.json"

class GeneratedQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            max: data.length,
            currentUrl: "",
            description: ""
        };

        this.navigateToMenu = createNavigationHandler(
            props.history,
            routes.menuPage
        );

        this.randomiseImage = () => {
            var imgIndex = Math.floor(Math.random() * this.state.max);
            this.setState({description: data[imgIndex].description, currentUrl: data[imgIndex].url})
        }
    }


    componentDidMount() {
        this.randomiseImage();
    }


    render() {
        return (
            <MainTemplate>
                <div className="main-block">
                    <div className="screenshot-container">
                        <img onClick={this.randomiseImage}
                             className="generated-image"
                             src={this.state.currentUrl}
                             alt={this.state.description}
                             key="quiz-image"
                        />
                    </div>
                    <div className="description-test">{this.state.description}</div>
                </div>
            </MainTemplate>
        );
    }
}

export default GeneratedQuiz;
