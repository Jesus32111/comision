// OnboardingForm.tsx
import { useState } from 'react';
import './OnboardingForm.css'; // Crearemos este CSS

interface OnboardingData {
  universidad: string;
  habilidades: string;
  cv?: File | null;
}

interface OnboardingFormProps {
  onSubmit: (data: OnboardingData) => void;
  nombreUsuario: string;
}

export default function OnboardingForm({ onSubmit, nombreUsuario }: OnboardingFormProps) {
  const [formData, setFormData] = useState<OnboardingData>({
    universidad: '',
    habilidades: '',
    cv: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.universidad.trim()) {
      newErrors.universidad = 'La universidad es requerida';
    }
    if (!formData.habilidades.trim()) {
      newErrors.habilidades = 'Las habilidades son requeridas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, cv: e.target.files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    // En una app real, aquí subirías el CV y luego llamarías a onSubmit
    console.log('Datos de Onboarding:', formData);
    onSubmit(formData);
  };

  return (
    <div className="onboarding-form-container">
      <h2 className="auth-title">¡Casi listo, {nombreUsuario.split(' ')[0]}!</h2>
      <p className="auth-subtitle">
        Completa tu perfil para continuar.
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <input
            type="text"
            name="universidad"
            placeholder="Universidad donde estudias"
            value={formData.universidad}
            onChange={handleChange}
            className={errors.universidad ? 'error' : ''}
          />
          {errors.universidad && <span className="error-message">{errors.universidad}</span>}
        </div>

        <div className="form-group">
          <textarea
            name="habilidades"
            placeholder="Tus habilidades (ej. React, Liderazgo, Excel)"
            value={formData.habilidades}
            onChange={handleChange}
            className={errors.habilidades ? 'error' : ''}
          />
          {errors.habilidades && <span className="error-message">{errors.habilidades}</span>}
        </div>

        <div className="form-group file-input-group">
          <label htmlFor="cv-upload">Sube tu CV (Opcional)</label>
          <input
            type="file"
            id="cv-upload"
            name="cv"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          {formData.cv && <span className="file-name">{formData.cv.name}</span>}
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Siguiente: Iniciar Juego'}
        </button>
      </form>
    </div>
  );
}