import React, { useState, useEffect } from "react";
import { instance } from "../api/axios.api";
import avatar from "../assets/default-avatar.png";

function ContentNoAuth() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Получаем все посты из базы
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get("/post");
        setPosts(response.data);
      } catch (error) {
        console.error("Ошибка загрузки постов:", error);
        setError("Не удалось загрузить посты");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="content">Загрузка постов...</div>;
  if (error) return <div className="content">{error}</div>;
  if (posts.length === 0) return <div className="content">Постов пока нет</div>;

  return (
    <section className="content">
      {posts.map((post) => (
        <div key={post.post_id} className="card">
          <header className="card-title">
            <img
              className="avatar-post"
              src={post.user?.avatar || avatar}
              alt="avatar"
            />
            <h1>{post.user?.name || "Неизвестный автор"}</h1>
          </header>
          <p>{post.content}</p>

          <footer className="card-footer">
            <button type="button" className="button primary">
              <i className="bx bx-heart"></i>
              <span className="like-count">{post.likes || 0}</span>
            </button>
            <button type="button" className="button secondary">
              Комментарии {post.comments?.length || 0}
            </button>
          </footer>
        </div>
      ))}
    </section>
  );
}

export default ContentNoAuth;
