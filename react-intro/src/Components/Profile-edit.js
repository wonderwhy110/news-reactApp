import React, { useState, useEffect } from "react";
import { instance } from "../api/axios.api";
import avatar from "../assets/default-avatar.png"; // правильное написание

const getAvatarUrl = (user) => {
  //сonsole.log("User avatar data:", post.user?.avatar);
  return user?.avatar || avatar;
};

function ProfileEdit() {
  const UPLOADS_BASE_URL = process.env.REACT_APP_UPLOADS_BASE_URL;
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState({
    name: "",
    avatar: "",
    bio: "",
    email: "",
  });
  const [postContent, setPostContent] = useState(""); // State для текста поста
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false); // State для индикатора отправки
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  // Сохранение изменений
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const userId = getUserIdFromToken();
      if (userId) {
        // Отправляем только те поля, которые можно изменить
        const updateData = {
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
        };

        await instance.patch(`/user/${userId}`, updateData);
        alert("Профиль успешно обновлен!");
      }
    } catch (error) {
      console.error("Полная ошибка:", error);
      console.error("URL запроса:", error.config?.url);
      console.error("Метод:", error.config?.method);
      alert("Ошибка при сохранении профиля");
    } finally {
      setSaving(false);
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
  // Загрузка аватара

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("=== AVATAR UPLOAD DEBUG ===");
    console.log("API_BASE_URL:", API_BASE_URL);

    const userId = getUserIdFromToken();
    console.log("User ID from token:", userId);

    if (!userId) {
      alert("Ошибка аутентификации");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      // Используем прямой fetch вместо axios для теста
      const response = await fetch(`${API_BASE_URL}/user/${userId}/avatar`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      console.log("✅ Успешный ответ, avatar длина:", result.avatar.length);

      // Логируем ДО обновления состояния
      console.log("Текущий user до обновления:", {
        id: user?.id,
        hasAvatar: !!user?.avatar,
      });

      // Обновляем состояние
      setUser((prev) => {
        const updatedUser = { ...prev, avatar: result.avatar };
        console.log("Обновленный user в setUser:", {
          id: updatedUser.id,
          avatarLength: updatedUser.avatar?.length,
        });
        return updatedUser;
      });
    } catch (error) {
      console.error("❌ Ошибка загрузки:", error);
      alert(`Ошибка при загрузке аватара: ${error.message}`);
    } finally {
      setUploading(false);
    }
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
  if (loading) return <div>Загрузка...</div>;

  return (
    <section className="content">
      <div className="card profile">
        <header className="card-title">
          <div className="avatar-container">
            <img
              src={user?.avatar || avatar}
              alt="Аватар"
              className="avatar"
              onError={(e) => {
                console.error("❌ Ошибка загрузки аватарки в img теге");
                console.error(
                  "SRC содержимое:",
                  user?.avatar?.substring(0, 100)
                );
                e.target.src = avatar;
              }}
              onLoad={() => console.log("✅ Аватарка загружена в браузере")}
            />

            <label htmlFor="avatar-upload" className="avatar-upload-label">
              {uploading ? "⏳" : "✎"}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="right-groop">
            <div className="form-group">
              <input
                type="text"
                value={user.name}
                className="text-input medium userName"
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Введите ваше имя"
              />
            </div>

            <div className="form-group">
              <label>О себе:</label>
              <textarea
                value={user.bio}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                placeholder="Расскажите о себе"
                className="text-input large post"
                rows="4"
              />
            </div>
          </div>
        </header>

        {/* Кнопка сохранения профиля */}
        <div className="form-group">
          <button
            type="button"
            onClick={handleSaveProfile}
            className="button primary"
            disabled={saving}
          >
            {saving ? "Сохранение..." : "Сохранить профиль"}
          </button>
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="disabled-input"
          />
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
