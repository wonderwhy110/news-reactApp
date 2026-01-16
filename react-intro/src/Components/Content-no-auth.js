// ContentNoAuth.jsx
import React, { useState, useEffect } from "react";
import { instance, instanceWithoutAuth } from "../api/axios.api";
import avatar from "../assets/default-avatar.png";
import { useLikes } from "../hooks/useLikes"; // Импортируем хук
import { Link } from "react-router-dom";

function ContentNoAuth({ posts: initialPosts, setPosts, disabled }) {
  const UPLOADS_BASE_URL = process.env.REACT_APP_UPLOADS_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setLocalPosts] = useState(initialPosts || []);
  const [likingPosts, setLikingPosts] = useState(new Set());

  // Используем хук лайков
  const { isPostLiked, getLikesCount, handleLike, isAuth } = useLikes();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get("/post");
        const fetchedPosts = response.data;
        setLocalPosts(fetchedPosts);
        if (setPosts) setPosts(fetchedPosts);
      } catch (error) {
        console.error("Ошибка загрузки постов с токеном:", error);
        if (error.response?.status === 401) {
          try {
            const response = await instanceWithoutAuth.get("/post");
            const fetchedPosts = response.data;
            setLocalPosts(fetchedPosts);
            if (setPosts) setPosts(fetchedPosts);
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

  // Обработчик лайка для ContentNoAuth
  const handleLikeClick = async (postId) => {
    if (disabled) return;

    setLikingPosts((prev) => new Set(prev).add(postId));

    const post = posts.find((p) => (p.post_id || p.id) === postId);
    const result = await handleLike(postId, post);

    if (result.success) {
      // Обновляем пост в списке
      const updatedPosts = posts.map((p) =>
        (p.post_id || p.id) === postId ? result.data : p
      );

      setLocalPosts(updatedPosts);
      if (setPosts) setPosts(updatedPosts);
    }

    setLikingPosts((prev) => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
  };

  if (loading) return <div className="content">Загрузка постов...</div>;
  if (error) return <div className="content">{error}</div>;
if (!posts || !Array.isArray(posts) || posts.length === 0) {
  return <div className="content">Постов пока нет</div>;
}

  return (
    <section className="content">
      {posts.map((post) => {
        const postId = post.post_id || post.id;
        const isLiked = isPostLiked(post);
        const likesCount = getLikesCount(post);
        const isLiking = likingPosts.has(postId);

        return (
          <div key={postId} className="card">
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
            </header>

            <p>{post.content}</p>

            <footer className="card-footer">
              <button
                type="button"
                className="button primary"
                onClick={() => handleLikeClick(postId)}
                disabled={isLiking || disabled}
              >
                <i className={`bx ${isLiked ? "bxs-heart" : "bx-heart"}`}></i>
                <span className="like-count">{likesCount}</span>
                {isLiking}
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
