import React, { useState } from "react";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import { setTokenToLocalStorage } from "../helpers/localStorage.helper";

function Section() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useAppDispatch(); // Переместите dispatch наверх
  const navigate = useNavigate();

  const regHandler = async (event) => {
    event.preventDefault();

    // Валидация полей
    if (!email || !password || !confPassword) {
      setError(true);
      return;
    }

    if (password !== confPassword) {
      setPasswordMatch(false);
      return;
    }

    setPasswordMatch(true);
    setError(false);

    try {
      // 1. Регистрация
      const regData = await AuthService.registration({ email, password });

      if (regData) {
        toast.success("Вы зарегистрировались.");

        // 2. Автоматический вход после успешной регистрации
         try {
      
              const data = await AuthService.login({ email, password });
        
              if (data) {
                setTokenToLocalStorage("token", data.token);
        
                // Сохраняем пользователя в localStorage
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    userId: data.userId,
                    email: data.email,
                  })
                );
        
                dispatch(
                  login({
                    userId: data.userId,
                    email: data.email,
                    token: data.token,
                    avatar: data.avatar,
                  })
                );
        
                toast.success("Вы вошли в аккаунт.");
                navigate("/");
              }
        } catch (loginError) {
          toast.error(
            "Ошибка автоматического входа: " +
              loginError.response?.data?.message
          );
        }
      }
    } catch (err) {
      const error = err.response?.data?.message || "Ошибка регистрации";
      toast.error(error.toString());
    }
  };

  return (
    <>
      <section
        className="content-reg"
        style={{ display: submitted ? "" : "none" }}
      >
        <div
          className="messages"
          style={{ display: submitted ? "" : "none" }}
        ></div>
      </section>

      <section className="content-reg">
        <form
          className="login-dialog"
          onSubmit={regHandler}
          style={{ display: submitted ? "none" : "" }}
        >
          <header className="login-title">Регистрация</header>

          <div className="login-fields">
            <label className="field-row">
              <input
                type="text"
                className="text-input large"
                placeholder="Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </label>
            {error && !email && (
              <span className="error">*Пожалуйста введите email</span>
            )}

            <label className="field-row">
              <input
                type="password"
                className="text-input large"
                placeholder="Пароль"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </label>
            {error && !password && (
              <span className="error">*Пожалуйста введите пароль</span>
            )}

            <label className="field-row">
              <input
                type="password"
                className="text-input large"
                placeholder="Повторить пароль"
                name="confirmPassword"
                onChange={(e) => setConfPassword(e.target.value)}
                value={confPassword}
              />
            </label>
            {error && !confPassword && (
              <span className="error">*Пожалуйста повторите пароль</span>
            )}
            {!passwordMatch && (
              <span className="error">Пароли не совпадают</span>
            )}
          </div>

          <footer className="login-footer">
            <a type="button" className="button secondary" href="/login">
              Войти
            </a>

            <button type="submit" className="button primary">
              Зарегистрироваться
            </button>
          </footer>
        </form>
      </section>
    </>
  );
}

export default Section;
