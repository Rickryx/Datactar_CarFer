'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Vehicle } from '@/lib/data/mock-fleet';
import { 
  Car, 
  User, 
  Fuel, 
  AlertTriangle,
  Clock,
  Wrench
} from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
  selectedVehicle?: Vehicle;
}

export function VehicleList({ vehicles, onVehicleSelect, selectedVehicle }: VehicleListProps) {
  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'alert': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: Vehicle['status']) => {
    const variants = {
      online: 'default',
      warning: 'secondary',
      alert: 'destructive',
      offline: 'outline'
    } as const;
    
    const labels = {
      online: 'en línea',
      warning: 'advertencia',
      alert: 'alerta',
      offline: 'desconectado'
    };
    
    return (
      <Badge variant={variants[status]} className="text-xs">
        {labels[status]}
      </Badge>
    );
  };

  const getFuelColor = (fuel: number) => {
    if (fuel < 15) return 'bg-red-500';
    if (fuel < 25) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Car className="h-5 w-5" />
          Vehículos de la Flota
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedVehicle?.id === vehicle.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => onVehicleSelect(vehicle)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)}`} />
                    <span className="font-semibold text-sm">{vehicle.alias}</span>
                    {getStatusBadge(vehicle.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">{vehicle.plate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{vehicle.lastUpdate}</p>
                  {vehicle.speed > 0 && (
                    <p className="text-xs font-medium text-blue-600">{vehicle.speed} km/h</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{vehicle.driver}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Fuel className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">Combustible</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    vehicle.fuel < 15 ? 'text-red-600' : 
                    vehicle.fuel < 25 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {vehicle.fuel}%
                  </span>
                </div>
                <Progress 
                  value={vehicle.fuel} 
                  className="h-1"
                  style={{
                    '--progress-background': getFuelColor(vehicle.fuel)
                  } as React.CSSProperties}
                />
              </div>

              {vehicle.alerts.length > 0 && (
                <div className="mt-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  <span className="text-xs text-amber-600">
                    {vehicle.alerts.length} alerta{vehicle.alerts.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
