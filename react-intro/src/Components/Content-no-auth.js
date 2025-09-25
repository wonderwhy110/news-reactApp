import React, { useState, useEffect } from "react";
import { instance, instanceWithoutAuth } from "../api/axios.api";
import avatar from "../assets/default-avatar.png";
import { useAuth } from "../hooks/useAuth";

// Функция для декодирования JWT
const decodeJWT = (token) => {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Ошибка декодирования JWT:", error);
    return null;
  }
};

function ContentNoAuth() {
  const UPLOADS_BASE_URL = process.env.REACT_APP_UPLOADS_BASE_URL;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likingPosts, setLikingPosts] = useState(new Set());
  const { isAuth, user } = useAuth();

  // Функция для получения ID пользователя
  const getUserId = () => {
    if (!user) return null;

    // Если userId есть и он не undefined, используем его
    if (user.userId !== undefined && user.userId !== null) {
      return user.userId;
    }

    // Если userId undefined, но есть токен - декодируем токен
    if (user.token) {
      const decoded = decodeJWT(user.token);
     

      return decoded[id];
    }

    console.error("Не удалось найти ID пользователя");
    return null;
  };

  useEffect(() => {
    const userId = getUserId();
    
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get("/post");
        setPosts(response.data);
      } catch (error) {
        console.error("Ошибка загрузки постов с токеном:", error);
        if (error.response?.status === 401) {
          try {
            const response = await instanceWithoutAuth.get("/post");
            setPosts(response.data);
          } catch (er) {
            console.error("Ошибка загрузки постов без токена:", er);
            setError("Не удалось загрузить посты");
          }
        } else {
          setError("Не удалось загрузить посты");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLikeClick = async (postId) => {
    if (!isAuth) {
      alert("Пожалуйста, войдите в систему, чтобы ставить лайки");
      return;
    }

    const userId = getUserId();

    if (!userId) {
      console.error("Не удалось найти ID пользователя в объекте:", user);
      alert("Ошибка аутентификации: ID пользователя не найден");
      return;
    }

    const post = posts.find((p) => p.post_id === postId);
    const isLiked = post.likedByUserIds?.includes(userId);

    setLikingPosts((prev) => new Set(prev).add(postId));

    try {
      if (isLiked) {
        await instance.delete(`/post/${postId}/like`);
      } else {
        await instance.post(`/post/${postId}/like`);
      }

      const response = await instance.get("/post");
      setPosts(response.data);
    } catch (error) {
      console.error("Ошибка при работе с лайком:", error);
      if (error.response?.status === 401) {
        alert("Сессия истекла. Пожалуйста, войдите снова.");
      } else {
        alert("Не удалось выполнить действие");
      }
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const isPostLiked = (post) => {
    const userId = getUserId();
    return userId && post.likedByUserIds?.includes(userId);
  };

  const getLikesCount = (post) => {
    return post.likedByUserIds?.length || 0;
  };

  if (loading) return <div className="content">Загрузка постов...</div>;
  if (error) return <div className="content">{error}</div>;
  if (posts.length === 0) return <div className="content">Постов пока нет</div>;

  return (
    <section className="content">
      {posts && posts.map((post) => {
        const isLiked = isPostLiked(post);
        const likesCount = getLikesCount(post);

        return (
          <div key={post.post_id} className="card">
            <header className="card-title">
              <img
                className="avatar-post"
                src={
                  post.user.avatar
                    ? `${UPLOADS_BASE_URL}/${post.user.avatar}`
                    : avatar
                }
                alt="Аватар"
              />
              <h1>{post.user?.name || "Неизвестный автор"}</h1>
            </header>
            <p>{post.content}</p>

            <footer className="card-footer">
              <button
                type="button"
                className="button primary"
                onClick={() => handleLikeClick(post.post_id)}
                disabled={likingPosts.has(post.post_id)}
              >
                <i className={`bx ${isLiked ? "bxs-heart" : "bx-heart"}`}></i>
                <span className="like-count">{likesCount}</span>
                {likingPosts.has(post.post_id)}
              </button>

              <button type="button" className="button secondary">
                Комментарии {post.comments?.length || 0}
              </button>
            </footer>
          </div>
        );
      })}
    </section>
  );
}

export default ContentNoAuth;
