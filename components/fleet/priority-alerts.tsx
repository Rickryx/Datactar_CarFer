'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/lib/data/mock-fleet';
import { 
  Fuel, 
  Wrench, 
  WifiOff,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface PriorityAlertsProps {
  lowFuel: Vehicle[];
  serviceDue: Vehicle[];
  noSignal: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
}

export function PriorityAlerts({ lowFuel, serviceDue, noSignal, onVehicleSelect }: PriorityAlertsProps) {
  const sections = [
    {
      title: 'Combustible Bajo',
      icon: Fuel,
      vehicles: lowFuel,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      emptyMessage: 'Todos los vehículos tienen combustible suficiente'
    },
    {
      title: 'Mantenimiento Próximo',
      icon: Wrench,
      vehicles: serviceDue,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      emptyMessage: 'Ningún vehículo necesita mantenimiento'
    },
    {
      title: 'Sin Señal',
      icon: WifiOff,
      vehicles: noSignal,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      emptyMessage: 'Todos los vehículos están conectados'
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Alertas Prioritarias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-2">
              <section.icon className={`h-4 w-4 ${section.color}`} />
              <h4 className="font-medium text-sm">{section.title}</h4>
              <Badge variant="outline" className="text-xs">
                {section.vehicles.length}
              </Badge>
            </div>
            
            {section.vehicles.length === 0 ? (
              <p className="text-xs text-muted-foreground pl-6">
                {section.emptyMessage}
              </p>
            ) : (
              <div className="space-y-1 pl-6">
                {section.vehicles.slice(0, 3).map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onVehicleSelect(vehicle)}
                  >
                    <div>
                      <p className="text-sm font-medium">{vehicle.alias}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.plate}</p>
                    </div>
                    <div className="text-right">
                      {section.title === 'Combustible Bajo' && (
                        <p className={`text-xs font-medium ${section.color}`}>
                          {vehicle.fuel}%
                        </p>
                      )}
                      {section.title === 'Mantenimiento Próximo' && (
                        <p className={`text-xs font-medium ${section.color}`}>
                          {Math.max(0, vehicle.nextServiceKm - vehicle.maintenanceKm)} km
                        </p>
                      )}
                      {section.title === 'Sin Señal' && (
                        <p className={`text-xs font-medium ${section.color}`}>
                          {vehicle.lastUpdate}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {section.vehicles.length > 3 && (
                  <p className="text-xs text-muted-foreground pl-2">
                    +{section.vehicles.length - 3} más
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
