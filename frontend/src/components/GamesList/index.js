import "./style.css";

import { CheckCircleFill } from "react-bootstrap-icons";
import { XCircleFill } from "react-bootstrap-icons";

const GamesList = ({ games }) => (
  <div className="game-list">
    {
      (console.log(games),
      games.map(({ name, url, correct }, i) => (
        <p className="shown-game" key={`game_${i}`}>
          <span>
            {correct ? (
              <CheckCircleFill className="icon correct" />
            ) : (
              <XCircleFill className="icon incorrect" />
            )}
          </span>
          <a
            className="game-link"
            href={url}
            target="_blank"
            rel="noreferrer"
            key={`shown-game-${i}`}
          >
            <span>{name}</span>
          </a>
        </p>
      )))
    }
  </div>
);

export default GamesList;
