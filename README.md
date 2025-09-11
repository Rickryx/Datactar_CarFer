# Cam.i - Fleet Management Dashboard

🚛 **Plataforma de gestión inteligente de flotas con IA conversacional**

## 🌟 Características Principales

### 📊 Dashboard Completo
- **Mapa en tiempo real** con visualización de 10 vehículos en Bogotá
- **KPIs dinámicos**: Conectados, En movimiento, Combustible, Mantenimiento
- **Alertas prioritarias** categorizadas por urgencia
- **Lista detallada de vehículos** con estados en tiempo real

### 🗺️ Visualización de Rutas
- **Trayectos simulados** para cada vehículo con rutas realistas
- **Líneas de colores** según estado (verde=en línea, amarillo=advertencia, rojo=alerta, gris=desconectado)
- **Rastros de 24 horas** con puntos históricos
- **Popups informativos** con detalles completos de cada vehículo

### 🤖 FleetCopilot - Asistente IA
- **Chat conversacional** completamente en español
- **Comandos inteligentes**: `/estado`, `/combustible bajo`, `/difundir`, `/cercano`
- **Respuestas contextuales** basadas en datos reales de la flota
- **Interfaz de voz** simulada para comandos por audio

### 📱 Interfaz Moderna
- **Diseño responsivo** con shadcn/ui y Tailwind CSS
- **Tema oscuro/claro** disponible
- **Drawer de detalles** con telemetría completa
- **Sistema de difusión** de mensajes a conductores

## 🛠️ Tecnologías Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **shadcn/ui** - Componentes UI modernos
- **Leaflet** - Mapas interactivos
- **Lucide React** - Iconografía

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o bun

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Rickryx/Datactar_CarFer.git
cd Datactar_CarFer

# Instalar dependencias
npm install
# o
bun install

# Ejecutar en desarrollo
npm run dev
# o
bun dev
```

### Acceso
Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 📁 Estructura del Proyecto

```
fleet-dashboard/
├── app/                    # App Router de Next.js
├── components/
│   ├── fleet/             # Componentes específicos de flota
│   │   ├── dashboard-header.tsx
│   │   ├── fleet-map.tsx
│   │   ├── fleet-copilot.tsx
│   │   ├── kpi-cards.tsx
│   │   ├── priority-alerts.tsx
│   │   ├── vehicle-list.tsx
│   │   └── vehicle-detail.tsx
│   └── ui/                # Componentes UI de shadcn
├── lib/
│   └── data/
│       └── mock-fleet.ts  # Datos simulados de vehículos
└── hooks/                 # Custom hooks
```

## 🎯 Funcionalidades Implementadas

### ✅ Mapa Interactivo
- [x] Visualización de 10 vehículos en Bogotá
- [x] Rutas simuladas con trayectos realistas
- [x] Toggle para mostrar/ocultar rutas
- [x] Rastros de 24 horas con puntos históricos
- [x] Popups con información detallada
- [x] Resaltado de vehículo seleccionado

### ✅ Panel de Control
- [x] KPIs en tiempo real (Conectados, En movimiento, Combustible, Mantenimiento)
- [x] Alertas prioritarias por categorías
- [x] Lista de vehículos con filtrado
- [x] Búsqueda por placa, alias o conductor

### ✅ FleetCopilot IA
- [x] Chat conversacional en español
- [x] Comandos específicos de flota
- [x] Respuestas contextuales inteligentes
- [x] Interfaz de comandos rápidos

### ✅ Detalles de Vehículos
- [x] Drawer con información completa
- [x] Telemetría en tiempo real
- [x] Datos de combustible y batería
- [x] Información de servicio y mantenimiento
- [x] Sistema de alertas

## 🌍 Datos Simulados

El sistema incluye datos simulados de 10 vehículos operando en Bogotá:

- **Furgón Reparto 1** (ABC-123) - Ruta Norte
- **Camión Alpha** (DEF-456) - Ruta Industrial  
- **Furgón Beta** (GHI-789) - Ruta Sur
- **Pickup Gamma** (JKL-012) - Ruta Oeste
- **Sedán Delta** (MNO-345) - Ruta Este
- **Furgón Echo** (PQR-678) - Ruta Circular
- **Camión Foxtrot** (STU-901) - Ruta Logística
- **Furgón Golf** (VWX-234) - Ruta Comercial
- **Pickup Hotel** (YZA-567) - Ruta Residencial
- **Sedán India** (BCD-890) - Ruta Express

## 🔮 Próximas Funcionalidades

- [ ] Integración con APIs reales de telemetría
- [ ] Notificaciones push en tiempo real
- [ ] Reportes y analytics avanzados
- [ ] Geofencing y alertas de zona
- [ ] Optimización de rutas con IA
- [ ] Integración con sistemas de mantenimiento
- [ ] App móvil para conductores

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Rickryx** - [GitHub](https://github.com/Rickryx)

---

⭐ **¡Dale una estrella al proyecto si te ha sido útil!**
