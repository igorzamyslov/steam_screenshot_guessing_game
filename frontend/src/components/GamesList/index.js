import "./style.css";

const GamesList = ({ games }) => (
  <ul className="game-list">
    {games.map(({ appName, url }, i) => (
      <a className="game-link" href={url} target="_blank" rel="noreferrer" key={`shown-game-${i}`}>
        <li className="shown-game">{appName}</li>
      </a>
    ))}
  </ul>
);

export default GamesList;
