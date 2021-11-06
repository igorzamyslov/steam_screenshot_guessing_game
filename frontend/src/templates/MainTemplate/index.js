import "./style.css";

const MainTemplate = ({ children }) => (
  <div className="main-template">
    <h2 className="header" href="/">
      STEAM SCREENSHOT GUESSING GAME
    </h2>
    <div className="content">{children}</div>
    <div className="disclaimer">
      <div>
        This website is a hobby project and is not affiliated
        with Valve or Steam.
      </div>
      <div>Steam and the Steam logo are trademarks of Valve Corporation.</div>
      <div>All other trademarks are property of their respective owners.</div>
    </div>
  </div>
);

export default MainTemplate;
