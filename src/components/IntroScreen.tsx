import { Target } from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center bg-blue-100">
          <Target className="w-12 h-12 text-blue-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">Desafío de Razonamiento Profesional</h2>
        <p className="text-gray-600 mb-8">
          Pon a prueba tu lógica, análisis y toma de decisiones en 3 niveles de dificultad.
          Responde rápido para ganar puntos extra y desbloquear bonificaciones por racha.
        </p>

        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
        >
          Comenzar Desafío
        </button>
      </div>
    </div>
  );
}