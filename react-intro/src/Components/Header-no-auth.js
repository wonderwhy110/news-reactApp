import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/user/userSlice";
import { removeTokenFromLocalStorage } from "../helpers/localStorage.helper";
import { toast } from "react-toastify";
import { instance } from "../api/axios.api";
import "boxicons/css/boxicons.min.css";

// Импорты картинок
import arrow from "../assets/arrow-out.png";
import avatar from "../assets/default-avatar.png";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

function HeaderNoAuth({
  searchQuery,
  onSearchChange,
  onPerformSearch,
  onReset,
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  // Простой state - только аватар
  const [userAvatar, setUserAvatar] = useState("");
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
    // Очищаем аватар при выходе
    setUserAvatar("");
  };

  const userHandler = () => {
    navigate("/user");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onPerformSearch(searchQuery);
    }
  };

  // Загружаем только аватар
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (!isAuth) {
        setUserAvatar("");
        setLoading(false);
        return;
      }

      try {
        const userId = getUserIdFromToken();
        if (userId) {
          const response = await instance.get(`/user/${userId}`);
          // Сервер ВСЕГДА возвращает base64
          setUserAvatar(response.data.avatar || "");
        }
      } catch (error) {
        console.error("Ошибка загрузки аватара:", error);
        setUserAvatar("");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAvatar();
  }, [isAuth, setUserAvatar]);

  const headerStyles = {
    backgroundColor: "var(--header-bg)",
    color: "var(--text-primary)",
    borderBottom: "1px solid var(--border-color)",
    transition: "all 0.3s ease",
  };

  const inputStyles = {
    color: "var(--text-primary)",
  };

  const handleLogoClick = (e) => {
    navigate("/");

    window.location.reload();
  };

  return (
    <>
      <header className={`header ${theme}`} style={headerStyles}>
        <div className="logo-container" style={headerStyles}>
          <div className="left-group">
            <Link to="/" onClick={handleLogoClick}>
              <i className="bx bx-globe bx-bounce" />
            </Link>

            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Поиск по Новостям"
                className="text-input medium with-button"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                style={inputStyles}
              />
              {searchQuery && (
                <button className="reset-icon-button" onClick={() => onReset()}>
                  <i
                    className="bx bx-x"
                    style={{ color: "var(--text-secondary)" }}
                  />
                </button>
              )}

              <button
                className="search-icon-button"
                onClick={() => onPerformSearch(searchQuery)}
              >
                <i
                  className="bx bx-search"
                  style={{ color: "var(--text-secondary)" }}
                />
              </button>
            </div>
          </div>

          {isAuth ? (
            <div className="right-group">

               <input
                type="checkbox"
                id="mobile-menu-toggle"
                className="mobile-menu-checkbox"
              />

              <label htmlFor="mobile-menu-toggle" className="mobile-menu-btn">
                <i className="bx bx-menu" />
              </label>
              
              <img
                className="avatar-post head"
                src={userAvatar || avatar}
                alt="Аватар"
                onClick={userHandler}
                onError={(e) => {
                  console.log("Аватар не загрузился, показываем дефолтный");
                  e.target.src = avatar;
                }}
              />

              <Link to="/" onClick={logoutHandler} className="reg-wrap desktop-only">
                Выйти
                <img
                  className="reg-arrow"
                  onClick={logoutHandler}
                  src={arrow}
                  alt="Выйти"
                />
              </Link>

              

              {/* Мобильное меню */}
              <div className="mobile-menu">
                <div className="mobile-menu-content">
                  <div className="mobile-menu-item">
                    <span>Тема:</span>
                    <ThemeToggle />
                  </div>

                  <label
                    htmlFor="mobile-menu-toggle"
                    className="mobile-menu-close"
                  >
                    <i className="bx bx-x" /> Закрыть
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="right-group">
              <input
                type="checkbox"
                id="mobile-menu-toggle"
                className="mobile-menu-checkbox"
              />

              <label htmlFor="mobile-menu-toggle" className="mobile-menu-btn">
                <i className="bx bx-menu" />
              </label>
              <Link to="/registration" className="reg-wrap desktop-only">
                Зарегистрироваться
                <img
                  className="reg-arrow"
                  src={arrow}
                  alt=""
                  aria-hidden="true"
                />
              </Link>

              <Link to="/login" className="reg-wrap">
                Войти
                <img
                  className="reg-arrow"
                  src={arrow}
                  alt=""
                  aria-hidden="true"
                />
              </Link>

              <div
                className="theme-toggle-wrapper desktop-only"
                style={{
                  position: "fixed",

                  right: "20px",
                  zIndex: 1000,
                }}
              >
                <ThemeToggle />
              </div>

              {/* Мобильное меню */}
              <div className="mobile-menu">
                <div className="mobile-menu-content">
                  <div className="mobile-menu-item">
                    <span>Тема:</span>
                    <ThemeToggle />
                  </div>

                  <label
                    htmlFor="mobile-menu-toggle"
                    className="mobile-menu-close"
                  >
                    <i className="bx bx-x" /> Закрыть
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <hr className="hr-line" />
    </>
  );
}

export default HeaderNoAuth;
