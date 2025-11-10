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
  purchasedCourses: string[]; // Añadimos los cursos comprados
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Efecto para cargar el usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      // Asegurarse de que purchasedCourses exista, si no, inicializarlo
      if (!parsedUser.purchasedCourses) {
        parsedUser.purchasedCourses = [];
      }
      setUser(parsedUser);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: Omit<User, 'purchasedCourses'>) => {
    const newUser: User = {
      ...loggedInUser,
      purchasedCourses: [], // Inicializar con un array vacío al iniciar sesión
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

  // Nueva función para manejar la compra de un curso
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
          onPurchaseCourse={handlePurchaseCourse} // Pasamos la función de compra
        />
      );
    }

    return (
      <>
        <HomePage user={user} onLogout={handleLogout} onSelectCourse={handleSelectCourse} />
        <ChatWidget user={user} />
      </>
    );
  };

  return <div className="app-container">{renderContent()}</div>;
}

export default App;
