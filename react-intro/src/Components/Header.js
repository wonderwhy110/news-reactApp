import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "boxicons/css/boxicons.min.css";


function Header() {
  const headerStyles = {
    backgroundColor: "var(--header-bg)",
    transition: "all 0.3s ease",
  };

  return (
    <>
      <header className="header" style={headerStyles}>
        <div className="logo-container" style={headerStyles}>
          {/* Чекбокс для управления меню (без JS) */}
          <input type="checkbox" id="mobile-menu-toggle" className="mobile-menu-checkbox" />
          
          <label htmlFor="mobile-menu-toggle" className="mobile-menu-btn">
            <i className="bx bx-menu" />
          </label>

          <Link to="/">
            <i className="bx bx-globe bx-bounce" />
          </Link>

          {/* Десктопная версия */}
          <div className="theme-toggle-wrapper desktop-only">
            <ThemeToggle />
          </div>

          {/* Мобильное меню */}
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <div className="mobile-menu-item">
                <span>Тема:</span>
                <ThemeToggle />
              </div>
              
              <label htmlFor="mobile-menu-toggle" className="mobile-menu-close">
                <i className="bx bx-x" /> Закрыть
              </label>
            </div>
          </div>

    
          
        </div>
      </header>
      <hr className="hr-line" />
    </>
  );
}

export default Header;