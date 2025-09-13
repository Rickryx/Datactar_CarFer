interface ChatResponse {
  response: string;
  isSimulated: boolean;
  error?: string;
}

export class OpenAIService {
  private static instance: OpenAIService;

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async generateResponse(message: string, fleetData?: unknown): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          fleetData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      // Add badge indicator based on response type
      const badge = data.isSimulated ? '🤖 Simulado' : '✨ ChatGPT';
      
      return `${badge}\n\n${data.response}`;

    } catch (error) {
      console.error('Error calling chat API:', error);
      
      // Fallback to local simulated response
      return `🤖 Simulado (Offline)\n\n${this.getLocalFallback(message)}`;
    }
  }

  private getLocalFallback(message: string): string {
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
    
    return "Como FleetCopilot, estoy aquí para ayudarte con la gestión de tu flota. Puedo analizar combustible, mantenimiento, rutas, eficiencia y alertas. ¿En qué aspecto específico te gustaría que me enfoque?";
  }

  isConfigured(): boolean {
    // Always return true since we have fallback mechanisms
    return true;
  }

  getModelInfo(): { model: string; configured: boolean } {
    return {
      model: 'gpt-3.5-turbo',
      configured: true
    };
  }
}

export const openaiService = OpenAIService.getInstance();
