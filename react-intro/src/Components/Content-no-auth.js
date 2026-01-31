// ContentNoAuth.jsx - УПРОЩЕННАЯ ВЕРСИЯ
import React, { useEffect, useState } from "react";
import avatar from "../assets/default-avatar.png";
import { useLikes } from "../hooks/useLikes";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import { timeAgo } from "./Time";

function ContentNoAuth({
  posts, // ← посты передаются из App.js
  disabled,
  searchQuery,
  searchDone,
  isLoading = false,
}) {
  const { isPostLiked, getLikesCount, handleLike, isAuth, getUserId } =
    useLikes();

  const [localPosts, setLocalPosts] = useState(posts);
  const [likingPosts, setLikingPosts] = useState(new Set());

  // Синхронизируем посты при изменении пропса
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  // Обработчик лайка - ОПТИМИЗИРОВАННЫЙ ВАРИАНТ
  const handleLikeClick = async (postId) => {
    if (disabled) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Вы не авторизованы! Пожалуйста, войдите в систему.");
      return;
    }

    const userId = getUserId();
    if (!userId) {
      console.error("Не удалось получить ID пользователя");
      return;
    }

    setLikingPosts((prev) => new Set(prev).add(postId));

    try {
      // Находим текущий пост
      const postIndex = localPosts.findIndex(
        (post) => post.post_id === postId || post.id === postId,
      );

      if (postIndex === -1) return;

      const currentPost = localPosts[postIndex];
      const wasLiked = isPostLiked(currentPost);

      // Оптимистичное обновление UI
      const updatedPosts = [...localPosts];
      updatedPosts[postIndex] = {
        ...currentPost,
        likedByUserIds: wasLiked
          ? (currentPost.likedByUserIds || []).filter((id) => id !== userId)
          : [...(currentPost.likedByUserIds || []), userId],
      };

      setLocalPosts(updatedPosts);

      // Выполняем запрос к API
      const result = await handleLike(postId, currentPost);

      if (!result.success) {
        // Если запрос не удался - откатываем изменения
        console.error("Ошибка лайка:", result.error);
        setLocalPosts(posts); // Возвращаем исходные посты
      }
      // Если success - данные уже обновлены оптимистично
    } catch (error) {
      console.error("Ошибка лайка:", error);
      setLocalPosts(posts); // Откат при ошибке
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };
  if (isLoading) {
    return (
      <div className="content">
        <Spinner size={20} />
      </div>
    );
  }
  // Просто отображаем переданные посты
  if (!localPosts || localPosts.length === 0) {
    return (
      <div className="content">
        {searchDone
          ? `По запросу "${searchQuery}" ничего не найдено`
          : "Постов пока нет"}
      </div>
    );
  }

  return (
    <section className="content">
      {/* Информация о результатах поиска */}
      {searchDone && (
        <div className="search-results-info">
          Найдено {localPosts.length} постов по запросу: "{searchQuery}"
        </div>
      )}

      {localPosts.map((post) => {
        const postId = post.post_id;
        const isLiked = isPostLiked(post);
        const likesCount = getLikesCount(post);

        return (
          <div
            key={postId}
            className="card"
            style={{
              backgroundColor: " var(--bg-card)",
        
              boxShadow: " box-shadow: 0 6px 34px rgba(0, 0, 0, 0.12)",
              color: "var(--text-primary)",
            }}
          >
            <header className="card-title">
              <img
                className="avatar-post"
                src={post.user?.avatar || avatar}
                alt="Аватар"
                onError={(e) => {
                  e.target.src = avatar;
                }}
              />
              <h1>{post.user?.name || "Неизвестный автор"}</h1>
              <small className="time">
                {timeAgo(post.createdAt)} {/* "3 часа назад" */}
                {/* или smartFormat(comment.createdAt) для "сегодня в 14:30" */}
              </small>
            </header>

            {post.title && <h3 className="post-title">{post.title}</h3>}

            <p>{post.content}</p>

            <footer className="card-footer">
              <button
                type="button"
                className="button primary"
                onClick={() => handleLikeClick(postId)}
                disabled={disabled}
              >
                <i className={`bx ${isLiked ? "bxs-heart" : "bx-heart"}`}></i>
                <span className="like-count">{likesCount}</span>
              </button>

              <Link to={`/comments/${postId}`}>
                <button
                  type="button"
                  className="button secondary"
                  disabled={disabled}
                >
                  Комментарии {post.comments?.length || 0}
                </button>
              </Link>
            </footer>
          </div>
        );
      })}
    </section>
  );
}

export default ContentNoAuth;
