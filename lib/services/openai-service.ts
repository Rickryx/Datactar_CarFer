import OpenAI from 'openai';
import { mockVehicles } from '@/lib/data/mock-fleet';

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuración por defecto
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const DEFAULT_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '500');
const DEFAULT_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');

// Función para obtener contexto de la flota
const getFleetContext = () => {
  const totalVehicles = mockVehicles.length;
  const onlineVehicles = mockVehicles.filter(v => v.status === 'online').length;
  const movingVehicles = mockVehicles.filter(v => v.speed > 0).length;
  const lowFuelVehicles = mockVehicles.filter(v => v.fuel < 20).length;
  const maintenanceVehicles = mockVehicles.filter(v => v.nextMaintenance < 500).length;

  return `
Contexto actual de la flota Cam.i:
- Total de vehículos: ${totalVehicles}
- Vehículos conectados: ${onlineVehicles}/${totalVehicles}
- Vehículos en movimiento: ${movingVehicles}
- Vehículos con combustible bajo (<20%): ${lowFuelVehicles}
- Vehículos próximos a mantenimiento (<500km): ${maintenanceVehicles}

Ubicación: Bogotá, Colombia
Hora actual: ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}

Vehículos disponibles:
${mockVehicles.map(v => 
  `- ${v.plate} (${v.alias}): ${v.status}, ${v.fuel}% combustible, ${v.speed.toFixed(1)} km/h, conductor: ${v.driver}`
).join('\n')}
  `;
};

// Función principal para consultar ChatGPT
export async function queryOpenAI(userMessage: string): Promise<string> {
  try {
    // Verificar si hay API Key
    if (!process.env.OPENAI_API_KEY) {
      return "⚠️ **API Key no configurada**\n\nPara usar IA real, necesitas configurar tu API Key de OpenAI:\n1. Crea un archivo `.env.local`\n2. Agrega: `OPENAI_API_KEY=tu-api-key-aqui`\n3. Reinicia la aplicación\n\n*Mientras tanto, estoy funcionando en modo simulado.*";
    }

    // Verificar si la API Key es válida (no es el placeholder)
    if (process.env.OPENAI_API_KEY === 'tu-api-key-aqui') {
      return "⚠️ **API Key no válida**\n\nParece que no has reemplazado el placeholder en tu archivo `.env.local`.\n\nAsegúrate de poner tu API Key real de OpenAI:\n`OPENAI_API_KEY=sk-proj-...`\n\n*Funcionando en modo simulado.*";
    }

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      max_tokens: DEFAULT_MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      messages: [
        {
          role: "system",
          content: `Eres FleetCopilot, un asistente inteligente de gestión de flotas para la empresa Cam.i en Bogotá, Colombia. 

PERSONALIDAD:
- Profesional pero amigable
- Experto en logística y gestión de flotas
- Respondes siempre en español
- Usas emojis ocasionalmente para ser más visual
- Eres proactivo sugiriendo mejoras

CAPACIDADES:
- Monitoreo de vehículos en tiempo real
- Análisis de combustible y mantenimiento
- Optimización de rutas
- Gestión de alertas y emergencias
- Reportes y estadísticas

COMANDOS ESPECIALES que debes reconocer:
- /estado [placa]: Mostrar estado detallado de un vehículo
- /combustible bajo: Listar vehículos con combustible bajo
- /difundir [mensaje]: Enviar mensaje a conductores
- /cercano [ubicación]: Encontrar vehículo más cercano
- /ruta [placa]: Mostrar ruta actual del vehículo
- /alerta [tipo]: Crear nueva alerta
- /reporte: Generar reporte de la flota

FORMATO DE RESPUESTAS:
- Usa markdown para formatear
- Incluye datos específicos cuando sea relevante
- Sugiere acciones cuando sea apropiado
- Mantén respuestas concisas pero informativas

${getFleetContext()}`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return "❌ No pude generar una respuesta. Intenta de nuevo.";
    }

    return response;

  } catch (error: unknown) {
    console.error('Error al consultar OpenAI:', error);
    
    // Manejo específico de errores
    if (error.code === 'invalid_api_key') {
      return "❌ **API Key inválida**\n\nTu API Key de OpenAI no es válida. Verifica que:\n1. La copiaste correctamente\n2. Tiene permisos para usar la API\n3. Tu cuenta tiene créditos disponibles";
    }
    
    if (error.code === 'insufficient_quota') {
      return "❌ **Sin créditos**\n\nTu cuenta de OpenAI no tiene créditos suficientes. Ve a https://platform.openai.com/account/billing para agregar créditos.";
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return "⏳ **Límite de velocidad excedido**\n\nHas hecho demasiadas consultas muy rápido. Espera un momento e intenta de nuevo.";
    }

    return `❌ **Error de conexión**\n\nNo pude conectar con OpenAI: ${error.message}\n\n*Funcionando en modo simulado mientras tanto.*`;
  }
}

// Función para verificar si OpenAI está configurado
export function isOpenAIConfigured(): boolean {
  return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'tu-api-key-aqui');
}

// Función para obtener información de configuración
export function getOpenAIConfig() {
  return {
    configured: isOpenAIConfigured(),
    model: DEFAULT_MODEL,
    maxTokens: DEFAULT_MAX_TOKENS,
    temperature: DEFAULT_TEMPERATURE,
    hasApiKey: !!process.env.OPENAI_API_KEY,
    isPlaceholder: process.env.OPENAI_API_KEY === 'tu-api-key-aqui'
  };
}
