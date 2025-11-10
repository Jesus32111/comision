export interface CourseDetail {
  id: string;
  title: string;
  headerImage: string;
  longDescription: string;
  instructor: string;
  learningObjectives: string[];
  tasks: { id: string; title: string }[];
}

export const courseDetails: CourseDetail[] = [
  {
    id: '1',
    title: 'Liderazgo y Gestión de Equipos',
    headerImage: 'https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    longDescription: 'Este curso está diseñado para desarrollar las competencias clave necesarias para liderar, motivar y gestionar equipos de manera efectiva. Aprenderás a adaptar tu estilo de liderazgo a diferentes situaciones, a comunicarte de manera asertiva y a fomentar un ambiente de colaboración y alto rendimiento.',
    instructor: 'Elena Torres',
    learningObjectives: [
      'Identificar y aplicar diferentes estilos de liderazgo.',
      'Desarrollar habilidades de comunicación efectiva y feedback constructivo.',
      'Aprender técnicas de motivación y gestión de conflictos.',
      'Fomentar la colaboración y el trabajo en equipo.',
      'Establecer y medir KPIs para el rendimiento del equipo.'
    ],
    tasks: [
      { id: '1-1', title: 'Análisis de caso: Estilos de Liderazgo' },
      { id: '1-2', title: 'Ejercicio práctico: Sesión de Feedback' },
      { id: '1-3', title: 'Plan de desarrollo de equipo' },
      { id: '1-4', title: 'Simulación de resolución de conflictos' },
      { id: '1-5', title: 'Proyecto final: Estrategia de Liderazgo' }
    ]
  },
  {
    id: '2',
    title: 'Marketing Digital Avanzado',
    headerImage: 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    longDescription: 'Sumérgete en el ecosistema del marketing digital y domina las herramientas y estrategias que impulsan el crecimiento en el entorno online. Desde SEO y SEM hasta marketing de contenidos y analítica web, este curso te proporcionará una visión 360° para crear y ejecutar campañas exitosas.',
    instructor: 'Carlos Vega',
    learningObjectives: [
      'Optimizar sitios web para motores de búsqueda (SEO).',
      'Crear y gestionar campañas de publicidad en Google Ads (SEM).',
      'Desarrollar una estrategia de marketing de contenidos efectiva.',
      'Utilizar las redes sociales para construir una comunidad y generar leads.',
      'Analizar métricas clave y tomar decisiones basadas en datos.'
    ],
    tasks: [
      { id: '2-1', title: 'Auditoría SEO de un sitio web' },
      { id: '2-2', title: 'Creación de una campaña en Google Ads' },
      { id: '2-3', title: 'Desarrollo de un calendario de contenidos' },
      { id: '2-4', title: 'Análisis de métricas de una campaña en redes sociales' },
      { id: '2-5', title: 'Proyecto final: Plan de Marketing Digital Integral' }
    ]
  },
  {
    id: '3',
    title: 'Desarrollo Web Full Stack',
    headerImage: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    longDescription: 'Conviértete en un desarrollador versátil capaz de construir aplicaciones web completas. Este curso te guiará a través del desarrollo del frontend con React y del backend con Node.js y Express, cubriendo bases de datos, APIs RESTful y despliegue de aplicaciones.',
    instructor: 'Ana Mendoza',
    learningObjectives: [
      'Construir interfaces de usuario interactivas con React.',
      'Crear APIs RESTful robustas con Node.js y Express.',
      'Diseñar y gestionar bases de datos NoSQL (MongoDB).',
      'Implementar autenticación y autorización de usuarios.',
      'Desplegar aplicaciones web en servicios en la nube.'
    ],
    tasks: [
      { id: '3-1', title: 'Crear una Single Page Application (SPA) con React' },
      { id: '3-2', title: 'Desarrollar una API RESTful para un blog' },
      { id: '3-3', title: 'Integrar la API con el frontend de React' },
      { id: '3-4', title: 'Implementar autenticación de usuarios con JWT' },
      { id: '3-5', title: 'Proyecto final: Desplegar una aplicación MERN completa' }
    ]
  },
  // Añadir más detalles de cursos si es necesario
];
