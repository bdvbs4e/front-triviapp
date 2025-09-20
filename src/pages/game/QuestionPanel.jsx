// src/pages/game/QuestionPanel.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/global.css";
import "../../styles/question.css";
import { getSocket } from "../../services/socket.services";

export default function QuestionPanel() {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const [roundResults, setRoundResults] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId;
  const user = JSON.parse(localStorage.getItem("user"));
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    // 🔥 Nueva pregunta
    socket.on("new-question", (q) => {
      console.log("🆕 Pregunta recibida:", q);
      setQuestion(q);
      setSelected(null);
      setRoundResults(null);
      setTimeLeft(5);
    });

    // 📊 Resultados de ronda
    socket.on("round-results", (data) => {
      console.log("📊 Resultados ronda:", data);
      setRoundResults(data);

      // Priorizar datos de la base de datos si están disponibles
      const playersData = data.dbResults && data.dbResults.length > 0 ? data.dbResults : data.players;
      const me = playersData.find((p) => String(p.playerId || p.id) === String(user._id));

      if (me?.eliminated) {
        // 👋 Si este jugador perdió, lo mandamos a resultados
        setTimeout(() => {
          navigate("/results", {
            replace: true,
            state: { roomId, players: playersData, winner: null },
          });
        }, 1500);
      }
    });

    // 🏁 Fin del juego (alguien ganó o no hay más preguntas)
    socket.on("game-over", (data) => {
      console.log("🏁 Juego terminado:", data);
      
      // Priorizar datos de la base de datos si están disponibles
      const playersData = data.dbResults && data.dbResults.length > 0 ? data.dbResults : data.players;
      
      navigate("/results", {
        replace: true,
        state: {
          roomId,
          players: playersData || [],
          winner: data.winner || null,
        },
      });
    });

    return () => {
      socket.off("new-question");
      socket.off("round-results");
      socket.off("game-over");
    };
  }, [socket, navigate, roomId, user?._id]);

  // Temporizador ⏱️
  useEffect(() => {
    if (!question || selected) return;
    if (timeLeft <= 0) {
      handleAnswer(null); // no respondió a tiempo
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, question, selected]);

  const handleAnswer = (option) => {
    if (!socket || !question) return;
    setSelected(option);

    socket.emit("player-answer", {
      roomId,
      playerId: user._id,
      answer: option,
      correctAnswer: question.correctAnswer, // el backend valida
    });
  };

  if (!question) {
    return (
      <div className="screen">
        <h1 className="question-title">Esperando pregunta...</h1>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="question-card">
        <h1 className="question-title">{question.text}</h1>
        <div className="timer">⏳ Tiempo: {timeLeft}s</div>

        <div className="options">
          {question.options.map((opt, i) => {
            const isCorrect =
              roundResults?.correctAnswer && opt === roundResults.correctAnswer;
            const isWrong =
              selected === opt && opt !== roundResults?.correctAnswer;

            return (
              <button
                key={i}
                className={`option-btn ${
                  isCorrect ? "correct" : isWrong ? "wrong" : ""
                }`}
                onClick={() => handleAnswer(opt)}
                disabled={!!selected}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {roundResults && (
          <div className="round-feedback">
            <p>✅ Respuesta correcta: {roundResults.correctAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
