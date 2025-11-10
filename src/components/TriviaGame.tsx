import React, { useState, useEffect, useCallback } from 'react';
import { courses } from '../data/courses'; // Importar datos de cursos
import type { Course } from '../data/courses';
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
        question: "¿Cuál es el documento principal que envías al postular a un trabajo?",
        options: ["DNI", "Currículum Vitae (CV)", "Carta de recomendación", "Contrato anterior"],
        correctAnswer: "Currículum Vitae (CV)",
      },
      {
        question: "¿Cómo se llama la reunión donde un empleador te conoce en persona o virtualmente?",
        options: ["Examen final", "Reunión de equipo", "Entrevista de trabajo", "Capacitación"],
        correctAnswer: "Entrevista de trabajo",
      },
      {
        question: "Generalmente, ¿cómo deberías vestir para una entrevista de trabajo corporativa?",
        options: ["Ropa deportiva", "Pijama", "Formal o semi-formal", "Ropa de playa"],
        correctAnswer: "Formal o semi-formal",
      },
    ],
  },
  {
    name: "Intermedio",
    questions: [
      {
        question: "¿Cuál es la red social profesional más popular para buscar empleo y hacer networking?",
        options: ["Facebook", "TikTok", "LinkedIn", "Instagram"],
        correctAnswer: "LinkedIn",
      },
      {
        question: "¿Qué información personal generalmente NO es necesario incluir en tu CV?",
        options: ["Experiencia laboral", "Educación", "Estado civil o religión", "Datos de contacto"],
        correctAnswer: "Estado civil o religión",
      },
      {
        question: "El método 'STAR' (Situación, Tarea, Acción, Resultado) se usa para responder preguntas de...",
        options: ["Comportamiento", "Técnicas", "Sueldo", "Conocimiento general"],
        correctAnswer: "Comportamiento",
      },
    ],
  },
  {
    name: "Avanzado",
    questions: [
      {
        question: "La 'comunicación asertiva' y la 'gestión del tiempo' son ejemplos de...",
        options: ["Habilidades duras (Hard skills)", "Habilidades blandas (Soft skills)", "Habilidades técnicas", "Requisitos legales"],
        correctAnswer: "Habilidades blandas (Soft skills)",
      },
      {
        question: "¿A qué se refiere el término 'salario bruto'?",
        options: ["El salario después de impuestos", "El salario total antes de impuestos y deducciones", "El salario más bonificaciones", "El salario mínimo"],
        correctAnswer: "El salario total antes de impuestos y deducciones",
      },
      {
        question: "¿Qué es el 'mercado laboral oculto'?",
        options: ["Trabajos ilegales", "Trabajos solo para extranjeros", "Vacantes que no se publican y se llenan por contactos", "Trabajos de medio tiempo"],
        correctAnswer: "Vacantes que no se publican y se llenan por contactos",
      },
    ],
  },
];

interface TriviaGameProps {
  onClose: () => void;
  onGameComplete: (won: boolean) => void;
  onClaimGiftedCourse: (courseId: string) => void;
  userPurchasedCourses: string[];
  hasClaimedAnyGift: boolean; // Nueva prop para el premio único general
}

// Umbral para ganar el juego (70% de aciertos)
const WIN_THRESHOLD_PERCENTAGE = 0.7;
// Umbral para recibir el curso de regalo (3 aciertos)
const GIFT_COURSE_THRESHOLD = 3; // Ahora 3 aciertos para ganar un curso

export default function TriviaGame({ onClose, onGameComplete, onClaimGiftedCourse, userPurchasedCourses, hasClaimedAnyGift }: TriviaGameProps) {
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

  // Función para reiniciar el juego
  const handleRestartGame = useCallback(() => {
    setCurrentLevelIndex(0);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setGameFinished(false);
    setTimerKey(prevKey => prevKey + 1); // Asegura que la barra de tiempo se reinicie visualmente
  }, []);

  // Effect for game completion
  useEffect(() => {
    if (gameFinished) {
      onGameComplete(score >= winThreshold);
    }
  }, [gameFinished, score, winThreshold, onGameComplete]);

  const handleSubmitAnswer = useCallback((timedOut: boolean = false) => {
    if (selectedOption === null && !timedOut) return;

    setShowResult(true);
    if (selectedOption === currentQuestion?.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  }, [selectedOption, currentQuestion]);

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
  }, [currentQuestion, currentQuestionIndex, currentLevelIndex, showResult, gameFinished, handleSubmitAnswer]);

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
    const hasWonGame = score >= winThreshold; // Ganar el juego completo (ej. 70% de aciertos)
    const hasWonCourse = score >= GIFT_COURSE_THRESHOLD; // Ganar un curso (3 o más aciertos)
    const hasAlreadyClaimedGiftedCourse = userPurchasedCourses.includes(giftedCourse?.id || ''); // Verificar si ya tiene el curso

    if (!hasWonCourse) {
      return (
        <div className="trivia-nogift-overlay">
          <div className="trivia-nogift-content">
            <button className="trivia-nogift-close" onClick={onClose} aria-label="Cerrar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="trivia-nogift-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            </div>

            <h2 className="trivia-nogift-title">¡No has ganado un curso!</h2>
            <p className="trivia-nogift-message">
              Necesitas al menos <strong className="text-primary">{GIFT_COURSE_THRESHOLD} aciertos</strong> para obtener un curso gratis.
            </p>
            <p className="trivia-nogift-message-secondary">
              ¡Pero no te desanimes!
            </p>
            <p className="trivia-nogift-message-tertiary">
              ¿Te gustaría volver a intentarlo y demostrar tu conocimiento?
            </p>

            <div className="trivia-nogift-actions">
              <button className="trivia-nogift-button trivia-nogift-button-restart" onClick={handleRestartGame}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.5M22 12.5a10 10 0 0 1-18.8 4.5"/></svg>
                Volver a intentar
              </button>
              <button className="trivia-nogift-button trivia-nogift-button-close" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Lógica para cuando el usuario SÍ ha ganado un curso (score >= GIFT_COURSE_THRESHOLD)
    if (hasClaimedAnyGift) {
      // Si ya ha reclamado CUALQUIER regalo antes, no puede ganar otro.
      return (
        <div className="trivia-nogift-overlay">
          <div className="trivia-nogift-content">
            <button className="trivia-nogift-close" onClick={onClose} aria-label="Cerrar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="trivia-nogift-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>

            <h2 className="trivia-nogift-title">¡Felicidades!</h2>
            <p className="trivia-nogift-message">
              Has demostrado un gran conocimiento, pero ya has reclamado tu premio único.
            </p>
            <p className="trivia-nogift-message-secondary">
              ¡Gracias por participar!
            </p>

            <div className="trivia-nogift-actions">
              <button className="trivia-nogift-button trivia-nogift-button-close" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Si ganó un curso y NO ha reclamado NINGÚN regalo antes
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
        <h2>{hasWonGame ? '¡Felicidades, has ganado el juego!' : '¡Lo siento, no has ganado el juego!'}</h2>
        <p>Has acertado {score} de {totalQuestions} preguntas.</p>

        {hasWonCourse && giftedCourse && !hasAlreadyClaimedGiftedCourse ? (
          // Mostrar tarjeta de regalo si ganó, el curso existe y no ha sido reclamado
          <>
            <p className="trivia-win-message">¡Por tu excelente desempeño, has ganado un curso gratis!</p>
            <div className="trivia-gift-card">
              <img src={giftedCourse.imageUrl} alt={giftedCourse.title} className="trivia-gift-card-image" />
              <div className="trivia-gift-card-content">
                <h3 className="trivia-gift-card-title">{giftedCourse.title}</h3>
                <p className="trivia-gift-card-description">{giftedCourse.description}</p>
                <button
                  className="trivia-gift-card-button"
                  onClick={() => {
                    onClaimGiftedCourse(giftedCourse.id); // Llama a la nueva prop
                    onClose(); // Cierra el modal del juego después de reclamar
                  }}
                >
                  Reclamar Curso
                </button>
              </div>
            </div>
            <button className="trivia-start-button" onClick={onClose}>
              Cerrar
            </button>
          </>
        ) : hasWonCourse && giftedCourse && hasAlreadyClaimedGiftedCourse ? (
          // Mostrar mensaje si ganó, el curso existe, pero ya lo tiene
          <>
            <p className="trivia-win-message">¡Felicidades! Ya tienes este curso en tu biblioteca.</p>
            <p className="trivia-gift-card-description">Puedes acceder a él en cualquier momento desde tu perfil.</p>
            <button
              className="trivia-gift-card-button"
              onClick={() => {
                onClaimGiftedCourse(giftedCourse.id); // Navegar al curso incluso si ya lo tiene
                onClose();
              }}
            >
              Ir al Curso
            </button>
            <button className="trivia-start-button" onClick={onClose}>
              Cerrar
            </button>
          </>
        ) : (
          // Fallback si hasWonCourse es true pero no hay giftedCourse o otros casos
          <button className="trivia-start-button" onClick={onClose}>
            Cerrar
          </button>
        )}
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
