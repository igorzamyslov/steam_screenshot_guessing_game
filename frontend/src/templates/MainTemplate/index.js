import "./style.css";

const MainTemplate = ({ children }) => (
  <div className="main-template">
    <h2 className="header" href="/">
      STEAM SCREENSHOT GUESSING GAME
    </h2>
    <div className="content">{children}</div>
  </div>
);

export default MainTemplate;
