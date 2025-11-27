import logo from "../assets/earth.png";

function Header() {
  
  return (
    <>
      <header className="header">
        <div className="logo-container">
          <Link to="/">
              <i class="bx bx-globe bx-bounce" />
            </Link>
        </div>
      </header>
      <hr className="hr-line" />
    </>
  );
}

export default Header;
