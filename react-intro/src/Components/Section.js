import React, { useState } from "react";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";

function Section() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      const data = await AuthService.registration({ email, password });
      if (data) {
        toast.success("Вы зарегестрировались.");
        setSubmitted(true);
      }
    } catch (err) {
      const error = err.response?.data?.message || "Ошибка регистрации";
      toast.error(error.toString());
    }
  };

  const successMessage = () => {
    return (
      <div className="success" style={{ display: submitted ? "" : "none" }}>
        <h1>Successfully signed up!!!</h1>
        <a href="/" style={{ marginTop: "20px" }}>
          Перейти на сайт
        </a>
      </div>
    );
  };

  return (
    <>
      <section
        className="content-reg"
        style={{ display: submitted ? "" : "none" }}
      >
        <div className="messages" style={{ display: submitted ? "" : "none" }}>
          {successMessage()}
        </div>
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
