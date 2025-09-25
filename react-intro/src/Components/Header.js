import logo from "../assets/earth.png";

function Header() {
  
  return (
    <>
      <header className="header">
        <div className="logo-container">
          <img className="logo" src={logo} alt="logo" />
        </div>
      </header>
      <hr className="hr-line" />
    </>
  );
}

export default Header;
