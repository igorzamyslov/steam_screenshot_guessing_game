import "./style.scss";

const MainTemplate = ({ children }) => (
  <div className="main-template">
    <h2 className="header" href="/">
      <span className="logo-font">STEAM SCREENSHOT GUESSING GAME</span>
      <span>
        <a className="disclaimer" href="/about">
          About
        </a>
      </span>
    </h2>
    <div className="content">{children}</div>
  </div>
);

export default MainTemplate;
