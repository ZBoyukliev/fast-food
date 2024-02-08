import * as request from './requester';
const baseUrl = 'http://localhost:3030/data';

export const getAllComments = () => request.get(`${baseUrl}/comments`);

export const getCommendById = (commentId) => request.get(`${baseUrl}/comments/${commentId}`);

export const postComment = (userId, comment, username, imageUrl) => request.post(`${baseUrl}/comments`, { userId, comment, username, imageUrl });

export const editComent = (commentId, data) => request.put(`${baseUrl}/comments/${commentId}`, data);

export const removeCommment = (commentId) => request.del(`${baseUrl}/comments/${commentId}`);
