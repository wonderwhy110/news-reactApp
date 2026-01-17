// hooks/useLikes.js
import { useState } from "react";
import { instance } from "../api/axios.api";
import { useAuth } from "./useAuth";

export function useLikes() {
  const { isAuth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получение ID пользователя
  const getUserId = () => {
    if (!user) return null;

    // Проверяем разные варианты где может быть userId
    if (user.userId !== undefined && user.userId !== null) {
      return user.userId;
    }

    if (user.id !== undefined && user.id !== null) {
      return user.id;
    }

    // Пробуем декодировать из токена
    if (user.token) {
      try {
        const payload = user.token.split(".")[1];
        const decodedPayload = atob(payload);
        const decoded = JSON.parse(decodedPayload);
        return decoded.userId || decoded.sub || decoded.id;
      } catch (err) {
        console.error("Ошибка декодирования токена:", err);
      }
    }

    console.error("Не удалось получить ID пользователя из объекта:", user);
    return null;
  };

  // Получение количества лайков
  const getLikesCount = (post) => {
    if (!post) return 0;
    return post.likedByUserIds?.length || 0;
  };

  const isPostLiked = (post) => {
    if (!post || !user) return false;
    const userId = getUserId();
    return userId && post.likedByUserIds?.includes(userId);
  };

  // Основная функция для лайка/анлайка
  const handleLike = async (postId, currentPost) => {
    if (!isAuth || !user) {
      alert("Пожалуйста, войдите в систему, чтобы ставить лайки");
      return { success: false, error: "Не авторизован" };
    }

    const userId = getUserId();
    if (!userId) {
      alert("Ошибка аутентификации: ID пользователя не найден");
      return { success: false, error: "ID пользователя не найден" };
    }

    setLoading(true);
    setError(null);

    try {
      // Определяем, лайкаем или убираем лайк
      const isLiked = currentPost?.likedByUserIds?.includes(userId);

      if (isLiked) {
        // Убираем лайк
        await instance.delete(`/post/${postId}/like`);
      } else {
        // Ставим лайк
        await instance.post(`/post/${postId}/like`);
      }

      // Возвращаем обновленные данные
      const response = await instance.get(`/post/${postId}`);

      return {
        success: true,
        data: response.data,
        action: isLiked ? "unliked" : "liked",
      };
    } catch (error) {
      console.error("Ошибка при работе с лайком:", error);
      setError(error.message);

      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Сессия истекла. Пожалуйста, войдите снова.",
        };
      } else {
        return {
          success: false,
          error: "Не удалось выполнить действие",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    // Состояние
    loading,
    error,

    // Функции
    getUserId,
    isPostLiked,
    getLikesCount,
    handleLike,


    // Данные пользователя
    isAuth,
    user,

    // Хелперы
    canLike: isAuth && user && getUserId(),
  };
}
