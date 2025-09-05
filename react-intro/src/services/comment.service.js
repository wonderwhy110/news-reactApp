// src/services/commentService.ts
import { instance } from "../api/axios.api"

export const commentService = {
  // Получить комментарии поста
  getPostComments: async (postId) => {
    const response = await  instance.get(`/posts/${postId}/comments`);
    return response.data;
  },

  // Создать комментарий
  createComment: async (postId, content) => {
    const response = await  instance.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  // Обновить комментарий
  updateComment: async (postId, commentId, content) => {
    const response = await  instance.put(`/posts/${postId}/comments/${commentId}`, { content });
    return response.data;
  },

  // Удалить комментарий
  deleteComment: async (postId, commentId) => {
    await  instance.delete(`/posts/${postId}/comments/${commentId}`);
  }
};