'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Vehicle } from '@/lib/data/mock-fleet';
import { 
  Car,
  Gauge,
  Fuel,
  Battery,
  MapPin,
  Clock,
  Wrench,
  AlertTriangle,
  MessageSquare,
  MapPinned,
  Zap,
  Navigation,
  Calendar
} from 'lucide-react';

interface VehicleDetailProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleDetail({ vehicle, isOpen, onClose }: VehicleDetailProps) {
  const [activeTab, setActiveTab] = useState('telemetry');

  if (!vehicle) return null;

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-amber-600 bg-amber-50';
      case 'alert': return 'text-red-600 bg-red-50';
      case 'offline': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: Vehicle['status']) => {
    const labels = {
      online: 'en línea',
      warning: 'advertencia',
      alert: 'alerta',
      offline: 'desconectado'
    };
    return labels[status];
  };

  const getFuelColor = (fuel: number) => {
    if (fuel < 15) return 'text-red-600';
    if (fuel < 25) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px] p-0">
        <div className="h-full flex flex-col">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{vehicle.alias}</h2>
                  <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                </div>
              </div>
              <Badge className={getStatusColor(vehicle.status)}>
                {getStatusLabel(vehicle.status)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-600">{vehicle.speed}</p>
                <p className="text-xs text-muted-foreground">km/h</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <p className={`text-2xl font-bold ${getFuelColor(vehicle.fuel)}`}>{vehicle.fuel}</p>
                <p className="text-xs text-muted-foreground">% combustible</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-600">{vehicle.battery}</p>
                <p className="text-xs text-muted-foreground">% batería</p>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
                <TabsTrigger value="telemetry">Telemetría</TabsTrigger>
                <TabsTrigger value="fuel">Combustible</TabsTrigger>
                <TabsTrigger value="maintenance">Servicio</TabsTrigger>
                <TabsTrigger value="alerts">Alertas</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-4">
                <TabsContent value="telemetry" className="space-y-4 mt-0">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Gauge className="h-4 w-4" />
                        Estado Actual
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Velocidad</span>
                          <span className="font-medium">{vehicle.speed} km/h</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Encendido</span>
                          <Badge variant={vehicle.ignition ? 'default' : 'secondary'}>
                            {vehicle.ignition ? 'ENCENDIDO' : 'APAGADO'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Odómetro</span>
                          <span className="font-medium">{vehicle.odometer.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Batería</span>
                          <span className="font-medium">{vehicle.battery}%</span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Última Posición</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.position.lat.toFixed(6)}, {vehicle.position.lng.toFixed(6)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Actualizado {vehicle.lastUpdate}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="fuel" className="space-y-4 mt-0">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Fuel className="h-4 w-4" />
                        Estado del Combustible
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <p className={`text-4xl font-bold ${getFuelColor(vehicle.fuel)}`}>
                          {vehicle.fuel}%
                        </p>
                        <p className="text-sm text-muted-foreground">Nivel actual de combustible</p>
                      </div>
                      
                      <Progress value={vehicle.fuel} className="h-3" />
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-semibold">~{Math.round(vehicle.fuel * 8)} km</p>
                          <p className="text-xs text-muted-foreground">Autonomía estimada</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-semibold">{100 - vehicle.fuel}L</p>
                          <p className="text-xs text-muted-foreground">Para llenar tanque</p>
                        </div>
                      </div>

                      {vehicle.fuel < 25 && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <span className="text-sm text-amber-700">
                            {vehicle.fuel < 15 ? 'Nivel crítico de combustible - recargar inmediatamente' : 'Combustible bajo - considerar recargar pronto'}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-4 mt-0">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Wrench className="h-4 w-4" />
                        Programa de Mantenimiento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {Math.max(0, vehicle.nextServiceKm - vehicle.maintenanceKm)} km
                        </p>
                        <p className="text-sm text-muted-foreground">Hasta próximo servicio</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Odómetro actual</span>
                          <span className="font-medium">{vehicle.maintenanceKm.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Próximo servicio en</span>
                          <span className="font-medium">{vehicle.nextServiceKm.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Intervalo de servicio</span>
                          <span className="font-medium">10,000 km</span>
                        </div>
                      </div>

                      <Progress 
                        value={((vehicle.maintenanceKm % 10000) / 10000) * 100} 
                        className="h-2" 
                      />

                      {vehicle.nextServiceKm - vehicle.maintenanceKm < 5000 && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span className="text-sm text-amber-700">
                            Servicio próximo - programar mantenimiento
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-4 mt-0">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertTriangle className="h-4 w-4" />
                        Alertas Activas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {vehicle.alerts.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Zap className="h-6 w-6 text-green-600" />
                          </div>
                          <p className="text-sm text-muted-foreground">Sin alertas activas</p>
                          <p className="text-xs text-muted-foreground">El vehículo opera normalmente</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {vehicle.alerts.map((alert, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-red-700">{alert}</p>
                                <p className="text-xs text-red-600">Activa desde {vehicle.lastUpdate}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              {/* Action Buttons */}
              <div className="border-t p-4 space-y-2">
                <Button className="w-full" variant="default">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Mensaje al Conductor
                </Button>
                <Button className="w-full" variant="outline">
                  <MapPinned className="h-4 w-4 mr-2" />
                  Crear Geocerca Aquí
                </Button>
              </div>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
