import { Component } from 'react';
import SteamService from 'services/SteamService';
import './App.css';

const messages = {
  loading: 'Steam app loading ...',
  error: 'Error during Steam app loading!',
};

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentApp: null,
      currentScreenshot: null,
      message: messages.loading,
    };
    this.currentIndex = null;
  }

  componentDidMount () {
    this.loadNextApp();
  }

  static selectRandomScreenshot = (app) => {
    return Math.floor(Math.random() * app.screenshots.length);
  };

  loadNextApp = () => {
    this.setState({ message: messages.loading });
    SteamService.getRandomAppData()
      .then(response => {
        const currentApp = response.body;
        const currentScreenshot = App.selectRandomScreenshot(currentApp);
        this.setState({ currentApp, currentScreenshot, message: null });
      })
      .catch(() => {
        this.setState({
          currentApp: null,
          currentScreenshot: null,
          message: messages.error,
        });
      });
  };

  render () {
    const { currentApp, currentScreenshot, message } = this.state;
    let content;
    if (message && !currentApp) {
      content = <p>{message}</p>;
    } else {
      content = [
        <img
          onClick={this.loadNextApp}
          style={{ maxWidth: '80%', maxHeight: '80%' }}
          src={currentApp.screenshots[currentScreenshot]}
          alt="The whole purpose of this website"
        />,
        <center className="title">{currentApp.name}</center>,
      ];
    }
    return (
      <div className="App">
        <header className="App-header">
          {content}
        </header>
      </div>
    );
  }

}

export default App;
