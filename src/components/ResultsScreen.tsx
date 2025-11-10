// ResultsScreen.tsx
import { Trophy, Share2 } from 'lucide-react';

interface ResultsScreenProps {
  score: number;
  onComplete: () => void; // <-- MODIFICADO: de onRestart a onComplete
}

export function ResultsScreen({ score, onComplete }: ResultsScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center bg-yellow-100 animate-bounce">
          <Trophy className="w-12 h-12 text-yellow-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Desafío Completado!</h2>
        <p className="text-gray-600 mb-4">
          ¡Felicidades por tu desempeño! Has completado el onboarding.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-600">Puntuación Total</p>
          <p className="text-4xl font-bold text-blue-600 mt-1">{score}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Tu Recompensa</h3>
          <p className="text-sm text-gray-600">
            {/* <-- TEXTO MODIFICADO --> */}
            Como recompensa, puedes reclamar un curso gratuito de nuestro catálogo disponible.
          </p>
          <a
            href="#cursos" // Puedes cambiar esto al enlace real
            className="text-blue-600 font-medium hover:underline mt-2 inline-block"
          >
            Ver cursos disponibles
          </a>
        </div>

        <div className="flex gap-4">
          {/* <-- BOTÓN MODIFICADO --> */}
          <button
            onClick={onComplete}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-colors"
          >
            Ir a la App
          </button>
          <button className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Compartir
          </button>
        </div>
      </div>
    </div>
  );
}