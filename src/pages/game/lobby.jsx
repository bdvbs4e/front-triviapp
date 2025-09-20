// src/pages/game/lobby.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";
import "../../styles/lobby.css";
import { connectSocket, getSocket } from "../../services/socket.services";

export default function Lobby() {
  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("waiting");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    let socket = getSocket();
    if (!socket) socket = connectSocket();

    const fromResults = sessionStorage.getItem("fromResults") === "true";

    const joinRoom = () => {
      socket.emit("player-join", {
        id: user._id,
        name: user.name,
        forceNew: fromResults,
      });
    };

    socket.on("connect", joinRoom);
    joinRoom();
    sessionStorage.removeItem("fromResults");

    socket.on("lobby-update", (data) => {
      setPlayers(data.players || []);
      setStatus(data.status || "waiting");
    });

    socket.on("start-game", (data) => {
      navigate("/question", { state: { roomId: data.roomId } });
    });

    return () => {
      socket.off("connect", joinRoom);
      socket.off("lobby-update");
      socket.off("start-game");
    };
  }, [navigate]);

  const handleReady = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const socket = getSocket();
    if (!socket) return;
    // evitar marcar como listo si ya lo está
    const currentPlayer = players.find((p) => String(p.id) === String(user?._id));
    if (currentPlayer?.ready) return;
    socket.emit("player-ready", user._id);
  };

  const handleLeave = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const socket = getSocket();
    if (!socket) return;
    socket.emit("player-leave", { id: user._id, roomId: players[0]?.roomId });
    navigate("/");
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const currentPlayer = players.find((p) => String(p.id) === String(user?._id));
  const isReady = currentPlayer?.ready;

  return (
    <div className="screen">
      <div className="lobby-card">
        <h1 className="lobby-title">Sala de espera</h1>
        <p className="lobby-subtitle">
          {status === "waiting"
            ? players.length < 6
              ? `Esperando jugadores... (${players.length}/5)`
              : "Todos presentes, esperando confirmaciones..."
            : "¡Partida en progreso!"}
        </p>

        <ul className="player-list">
          {players.map((p) => (
            <li key={p.id} className={`player ${p.ready ? "ready" : ""}`}>
              <span>{p.name}{!p.connected && " (desconectado)"}</span>
              <span className="status">
                {p.ready ? "✅ Listo" : "⏳ Esperando"}
              </span>
            </li>
          ))}
        </ul>

        <div className="waiting">
          {status === "waiting" && (
            <button
              className="btn-primary"
              onClick={handleReady}
              disabled={isReady}
            >
              {isReady ? "Esperando a los demás..." : "¡Estoy listo!"}
            </button>
          )}
          <button className="btn-secondary mt-2" onClick={handleLeave}>
            Salir del Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
