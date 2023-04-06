
import * as request from './requester';
const baseUrl = 'http://localhost:3030/data';

export const getAllLikes = () => request.get(`${baseUrl}/likes`);
 
export const likeFood = (foodId) => request.post(`${baseUrl}/likes`, { foodId });
 
export const getLikesByFoodId =(foodId) => request.get(`${baseUrl}/likes?where=foodId%3D%22${foodId}%22&distinct=_ownerId&count`);
 
export const getMyLikeByFoodId = (foodId, userId) => request.get(`${baseUrl}/likes?where=foodId%3D%22${foodId}%22%20and%20_ownerId%3D%22${userId}%22&count`);
 
export const dislikeFood = (likeId) => request.del(`${baseUrl}/likes/${likeId}`);