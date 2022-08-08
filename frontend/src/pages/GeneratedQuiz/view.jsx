import "./style.scss";

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
            description: "",
            inputText: "",
            correct: "",
            wrong: ""
        };

        this.navigateToMenu = createNavigationHandler(
            props.history,
            routes.menuPage
        );


        this.randomiseImage = () => {
            var imgIndex = Math.floor(Math.random() * this.state.max);
            this.setState({
                description: data[imgIndex].description.toLowerCase(),
                currentUrl: data[imgIndex].url,
                correct: "",
                inputText: "",
                wrong: "",
            })
        }
    }

    _onChange = (event) => {
        this.setState({inputText: event.target.value});
    }

    _onKeyDown = (e) => {
        if (e.key === 'Enter') {
            let words = this.state.description.split(" ");
            let input = this.state.inputText.toLowerCase();

            if (words.includes(input)) {
                let old = this.state.correct
                this.setState({correct: old + " " + input})
                this.setState({inputText: ""})
            } else {
                let old = this.state.wrong
                this.setState({wrong: old + " " + input})
                this.setState({inputText: ""})
            }

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
                    <div> Words: {this.state.description.split(" ").length} </div>
                    <input
                        className="text-input"
                        type="text"
                        id="message"
                        name="message"
                        value={this.state.inputText}
                        onChange={this._onChange}
                        onKeyDown={this._onKeyDown}
                    />
                    <div> Correct: {this.state.correct}</div>
                    <div> Wrong:{this.state.wrong}</div>
                    <div className="description-test">{this.state.description}</div>
                </div>
            </MainTemplate>
        );
    }
}

export default GeneratedQuiz;
