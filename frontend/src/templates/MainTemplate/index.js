import './style.css';

const MainTemplate = ({ children }) => (
  <div className="main-template">
    <nav class="nav">
      <a class="nav-link active" href="#"> STEAM SCREENSHOT GUESSING GAME</a>      
    </nav>
    {children}
  </div>
);

export default MainTemplate;
