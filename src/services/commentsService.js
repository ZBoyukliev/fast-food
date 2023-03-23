import * as request from './requester';
const baseUrl = 'http://localhost:3030/data';


export const getAllComments = () => request.get(`${baseUrl}/comments`);
 
export const postComment = (foodId, comment, username, imageUrl) => request.post(`${baseUrl}/comments`, {foodId, comment, username, imageUrl});
 
export const removeCommment = (commentId) => request.del(`${baseUrl}/comments/${commentId}`);