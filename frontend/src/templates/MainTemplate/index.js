import "./style.css";

const MainTemplate = ({ children }) => (
  <div className="main-template">
    <nav className="nav">
      <h2 className="" href="/">GUESS STEAM GAME</h2>      
    </nav>
    {children}
  </div>
);

export default MainTemplate;
