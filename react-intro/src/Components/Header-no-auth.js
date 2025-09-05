import logo from "../assets/earth.png";
import arrow from "../assets/arrow-out.png";
import avatar from "../assets/default-avatar.png";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/user/userSlice";
import { removeTokenFromLocalStorage } from "../helpers/localStorage.helper";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
function HeaderNoAuth() {
  const isAuth = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    removeTokenFromLocalStorage("token");
    toast.success("Вы вышли из аккаунта.");
  };

  const userHandler = () => {
    navigate("/user");
  };

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <div className="left-group">
            <a href="/">
              <img className="logo" src={logo} alt="logo" />
            </a>

            <input
              type="text"
              className="text-input medium"
              placeholder="Поиск по t-News"
            />
          </div>
          {isAuth ? (
            <div className="right-group">
              <>
                <a href="/" onClick={logoutHandler}>
                  Выйти
                </a>
                <img className="reg-arrow" src={arrow} alt="reg" />
              </>
              <img
                className="logo"
                src={avatar}
                alt="icon"
                onClick={userHandler}
              />
            </div>
          ) : (
            <div className="right-group">
              <a href="/registration">Зарегестрироваться</a>
              <img className="reg-arrow" src={arrow} alt="reg" />
              <a href="/login">Войти</a>
              <img className="reg-arrow" src={arrow} alt="reg" />
            </div>
          )}
        </div>
      </header>
      <hr className="hr-line" />
    </>
  );
}

export default HeaderNoAuth;
