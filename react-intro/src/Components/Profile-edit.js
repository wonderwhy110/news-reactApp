import React, { useState, useEffect } from "react";
import { instance } from "../api/axios.api";
import avatar from "../assets/default-avatar.png"; // правильное написание

function ProfileEdit() {
  const [user, setUser] = useState({
    name: "",
    avatar: "",
    bio: "",
    email: "",
  });
  const [postContent, setPostContent] = useState(""); // State для текста поста
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false); // State для индикатора отправки

  // Функция для получения ID из токена
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

  // Получаем данные пользователя
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

  // Сохранение изменений
  const handleSave = async () => {
    try {
      const userId = getUserIdFromToken();
      if (userId) {
        await instance.patch(`/user/${userId}`, user);
        alert("Профиль успешно обновлен!");
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };
  const handleSubmitPost = async (e) => {
    e.preventDefault();

    if (!postContent.trim()) {
      alert("Пост не может быть пустым!");
      return;
    }

    setPosting(true);
    try {
      const response = await instance.post("/post/create", {
        content: postContent,
      });

      alert("Пост успешно создан!");
      setPostContent(""); // Очищаем поле ввода
      console.log("Создан пост:", response.data);
    } catch (error) {
      console.error("Ошибка создания поста:", error);
      alert("Ошибка при создании поста");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <section className="content">
      <div className="card profile">
        <header className="card-title">
          <img src={user.avatar || avatar} alt="Аватар" className="avatar" />

          <div className="form-group">
            <label>Имя:</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Введите ваше имя"
            />
          </div>
        </header>

        <div className="right-groop">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label>О себе:</label>
            <textarea
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              placeholder="Расскажите о себе"
              rows="4"
            />
          </div>
        </div>

        <form onSubmit={handleSubmitPost} className="post-form">
          <label className="field-row post">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="text-input large post"
              placeholder="Введите свой пост"
              rows="3"
              disabled={posting}
            />
          </label>

          <button
            type="submit"
            className="button primary"
            disabled={posting || !postContent.trim()}
          >
            {posting ? "Отправка..." : "Опубликовать пост"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ProfileEdit;
