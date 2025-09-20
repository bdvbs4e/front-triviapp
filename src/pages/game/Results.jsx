// src/pages/game/Results.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import "../../styles/global.css";
import "../../styles/results.css";
import { getSocket } from "../../services/socket.services";

export default function Results() {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [dbResults, setDbResults] = useState([]);

  const localUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !socket.connected) return;

    console.log("🔗 Solicitando resultados de la sala...");
    socket.emit("get-results", { roomId: localUser?.roomId });

    socket.on("results-update", (data) => {
      console.log("📢 results-update:", data);
      
      // Priorizar datos de la base de datos si están disponibles
      if (data.dbResults && data.dbResults.length > 0) {
        setPlayers(data.dbResults);
        setDbResults(data.dbResults);
      } else {
        setPlayers(data.players || []);
        setDbResults(data.players || []);
      }
      
      setWinner(data.winner || null);
    });

    return () => {
      socket.off("results-update");
    };
  }, [localUser?.roomId]);

  // 🔢 Calcular preguntas correctas basado en la ronda de eliminación
  const calculateCorrectAnswers = (player) => {
    if (!player.eliminated) {
      // Si no fue eliminado, su score es correcto
      return player.score || 0;
    } else {
      // Si fue eliminado, las preguntas correctas = ronda eliminada - 1
      const eliminatedRound = player.eliminatedRound || player.round || 0;
      return Math.max(0, eliminatedRound - 1);
    }
  };

  // 🏆 Ordenar jugadores para mostrar ranking
  const sortedPlayers = useMemo(() => {
    const playersCopy = [...players];
    return playersCopy.sort((a, b) => {
      // Primero los no eliminados
      if (!a.eliminated && b.eliminated) return -1;
      if (a.eliminated && !b.eliminated) return 1;
      
      // Luego por puntuación (mayor a menor)
      if (a.score !== b.score) return (b.score || 0) - (a.score || 0);
      
      // Finalmente por ronda de eliminación (menor a mayor)
      return (a.eliminatedRound || 0) - (b.eliminatedRound || 0);
    });
  }, [players]);

  const handleBackToLobby = async () => {
    if (isLeaving) return;
    setIsLeaving(true);

    const socket = getSocket();
    if (socket && socket.connected) {
      console.log("👋 Saliendo de la partida...");
      socket.emit("player-leave", { id: localUser?._id, roomId: localUser?.roomId });
    }

    sessionStorage.setItem("fromResults", "true");
    navigate("/lobby", { replace: true });
  };

  return (
    <div className="screen">
      <div className="results-card">
        <h1 className="results-title">
          {winner && (winner.playerId || winner.id) === localUser?._id
            ? " ¡Ganaste!"
            : "📊 Resultados de la partida"}
        </h1>

        <p className="results-subtitle">
          {winner
            ? `Ganador: ${winner.playerName || winner.name}`
            : players.length > 0
            ? "La partida sigue en curso, esperando siguientes resultados..."
            : "Cargando datos de la partida..."}
        </p>

        {players.length > 0 ? (
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th>Estado</th>
                  <th>Ronda Eliminado</th>
                  <th>Preguntas Correctas</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((p) => {
                  const isCurrent =
                    localUser?._id && String(p.playerId || p.id) === String(localUser._id);
                  const isWinner = winner && String(winner.playerId || winner.id) === String(p.playerId || p.id);
                  const correctAnswers = calculateCorrectAnswers(p);
                  
                  return (
                    <tr
                      key={p.playerId || p.id}
                      className={`${isCurrent ? "highlight" : ""} ${
                        isWinner ? "winner-row" : ""
                      }`}
                    >
                      <td>
                        <div className="player-name-cell">
                          <span className="player-name">
                            {p.playerName || p.name}
                          </span>
                          {isWinner && <span className="winner-icon">🏆</span>}
                          {isCurrent && <span className="current-player"> — (tú)</span>}
                        </div>
                      </td>
                      <td>
                        <div className="status-cell">
                          {p.eliminated ? (
                            <span className="eliminated-status">❌ Eliminado</span>
                          ) : (
                            <span className="survived-status">✅ Sobrevivió</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="round-cell">
                          {p.eliminated ? (p.eliminatedRound || p.round || "-") : "-"}
                        </div>
                      </td>
                      <td>
                        <div className="score-cell">
                          {correctAnswers}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No hay datos de jugadores aún.
          </p>
        )}

        <div style={{ marginTop: 20 }}>
          <button
            className="btn-primary"
            onClick={handleBackToLobby}
            disabled={isLeaving}
          >
            {isLeaving ? "Volviendo al Lobby..." : "Volver al Lobby"}
          </button>
        </div>
      </div>
    </div>
  );
}