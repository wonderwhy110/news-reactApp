
import { instance } from "../api/axios.api"
import api from './api';

export const postService = {
  // Создать пост
  createPost: async (content) => {
    const response = await instance.post('/posts', { content });
    return response.data;
  },

  // Получить все посты
  getAllPosts: async () => {
    const response = await instance.get('/posts');
    return response.data;
  },

  // Получить посты пользователя
  getUserPosts: async (userId) => {
    const response = await instance.get(`/posts/user/${userId}`);
    return response.data;
  },

  // Получить ленту
  getFeed: async () => {
    const response = await instance.get('/posts/feed');
    return response.data;
  },

  // Получить пост по ID
  getPost: async (postId) => {
    const response = await instance.get(`/posts/${postId}`);
    return response.data;
  },

  // Обновить пост
  updatePost: async (postId, content) => {
    const response = await instance.put(`/posts/${postId}`, { content });
    return response.data;
  },

  // Удалить пост
  deletePost: async (postId) => {
    await instance.delete(`/posts/${postId}`);
  },

  // Лайкнуть пост
  likePost: async (postId) => {
    const response = await instance.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Убрать лайк
  unlikePost: async (postId) => {
    await instance.delete(`/posts/${postId}/like`);
  },

  // Поиск постов
  searchPosts: async (query) => {
    const response = await instance.get(`/posts/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};