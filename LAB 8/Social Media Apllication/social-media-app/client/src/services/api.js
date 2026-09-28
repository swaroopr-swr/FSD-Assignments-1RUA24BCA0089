import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5001/api" });

export const getPosts = () => api.get("/posts");
export const createPost = (data) => api.post("/posts", data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
