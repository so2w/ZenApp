import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// API KEY obtenida exclusivamente desde variables de entorno de Supabase
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Validación temprana: si no hay clave configurada, retornar error limpio sin exponer detalles
  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Servicio no disponible. Contacta al administrador.' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { cardName, archetype, concepts } = body;

    if (!cardName) {
      return new Response(
        JSON.stringify({ error: 'Faltan datos de la carta.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitización básica: limitar longitud de inputs para prevenir prompt injection
    const safeCardName = String(cardName).slice(0, 100);
    const safeArchetype = String(archetype ?? '').slice(0, 100);
    const safeConcepts = String(concepts ?? '').slice(0, 200);

    const promptText = `Actúa como un guía zen contemporáneo inspirado en filosofías orientales modernas. El usuario ha sacado la carta '${safeCardName}', cuyo arquetipo es '${safeArchetype}' y sus conceptos clave son: '${safeConcepts}'. Genera una breve reflexión o parábola original (máximo 80 palabras) poética y termina siempre con una sola pregunta socrática de introspección. Sé profundo pero amable. No des bienvenida ni introducciones.`;

    const requestBody = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { maxOutputTokens: 250 },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Error de comunicación con el oráculo (status ${response.status})`);
    }

    const data = await response.json();
    const explanation =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      'El silencio tiene las respuestas que las palabras no alcanzan. ¿Qué encuentras cuando dejas de buscar?';

    return new Response(JSON.stringify({ text: explanation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    // No filtramos mensajes internos al cliente para evitar info disclosure
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    console.error('[zen-oracle]', message);
    return new Response(
      JSON.stringify({ error: 'El oráculo no pudo responder. Intenta más tarde.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
