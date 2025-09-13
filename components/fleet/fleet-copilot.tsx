'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Mic, 
  Send, 
  MessageSquare,
  Zap,
  Navigation,
  Fuel,
  Radio,
  Loader2,
  Settings,
  AlertCircle
} from 'lucide-react';
import { queryOpenAI, isOpenAIConfigured, getOpenAIConfig } from '@/lib/services/openai-service';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface FleetCopilotProps {
  onCommand: (command: string) => void;
}

export function FleetCopilot({ onCommand }: FleetCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy FleetCopilot, tu asistente de IA. Puedo ayudarte a monitorear tu flota, verificar el estado de los vehículos y gestionar operaciones. Prueba comandos como /estado ABC-123 o pregúntame lo que necesites!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiConfig, setAiConfig] = useState(getOpenAIConfig());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Verificar configuración de OpenAI al montar el componente
  useEffect(() => {
    const config = getOpenAIConfig();
    setAiConfig(config);
    
    if (!config.configured) {
      const systemMessage: Message = {
        id: 'config-warning',
        type: 'system',
        content: '⚠️ **IA en modo simulado** - Para usar ChatGPT real, configura tu API Key en el archivo `.env.local`',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, systemMessage]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Agregar mensaje de carga
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Procesando...',
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      let response = '';
      
      // Procesar comando si empieza con /
      if (input.startsWith('/')) {
        onCommand(input);
        
        // Si OpenAI está configurado, usar IA real para comandos también
        if (isOpenAIConfigured()) {
          response = await queryOpenAI(input);
        } else {
          response = handleSimulatedCommand(input);
        }
      } else {
        // Para consultas generales, usar OpenAI si está configurado
        if (isOpenAIConfigured()) {
          response = await queryOpenAI(input);
        } else {
          response = handleSimulatedQuery(input);
        }
      }

      // Remover mensaje de carga y agregar respuesta real
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: response,
          timestamp: new Date()
        }];
      });

    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      
      // Remover mensaje de carga y mostrar error
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: '❌ Error al procesar tu consulta. Intenta de nuevo.',
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  // Función de respaldo para comandos simulados
  const handleSimulatedCommand = (command: string): string => {
    if (command.startsWith('/estado')) {
      const plate = command.split(' ')[1];
      if (plate) {
        return `🚛 **Estado del vehículo ${plate}**\n\n✅ **En línea** - Combustible al 67%\n📍 Última posición: 4.6097, -74.0817\n⏰ Visto hace 2 minutos\n🔋 Batería: 84%\n⚡ Motor: Encendido`;
      } else {
        return '❓ Por favor especifica una placa.\n**Uso:** `/estado ABC-123`';
      }
    } else if (command.startsWith('/combustible')) {
      return '⛽ **Vehículos con combustible bajo:**\n\n🔴 **DEF-456** - 12% (Crítico)\n🟡 **VWX-234** - 8% (Crítico)\n🟠 **PQR-678** - 34% (Bajo)\n\n📍 Estaciones cercanas identificadas\n🗺️ Rutas optimizadas enviadas';
    } else if (command.startsWith('/difundir')) {
      const message = command.substring(10);
      if (message) {
        return `📢 **Mensaje difundido:**\n"${message}"\n\n✅ Enviado a 8 vehículos activos\n📱 Confirmación de recepción: 7/8`;
      } else {
        return '❓ Proporciona un mensaje.\n**Uso:** `/difundir Tu mensaje aquí`';
      }
    } else if (command.startsWith('/cercano')) {
      return '📍 **Vehículo más cercano:**\n\n🚛 **ABC-123** (Furgón Reparto 1)\n👨‍💼 Conductor: Carlos Méndez\n📏 Distancia: 2.3 km\n⏱️ ETA: 8 minutos\n📞 Tel: +57 300 123 4567';
    } else {
      return '❓ **Comando desconocido**\n\n**Comandos disponibles:**\n• `/estado <placa>` - Estado del vehículo\n• `/combustible bajo` - Vehículos con combustible bajo\n• `/difundir <mensaje>` - Enviar mensaje a conductores\n• `/cercano` - Encontrar vehículo más cercano';
    }
  };

  // Función de respaldo para consultas simuladas
  const handleSimulatedQuery = (query: string): string => {
    if (query.toLowerCase().includes('combustible')) {
      return '⛽ **Estado de combustible:**\n\n🔴 **2 vehículos críticos** (< 15%)\n• DEF-456: 12%\n• VWX-234: 8%\n\n¿Te gustaría que envíe alertas de recarga a sus conductores?';
    } else if (query.toLowerCase().includes('mantenimiento') || query.toLowerCase().includes('servicio')) {
      return '🔧 **Estado de mantenimiento:**\n\n🔴 **PQR-678** - Vencido por 450 km\n🟡 **DEF-456** - Próximo en 250 km\n\n¿Debo programar citas de mantenimiento?';
    } else if (query.toLowerCase().includes('ubicación') || query.toLowerCase().includes('dónde')) {
      return '📍 **Ubicaciones actuales:**\n\n🏙️ Área metropolitana de Bogotá\n🚛 6 vehículos en movimiento\n🅿️ 4 vehículos estacionarios\n\n¿Necesitas coordenadas específicas?';
    } else {
      return '🤖 **¿En qué puedo ayudarte?**\n\n• 📊 Monitoreo de flota\n• 🚛 Estado de vehículos\n• ⛽ Gestión de combustible\n• 🔧 Programación de mantenimiento\n• 📞 Comunicación con conductores\n\n¡Pregúntame lo que necesites!';
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input would be implemented here
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInput('Verificar niveles de combustible de todos los vehículos');
      }, 2000);
    }
  };

  const quickCommands = [
    { label: '/estado', icon: Zap, description: 'Verificar estado del vehículo' },
    { label: '/combustible bajo', icon: Fuel, description: 'Encontrar vehículos con combustible bajo' },
    { label: '/difundir', icon: Radio, description: 'Enviar mensaje a conductores' },
    { label: '/cercano', icon: Navigation, description: 'Encontrar vehículo más cercano' }
  ];

  return (
    <Card className="h-80 flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Bot className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">FleetCopilot</h3>
          <p className="text-xs text-muted-foreground">
            {aiConfig.configured ? 'IA Real (ChatGPT)' : 'IA Simulada'}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {aiConfig.configured ? (
            <Badge variant="default" className="text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
              ChatGPT
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Simulado
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'system'
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Procesando...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
              <p className={`text-xs mt-1 ${
                message.type === 'user' 
                  ? 'text-blue-100' 
                  : message.type === 'system'
                  ? 'text-yellow-600'
                  : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t space-y-3">
        <div className="flex flex-wrap gap-1">
          {quickCommands.map((cmd, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => setInput(cmd.label)}
              disabled={isLoading}
            >
              <cmd.icon className="h-3 w-3 mr-1" />
              {cmd.label}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              aiConfig.configured 
                ? "Pregunta a FleetCopilot (ChatGPT) o usa /comandos..." 
                : "Pregunta a FleetCopilot o usa /comandos..."
            }
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleVoiceInput}
            className={isListening ? 'bg-red-50 border-red-200' : ''}
            disabled={isLoading}
          >
            <Mic className={`h-4 w-4 ${isListening ? 'text-red-600' : ''}`} />
          </Button>
          <Button 
            onClick={handleSend} 
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
