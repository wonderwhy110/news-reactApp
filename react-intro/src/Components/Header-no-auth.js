import logo from "../assets/earth.png";
import arrow from "../assets/arrow-out.png";
import avatar from "../assets/default-avatar.png";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/user/userSlice";
import { removeTokenFromLocalStorage } from "../helpers/localStorage.helper";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

import { useNavigate } from "react-router-dom";
import { instance } from "../api/axios.api";
function HeaderNoAuth({
  searchQuery,
  onSearchChange,
  onPerformSearch,
  onReset,
}) {
  const UPLOADS_BASE_URL = process.env.REACT_APP_UPLOADS_BASE_URL;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    avatar: "",
    bio: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const { isAuth } = useAuth();

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id;
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
      }
    }
    return null;
  };

  const logoutHandler = () => {
    dispatch(logout());
    removeTokenFromLocalStorage("token");
    toast.success("Вы вышли из аккаунта.");
  };

  const userHandler = () => {
    navigate("/user");
  };

  const getAvatarUrl = (user) => {
    //сonsole.log("User avatar data:", post.user?.avatar);
    return user?.avatar || avatar;
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onPerformSearch(searchQuery);
    }
  };

  useEffect(() => {
    if (!onPerformSearch) return; // ← пропускаем если нет функции

    const timeoutId = setTimeout(() => {
      onPerformSearch(searchQuery);
    }, 300); // ← ждем 300ms после последнего ввода

    return () => clearTimeout(timeoutId); // ← очищаем предыдущий таймер
  }, [searchQuery]);

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <div className="left-group">
            <Link to="/">
              <i class="bx bx-globe bx-bounce" />
            </Link>

            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Поиск по News"
                className="text-input medium with-button"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="reset-icon-button" onClick={() => onReset()}>
                <i
                  class="bx  bx-x"
                  style={{ color: "rgba(0, 0, 0, 0.54)" }}
                ></i>
              </button>
              <button
                className="search-icon-button"
                onClick={() => onPerformSearch(searchQuery)}
              >
                <i
                  className="bx  bx-search "
                  style={{ color: "rgba(0, 0, 0, 0.54)" }}
                ></i>
              </button>
            </div>
          </div>
          {isAuth ? (
            <div className="right-group">
              <>
                <Link to="/" onClick={logoutHandler}>
                  Выйти
                </Link>
                <img className="reg-arrow" src={arrow} alt="reg" />

                <img
                  className="avatar-post"
                  src={user?.avatar || avatar}
                  alt="Аватар"
                  onClick={userHandler}
                  onError={(e) => {
                    e.target.src = avatar;
                  }}
                />
              </>
            </div>
          ) : (
            <div className="right-group">
              <Link to="/registration" className="desktop-only">
                Зарегистрироваться
              </Link>
              <img className="reg-arrow desktop-only" src={arrow} alt="reg" />
              <Link to="/login"> Войти</Link>
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
