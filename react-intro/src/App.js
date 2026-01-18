import logo from "./logo.svg";
import "./App.css";
import HeaderNoAuth from "./Components/Header-no-auth";
import ContentNoAuth from "./Components/Content-no-auth";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Registration from "./Pages/Registration";
import Login from "./Pages/Login";
import User from "./Pages/User";

import { instance, instanceWithoutAuth } from "./api/axios.api";

import { useAppDispatch } from "./store/hooks";
import { getTokenFromLocalStorage } from "./helpers/localStorage.helper";
import { AuthService } from "./services/auth.service";
import { login, logout } from "./store/user/userSlice";
import AuthInitializer from "./Components/AuthInitializer";
import Comments from "./Pages/Comments";
import SnowEffect from "./Components/SnowEffect";

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

  const basename = window.location.pathname.includes("/news-reactApp")
    ? "/news-reactApp"
    : "";

  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [searchDone, setSearchDone] = useState(false);

  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await instance.get("/post");
      return response.data; // ← ВОЗВРАЩАЕМ данные вместо setPosts
    } catch (error) {
      console.error("Ошибка загрузки постов с токеном:", error);
      if (error.response?.status === 401) {
        try {
          const response = await instanceWithoutAuth.get("/post");
          return response.data; // ← ВОЗВРАЩАЕМ данные
        } catch (er) {
          console.error("Ошибка загрузки постов без токена:", er);
          throw new Error("Не удалось загрузить посты"); // ← пробрасываем ошибку
        }
      } else {
        throw new Error("Не удалось загрузить посты"); // ← пробрасываем ошибку
      }
    }
  };
  useEffect(() => {
    const loadInitialPosts = async () => {
      try {
        setLoading(true);
        const initialPosts = await fetchPosts(); // используем существующую функцию
        setPosts(initialPosts);
        setError(null);
      } catch (error) {
        console.error("Ошибка загрузки постов:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialPosts();
  }, []);

  // Функция поиска
  const performSearch = async (query) => {
    console.log("🔍 === SEARCH DEBUG START ===");
    console.log("Search query:", query);
    if(!query || !query.trim()){
      return
    }

      setSearchDone(false);
    

    try {
      let results;
      if (query.trim()) {
        console.log("Calling searchPosts...");
        results = await searchPosts(query);
        console.log("Search results:", results);
      } else {
        console.log("Calling fetchPosts...");
        results = await fetchPosts();
        console.log("Fetch results:", results);
      }

      console.log("Setting posts with:", results);
      setPosts(results);
      setLoading(false);
      setSearchDone(true);
    } catch (error) {
      console.error("Search error:", error);
      setError(error.message);
      setPosts([]);
      setLoading(false);
    }

    console.log("🔍 === SEARCH DEBUG END ===");
  };
  const resetSearch = async () => {
    try {
      let results;

      results = await fetchPosts();

      console.log("Setting posts with:", results);
      setPosts(results);
      setLoading(false);
      setSearchQuery("");
      setSearchDone(false);
    } catch (error) {
      console.error("Search error:", error);
      setError(error.message);
      setPosts([]);
      setLoading(false);
    }
  };
  const handleSearchChange = (value) => {

      setSearchQuery(value);
      // Сбрасываем флаг поиска при изменении запроса
      setSearchDone(false);
    
  };

  const searchPosts = async (query) => {
    console.log("📡 Making API request to search...");
    const response = await instance.get(
      `/post/search?q=${encodeURIComponent(query)}`,
    );
    console.log("📡 API response:", response.data);
    return response.data;
  };

  return (
    <div className="app">
      <Router>
        <AuthInitializer />
        <SnowEffect />
        <Routes>
          {/* Главная страница (/) - с HeaderNoAuth и ContentNoAuth */}
          <Route
            path="/"
            element={
              <>
                <HeaderNoAuth
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  onPerformSearch={performSearch}
                  onReset={resetSearch}
                />
                <ContentNoAuth
                  posts={posts}
                  setPosts={setPosts}
                  searchQuery={searchQuery}
                  isLoading={loading}
                  searchDone={searchDone}
                />
              </>
            }
          />

          {/* Страница регистрации  */}
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="/post" element={<ContentNoAuth />} />
          <Route path="/comments/:postId" element={<Comments />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
