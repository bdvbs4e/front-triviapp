import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Obtener resultados de jugadores de una sala
export const getPlayerResultsByRoom = async (roomId) => {
  try {
    const response = await axios.get(`${API_URL}/api/player-results/room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo resultados de sala:", error);
    throw error;
  }
};

// Crear o actualizar resultado de jugador
export const createOrUpdatePlayerResult = async (roomId, playerData) => {
  try {
    const response = await axios.post(`${API_URL}/api/player-results/room/${roomId}`, playerData);
    return response.data;
  } catch (error) {
    console.error("Error creando/actualizando resultado de jugador:", error);
    throw error;
  }
};

// Actualizar eliminación de jugador
export const updatePlayerElimination = async (roomId, playerId, eliminated, eliminatedRound) => {
  try {
    const response = await axios.put(`${API_URL}/api/player-results/room/${roomId}/player/${playerId}/elimination`, {
      eliminated,
      eliminatedRound
    });
    return response.data;
  } catch (error) {
    console.error("Error actualizando eliminación de jugador:", error);
    throw error;
  }
};

// Actualizar puntuación de jugador
export const updatePlayerScore = async (roomId, playerId, score) => {
  try {
    const response = await axios.put(`${API_URL}/api/player-results/room/${roomId}/player/${playerId}/score`, {
      score
    });
    return response.data;
  } catch (error) {
    console.error("Error actualizando puntuación de jugador:", error);
    throw error;
  }
};

// Obtener estadísticas de un jugador
export const getPlayerStats = async (playerId) => {
  try {
    const response = await axios.get(`${API_URL}/api/player-results/player/${playerId}/stats`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo estadísticas de jugador:", error);
    throw error;
  }
};

