import React, { useState, useEffect, useCallback } from 'react';
import { courses, Course } from '../data/courses'; // Importar datos de cursos
import './TriviaGame.css'; // Importar estilos específicos del juego

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Level {
  name: string;
  questions: Question[];
}

const triviaLevels: Level[] = [
  {
    name: "Fácil",
    questions: [
      {
        question: "¿Cuál es la capital de Perú?",
        options: ["Cusco", "Arequipa", "Lima", "Trujillo"],
        correctAnswer: "Lima",
      },
      {
        question: "¿Qué animal es el símbolo nacional de Perú?",
        options: ["Llama", "Cóndor", "Vicuña", "Alpaca"],
        correctAnswer: "Vicuña",
      },
      {
        question: "¿Qué civilización construyó Machu Picchu?",
        options: ["Moche", "Nazca", "Inca", "Chimú"],
        correctAnswer: "Inca",
      },
    ],
  },
  {
    name: "Intermedio",
    questions: [
      {
        question: "¿En qué año se proclamó la Independencia del Perú?",
        options: ["1820", "1821", "1822", "1824"],
        correctAnswer: "1821",
      },
      {
        question: "¿Cuál es el río más largo del Perú?",
        options: ["Ucayali", "Marañón", "Amazonas", "Madre de Dios"],
        correctAnswer: "Ucayali",
      },
      {
        question: "¿Qué desierto se encuentra en la costa sur de Perú?",
        options: ["Sechura", "Atacama", "Ica", "Paracas"],
        correctAnswer: "Ica",
      },
    ],
  },
  {
    name: "Avanzado",
    questions: [
      {
        question: "¿Quién fue el último inca de Vilcabamba?",
        options: ["Atahualpa", "Manco Inca", "Túpac Amaru I", "Sayri Túpac"],
        correctAnswer: "Túpac Amaru I",
      },
      {
        question: "¿Qué batalla selló la independencia definitiva del Perú?",
        options: ["Batalla de Junín", "Batalla de Ayacucho", "Batalla de Tarapacá", "Batalla de Miraflores"],
        correctAnswer: "Batalla de Ayacucho",
      },
      {
        question: "¿Cuál es el nombre del tratado que puso fin a la Guerra del Pacífico?",
        options: ["Tratado de Ancón", "Tratado de Lima", "Tratado de Paucarpata", "Tratado de Guayaquil"],
        correctAnswer: "Tratado de Ancón",
      },
    ],
  },
];

interface TriviaGameProps {
  onClose: () => void;
  onGameComplete: (won: boolean) => void;
}

// Umbral para ganar el juego (70% de aciertos)
const WIN_THRESHOLD_PERCENTAGE = 0.7;
// Umbral para recibir el curso de regalo (5 aciertos)
const GIFT_COURSE_THRESHOLD = 5;

export default function TriviaGame({ onClose, onGameComplete }: TriviaGameProps) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0); // Contador de aciertos
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // Key to reset CSS animation

  const currentLevel = triviaLevels[currentLevelIndex];
  const currentQuestion = currentLevel?.questions[currentQuestionIndex];

  const totalQuestions = triviaLevels.reduce((acc, level) => acc + level.questions.length, 0);
  const winThreshold = Math.ceil(totalQuestions * WIN_THRESHOLD_PERCENTAGE);

  // Seleccionar un curso para regalar (ej. el primero de la lista)
  const giftedCourse: Course | undefined = courses[0]; // "Liderazgo y Gestión de Equipos"

  // Effect for game completion
  useEffect(() => {
    if (gameFinished) {
      onGameComplete(score >= winThreshold);
    }
  }, [gameFinished, score, winThreshold, onGameComplete]);

  // Effect for timer logic
  useEffect(() => {
    if (!currentQuestion || showResult || gameFinished) {
      return;
    }

    const timer = setTimeout(() => {
      if (!showResult) {
        handleSubmitAnswer(true); // Submit automatically, marking as incorrect if no option selected
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [currentQuestion, currentQuestionIndex, currentLevelIndex, showResult, gameFinished, handleSubmitAnswer]); // Added handleSubmitAnswer to dependencies

  // Reset timer key when question changes
  useEffect(() => {
    if (currentQuestion) {
      setTimerKey(prevKey => prevKey + 1);
      setSelectedOption(null); // Clear selection for new question
      setShowResult(false); // Hide result for new question
    }
  }, [currentQuestion, currentQuestionIndex, currentLevelIndex]);


  const handleOptionClick = (option: string) => {
    if (!showResult) {
      setSelectedOption(option);
    }
  };

  const handleSubmitAnswer = useCallback((timedOut: boolean = false) => {
    if (selectedOption === null && !timedOut) return;

    setShowResult(true);
    if (selectedOption === currentQuestion?.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  }, [selectedOption, currentQuestion]);

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);

    if (currentQuestionIndex < currentLevel.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else if (currentLevelIndex < triviaLevels.length - 1) {
      setCurrentLevelIndex(prevIndex => prevIndex + 1);
      setCurrentQuestionIndex(0); // Reset question index for new level
    } else {
      setGameFinished(true);
    }
  };

  const getOptionClassName = (option: string) => {
    if (!showResult) {
      return selectedOption === option ? 'trivia-option selected' : 'trivia-option';
    }
    // After showing result
    if (option === currentQuestion?.correctAnswer) {
      return 'trivia-option correct';
    }
    if (selectedOption === option && selectedOption !== currentQuestion?.correctAnswer) {
      return 'trivia-option incorrect';
    }
    return 'trivia-option disabled';
  };

  if (gameFinished) {
    const hasWonGame = score >= winThreshold;
    const hasWonCourse = score >= GIFT_COURSE_THRESHOLD;

    return (
      <div className="trivia-modal-content trivia-game-finished">
        <button className="trivia-modal-close" onClick={onClose} aria-label="Cerrar juego de trivia">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="trivia-modal-icon">
          {hasWonGame ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          )}
        </div>
        <h2>{hasWonGame ? '¡Felicidades, has ganado!' : '¡Lo siento, no has ganado!'}</h2>
        <p>Has acertado {score} de {totalQuestions} preguntas.</p>

        {hasWonCourse && giftedCourse ? (
          <>
            <p className="trivia-win-message">¡Has respondido {score} preguntas correctamente y has ganado un curso gratis!</p>
            <div className="trivia-gift-card">
              <img src={giftedCourse.imageUrl} alt={giftedCourse.title} className="trivia-gift-card-image" />
              <div className="trivia-gift-card-content">
                <h3 className="trivia-gift-card-title">{giftedCourse.title}</h3>
                <p className="trivia-gift-card-description">{giftedCourse.description}</p>
                <button className="trivia-gift-card-button" onClick={() => alert(`¡Felicidades! Has reclamado el curso: ${giftedCourse.title}`)}>
                  Reclamar Curso
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="trivia-win-message">Sigue practicando para ganar un curso gratis. Necesitas {GIFT_COURSE_THRESHOLD} aciertos.</p>
        )}

        <button className="trivia-start-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="trivia-modal-content">
        <p>Cargando trivia...</p>
      </div>
    );
  }

  return (
    <div className="trivia-modal-content trivia-game-active">
      <button className="trivia-modal-close" onClick={onClose} aria-label="Cerrar juego de trivia">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div className="trivia-progress">
        <span>Nivel: {currentLevel.name} ({currentLevelIndex + 1}/{triviaLevels.length}) | Pregunta: {currentQuestionIndex + 1}/{currentLevel.questions.length}</span>
        <span className="trivia-score-counter">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Aciertos: {score}
        </span>
      </div>

      {/* Timer Bar */}
      <div className="trivia-timer-bar-wrapper" key={timerKey}>
        <div className="trivia-timer-bar-fill"></div>
      </div>

      <h3 className="trivia-question">{currentQuestion.question}</h3>
      <div className="trivia-options-container">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClassName(option)}
            onClick={() => handleOptionClick(option)}
            disabled={showResult}
            aria-pressed={selectedOption === option}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="trivia-actions">
        {!showResult ? (
          <button
            className="trivia-submit-button"
            onClick={() => handleSubmitAnswer()}
            disabled={selectedOption === null}
          >
            Enviar Respuesta
          </button>
        ) : (
          <button className="trivia-next-button" onClick={handleNext}>
            {currentQuestionIndex < currentLevel.questions.length - 1 || currentLevelIndex < triviaLevels.length - 1
              ? 'Siguiente Pregunta'
              : 'Ver Resultados'}
          </button>
        )}
      </div>
    </div>
  );
}
