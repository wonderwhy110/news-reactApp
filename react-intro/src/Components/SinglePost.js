// SinglePost.jsx
import React, { useState } from "react";
import avatar from "../assets/default-avatar.png";
import { useLikes } from "../hooks/useLikes"; // Импортируем хук

function SinglePost({ post, onPostUpdated, disabled = false }) {
  const [localPost, setLocalPost] = useState(post);

  // Используем хук лайков
  const {
    isPostLiked,
    getLikesCount,
    handleLike,
    loading: likeLoading,
    isAuth,
  } = useLikes();

  // Обработчик лайка
  const handleLikeClick = async () => {
    if (disabled) return;

    const postId = localPost.post_id;
    if (!postId) return;

    const result = await handleLike(postId, localPost);

    if (result.success) {
      // Обновляем локальное состояние
      setLocalPost(result.data);

      // Оповещаем родительский компонент
      if (onPostUpdated) {
        onPostUpdated(result.data);
      }
    } else if (result.error) {
      alert(result.error);
    }
  };

  if (!localPost) {
    return <div className="content">Пост не найден</div>;
  }

  const isLiked = isPostLiked(localPost);
  const likesCount = getLikesCount(localPost);

  return (
    <div className ="wrap-comments">

   
    <section className="content comments">
      <div className="card">
        <header className="card-title">
          <img
            className="avatar-post"
            src={localPost.user?.avatar || avatar}
            alt="Аватар"
            onError={(e) => {
              e.target.src = avatar;
            }}
          />
          <h1>{localPost.user?.name || "Неизвестный автор"}</h1>
        </header>

        <p>{localPost.content}</p>

        <footer className="card-footer">
          <button
            type="button"
            className="button primary"
            onClick={handleLikeClick}
            disabled={likeLoading || disabled}
          >
            <i className={`bx ${isLiked ? "bxs-heart" : "bx-heart"}`}></i>
            <span className="like-count">{likesCount}</span>
            {likeLoading}
          </button>

          <button type="button" className="button secondary" disabled={true}>
            Комментарии {localPost.comments?.length || 0}
          </button>
        </footer>
      </div>
   

              <textarea
                placeholder="Введите свой комментарий"
                className="text-input large comment"
                rows="4"
              />
               <button
            type="button"
         
            className="button primary"
       
          >
           Отправить
          </button>
    

      
    </section>
     </div>
  );
}

export default SinglePost;
