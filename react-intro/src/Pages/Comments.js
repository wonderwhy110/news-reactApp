import "../css/registration.css";
import Header from "../Components/Header";
import { useParams } from "react-router-dom";
import SinglePost from "../Components/SinglePost";
import { useEffect, useState } from "react";
import { instance, instanceWithoutAuth } from "../api/axios.api";
import HeaderNoAuth from "../Components/Header-no-auth";
import HeaderWithoutSearch from "../Components/HeaderWithoutSearch";

function Comments() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await instance.get(`/post/${postId}`);
        setPost(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          const response = await instanceWithoutAuth.get(`/post/${postId}`);
          setPost(response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    postId && fetchPost();
  }, [postId]);

  const handleLikeClick = async (postIdToLike) => {
    try {
      const response = await instance.get(`/post/${postIdToLike}`);
      setPost(response.data);
    } catch (error) {
      console.error("Ошибка лайка:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!post) return <div>Пост не найден</div>;

  return (
    <>
      <HeaderWithoutSearch/>
      <div className="container">
        <SinglePost 
          post={post} 
          onLikeClick={handleLikeClick}
        />
      </div>
    </>
  );
}

export default Comments;