import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Obtener todos los usuarios
export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/api/users`);
    return response.data;
};

// Obtener un usuario por ID
export const getUserById = async (id) => {
    const response = await axios.get(`${API_URL}/api/users/${id}`);
    return response.data;
};

// Crear usuario
export const createUser = async (newUser) => {
    const response = await axios.post(`${API_URL}/api/users`, newUser);
    return response.data;
};

// Login de usuario
export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/users/login`, { email, password });
    return response.data;
};