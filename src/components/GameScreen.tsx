// GameScreen.tsx
// (Tus imports ... )
import { useState, useEffect, useCallback } from 'react';
// import { supabase, Question } from '../lib/supabase'; // <-- ELIMINADO
import { Question, Profile } from '../types/gameTypes'; // <-- AÑADIDO
import { QuestionScreen } from './QuestionScreen';
import { GameHeader } from './GameHeader';
import { Loader2, Zap, Trophy } from 'lucide-react';
import { STATIC_QUESTIONS } from '../constants/questionsData';

// Constantes del juego
const LEVELS = ['Básico', 'Intermedio', 'Avanzado'];
const QUESTIONS_PER_LEVEL = 3; // <-- MODIFICADO
const QUESTION_TIME_LIMIT = 20;
// ... (resto de constantes)
const BASE_POINTS = 100;
const SPEED_BONUS_THRESHOLD = QUESTION_TIME_LIMIT / 2;
const SPEED_BONUS_POINTS = 50;
const STREAK_BONUSES = {
  3: { points: 150, message: '¡Racha Rápida!' },
  5: { points: 300, message: '¡Racha Profesional!' },
  10: { points: 500, message: '¡Mega Bonus!' },
};

interface GameScreenProps {
  onGameEnd: (score: number) => void;
  initialLevelIndex: number;
}

export function GameScreen({ onGameEnd, initialLevelIndex }: GameScreenProps) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(initialLevelIndex);
  const [levelQuestions, setLevelQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const currentLevelName = LEVELS[currentLevelIndex];

  const loadQuestionsForLevel = useCallback((levelIndex: number) => {
    setLoading(true);

    const questionsForLevel = STATIC_QUESTIONS
      .filter(q => q.level === levelIndex + 1);
    
    // Barajar y tomar la cantidad de preguntas
    const shuffledQuestions = questionsForLevel
      .sort(() => Math.random() - 0.5)
      .slice(0, QUESTIONS_PER_LEVEL); // <-- AÑADIDO: Tomar solo 3

    if (shuffledQuestions.length === 0) {
      console.warn(`No questions found for Level ${levelIndex + 1} (${LEVELS[levelIndex]})`);
    }

    setLevelQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0); // Asegurarse de empezar de 0
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQuestionsForLevel(currentLevelIndex);
  }, [currentLevelIndex, loadQuestionsForLevel]);

  const handleAnswer = (isCorrect: boolean, timeTaken: number) => {
    setShowFeedback(true);

    if (isCorrect) {
      // (Lógica de puntos existente - sin cambios)
      const questionBasePoints = levelQuestions[currentQuestionIndex]?.points || BASE_POINTS;
      let pointsEarned = questionBasePoints;
      let bonusMessage = '';

      if (timeTaken < SPEED_BONUS_THRESHOLD) {
        pointsEarned += SPEED_BONUS_POINTS;
        bonusMessage = '¡Bono Rápido!';
      }
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (STREAK_BONUSES[newStreak as keyof typeof STREAK_BONUSES]) {
        const streakBonus = STREAK_BONUSES[newStreak as keyof typeof STREAK_BONUSES];
        pointsEarned += streakBonus.points;
        bonusMessage = streakBonus.message;
      }
      setScore((prevScore) => prevScore + pointsEarned);
      setFeedbackMessage(`+${pointsEarned} puntos. ${bonusMessage}`);

      // Lógica de avance
      setTimeout(() => {
        setShowFeedback(false);
        if (currentQuestionIndex < levelQuestions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
          // Fin del nivel
          if (currentLevelIndex < LEVELS.length - 1) {
            setCurrentLevelIndex((prevLevel) => prevLevel + 1);
            // El useEffect se encargará de cargar el nuevo nivel
          } else {
            onGameEnd(score);
          }
        }
      }, 2000);

    } else {
      // <-- INICIO DE MODIFICACIÓN: Lógica de fallo
      setStreak(0);
      setFeedbackMessage('Respuesta incorrecta. Reiniciando nivel...');

      setTimeout(() => {
        setShowFeedback(false);
        setCurrentQuestionIndex(0); // Reinicia el índice de la pregunta
        // Opcional: recargar (barajar) las preguntas del nivel
        // loadQuestionsForLevel(currentLevelIndex); 
        // Por ahora, solo reiniciamos el índice, es más simple.
      }, 2500);
      // <-- FIN DE MODIFICACIÓN
    }
  };

  // (Resto del componente GameScreen.tsx - sin cambios)
  // ... (if (loading) ... )
  // ... (if (levelQuestions.length === 0) ... )
  // ... (return ( ... )

  if (loading) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
         <div className="text-center">
           <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
           <p className="text-gray-600 font-medium">Cargando preguntas de nivel {currentLevelName}...</p>
         </div>
       </div>
     );
   }
 
   if (levelQuestions.length === 0) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
         <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-200">
           <Trophy className="w-12 h-12 text-red-500 mx-auto mb-3" />
           <h3 className="text-xl font-bold text-gray-800 mb-2">¡Atención! Sin Preguntas</h3>
           <p className="text-gray-600">No se encontraron preguntas estáticas para el Nivel {currentLevelIndex + 1} ({currentLevelName}).</p>
           <p className="text-sm text-gray-500 mt-2">Asegúrate de que STATIC_QUESTIONS contenga datos para el nivel {currentLevelIndex + 1}.</p>
           <button 
             onClick={() => onGameEnd(score)}
             className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
           >
             Terminar Juego Ahora
           </button>
         </div>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-gray-50">
       <GameHeader profile={{ total_score: score, current_level: currentLevelIndex + 1, username: 'Jugador Anónimo', id: 'anon-user-123', created_at: '', updated_at: '' }} />
 
       <div className="max-w-5xl mx-auto px-4 py-8">
         <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-gray-100">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-indigo-100 shadow-inner">
                 <Zap className="w-7 h-7 text-indigo-600" />
               </div>
               <div>
                 <h2 className="text-2xl font-extrabold text-gray-900">Nivel {currentLevelName}</h2>
                 <p className="text-md text-gray-500">
                   Pregunta {currentQuestionIndex + 1} de {levelQuestions.length}
                 </p>
               </div>
             </div>
 
             <div className="flex items-center gap-2 px-5 py-2 bg-yellow-50 border border-yellow-200 rounded-full shadow-md">
               <Trophy className="w-5 h-5 text-yellow-600 fill-yellow-300" />
               <span className="text-lg font-bold text-gray-800">{score} pts</span>
             </div>
           </div>
 
           <div className="w-full h-3 bg-gray-200 rounded-full mb-10 overflow-hidden">
             <div
               className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-400 to-indigo-600"
               style={{
                 width: `${((currentQuestionIndex + 1) / levelQuestions.length) * 100}%`,
               }}
             />
           </div>
 
           <QuestionScreen
             question={levelQuestions[currentQuestionIndex]}
             onAnswer={handleAnswer}
             timeLimit={QUESTION_TIME_LIMIT}
             showFeedback={showFeedback}
             feedbackMessage={feedbackMessage}
             streak={streak}
           />
         </div>
       </div>
     </div>
   );
}