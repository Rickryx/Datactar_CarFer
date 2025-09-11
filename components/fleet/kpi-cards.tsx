'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FleetKPI } from '@/lib/data/mock-fleet';
import { 
  Wifi, 
  Navigation, 
  Fuel, 
  Wrench,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface KPICardsProps {
  kpis: FleetKPI;
}

export function KPICards({ kpis }: KPICardsProps) {
  const cards = [
    {
      title: 'Conectados',
      value: `${kpis.connected}/${kpis.total}`,
      icon: Wifi,
      color: kpis.connected === kpis.total ? 'text-green-600' : 'text-amber-600',
      bgColor: kpis.connected === kpis.total ? 'bg-green-50' : 'bg-amber-50',
      percentage: Math.round((kpis.connected / kpis.total) * 100)
    },
    {
      title: 'En Movimiento',
      value: kpis.moving.toString(),
      icon: Navigation,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      percentage: Math.round((kpis.moving / kpis.total) * 100)
    },
    {
      title: 'Necesitan Combustible',
      value: kpis.needFuel.toString(),
      icon: Fuel,
      color: kpis.needFuel > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: kpis.needFuel > 0 ? 'bg-red-50' : 'bg-green-50',
      percentage: Math.round((kpis.needFuel / kpis.total) * 100)
    },
    {
      title: 'Mantenimiento Próximo',
      value: kpis.needMaintenance.toString(),
      icon: Wrench,
      color: kpis.needMaintenance > 0 ? 'text-amber-600' : 'text-green-600',
      bgColor: kpis.needMaintenance > 0 ? 'bg-amber-50' : 'bg-green-50',
      percentage: Math.round((kpis.needMaintenance / kpis.total) * 100)
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.percentage}% de la flota
                </p>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
