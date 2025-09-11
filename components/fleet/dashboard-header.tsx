'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Radio, 
  Moon, 
  Sun,
  Truck,
  Send
} from 'lucide-react';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onBroadcast: (message: string, target: string) => void;
}

export function DashboardHeader({ onSearch, onBroadcast }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleBroadcast = () => {
    if (broadcastMessage.trim()) {
      onBroadcast(broadcastMessage, broadcastTarget);
      setBroadcastMessage('');
      setIsDialogOpen(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Theme toggle logic would be implemented here
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo y Título */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Cam.i</h1>
            <p className="text-sm text-gray-500">Gestión inteligente de flotas</p>
          </div>
        </div>

        {/* Barra de Búsqueda */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por placa o alias..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {/* Toggle de Tema */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Botón de Difusión */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Radio className="h-4 w-4" />
                Difundir
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5" />
                  Difundir Mensaje
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="target">Enviar a</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={broadcastTarget === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBroadcastTarget('all')}
                    >
                      Todos los Conductores
                    </Button>
                    <Button
                      variant={broadcastTarget === 'active' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBroadcastTarget('active')}
                    >
                      Solo Activos
                    </Button>
                    <Button
                      variant={broadcastTarget === 'alerts' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBroadcastTarget('alerts')}
                    >
                      Con Alertas
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    placeholder="Ingresa tu mensaje para los conductores..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {broadcastTarget === 'all' ? '10 conductores' : 
                       broadcastTarget === 'active' ? '8 conductores' : '3 conductores'}
                    </Badge>
                  </div>
                  <Button onClick={handleBroadcast} disabled={!broadcastMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
