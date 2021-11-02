const GamesList = ({ games }) => (
  <ul>
    {games.map(({ appName, url }, i) => (
      <a href={url} target="_blank" rel="noreferrer" key={`shown-game-${i}`}>
        <li className="shown-game">{appName}</li>
      </a>
    ))}
  </ul>
);

export default GamesList;
