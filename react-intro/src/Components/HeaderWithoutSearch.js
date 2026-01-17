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

function HeaderWithoutSearch({

}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
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
  }, [isAuth,setUserAvatar]);



  // Простая проверка загрузки

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <div className="left-group">
            <Link to="/">
              <i className="bx bx-globe bx-bounce" />
            </Link>

            
          </div>

          {isAuth ? (
            <div className="right-group">
              <Link to="/" onClick={logoutHandler}>
                Выйти
              </Link>
              <img className="reg-arrow" src={arrow} alt="Выйти" />
              
              {/* ПРОСТО: если есть base64 - показываем его, иначе дефолтный */}
              <img
                className="avatar-post"
                src={userAvatar || avatar}
                alt="Аватар"
                onClick={userHandler}
                onError={(e) => {
                  console.log("Аватар не загрузился, показываем дефолтный");
                  e.target.src = avatar;
                }}
              />
            </div>
          ) : (
            <div className="right-group">
              <Link to="/registration" className="desktop-only">
                Зарегистрироваться
              </Link>
              <img className="reg-arrow desktop-only" src={arrow} alt="Регистрация" />
              <Link to="/login">Войти</Link>
              <img className="reg-arrow" src={arrow} alt="Войти" />
            </div>
          )}
        </div>
      </header>
      <hr className="hr-line" />
    </>
  );
}

export default HeaderWithoutSearch;