import { useState, useEffect, useMemo } from 'react';
import { courseDetails } from '../data/coursesDetails';
import { courses } from '../data/courses'; // Importamos la lista de cursos para obtener el costo
import './CourseDetailPage.css';

interface CourseDetailPageProps {
  courseId: string;
  onBack: () => void;
  user: {
    nombre: string;
    email: string;
    purchasedCourses: string[]; // Ahora el usuario tiene cursos comprados
  };
  onPurchaseCourse: (courseId: string) => void; // Nueva prop para comprar el curso
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  grade: number;
}

export default function CourseDetailPage({ courseId, onBack, user, onPurchaseCourse }: CourseDetailPageProps) {
  const courseDetail = courseDetails.find(c => c.id === courseId);
  const courseData = courses.find(c => c.id === courseId); // Obtenemos los datos del curso con el costo
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState('description');

  const progressStorageKey = `course_progress_${user.email}_${courseId}`;

  // Determinar si el curso ha sido comprado por el usuario actual
  const isCoursePurchased = useMemo(() => {
    return user.purchasedCourses.includes(courseId);
  }, [user.purchasedCourses, courseId]);

  useEffect(() => {
    if (courseDetail) {
      const savedProgress = localStorage.getItem(progressStorageKey);
      if (savedProgress) {
        setTasks(JSON.parse(savedProgress));
      } else {
        const initialTasks = courseDetail.tasks.map(task => ({ ...task, completed: false, grade: 0 }));
        setTasks(initialTasks);
      }
    }
  }, [courseDetail, progressStorageKey]);

  const handleToggleTask = (taskId: string) => {
    if (!isCoursePurchased) {
      alert('Debes comprar el curso para poder completar las tareas.');
      return;
    }
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed, grade: !task.completed ? 100 : 0 } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(progressStorageKey, JSON.stringify(updatedTasks));
    console.log(`Simulating POST /api/v1/tasks/${taskId}/complete for user ${user.email}`);
  };

  const { completedTasksCount, progressPercentage, finalGrade } = useMemo(() => {
    const completedCount = tasks.filter(task => task.completed).length;
    const percentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
    const totalGrade = tasks.reduce((sum, task) => sum + (task.completed ? 100 : 0), 0);
    const avgGrade = tasks.length > 0 ? totalGrade / tasks.length : 0;
    return {
      completedTasksCount: completedCount,
      progressPercentage: percentage,
      finalGrade: avgGrade,
    };
  }, [tasks]);

  if (!courseDetail || !courseData) {
    return (
      <div className="course-detail-container">
        <p>Curso no encontrado.</p>
        <button onClick={onBack} className="back-button-primary">Volver</button>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      <div className="course-detail-layout">

        <aside className="course-sidebar">
          <button onClick={onBack} className="back-button-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver a Cursos
          </button>
          
          <img src={courseDetail.headerImage} alt={courseDetail.title} className="course-sidebar-image" />
          
          <h1>{courseDetail.title}</h1>

          <div className="course-sidebar-meta">
            <div className="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Docente: {courseDetail.instructor}</span>
            </div>
            <div className="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>Idioma: Español</span>
            </div>
            <div className="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span>Plataforma: Web</span>
            </div>
          </div>

          {!isCoursePurchased && (
            <div className="purchase-callout">
              <p>Este curso tiene un costo de <strong>${courseData.cost.toFixed(2)}</strong>.</p>
              <button className="purchase-button" onClick={() => onPurchaseCourse(courseId)}>
                Comprar Curso
              </button>
            </div>
          )}
        </aside>

        <div className="course-main-content">
          
          <div className="progress-bar-section-wrapper">
            <div className="progress-bar-section">
              <h3>Progreso del Curso</h3>
              <div className="progress-bar-wrapper">
                <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <span>{completedTasksCount} de {tasks.length} tareas completadas ({Math.round(progressPercentage)}%)</span>
            </div>
          </div>
          
          <nav className="course-tabs">
            <button 
              className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              Descripción
            </button>
            <button 
              className={`tab-button ${activeTab === 'tasks' ? 'active' : ''} ${!isCoursePurchased ? 'disabled' : ''}`}
              onClick={() => isCoursePurchased && setActiveTab('tasks')}
              disabled={!isCoursePurchased}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
              Tareas
            </button>
            <button 
              className={`tab-button ${activeTab === 'grades' ? 'active' : ''} ${!isCoursePurchased ? 'disabled' : ''}`}
              onClick={() => isCoursePurchased && setActiveTab('grades')}
              disabled={!isCoursePurchased}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V21c0 .8.7 1.5 1.5 1.5h11c.8 0 1.5-.7 1.5-1.5v-11L15.5 2z"/><path d="M15 2v5h5"/><path d="M10 16s.8-1 2-1 2 1 2 1"/><path d="M10 12s.8-1 2-1 2 1 2 1"/></svg>
              Notas
            </button>
          </nav>

          <main className="course-content-grid">
            <div className="tab-content-wrapper" key={activeTab}>
              
              {activeTab === 'description' && (
                <section className="course-section description-section">
                  <h2>Descripción del Curso</h2>
                  <p>{courseDetail.longDescription}</p>
                  
                  <h3>¿Qué aprenderás?</h3>
                  <br />
                  <ul className="learning-objectives">
                    {courseDetail.learningObjectives.map((obj, index) => <li key={index}>{obj}</li>)}
                  </ul>
                </section>
              )}
              
              {activeTab === 'tasks' && (
                <section className="course-section tasks-section">
                  <h2>Tareas del Curso</h2>
                  {!isCoursePurchased ? (
                    <p className="locked-message">Este curso está bloqueado. Compra el curso para acceder a las tareas.</p>
                  ) : (
                    <ul className="task-list">
                      {tasks.map(task => (
                        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                          <label>
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleTask(task.id)}
                              disabled={!isCoursePurchased} // Deshabilitar si no está comprado
                            />
                            <span className="custom-checkbox"></span>
                            {task.title}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}
              {activeTab === 'grades' && (
                <section className="course-section grades-section">
                  <h2>Notas del Curso</h2>
                  {!isCoursePurchased ? (
                    <p className="locked-message">Este curso está bloqueado. Compra el curso para ver tus notas.</p>
                  ) : (
                    <div className="grades-summary">
                      <div className="final-grade-wrapper">
                        <span>Nota Final</span>
                        <span className="final-grade-value">{finalGrade.toFixed(0)}</span>
                      </div>
                      <ul className="grades-list">
                        {tasks.map(task => (
                          <li key={task.id}>
                            <span>{task.title}</span>
                            <span className={`grade ${task.completed ? 'grade-approved' : 'grade-pending'}`}>{task.completed ? '100' : '0'}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
