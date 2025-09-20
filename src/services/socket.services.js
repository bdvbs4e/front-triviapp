// src/services/socket.js
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let socket = null;

export const connectSocket = (token) => {
  socket = io(API_URL, {
    auth: { token }, // en el futuro usaremos esto para la fase 2
  });

  socket.on("connect", () => {
    console.log("🟢 Socket conectado:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket desconectado:", reason);
  });

  // Solo para probar: escuchar el evento de prueba "pong"
  socket.on("pong", (data) => {
    console.log("📩 PONG recibido desde el servidor:", data);
  });

  return socket;
};

export const getSocket = () => socket;

