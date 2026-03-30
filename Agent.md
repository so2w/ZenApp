🧘 Zen Tarot App — Agent.md 

🎯 Objetivo
Construir una aplicación móvil de introspección basada en la filosofía del Neo Tarot. La app utiliza IA para generar reflexiones y "micro-historias" originales inspiradas en conceptos zen, evitando el uso de textos protegidos por derechos de autor y enfocándose en el mindfulness y el journaling.


🧩 Concepto del Producto
El usuario no busca una "predicción", sino un espejo de su estado interno.

Mecánica: Selección de cartas con simbología clásica.

Motor: IA que interpreta la simbología en tiempo real.

Resultado: Reflexiones únicas, preguntas socráticas y sugerencias de meditación.

🛠️ Stack Tecnológico (Mobile First)
Frontend & App
Framework: Expo + React Native (Eficiencia en despliegue Android/iOS).

Estilo: NativeWind (Tailwind CSS) - Tema: Zen Dark (Fondos negros, acentos dorados/ocre).

Animaciones: Moti o Reanimated (Para el efecto de voltear cartas y transiciones suaves).

Backend & Datos
Base de Datos: Supabase (PostgreSQL).

Almacena: Metadatos de cartas (ID, Título, Arquetipo), historial de lecturas del usuario y favoritos.

Auth: Supabase Auth (Login con Google/Apple para guardar el diario personal).

Inteligencia Artificial
Modelo: GPT-4o-mini o Groq (Llama 3) por su bajísimo costo y alta velocidad.

Lógica: La IA recibe el "Concepto de la Carta" + "Contexto del Usuario" y genera una reflexión original.

🔮 Funcionalidades Core
1. El Oráculo IA (Generativo)
En lugar de mostrar un texto estático extraído de la web, la app envía un prompt al backend:

"Actúa como un guía zen. La carta seleccionada es 'La Mente'. Genera una breve parábola original (máx 100 palabras) sobre la observación del pensamiento y termina con una pregunta introspectiva para el usuario."

2. Tiradas Dinámicas
1 Carta (Zen Moment): Enfoque rápido para el día.

3 Cartas (El Observador): Situación actual → El desafío → El camino de la conciencia.

Diario de Reflexión: Espacio para que el usuario escriba qué sintió con la lectura (Journaling).

3. Monetización (Ingresos Pasivos)
AdMob Interstitials: Un anuncio corto antes de revelar una tirada compleja (3 o 5 cartas).

Premium Tier: Eliminar anuncios y acceso a "Reflexiones Profundas" ilimitadas generadas por modelos de IA más avanzados.

🎨 UI / UX (Identidad Visual)
Paleta: #000000 (Fondo), #D4AF37 (Dorado), #F5F5DC (Texto crema).

Tipografía: Serif elegante para títulos (estilo espiritual) y Sans-serif limpia para lecturas largas.

Sonido: Feedback háptico (vibración sutil) al tocar las cartas.

🛡️ Estrategia Legal & Ética

IA como Autor: Las reflexiones son generadas al vuelo, lo que crea contenido nuevo bajo cada petición.

Disclaimer: "Esta app es una herramienta de introspección personal y no sustituye terapia profesional ni garantiza predicciones futuras."

### 🧠 Módulo de Personalización (Deep Reflection)
- **Input:** Cuestionario de 3 preguntas (Estado de ánimo, Desafío actual, Intención).
- **Lógica de Selección:** - La IA analiza el input y asigna "Pesos" a las cartas del mazo. 
  - Ejemplo: Si el usuario menciona "estrés laboral", el mazo prioriza cartas de *No-Hacer, Juego y Raíces*.
- **Opción "Libre":** El usuario puede saltar la encuesta y recibir una tirada totalmente aleatoria (causalidad pura).

🚀 Roadmap 

Fase 1: Cimientos
Setup de Expo y Supabase.

Definición de la tabla cards_metadata (solo nombres de cartas y conceptos clave).

UI básica de selección de cartas.

Fase 2: Integración IA
Conexión con API de IA.

Ingeniería de Prompts (Prompt Engineering) para asegurar el tono "Osho-style" sin plagiar.

Lógica de barajado aleatorio en el dispositivo.

Fase 3: Monetización y Lanzamiento
Integración de Google AdMob.

Implementación de guardado de lecturas en la nube.

Publicación en Play Store / App Store.