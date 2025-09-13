# 🚀 Guía Completa para Ejecutar Cam.i en Local

## 📋 Guía Paso a Paso para Dummies

### 🔧 **PASO 1: Instalar Prerrequisitos**

#### A) Instalar Node.js
1. Ve a https://nodejs.org/
2. Descarga la versión **LTS** (recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. Verifica la instalación abriendo terminal/cmd y escribiendo:
   ```bash
   node --version
   npm --version
   ```

#### B) Instalar Git (si no lo tienes)
1. Ve a https://git-scm.com/
2. Descarga e instala Git
3. Verifica escribiendo en terminal:
   ```bash
   git --version
   ```

### 📥 **PASO 2: Descargar el Proyecto**

#### Opción A: Clonar con Git (Recomendado)
```bash
# Abrir terminal/cmd y navegar a donde quieres el proyecto
cd Desktop
# o
cd Documents

# Clonar el repositorio
git clone https://github.com/Rickryx/Datactar_CarFer.git

# Entrar al directorio
cd Datactar_CarFer
```

#### Opción B: Descargar ZIP
1. Ve a https://github.com/Rickryx/Datactar_CarFer
2. Clic en el botón verde **"Code"**
3. Selecciona **"Download ZIP"**
4. Extrae el archivo ZIP
5. Abre terminal en la carpeta extraída

### 📦 **PASO 3: Instalar Dependencias**

```bash
# Asegúrate de estar en la carpeta del proyecto
cd Datactar_CarFer

# Instalar todas las dependencias
npm install

# Esperar a que termine (puede tomar unos minutos)
```

### ▶️ **PASO 4: Ejecutar la Aplicación**

```bash
# Ejecutar en modo desarrollo
npm run dev

# Verás algo como:
# ✓ Ready in 2.3s
# ○ Local:   http://localhost:3000
```

### 🌐 **PASO 5: Ver la Aplicación**

1. Abre tu navegador web
2. Ve a: **http://localhost:3000**
3. ¡Listo! Deberías ver **Cam.i** funcionando

---

## ❓ **Preguntas Frecuentes**

### **P: ¿Dónde está el archivo .py y el modelo de IA?**

**R:** **Cam.i** es una aplicación **100% JavaScript/TypeScript**, NO usa Python. La "IA" es simulada:

- **FleetCopilot** usa lógica JavaScript para responder comandos
- **No hay modelo de machine learning real**
- **No hay archivos .py** porque no los necesita
- Es una **simulación inteligente** de respuestas basada en los datos de la flota

### **P: ¿Cómo funciona la "IA" entonces?**

**R:** La IA es **simulada** mediante:
```javascript
// Ejemplo del código en components/fleet/fleet-copilot.tsx
if (command.startsWith('/estado')) {
  response = `Verificando estado del vehículo ${plate}...`;
} else if (command.startsWith('/combustible')) {
  response = 'Encontré 3 vehículos con combustible bajo...';
}
```

### **P: ¿Los datos son reales?**

**R:** No, son **datos simulados** de 10 vehículos en Bogotá:
- Ubicaciones ficticias pero realistas
- Rutas simuladas por la ciudad
- Datos de combustible, velocidad, etc. generados automáticamente

---

## 🛠️ **Solución de Problemas Comunes**

### Error: "npm no se reconoce como comando"
- **Solución:** Reinstalar Node.js desde nodejs.org
- Reiniciar terminal después de instalar

### Error: "Puerto 3000 ya está en uso"
```bash
# Usar otro puerto
npm run dev -- --port 3001
# Luego ir a http://localhost:3001
```

### Error: "Cannot find module"
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules
rm package-lock.json
npm install
```

### La aplicación se ve rota o sin estilos
```bash
# Limpiar caché y reinstalar
npm run build
npm run dev
```

---

## 📁 **Estructura del Proyecto (Para Entender)**

```
Datactar_CarFer/
├── app/                    # Páginas de Next.js
│   ├── page.tsx           # Página principal
│   └── layout.tsx         # Layout general
├── components/
│   ├── fleet/             # Componentes de la flota
│   │   ├── fleet-map.tsx      # Mapa con rutas
│   │   ├── fleet-copilot.tsx  # "IA" simulada
│   │   ├── kpi-cards.tsx      # Tarjetas de KPIs
│   │   └── ...
│   └── ui/                # Componentes de interfaz
├── lib/
│   └── data/
│       └── mock-fleet.ts  # Datos simulados de vehículos
├── package.json           # Dependencias del proyecto
└── README.md             # Documentación
```

---

## 🎯 **Comandos Útiles**

```bash
# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar versión de producción
npm start

# Verificar errores de código
npm run lint

# Ver todas las dependencias instaladas
npm list
```

---

## 🔄 **Actualizar el Proyecto**

Si hay cambios nuevos en GitHub:
```bash
# Descargar cambios
git pull origin main

# Instalar nuevas dependencias (si las hay)
npm install

# Ejecutar de nuevo
npm run dev
```

---

## 💡 **Notas Importantes**

1. **No necesitas Python** - Es 100% JavaScript
2. **No hay modelo de IA real** - Es simulación inteligente
3. **Los datos son ficticios** - Pero realistas para demostración
4. **Funciona offline** - No necesita internet después de instalar
5. **Es responsive** - Se ve bien en móvil y desktop

---

## 🆘 **¿Necesitas Ayuda?**

Si algo no funciona:
1. Verifica que Node.js esté instalado correctamente
2. Asegúrate de estar en la carpeta correcta del proyecto
3. Revisa que todas las dependencias se instalaron: `npm install`
4. Intenta limpiar y reinstalar: `rm -rf node_modules && npm install`

¡Listo! Tu amigo debería poder ejecutar **Cam.i** siguiendo estos pasos. 🚛✨
