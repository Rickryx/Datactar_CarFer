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
  Radio
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Process command
    if (input.startsWith('/')) {
      onCommand(input);
      handleCommand(input);
    } else {
      handleGeneralQuery(input);
    }

    setInput('');
  };

  const handleCommand = (command: string) => {
    let response = '';
    
    if (command.startsWith('/estado')) {
      const plate = command.split(' ')[1];
      if (plate) {
        response = `Verificando estado del vehículo ${plate}... El vehículo está en línea, combustible al 67%, visto por última vez hace 2 minutos en las coordenadas 4.6097, -74.0817.`;
      } else {
        response = 'Por favor especifica una placa. Uso: /estado <placa>';
      }
    } else if (command.startsWith('/combustible')) {
      response = 'Encontré 3 vehículos con combustible bajo: DEF-456 (12%), VWX-234 (8%), y PQR-678 (34%). Se han identificado las estaciones de servicio más cercanas y optimizado las rutas.';
    } else if (command.startsWith('/difundir')) {
      const message = command.substring(10);
      if (message) {
        response = `Difundiendo mensaje a todos los conductores: "${message}". Mensaje enviado a 8 vehículos activos.`;
      } else {
        response = 'Por favor proporciona un mensaje. Uso: /difundir <mensaje>';
      }
    } else if (command.startsWith('/cercano')) {
      response = 'Analizando posiciones de la flota... El vehículo más cercano es ABC-123 (Furgón Reparto 1) conducido por Carlos Méndez, a 2.3 km de distancia, ETA 8 minutos.';
    } else {
      response = 'Comando desconocido. Comandos disponibles: /estado, /combustible, /difundir, /cercano';
    }

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleGeneralQuery = (query: string) => {
    let response = '';
    
    if (query.toLowerCase().includes('combustible')) {
      response = 'Actualmente 2 vehículos necesitan recargar combustible inmediatamente (combustible < 15%): DEF-456 al 12% y VWX-234 al 8%. ¿Te gustaría que envíe alertas de recarga a sus conductores?';
    } else if (query.toLowerCase().includes('mantenimiento') || query.toLowerCase().includes('servicio')) {
      response = 'El vehículo PQR-678 tiene mantenimiento vencido por 450 km. DEF-456 necesita servicio en 250 km. ¿Debo programar citas de mantenimiento?';
    } else if (query.toLowerCase().includes('ubicación') || query.toLowerCase().includes('dónde')) {
      response = 'Todos los vehículos están operando actualmente en el área metropolitana de Bogotá. 6 vehículos están en movimiento, 4 están estacionarios. ¿Te gustaría coordenadas específicas de algún vehículo?';
    } else {
      response = 'Puedo ayudarte con monitoreo de flota, verificación de estado de vehículos, gestión de combustible, programación de mantenimiento y comunicación con conductores. ¿Qué te gustaría saber?';
    }

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
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
          <p className="text-xs text-muted-foreground">Asistente IA de Flota</p>
        </div>
        <div className="ml-auto">
          <Badge variant="secondary" className="text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
            En línea
          </Badge>
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
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
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
            placeholder="Pregunta a FleetCopilot o usa /comandos..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleVoiceInput}
            className={isListening ? 'bg-red-50 border-red-200' : ''}
          >
            <Mic className={`h-4 w-4 ${isListening ? 'text-red-600' : ''}`} />
          </Button>
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
