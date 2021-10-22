import './style.css';

const MainTemplate = ({ children }) => (
  <div className="main-template">
    <header className="main-template-header">
      {children}
    </header>
  </div>
);

export default MainTemplate;
