'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/fleet/dashboard-header';
import { FleetMap } from '@/components/fleet/fleet-map';
import { KPICards } from '@/components/fleet/kpi-cards';
import { VehicleList } from '@/components/fleet/vehicle-list';
import { PriorityAlerts } from '@/components/fleet/priority-alerts';
import { VehicleDetail } from '@/components/fleet/vehicle-detail';
import { FleetCopilot } from '@/components/fleet/fleet-copilot';
import { 
  mockVehicles, 
  getFleetKPIs, 
  getPriorityVehicles,
  Vehicle 
} from '@/lib/data/mock-fleet';

export default function FleetDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => ({
          ...vehicle,
          // Simulate small changes in speed and fuel
          speed: Math.max(0, vehicle.speed + (Math.random() - 0.5) * 10),
          fuel: Math.max(0, Math.min(100, vehicle.fuel + (Math.random() - 0.5) * 2)),
          battery: Math.max(0, Math.min(100, vehicle.battery + (Math.random() - 0.5) * 1)),
        }))
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter vehicles based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter(vehicle =>
        vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVehicles(filtered);
    }
  }, [searchQuery, vehicles]);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleBroadcast = (message: string, target: string) => {
    console.log(`Broadcasting to ${target}: ${message}`);
    // In a real app, this would send the message via API
  };

  const handleCopilotCommand = (command: string) => {
    console.log('FleetCopilot command:', command);
    // Process AI commands here
  };

  const kpis = getFleetKPIs();
  const priorities = getPriorityVehicles();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader 
        onSearch={handleSearch}
        onBroadcast={handleBroadcast}
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Map (70%) */}
        <div className="flex-1 p-6 pr-3">
          <FleetMap
            vehicles={filteredVehicles}
            onVehicleSelect={handleVehicleSelect}
            selectedVehicle={selectedVehicle}
          />
        </div>

        {/* Right Panel - Vehicle List & KPIs (30%) */}
        <div className="w-[400px] p-6 pl-3 flex flex-col">
          {/* KPI Cards */}
          <KPICards kpis={kpis} />

          {/* Priority Alerts */}
          <PriorityAlerts
            lowFuel={priorities.lowFuel}
            serviceDue={priorities.serviceDue}
            noSignal={priorities.noSignal}
            onVehicleSelect={handleVehicleSelect}
          />

          {/* Vehicle List */}
          <div className="flex-1 min-h-0">
            <VehicleList
              vehicles={filteredVehicles}
              onVehicleSelect={handleVehicleSelect}
              selectedVehicle={selectedVehicle}
            />
          </div>
        </div>
      </div>

      {/* Bottom Dock - FleetCopilot */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-sm border-t">
        <FleetCopilot onCommand={handleCopilotCommand} />
      </div>

      {/* Vehicle Detail Drawer */}
      <VehicleDetail
        vehicle={selectedVehicle}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
