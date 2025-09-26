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

import { useNavigate } from "react-router-dom";
import { instance } from "../api/axios.api";
function HeaderNoAuth() {
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
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getUserIdFromToken();
        if (userId) {
          // Используем существующий endpoint /user/:id
          const response = await instance.get(`/user/${userId}`);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки пользователя:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
  

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <div className="left-group">
            <Link to="/">
              <img className="logo" src={logo} alt="logo" />
            </Link>

            <input
              type="text"
              className="text-input medium"
              placeholder="Поиск по News"
            />
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
                  src={getAvatarUrl(user?.avatar, avatar)}
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
              <Link to="/registration">Зарегистрироваться</Link>
              <img className="reg-arrow" src={arrow} alt="reg" />
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
