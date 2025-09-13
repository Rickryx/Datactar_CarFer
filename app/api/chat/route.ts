import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, fleetData } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      // Fallback to simulated AI if no API key
      return NextResponse.json({
        response: "Soy FleetCopilot (Simulado). " + getSimulatedResponse(message),
        isSimulated: true
      });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Eres FleetCopilot, un asistente especializado en gestión de flotas vehiculares. 
          Tienes acceso a los siguientes datos de la flota: ${JSON.stringify(fleetData)}
          
          Responde siempre en español y de manera profesional. Proporciona análisis detallados 
          sobre el estado de los vehículos, rutas, combustible, mantenimiento y eficiencia operacional.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '500'),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
      isSimulated: false
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback to simulated AI on error
    const { message } = await request.json();
    return NextResponse.json({
      response: "Soy FleetCopilot (Simulado). " + getSimulatedResponse(message),
      isSimulated: true,
      error: 'API temporarily unavailable'
    });
  }
}

function getSimulatedResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('combustible') || lowerMessage.includes('gasolina')) {
    return "Analizando los niveles de combustible de la flota... Veo que 3 vehículos tienen niveles críticos (<20%). Recomiendo programar reabastecimiento para VEH-001, VEH-005 y VEH-008 antes de las próximas rutas.";
  }
  
  if (lowerMessage.includes('mantenimiento')) {
    return "Revisando el estado de mantenimiento... Hay 2 vehículos que requieren atención: VEH-003 necesita cambio de aceite en 500km, y VEH-007 tiene mantenimiento programado para mañana. El resto de la flota está en buen estado.";
  }
  
  if (lowerMessage.includes('ruta') || lowerMessage.includes('ubicación')) {
    return "Monitoreando las rutas activas... Actualmente 7 vehículos están en movimiento. VEH-002 está experimentando tráfico pesado en la Av. Caracas, sugiero ruta alternativa por la Calle 26. Los demás vehículos mantienen tiempos estimados normales.";
  }
  
  if (lowerMessage.includes('eficiencia') || lowerMessage.includes('rendimiento')) {
    return "Calculando métricas de eficiencia... La flota mantiene un promedio de 12.5 km/l este mes. VEH-004 y VEH-006 muestran el mejor rendimiento (14.2 km/l), mientras que VEH-001 necesita revisión (9.8 km/l). Recomiendo inspección del sistema de inyección.";
  }
  
  if (lowerMessage.includes('alerta') || lowerMessage.includes('problema')) {
    return "Revisando alertas activas... Detecté 2 alertas de prioridad media: combustible bajo en VEH-005 y mantenimiento pendiente en VEH-003. No hay alertas críticas en este momento. Todos los vehículos reportan señal GPS estable.";
  }
  
  return "Como FleetCopilot, estoy aquí para ayudarte con la gestión de tu flota. Puedo analizar combustible, mantenimiento, rutas, eficiencia y alertas. ¿En qué aspecto específico te gustaría que me enfoque?";
}
