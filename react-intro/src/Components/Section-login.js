import { useNavigate } from "react-router-dom";
import { setTokenToLocalStorage } from "../helpers/localStorage.helper";
import { AuthService } from "../services/auth.service";
import { useAppDispatch } from "../store/hooks";
import React, { useState } from "react";
import { login } from "../store/user/userSlice";
import { toast } from "react-toastify";

function SectionLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      const data = await AuthService.login({ email, password });

      if (data) {
        setTokenToLocalStorage("token", data.token);
        dispatch(login(data));

        toast.success("Вы вошли в аккаунт.");
        navigate("/");
      }
    } catch (err) {
      const error = err.response?.data?.message || "Ошибка авторизации";
      toast.error(error.toString());
    }
  };

  return (
    <section className="content">
      <form
        className="login-dialog"
        onSubmit={loginHandler}
        style={{ display: submitted ? "none" : "" }}
      >
        <header className="login-title">Вход</header>

        <div className="login-fields">
          <label className="field-row">
            <input
              type="text"
              className="text-input large"
              placeholder="Логин"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
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
        </div>
        <footer className="login-footer">
          <a href="/registration">
            {" "}
            <button type="button" class="button secondary">
              {" "}
              Зарегестрироваться
            </button>
          </a>
          <button type="submit" class="button primary">
            {" "}
            Войти
          </button>
        </footer>
      </form>
    </section>
  );
}

export default SectionLogin;
