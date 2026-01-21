// SinglePost.jsx
import React, { useEffect, useState } from "react";
import avatar from "../assets/default-avatar.png";
import { useLikes } from "../hooks/useLikes"; // Импортируем хук
import { instance } from "../api/axios.api";
import { useSelector } from "react-redux";
import ConfirmModal from "./ConfirmModal";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "./Time";

function SinglePost({ post, onPostUpdated, disabled = false }) {
  const [localPost, setLocalPost] = useState(post);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);

  const userState = useSelector((state) => state.user);
  const userId = userState?.user?.userId || null;

  // Используем хук лайков
  const {
    isPostLiked,
    getLikesCount,
    handleLike,
    loading: likeLoading,
    isAuth,
  } = useLikes();
  const navigate = useNavigate();
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
      console.log(result.error);
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/registration");
      return;
    }
  };
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      alert("Комментарий не может быть пустым!");
      return;
    }
    const token = localStorage.getItem("token");

    // Проверка авторизации
    if (!token) {
      alert("Вы не авторизованы! Пожалуйста, войдите в систему.");
      // Можно перенаправить на страницу логина
      navigate("/registration");
      return;
    }

    const postId = localPost.post_id;
    try {
      const response = await instance.post(`/post/${postId}/comments`, {
        content: commentContent,
      });
      setComments((prev) => [...prev, response.data]);
      setCommentContent("");
      console.log("Комментарий оставлен!", response.data);
    } catch (er) {
      alert("Ошибка при создании комментария ");
      console.log("error: ", er);
    }
  };
  const postId = localPost.post_id;
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await instance.get(`/post/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Ошибка загрузки комментариев:", error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");

    try {
      await instance.delete(`/post/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Удаляем комментарий из состояния
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));

      console.log("Комментарий удален");
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert(error.response?.data?.message || "Ошибка при удалении");
    }
  };

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    commentId: null,
  });

  const openDeleteModal = (commentId) => {
    setDeleteModal({ isOpen: true, commentId });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.commentId) {
      await handleDeleteComment(deleteModal.commentId);
      setDeleteModal({ isOpen: false, commentId: null });
    }
  };

  if (!localPost) {
    return <div className="content">Пост не найден</div>;
  }

  const isLiked = isPostLiked(localPost);
  const likesCount = getLikesCount(localPost);

  return (
    <div className="wrap-comments">
      <section className="content comments">
        <div className="card single">
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
            <small className="time">
              {timeAgo(localPost.createdAt)} {/* "3 часа назад" */}
              {/* или smartFormat(comment.createdAt) для "сегодня в 14:30" */}
            </small>
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
              Комментарии {comments?.length || 0}
            </button>
          </footer>
        </div>
        {comments &&
          comments.map((comment) => {
            const isAuthor =
              userId !== null &&
              userId !== undefined &&
              comment.userId &&
              parseInt(comment.userId) === parseInt(userId);

            return (
              <div key={comment.id} className="card comment">
                <header className="card-title">
                  <img
                    className="avatar-post"
                    src={comment.user?.avatar || avatar}
                    alt="Аватар"
                    onError={(e) => {
                      e.target.src = avatar;
                    }}
                  />
                  <h1>{comment.user?.name || "Неизвестный автор"}</h1>
                  <small className="time">
                    {timeAgo(comment.createdAt)} {/* "3 часа назад" */}
                    {/* или smartFormat(comment.createdAt) для "сегодня в 14:30" */}
                  </small>
                </header>

                <p className="comment-content">{comment.content}</p>

                {/* Кнопка удаления (показываем только автору) */}
                {isAuthor && (
                  <button
                    onClick={() => openDeleteModal(comment.id)}
                    className="delete-btn"
                  >
                    <i class="bx  bx-trash"></i>
                  </button>
                )}
              </div>
            );
          })}

        <textarea
          placeholder="Введите свой комментарий"
          className="text-input large comment"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          rows="4"
        />
        <button
          type="button"
          onClick={handleSubmitComment}
          className="button primary"
        >
          Отправить
        </button>
      </section>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, commentId: null })}
        onConfirm={handleDeleteConfirm}
        title="Удаление комментария"
        message="Вы уверены, что хотите удалить этот комментарий? Это действие нельзя отменить."
      />
    </div>
  );
}

export default SinglePost;
