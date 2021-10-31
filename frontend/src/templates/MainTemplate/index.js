import "./style.css";

const MainTemplate = ({ children }) => (
  <div className="main-template">
    <h2 className="header" href="/">
      GUESS STEAM GAME
    </h2>
    <div className="content">
      {children}
    </div>
  </div>
);

export default MainTemplate;
