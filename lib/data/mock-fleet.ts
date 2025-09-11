export interface Vehicle {
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

export interface FleetKPI {
  connected: number;
  total: number;
  moving: number;
  needFuel: number;
  needMaintenance: number;
}

// Datos simulados de la flota - 10 vehículos alrededor de Bogotá
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    plate: 'ABC-123',
    alias: 'Furgón Reparto 1',
    driver: 'Carlos Méndez',
    status: 'online',
    position: { lat: 4.6097, lng: -74.0817 },
    fuel: 85,
    speed: 45,
    ignition: true,
    odometer: 125430,
    battery: 95,
    lastUpdate: 'hace 2 min',
    maintenanceKm: 125430,
    nextServiceKm: 130000,
    alerts: []
  },
  {
    id: '2',
    plate: 'DEF-456',
    alias: 'Camión Alpha',
    driver: 'María Rodríguez',
    status: 'warning',
    position: { lat: 4.6351, lng: -74.0703 },
    fuel: 12,
    speed: 0,
    ignition: false,
    odometer: 89750,
    battery: 88,
    lastUpdate: 'hace 5 min',
    maintenanceKm: 89750,
    nextServiceKm: 90000,
    alerts: ['Combustible bajo', 'Mantenimiento próximo']
  },
  {
    id: '3',
    plate: 'GHI-789',
    alias: 'Furgón Beta',
    driver: 'Luis García',
    status: 'online',
    position: { lat: 4.5981, lng: -74.0758 },
    fuel: 67,
    speed: 32,
    ignition: true,
    odometer: 67890,
    battery: 92,
    lastUpdate: 'hace 1 min',
    maintenanceKm: 67890,
    nextServiceKm: 75000,
    alerts: []
  },
  {
    id: '4',
    plate: 'JKL-012',
    alias: 'Pickup Gamma',
    driver: 'Ana Martínez',
    status: 'alert',
    position: { lat: 4.6482, lng: -74.0776 },
    fuel: 45,
    speed: 0,
    ignition: false,
    odometer: 156780,
    battery: 45,
    lastUpdate: 'hace 15 min',
    maintenanceKm: 156780,
    nextServiceKm: 160000,
    alerts: ['Sin señal', 'Batería baja']
  },
  {
    id: '5',
    plate: 'MNO-345',
    alias: 'Sedán Delta',
    driver: 'Pedro Silva',
    status: 'online',
    position: { lat: 4.6244, lng: -74.0631 },
    fuel: 78,
    speed: 28,
    ignition: true,
    odometer: 98450,
    battery: 89,
    lastUpdate: 'hace 3 min',
    maintenanceKm: 98450,
    nextServiceKm: 105000,
    alerts: []
  },
  {
    id: '6',
    plate: 'PQR-678',
    alias: 'Furgón Echo',
    driver: 'Sofía López',
    status: 'offline',
    position: { lat: 4.5709, lng: -74.0973 },
    fuel: 34,
    speed: 0,
    ignition: false,
    odometer: 203450,
    battery: 0,
    lastUpdate: 'hace 2 horas',
    maintenanceKm: 203450,
    nextServiceKm: 205000,
    alerts: ['Desconectado', 'Mantenimiento vencido']
  },
  {
    id: '7',
    plate: 'STU-901',
    alias: 'Camión Foxtrot',
    driver: 'Diego Ramírez',
    status: 'online',
    position: { lat: 4.6533, lng: -74.0836 },
    fuel: 91,
    speed: 55,
    ignition: true,
    odometer: 45670,
    battery: 96,
    lastUpdate: 'hace 1 min',
    maintenanceKm: 45670,
    nextServiceKm: 50000,
    alerts: []
  },
  {
    id: '8',
    plate: 'VWX-234',
    alias: 'Furgón Golf',
    driver: 'Carmen Torres',
    status: 'warning',
    position: { lat: 4.5889, lng: -74.0583 },
    fuel: 8,
    speed: 15,
    ignition: true,
    odometer: 178920,
    battery: 78,
    lastUpdate: 'hace 4 min',
    maintenanceKm: 178920,
    nextServiceKm: 180000,
    alerts: ['Nivel crítico de combustible']
  },
  {
    id: '9',
    plate: 'YZA-567',
    alias: 'Pickup Hotel',
    driver: 'Roberto Vargas',
    status: 'online',
    position: { lat: 4.6156, lng: -74.0892 },
    fuel: 56,
    speed: 38,
    ignition: true,
    odometer: 134560,
    battery: 85,
    lastUpdate: 'hace 2 min',
    maintenanceKm: 134560,
    nextServiceKm: 140000,
    alerts: []
  },
  {
    id: '10',
    plate: 'BCD-890',
    alias: 'Sedán India',
    driver: 'Lucía Herrera',
    status: 'online',
    position: { lat: 4.6421, lng: -74.0654 },
    fuel: 72,
    speed: 42,
    ignition: true,
    odometer: 87340,
    battery: 91,
    lastUpdate: 'hace 1 min',
    maintenanceKm: 87340,
    nextServiceKm: 95000,
    alerts: []
  }
];

export const getFleetKPIs = (): FleetKPI => {
  const connected = mockVehicles.filter(v => v.status !== 'offline').length;
  const moving = mockVehicles.filter(v => v.speed > 0).length;
  const needFuel = mockVehicles.filter(v => v.fuel < 15).length;
  const needMaintenance = mockVehicles.filter(v => v.nextServiceKm - v.maintenanceKm < 5000).length;
  
  return {
    connected,
    total: mockVehicles.length,
    moving,
    needFuel,
    needMaintenance
  };
};

export const getPriorityVehicles = () => {
  const lowFuel = mockVehicles
    .filter(v => v.fuel < 25)
    .sort((a, b) => a.fuel - b.fuel)
    .slice(0, 5);
    
  const serviceDue = mockVehicles
    .filter(v => v.nextServiceKm - v.maintenanceKm < 10000)
    .sort((a, b) => (a.nextServiceKm - a.maintenanceKm) - (b.nextServiceKm - b.maintenanceKm))
    .slice(0, 5);
    
  const noSignal = mockVehicles.filter(v => v.status === 'alert' || v.status === 'offline');
  
  return { lowFuel, serviceDue, noSignal };
};
