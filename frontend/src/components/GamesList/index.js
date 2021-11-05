import "./style.css";

import { CheckCircleFill } from "react-bootstrap-icons";
import { XCircleFill } from "react-bootstrap-icons";


const GamesList = ({ games }) => (
  <div className="game-list">
    { console.log(games),
    games.map(({ appName, url }, i) => (
      <p className="shown-game" key={`game_${i}`}>
        <span><CheckCircleFill className="icon"/></span>
        <a className="game-link" href={url} target="_blank" rel="noreferrer" key={`shown-game-${i}`}>
          <span>{appName}</span>
        </a>
      </p>
    ))}
  </div>
);

export default GamesList;
