import "./style.css";

const MainTemplate = ({ children }) => (
  <div className="main-template">
    <header className="main-template-header">
      STEAM SCREENSHOT GUESSING GAME
    </header>
    {children}
  </div>
);

export default MainTemplate;
