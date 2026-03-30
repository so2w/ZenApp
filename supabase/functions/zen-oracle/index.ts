import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Obtenemos API KEY de Variables de Entorno de Supabase (o por fallo de la que pasaste).
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyDbOfBBA3C-JTb9krFiNSXZC61cagmGHY0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { cardName, archetype, concepts } = body;

    if (!cardName) {
      return new Response(JSON.stringify({ error: 'Faltan datos de la carta.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
    }

    const promptText = `Actúa como un guía zen contemporáneo inspirado en filosofías orientales modernas. El usuario ha sacado la carta '${cardName}', que tiene el arquetipo de '${archetype}' y sus conceptos son: '${concepts}'. Genera una breve reflexión o parábola original (máximo 80 palabras) poética y termina siempre con una sola pregunta socrática o de introspección para que el usuario reflexione al final. Sé profundo pero amable.`;

    const requestBody = {
      contents: [{
        parts: [{ text: promptText }]
      }],
      generationConfig: {
        maxOutputTokens: 250,
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`API de Gemini retornó status ${response.status}`);
    }

    const data = await response.json();
    const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text || "El silencio tiene las respuestas que las palabras no alcanzan. Observa tu mente y descubre la verdad.";

    return new Response(JSON.stringify({ text: explanation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
