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
  {
    id: '4',
    title: 'Gestión de Proyectos con Scrum y Kanban',
    headerImage: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    longDescription: 'Este curso te sumerge en las metodologías ágiles más demandadas: Scrum y Kanban. Aprenderás a planificar, ejecutar y monitorear proyectos de manera flexible y eficiente, optimizando la entrega de valor y fomentando la colaboración en equipos de alto rendimiento. Ideal para líderes de proyecto, desarrolladores y cualquier profesional que busque mejorar la gestión de sus iniciativas.',
    instructor: 'Ricardo Gómez',
    learningObjectives: [
      'Comprender los principios y valores del Manifiesto Ágil.',
      'Aplicar el framework Scrum para la gestión de proyectos.',
      'Implementar el método Kanban para visualizar y optimizar el flujo de trabajo.',
      'Utilizar herramientas y técnicas para la estimación y planificación ágil.',
      'Fomentar la mejora continua y la adaptación en los equipos de proyecto.'
    ],
    tasks: [
      { id: '4-1', title: 'Creación de un Product Backlog y User Stories' },
      { id: '4-2', title: 'Simulación de un Sprint Planning y Daily Scrum' },
      { id: '4-3', title: 'Diseño de un tablero Kanban para un proyecto real' },
      { id: '4-4', title: 'Análisis de métricas ágiles (Burndown Chart, Lead Time)' },
      { id: '4-5', title: 'Proyecto final: Gestión de un proyecto con Scrum o Kanban' }
    ]
  },
  {
    id: '5',
    title: 'Habilidades de Comunicación y Negociación',
    headerImage: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    longDescription: 'Domina el arte de la comunicación efectiva y la negociación estratégica, habilidades esenciales para el éxito en cualquier ámbito profesional y personal. Este curso te proporcionará las herramientas para expresarte con claridad, escuchar activamente, persuadir con argumentos sólidos y alcanzar acuerdos beneficiosos para todas las partes, incluso en situaciones complejas.',
    instructor: 'Sofía Vargas',
    learningObjectives: [
      'Desarrollar la escucha activa y la empatía en la comunicación.',
      'Aplicar técnicas de comunicación verbal y no verbal para influir positivamente.',
      'Identificar y manejar diferentes estilos de negociación.',
      'Preparar y ejecutar estrategias de negociación exitosas.',
      'Resolver conflictos de manera constructiva y colaborativa.'
    ],
    tasks: [
      { id: '5-1', title: 'Ejercicio de comunicación asertiva' },
      { id: '5-2', title: 'Análisis de un caso de negociación compleja' },
      { id: '5-3', title: 'Role-play de una situación de negociación' },
      { id: '5-4', title: 'Preparación de una presentación persuasiva' },
      { id: '5-5', title: 'Proyecto final: Plan de mejora de habilidades comunicativas y negociadoras' }
    ]
  },
  {
    id: '6',
    title: 'Análisis de Datos para la Toma de Decisiones',
    headerImage: 'https://images.pexels.com/photos/3184390/pexels-photo-3184390.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    longDescription: 'En la era de la información, la capacidad de analizar datos y convertirlos en insights accionables es una ventaja competitiva. Este curso te enseñará a recolectar, limpiar, visualizar e interpretar datos para fundamentar decisiones estratégicas, optimizar procesos y descubrir nuevas oportunidades de negocio. Ideal para profesionales de cualquier sector que busquen potenciar su pensamiento analítico.',
    instructor: 'Daniel Castro',
    learningObjectives: [
      'Comprender el ciclo de vida del análisis de datos.',
      'Utilizar herramientas básicas para la recolección y limpieza de datos.',
      'Aplicar técnicas de visualización de datos para comunicar insights.',
      'Realizar análisis estadísticos descriptivos e inferenciales.',
      'Traducir los resultados del análisis de datos en recomendaciones estratégicas.'
    ],
    tasks: [
      { id: '6-1', title: 'Recolección y limpieza de un dataset pequeño' },
      { id: '6-2', title: 'Creación de visualizaciones de datos en una herramienta (ej. Excel, Power BI)' },
      { id: '6-3', title: 'Análisis descriptivo de un conjunto de datos empresariales' },
      { id: '6-4', title: 'Elaboración de un informe con insights y recomendaciones' },
      { id: '6-5', title: 'Proyecto final: Análisis de datos para un caso de negocio real' }
    ]
  },
  // Añadir más detalles de cursos si es necesario
];
