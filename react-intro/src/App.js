import logo from "./logo.svg";
import "./App.css";
import HeaderNoAuth from "./Components/Header-no-auth";
import ContentNoAuth from "./Components/Content-no-auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, {useEffect} from "react";
import Registration from "./Pages/Registration";
import Login from "./Pages/Login";
import User from "./Pages/User";

import { useAppDispatch } from "./store/hooks";
import { getTokenFromLocalStorage } from "./helpers/localStorage.helper";
import { AuthService } from "./services/auth.service";
import { login, logout } from "./store/user/userSlice";

function App() {
  const dispatch = useAppDispatch();

  const checkAuth = async () => {
    const token = getTokenFromLocalStorage();
    try {
      if (token) {
        const data = await AuthService.getProfile();
        if (data) {
          dispatch(login(data));
        } else {
          dispatch(logout());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="app">
      <Router>
        <Routes>
          {/* Главная страница (/) - с HeaderNoAuth и ContentNoAuth */}
          <Route
            path="/"
            element={
              <>
                <HeaderNoAuth />
                <ContentNoAuth />
              </>
            }
          />

          {/* Страница регистрации  */}
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
           <Route path="/user" element={<User />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
