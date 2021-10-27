import "./style.css";

const MainTemplate = ({ children }) => (
  <div className="main-template">
    <nav className="nav">
      <a className="nav-link active" href="/"> STEAM SCREENSHOT GUESSING GAME</a>      
    </nav>
    {children}
  </div>
);

export default MainTemplate;
