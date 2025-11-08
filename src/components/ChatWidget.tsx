import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { courses } from '../data/courses';
import type { Course } from '../data/courses';
import './ChatWidget.css';

interface ChatWidgetProps {
  user: {
    nombre: string;
    email: string;
    carrera: string;
  };
}

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  isCourseRecommendation?: boolean;
  courseData?: Course;
  aiReason?: string;
}

// Renderiza texto con negritas estilo Markdown (**texto**)
const FormattedText = ({ text }: { text: string }) => {
  const parts = text.split('**');
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
      )}
    </>
  );
};

export default function ChatWidget({ user }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: '¡Hola! 👋 Soy tu asistente laboral de Crece +Perú. Estoy aquí para ayudarte a impulsar tu carrera profesional. ¿En qué te puedo apoyar hoy?',
      sender: 'bot',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const API_KEY = 'AIzaSyD-QphuQjOpaya-r4PHfm-gs8N-okVqun4';

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const appendMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleCourseClick = (courseId: string) => {
    alert(
      `Excelente elección. Este curso podría ayudarte a fortalecer tu perfil profesional.\nID del curso: ${courseId}`
    );
  };

  const sendMessage = async () => {
    const text = userInput.trim();
    if (!text || isLoading) return;

    appendMessage({ text, sender: 'user' });
    setUserInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const availableCourses = courses.filter((c) => c.status === 'available');
      const courseListForAI = availableCourses
        .map(
          (c) =>
            `ID: ${c.id}, Título: ${c.title}, Dificultad: ${c.difficulty}, Beneficios: ${c.careerBenefits.join(', ')}`
        )
        .join('\n');

      let userContext = `El usuario pregunta: "${text}".`;
      if (user.carrera && user.carrera !== 'Selecciona tu carrera' && user.carrera !== 'Otro...') {
        userContext = `El usuario tiene la carrera de "${user.carrera}" y pregunta: "${text}".`;
      }

      // 🧩 Detectar si el usuario solo saluda o agradece
      const simpleResponseKeywords = [
        'gracias',
        'ok',
        'perfecto',
        'entendido',
        'de acuerdo',
        'vale',
        'hola',
        'buenos días',
        'buenas tardes',
        'buenas noches',
        'adiós',
        'nos vemos',
      ];
      const isSimpleResponse = simpleResponseKeywords.some((word) =>
        text.toLowerCase().includes(word)
      );

      if (isSimpleResponse) {
        appendMessage({
          text: '¡De nada! 😊 Si más adelante deseas explorar nuevas oportunidades o aprender algo, estaré aquí para ayudarte.',
          sender: 'bot',
        });
        setIsLoading(false);
        return;
      }

      // 🧠 PROMPT CONTROLADO: solo recomendar cursos cuando sea pertinente
      const prompt = `
Eres un asesor laboral profesional y empático de **Crece +Perú**.

${userContext}

Tu objetivo es orientar al usuario de manera útil y cercana, sin sonar comercial ni insistente.

**Instrucciones:**
1. Si el usuario pregunta sobre **aprendizaje, mejorar habilidades, capacitación, cursos, desarrollo profesional, empleo o cómo crecer laboralmente**, puedes **recomendar hasta 2 cursos** de la lista proporcionada.
   - Usa este formato exacto:
     RECOMMEND_COURSES: [
       {id: "ID_CURSO_1", reason: "Motivo natural y breve"},
       {id: "ID_CURSO_2", reason: "Motivo natural y breve"}
     ]
   - Ejemplo de tono: “Quizás te interese revisar estos cursos que podrían ayudarte…”

2. Si el usuario pide **consejos o tips (por ejemplo, sobre CV, entrevistas, productividad o liderazgo)**:
   - Da una respuesta práctica.
   - Puedes **mencionar indirectamente los cursos** como complemento (“También podrías fortalecer tu perfil con certificaciones de estos cursos…”).

3. Si el usuario **no pide nada relacionado con aprender, mejorar o trabajo**, responde **solo de forma conversacional y natural**, sin mencionar cursos.

4. Si el usuario **saluda o agradece**, responde amablemente y **nunca recomiendes cursos**.

Cursos disponibles:
${courseListForAI}
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      // 🧩 Verificar si la IA quiso recomendar cursos
      const match = responseText.match(
        /RECOMMEND_COURSES:\s*\[(.*?)\]/s
      );

      if (match) {
        try {
          const jsonArrayText = `[${match[1]}]`;
          const parsed = JSON.parse(jsonArrayText);

          parsed.forEach((rec: { id: string; reason: string }) => {
            const recommendedCourse = courses.find((c) => c.id === rec.id);
            if (recommendedCourse) {
              appendMessage({
                text: 'Quizá te interese algo que complemente lo que mencionas 👇',
                sender: 'bot',
                isCourseRecommendation: true,
                courseData: recommendedCourse,
                aiReason: rec.reason,
              });
            }
          });
        } catch {
          appendMessage({ text: responseText, sender: 'bot' });
        }
      } else {
        appendMessage({ text: responseText, sender: 'bot' });
      }
    } catch (err) {
      console.error('Error al comunicarse con el asistente:', err);
      appendMessage({
        text: '⚠️ Hubo un problema al procesar tu mensaje. Inténtalo más tarde.',
        sender: 'bot',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-widget-container">
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h3>🤖 Asistente Laboral Crece +Perú</h3>
          <button onClick={toggleChat} className="close-chat-btn">
            &times;
          </button>
        </div>

        <div className="chat-box" id="chatBox" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
            >
              {msg.isCourseRecommendation && msg.courseData ? (
                <>
                  <p className="bot-intro-text">
                    <FormattedText text={msg.text} />
                  </p>
                  <div
                    className="course-recommendation-card"
                    onClick={() => handleCourseClick(msg.courseData!.id)}
                  >
                    <img
                      src={msg.courseData.imageUrl}
                      alt={msg.courseData.title}
                      className="course-rec-image"
                    />
                    <div className="course-rec-content">
                      <h4>{msg.courseData.title}</h4>
                      <p className="course-rec-difficulty">
                        Dificultad: <span>{msg.courseData.difficulty}</span>
                      </p>
                      <p className="course-rec-reason">
                        <FormattedText text={msg.aiReason!} />
                      </p>
                      <button className="course-rec-button">Ver Curso</button>
                    </div>
                  </div>
                </>
              ) : (
                <FormattedText text={msg.text} />
              )}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <textarea
            id="userInput"
            rows={1}
            placeholder="Escribe tu mensaje..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          ></textarea>
          <button id="sendBtn" onClick={sendMessage} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>

      <button onClick={toggleChat} className="chat-bubble">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="32"
          height="32"
        >
          <path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.897 5.515 5 6.934V22l5.34-4.005C17.044 17.587 22 14.258 22 10c0-4.411-4.486-8-10-8zm0 14h-.051c-1.262.022-4.132 1.231-4.949 1.867V16.58c.021-.016.042-.032.063-.048.005-.004.01-.007.015-.011A7.95 7.95 0 0 1 4 10c0-3.309 3.589-6 8-6s8 2.691 8 6-3.589 6-8 6z" />
          <path d="M9.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        </svg>
      </button>
    </div>
  );
}
