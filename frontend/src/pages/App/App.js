import logo from './logo.svg';
import './App.css';
import SteamService from 'services/SteamService';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      {
        SteamService.apps.map(app => (
          <p key={app.appid}>{app.appid} {app.name}</p>
        ))
      }
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
)

export default App;
