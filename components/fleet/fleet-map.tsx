'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, Route, Eye, EyeOff } from 'lucide-react';

interface Vehicle {
  id: string;
  plate: string;
  alias: string;
  driver: string;
  status: 'online' | 'offline' | 'alert' | 'warning';
  position: {
    lat: number;
    lng: number;
  };
  fuel: number;
  speed: number;
  ignition: boolean;
  odometer: number;
  battery: number;
  lastUpdate: string;
  maintenanceKm: number;
  nextServiceKm: number;
  alerts: string[];
}

interface FleetMapProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
  selectedVehicle?: Vehicle;
}

export function FleetMap({ vehicles, onVehicleSelect, selectedVehicle }: FleetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);
  const [showRoutes, setShowRoutes] = useState(true);
  const [show24hTrails, setShow24hTrails] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Rutas predefinidas para cada vehículo
  const vehicleRoutes: { [key: string]: Array<{ lat: number; lng: number }> } = {
    'ABC-123': [
      { lat: 4.7110, lng: -74.0721 },
      { lat: 4.6800, lng: -74.0500 },
      { lat: 4.6500, lng: -74.0600 },
      { lat: 4.6200, lng: -74.0800 },
      { lat: 4.6097, lng: -74.0817 }
    ],
    'DEF-456': [
      { lat: 4.5800, lng: -74.1200 },
      { lat: 4.6000, lng: -74.1000 },
      { lat: 4.6200, lng: -74.0900 },
      { lat: 4.6400, lng: -74.0700 },
      { lat: 4.6351, lng: -74.0703 }
    ],
    'GHI-789': [
      { lat: 4.5500, lng: -74.1100 },
      { lat: 4.5800, lng: -74.0900 },
      { lat: 4.6000, lng: -74.0800 },
      { lat: 4.6100, lng: -74.0780 },
      { lat: 4.5981, lng: -74.0758 }
    ],
    'JKL-012': [
      { lat: 4.6800, lng: -74.1200 },
      { lat: 4.6600, lng: -74.1000 },
      { lat: 4.6500, lng: -74.0850 },
      { lat: 4.6480, lng: -74.0780 },
      { lat: 4.6482, lng: -74.0776 }
    ],
    'MNO-345': [
      { lat: 4.6000, lng: -74.0400 },
      { lat: 4.6100, lng: -74.0500 },
      { lat: 4.6200, lng: -74.0600 },
      { lat: 4.6240, lng: -74.0630 },
      { lat: 4.6244, lng: -74.0631 }
    ],
    'PQR-678': [
      { lat: 4.6000, lng: -74.1200 },
      { lat: 4.5900, lng: -74.1100 },
      { lat: 4.5800, lng: -74.1000 },
      { lat: 4.5720, lng: -74.0980 },
      { lat: 4.5709, lng: -74.0973 }
    ],
    'STU-901': [
      { lat: 4.6200, lng: -74.1000 },
      { lat: 4.6300, lng: -74.0900 },
      { lat: 4.6400, lng: -74.0850 },
      { lat: 4.6530, lng: -74.0840 },
      { lat: 4.6533, lng: -74.0836 }
    ],
    'VWX-234': [
      { lat: 4.5600, lng: -74.0800 },
      { lat: 4.5700, lng: -74.0700 },
      { lat: 4.5800, lng: -74.0650 },
      { lat: 4.5880, lng: -74.0590 },
      { lat: 4.5889, lng: -74.0583 }
    ],
    'YZA-567': [
      { lat: 4.6400, lng: -74.1100 },
      { lat: 4.6300, lng: -74.1000 },
      { lat: 4.6200, lng: -74.0950 },
      { lat: 4.6160, lng: -74.0900 },
      { lat: 4.6156, lng: -74.0892 }
    ],
    'BCD-890': [
      { lat: 4.6600, lng: -74.0500 },
      { lat: 4.6500, lng: -74.0600 },
      { lat: 4.6450, lng: -74.0650 },
      { lat: 4.6420, lng: -74.0654 },
      { lat: 4.6421, lng: -74.0654 }
    ]
  };

  const getVehicleColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'alert': return '#ef4444';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'En línea';
      case 'warning': return 'Advertencia';
      case 'alert': return 'Alerta';
      case 'offline': return 'Desconectado';
      default: return 'Desconocido';
    }
  };

  // Inicializar mapa
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      import('leaflet').then((L) => {
        // Configurar iconos
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Crear mapa
        const map = L.map(mapRef.current!).setView([4.6097, -74.0817], 11);

        // Añadir tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        mapInstanceRef.current = map;
        setIsMapReady(true);
      });
    }
  }, []);

  // Actualizar marcadores y rutas
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      // Limpiar capas existentes
      layersRef.current.forEach(layer => {
        mapInstanceRef.current.removeLayer(layer);
      });
      layersRef.current = [];

      // Añadir vehículos y rutas
      vehicles.forEach(vehicle => {
        const color = getVehicleColor(vehicle.status);
        
        // Añadir ruta si está habilitada
        if (showRoutes && vehicleRoutes[vehicle.plate]) {
          const routeCoords = vehicleRoutes[vehicle.plate].map(point => [point.lat, point.lng]);
          
          // Crear línea de ruta
          const routeLine = L.polyline(routeCoords, {
            color: color,
            weight: 4,
            opacity: 0.7,
            dashArray: vehicle.status === 'offline' ? '10, 5' : undefined
          });
          
          routeLine.addTo(mapInstanceRef.current);
          layersRef.current.push(routeLine);

          // Añadir puntos de rastro si está habilitado
          if (show24hTrails) {
            vehicleRoutes[vehicle.plate].forEach((point, index) => {
              if (index < vehicleRoutes[vehicle.plate].length - 1) {
                const trailPoint = L.circleMarker([point.lat, point.lng], {
                  radius: 4,
                  fillColor: color,
                  color: 'white',
                  weight: 2,
                  opacity: 1,
                  fillOpacity: 0.8
                }).bindPopup(`
                  <div>
                    <strong>${vehicle.alias}</strong><br>
                    Punto ${index + 1} de la ruta<br>
                    Coordenadas: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}
                  </div>
                `);
                
                trailPoint.addTo(mapInstanceRef.current);
                layersRef.current.push(trailPoint);
              }
            });
          }
        }

        // Añadir marcador del vehículo (usando vehicle.position.lat y vehicle.position.lng)
        const marker = L.marker([vehicle.position.lat, vehicle.position.lng])
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${vehicle.alias}</h3>
              <p style="margin: 2px 0;"><strong>Placa:</strong> ${vehicle.plate}</p>
              <p style="margin: 2px 0;"><strong>Conductor:</strong> ${vehicle.driver}</p>
              <p style="margin: 2px 0;"><strong>Velocidad:</strong> ${vehicle.speed.toFixed(1)} km/h</p>
              <p style="margin: 2px 0;"><strong>Combustible:</strong> ${vehicle.fuel.toFixed(1)}%</p>
              <p style="margin: 2px 0;"><strong>Estado:</strong> 
                <span style="color: ${color}; font-weight: bold;">
                  ${getStatusText(vehicle.status)}
                </span>
              </p>
            </div>
          `)
          .on('click', () => onVehicleSelect(vehicle));

        marker.addTo(mapInstanceRef.current);
        layersRef.current.push(marker);

        // Resaltar vehículo seleccionado
        if (selectedVehicle && selectedVehicle.id === vehicle.id) {
          const highlight = L.circle([vehicle.position.lat, vehicle.position.lng], {
            radius: 300,
            fillColor: color,
            color: color,
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.2
          });
          
          highlight.addTo(mapInstanceRef.current);
          layersRef.current.push(highlight);
        }
      });
    });
  }, [vehicles, selectedVehicle, showRoutes, show24hTrails, isMapReady]);

  const onlineCount = vehicles.filter(v => v.status !== 'offline').length;
  const totalCount = vehicles.length;

  return (
    <Card className="h-96">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Mapa de Flota en Vivo</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-routes"
                checked={showRoutes}
                onCheckedChange={setShowRoutes}
              />
              <Label htmlFor="show-routes" className="text-sm">
                <Route className="h-4 w-4 inline mr-1" />
                Rutas
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-trails"
                checked={show24hTrails}
                onCheckedChange={setShow24hTrails}
              />
              <Label htmlFor="show-trails" className="text-sm">
                {show24hTrails ? <Eye className="h-4 w-4 inline mr-1" /> : <EyeOff className="h-4 w-4 inline mr-1" />}
                Rastros 24h
              </Label>
            </div>
            <Badge variant="outline" className="text-xs">
              {onlineCount}/{totalCount} activos
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapRef} className="h-80 w-full rounded-b-lg" />
      </CardContent>
    </Card>
  );
}
