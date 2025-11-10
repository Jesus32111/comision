import { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import CourseDetailPage from './page/CoursedDetailPage';
import ChatWidget from './components/ChatWidget';
import './index.css';

type User = {
  nombre: string;
  email: string;
  carrera: string;
  purchasedCourses: string[];
  hasClaimedAnyGift: boolean; // Nueva propiedad para el premio único general
  obtainedCertificates: string[]; // Nueva propiedad para certificados obtenidos
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Efecto para cargar el usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      // Asegurarse de que purchasedCourses, hasClaimedAnyGift y obtainedCertificates existan
      if (!parsedUser.purchasedCourses) {
        parsedUser.purchasedCourses = [];
      }
      if (typeof parsedUser.hasClaimedAnyGift === 'undefined') {
        parsedUser.hasClaimedAnyGift = false; // Inicializar si no existe
      }
      if (!parsedUser.obtainedCertificates) {
        parsedUser.obtainedCertificates = []; // Inicializar si no existe
      }
      setUser(parsedUser);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: Omit<User, 'purchasedCourses' | 'hasClaimedAnyGift' | 'obtainedCertificates'>) => {
    const newUser: User = {
      ...loggedInUser,
      purchasedCourses: [], // Inicializar con un array vacío al iniciar sesión
      hasClaimedAnyGift: false, // Inicializar a false al iniciar sesión
      obtainedCertificates: [], // Inicializar con un array vacío al iniciar sesión
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser)); // Guardar usuario en localStorage
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedCourseId(null); // Limpiar el curso seleccionado al cerrar sesión
    localStorage.removeItem('user'); // Limpiar localStorage
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  // Función para manejar la compra de un curso (existente)
  const handlePurchaseCourse = (courseId: string) => {
    if (user && !user.purchasedCourses.includes(courseId)) {
      const updatedUser = {
        ...user,
        purchasedCourses: [...user.purchasedCourses, courseId],
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert(`¡Curso "${courseId}" comprado con éxito!`);
    }
  };

  // Nueva función para manejar el reclamo de un curso regalado
  const handleClaimGiftedCourse = (courseId: string) => {
    if (user) {
      let updatedUser = { ...user };

      // Si el curso no está comprado, añadirlo y marcar que ya reclamó un regalo
      if (!user.purchasedCourses.includes(courseId)) {
        updatedUser = {
          ...updatedUser,
          purchasedCourses: [...user.purchasedCourses, courseId],
          hasClaimedAnyGift: true, // Marcar que ya reclamó un regalo
        };
      } else if (!user.hasClaimedAnyGift) {
        // Si ya tiene el curso pero no ha marcado que reclamó un regalo (caso borde)
        updatedUser = {
          ...updatedUser,
          hasClaimedAnyGift: true,
        };
      }

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSelectedCourseId(courseId); // Navegar directamente al curso
    }
  };

  // Nueva función para manejar la obtención de un certificado
  const handleObtainCertificate = (courseId: string) => {
    if (user && !user.obtainedCertificates.includes(courseId)) {
      const updatedUser = {
        ...user,
        obtainedCertificates: [...user.obtainedCertificates, courseId],
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log(`Certificado obtenido para el curso: ${courseId}`);
    }
  };

  const handleBackToHome = () => {
    setSelectedCourseId(null);
  };

  const renderContent = () => {
    if (!user) {
      return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    }

    if (selectedCourseId) {
      return (
        <CourseDetailPage
          courseId={selectedCourseId}
          onBack={handleBackToHome}
          user={user}
          onPurchaseCourse={handlePurchaseCourse}
          onObtainCertificate={handleObtainCertificate} // Pasar la nueva prop
        />
      );
    }

    return (
      <>
        <HomePage
          user={user}
          onLogout={handleLogout}
          onSelectCourse={handleSelectCourse}
          onClaimGiftedCourse={handleClaimGiftedCourse}
        />
        <ChatWidget user={user} />
      </>
    );
  };

  return <div className="app-container">{renderContent()}</div>;
}

export default App;
