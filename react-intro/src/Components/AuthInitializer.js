// components/AuthInitializer.js
import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { getTokenFromLocalStorage } from "../helpers/localStorage.helper";
import { AuthService } from "../services/auth.service";
import { login, logout } from "../store/user/userSlice";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();

  // components/AuthInitializer.js
  // components/AuthInitializer.js
  useEffect(() => {
    const initializeAuth = () => {
      const token = getTokenFromLocalStorage();
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          dispatch(
            login({
              userId: user.userId,
              email: user.email,
              token: token,
            })
          );
        } catch (error) {
          console.log("Error parsing user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
    };

    initializeAuth();
  }, [dispatch]);
};

export default AuthInitializer;
