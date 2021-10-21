import { Component } from 'react';
import SteamService from 'services/SteamService';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const apps = [...SteamService.apps];
    this.state = {
      apps: apps,
      currentApp: {
        id: null,
        name: null,
        screenshots: null,
        reviewsCount: null,
        releaseDate: null,
      },
      currentScreenshot: 0,
    };
    this.currentIndex = null;
  }

  componentDidMount() {
    if (this.state.apps.length) {
      this.loadNextApp();
    }
  }

  // deleteCurrentApp() {
  //   const newApps = [...this.state.apps]
  //   newApps.splice(this.currentIndex, 1);
  //   return newApps
  // }

  selectNextApp = () => {
    this.currentIndex = Math.floor(Math.random() * this.state.apps.length);
  }

  loadNextApp = () => {
    this.selectNextApp()
    const { apps }  = this.state;
    let currentApp = apps[this.currentIndex];
    SteamService.getAppData(currentApp.id).then(response => {
      currentApp = {...currentApp, ...response.body}
      if (currentApp.screenshots.length) {
        this.setState({ currentApp });
      } else {
        this.loadNextApp()
      }
    });
  }

  render() {
    const { currentApp, currentScreenshot } = this.state;
    if (currentApp.id) {
      return (
        <div className="App">
          <header className="App-header">
            <img
              onClick={this.loadNextApp}
              style={{maxWidth: '80%', maxHeight: '80%'}}
              src={currentApp.screenshots[currentScreenshot]}
              alt="The whole purpose of this website"
            />
            <center className="title">{currentApp.name}</center>
          </header>
        </div>
      );
    }
    return (
      <div className="App">
        <header className="App-header">
          App loading ...
        </header>
      </div>
    );
  }
}

export default App;
