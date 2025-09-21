// hooks/useAuth.js
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/user/userSlice";

export const useAuth = () => {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    // Перенаправляем на страницу логина
    window.location.href = "/login";
  };

  return {
    isAuth,
    user,
    logout: handleLogout,
  };
};
