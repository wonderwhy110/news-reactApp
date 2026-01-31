import React, { useState, useEffect } from "react";
import { instance } from "../api/axios.api";
import avatar from "../assets/default-avatar.png"; // правильное написание
import Spinner from "./Spinner";

const getAvatarUrl = (user) => {
  //сonsole.log("User avatar data:", post.user?.avatar);
  return user?.avatar || avatar;
};

function ProfileEdit() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState({
    name: "",
    avatar: "",
    bio: "",
    email: "",
  });

  useEffect(() => {
    console.log("ENV переменные:", {
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      API_BASE_URL: API_BASE_URL,
    });
  }, []);
   const [tempName, setTempName] = useState(""); // ← временное имя для редактирования
  const [isEditingName, setIsEditingName] = useState(false); // ← новое состояние
   const [tempBio, setTempBio] = useState(""); // ← временное имя для редактирования
  const [isEditingBio, setIsEditingBio] = useState(false); // ← новое состояние

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

   const handleBioChange = async () => {
  try {
    const userId = getUserIdFromToken();
    if (userId && tempBio.trim()) {
      const updateData = {
        bio: tempBio.trim(),
      };

      await instance.patch(`/user/${userId}`, updateData);
      
      // Обновляем состояние пользователя
      setUser(prev => ({ ...prev, bio: tempBio.trim() }));
      alert("успешно обновлено!");
      setIsEditingBio(false); // ← выходим из режима редактирования
    }
  } catch (error) {
    console.error("Ошибка сохранения описания:", error);
    alert("Ошибка при сохранении описания");
  }
};
const cancelBioEdit = () => {
  setIsEditingBio(false);
  setTempBio(user.bio); // восстанавливаем оригинальное имя
};

const startBioEditing = () => {
  setIsEditingBio(true);
  setTempBio(user.bio); // сохраняем текущее имя во временное состояние
};


  const handleNameChange = async () => {
  try {
    const userId = getUserIdFromToken();
    if (userId && tempName.trim()) {
      const updateData = {
        name: tempName.trim(),
      };

      await instance.patch(`/user/${userId}`, updateData);
      
      // Обновляем состояние пользователя
      setUser(prev => ({ ...prev, name: tempName.trim() }));
      alert("Имя успешно обновлено!");
      setIsEditingName(false); // ← выходим из режима редактирования
    }
  } catch (error) {
    console.error("Ошибка сохранения имени:", error);
    alert("Ошибка при сохранении имени");
  }
};
const cancelNameEdit = () => {
  setIsEditingName(false);
  setTempName(user.name); // восстанавливаем оригинальное имя
};

const startNameEditing = () => {
  setIsEditingName(true);
  setTempName(user.name); // сохраняем текущее имя во временное состояние
};
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

      const response = await instance.patch(
        `/user/${userId}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("✅ Ответ сервера:", response.data);

      if (response.data?.avatar) {
        // Обновляем состояние
        setUser((prev) => ({
          ...prev,
          avatar: response.data.avatar,
        }));
        alert("Аватар успешно обновлен!");

        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки:", error);
      console.error("URL запроса:", error.config?.url);
      console.error("Статус:", error.response?.status);
      console.error("Данные:", error.response?.data);

      alert(
        `Ошибка при загрузке аватара: ${
          error.response?.data?.message || error.message
        }`,
      );
    } finally {
      setUploading(false);
      // Очищаем input
      event.target.value = "";
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
  if (loading) return <Spinner size={20} />;

  return (
    <section className="content edit">
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
                  user?.avatar?.substring(0, 100),
                );
                e.target.src = avatar;
              }}
              onLoad={() => console.log("✅ Аватарка загружена в браузере")}
            />

            <label htmlFor="avatar-upload" className="avatar-upload-label">
              <i className="bx bxs-edit-alt"></i>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                style={{ display: "none" , color : 'var(--text-primary)'}}
              />
            </label>
          </div>

          <div className="right-groop">
            <div className="form-group">
              {isEditingName ? (
      <div className="name-edit-container">
        <input
           style ={{color : 'var(--text-primary)'}}
          type="text"
          value={tempName}
          className="text-input medium userName"
          onChange={(e) => setTempName(e.target.value)}
          placeholder="Введите ваше имя"
          autoFocus // автоматический фокус на поле
          onKeyDown={(e) => {
            // Сохраняем по нажатию Enter
            if (e.key === 'Enter') {
              handleNameChange();
            }
            // Отменяем по Escape
            if (e.key === 'Escape') {
              cancelNameEdit();
            }
          }}
        />
        
          <button
            type="button"
            onClick={handleNameChange}
            className="button small success"
            disabled={!tempName.trim()}
          >
            ✓
          </button>
          <button
            type="button"
            onClick={cancelNameEdit}
            className="button small cancel"
          >
            ✕
          </button>
        </div>
 
    ) : (
      /* Режим просмотра */
      <div className="name-edit-container">
        <h1>{user.name || "Без имени"}</h1>
        <button
          type="button"
          onClick={startNameEditing}
          className="button small edit"
          style ={{color : 'var(--text-primary)'}}
          title="Изменить имя"
        >
          <i className="bx bxs-edit-alt"></i>
        </button>
      </div>
    )}
  </div>
   <h2>О себе:</h2>


            <div className="form-group">
               {isEditingBio ? (
              <div className="name-edit-container">
        <textarea
         
          value={tempBio}
          className="text-input large post"
          onChange={(e) => setTempBio(e.target.value)}
          placeholder="Расскажите о себе"
           rows="4"
          autoFocus // автоматический фокус на поле
          onKeyDown={(e) => {
            // Сохраняем по нажатию Enter
            if (e.key === 'Enter') {
              handleBioChange();
            }
            // Отменяем по Escape
            if (e.key === 'Escape') {
              cancelBioEdit();
            }
          }}
        />
         <div className="edit-buttons">
         
         <button
            type="button"
            onClick={handleBioChange}
            className="button small success"
            disabled={!tempBio.trim()}
          >
            ✓
          </button>
          <button
            type="button"
            onClick={cancelBioEdit}
            className="button small cancel"
          >
            ✕
          </button>
        </div>
           </div>
 
    ) : (
      /* Режим просмотра */
      <div className="name-edit-container">
       
 
         <div className="text-input large post">{user.bio || "Раскажите о себе"} </div>
        
        <button
          type="button"
          onClick={startBioEditing}
          className="button small edit"
       
        >
          <i className="bx bxs-edit-alt"></i>
        </button>
      </div>
    )}
  </div>

                    


          </div>
        </header>
        

      

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
