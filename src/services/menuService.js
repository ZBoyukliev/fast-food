
import * as request from './requester';
const baseUrl = 'http://localhost:3030/data';
 

export const getAll = () => request.get(`${baseUrl}/menu`);
 
export const getByCategory = (foodCategory) => request.get(`${baseUrl}/menu?where=category%3D%22${foodCategory}%22`);

export const getOffers = () => request.get(`${baseUrl}/menu?where=type%3D%22offer%22`);

export const searchFood = (query) => request.get(`${baseUrl}/menu?where=title%20LIKE%20%22${query}%22`);
 
export const getById = (foodId) => request.get(`${baseUrl}/menu/${foodId}`);
 
export const create = (foodData) => request.post(`${baseUrl}/menu`, foodData);
 
export const edit = (foodId, foodData) => request.put(`${baseUrl}/menu/${foodId}`, foodData);

export const pagination = (skip, foodCategory) => request.get(`${baseUrl}/menu?where=category%3D%22${foodCategory}%22?offset=${skip}&pageSize=6`);
 

