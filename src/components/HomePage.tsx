import { useState, useRef, useEffect } from 'react';
import CoursesSection from './CoursesSection';
import TriviaGame from './TriviaGame'; // Importar el nuevo componente TriviaGame
import './HomePage.css';

interface HomePageProps {
  user: {
    nombre: string;
    email:string;
    carrera: string;
  };
  onLogout: () => void;
  onSelectCourse: (courseId: string) => void; // Nueva prop
}

export default function HomePage({ user, onLogout, onSelectCourse }: HomePageProps) {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showTriviaModal, setShowTriviaModal] = useState(false);
  const [isTriviaActive, setIsTriviaActive] = useState(false); // Nuevo estado para controlar si la trivia está activa
  const [profileImage, setProfileImage] = useState('https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  const profileCardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triviaModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileCardRef.current && !profileCardRef.current.contains(event.target as Node)) {
        setShowProfileCard(false);
      }
      // Cerrar modal de trivia si se hace clic fuera y no es la trivia activa
      if (triviaModalRef.current && !triviaModalRef.current.contains(event.target as Node) && !isTriviaActive) {
        setShowTriviaModal(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileCardRef, triviaModalRef, isTriviaActive]);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartTrivia = () => {
    setIsTriviaActive(true);
  };

  const handleCloseTriviaModal = () => {
    setShowTriviaModal(false);
    setIsTriviaActive(false); // Resetear el estado de la trivia
  };

  const handleTriviaGameComplete = (won: boolean) => {
    if (won) {
      alert('¡Felicidades! Has ganado un curso gratis. Revisa tu perfil.');
      // Aquí podrías añadir lógica para "otorgar" un curso gratis al usuario
    } else {
      alert('¡Sigue practicando! No has ganado un curso gratis esta vez.');
    }
    handleCloseTriviaModal();
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="header-left">
          <img src="/assets/logo.png" alt="Crece +Perú Logo" className="homepage-logo" />
          <button className="gift-button" onClick={() => setShowTriviaModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
            Regalo
          </button>
        </div>
        <nav className="homepage-nav">
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#cursos">Cursos</a></li>
            <li><a href="#mi-progreso" className="nav-link-progress">Mi Progreso</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </nav>
        <div className="user-actions">
          <div className="user-info-trigger" onClick={() => setShowProfileCard(!showProfileCard)}>
            <span>Hola, {user.nombre.split(' ')[0]}</span>
            {showProfileCard && (
              <div className="profile-card" ref={profileCardRef}>
                <div className="profile-card-header">
                  <div className="profile-card-image-container" onClick={handleProfileImageClick}>
                    <img src={profileImage} alt="Profile" className="profile-card-image" />
                    <div className="profile-image-overlay">
                      <span>Subir</span>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <h3>{user.nombre}</h3>
                </div>
                <div className="profile-card-details">
                  <p><strong>Nombre completo:</strong> {user.nombre}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Carrera:</strong> {user.carrera}</p>
                </div>
              </div>
            )}
          </div>
          <button onClick={onLogout} className="logout-button">
            Cerrar Sesión
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-icon">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>
      <main className="homepage-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Desbloquea tu Potencial con Crece +Perú</h1>
            <p>Accede a cursos de certificación de alta calidad y transforma tu futuro profesional.</p>
            <button className="hero-cta-button">Explorar Cursos</button>
          </div>
        </section>
        <CoursesSection onCourseClick={onSelectCourse} /> {/* Pasar la función */}
      </main>

      {/* Trivia Modal */}
      {showTriviaModal && (
        <div className="trivia-modal-overlay">
          {!isTriviaActive ? (
            <div className="trivia-modal-content" ref={triviaModalRef}>
              <button className="trivia-modal-close" onClick={handleCloseTriviaModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <div className="trivia-modal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"></path>
                  <path d="M22 12h-4l-3 9L11 3l-3 9H2"></path>
                </svg>
              </div>
              <h2>¡Empieza la Trivia!</h2>
              <p>Demuestra tus conocimientos y si ganas, ¡te llevarás un curso gratis!</p>
              <button className="trivia-start-button" onClick={handleStartTrivia}>
                Empezar
              </button>
            </div>
          ) : (
            <TriviaGame onClose={handleCloseTriviaModal} onGameComplete={handleTriviaGameComplete} />
          )}
        </div>
      )}
    </div>
  );
}
