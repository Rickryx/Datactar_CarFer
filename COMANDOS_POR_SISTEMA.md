# 💻 Comandos Específicos por Sistema Operativo

## 🪟 **WINDOWS**

### Abrir Terminal
- **Opción 1:** Presiona `Win + R`, escribe `cmd`, presiona Enter
- **Opción 2:** Presiona `Win + X`, selecciona "Windows PowerShell"
- **Opción 3:** Busca "cmd" o "PowerShell" en el menú inicio

### Comandos Windows
```cmd
# Navegar a Desktop
cd Desktop

# Clonar proyecto
git clone https://github.com/Rickryx/Datactar_CarFer.git

# Entrar al proyecto
cd Datactar_CarFer

# Instalar dependencias
npm install

# Ejecutar aplicación
npm run dev
```

### Si tienes problemas con permisos en Windows:
```powershell
# Ejecutar PowerShell como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Luego ejecutar los comandos normales
npm install
npm run dev
```

---

## 🍎 **macOS**

### Abrir Terminal
- **Opción 1:** Presiona `Cmd + Espacio`, escribe "Terminal", presiona Enter
- **Opción 2:** Ve a Aplicaciones → Utilidades → Terminal
- **Opción 3:** Presiona `Cmd + T` si ya tienes Terminal abierto

### Comandos macOS
```bash
# Navegar a Desktop
cd ~/Desktop

# Clonar proyecto
git clone https://github.com/Rickryx/Datactar_CarFer.git

# Entrar al proyecto
cd Datactar_CarFer

# Instalar dependencias
npm install

# Ejecutar aplicación
npm run dev
```

### Si no tienes Git instalado en Mac:
```bash
# Instalar Homebrew primero
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Git
brew install git

# Verificar instalación
git --version
```

---

## 🐧 **LINUX (Ubuntu/Debian)**

### Abrir Terminal
- **Opción 1:** Presiona `Ctrl + Alt + T`
- **Opción 2:** Busca "Terminal" en el menú de aplicaciones
- **Opción 3:** Clic derecho en el escritorio → "Abrir Terminal"

### Comandos Linux
```bash
# Actualizar sistema primero
sudo apt update

# Instalar Node.js y npm
sudo apt install nodejs npm git

# Verificar instalaciones
node --version
npm --version
git --version

# Navegar a Desktop
cd ~/Desktop

# Clonar proyecto
git clone https://github.com/Rickryx/Datactar_CarFer.git

# Entrar al proyecto
cd Datactar_CarFer

# Instalar dependencias
npm install

# Ejecutar aplicación
npm run dev
```

---

## 🔧 **Instalación de Node.js por Sistema**

### Windows:
1. Ve a https://nodejs.org/
2. Descarga "Windows Installer (.msi)"
3. Ejecuta el archivo descargado
4. Sigue el asistente de instalación
5. Reinicia el cmd/PowerShell

### macOS:
```bash
# Opción 1: Descargar desde nodejs.org
# Ve a https://nodejs.org/ y descarga el .pkg

# Opción 2: Usar Homebrew
brew install node

# Verificar
node --version
npm --version
```

### Linux (Ubuntu/Debian):
```bash
# Opción 1: Repositorio oficial
sudo apt update
sudo apt install nodejs npm

# Opción 2: NodeSource (versión más reciente)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar
node --version
npm --version
```

---

## 🌐 **Acceder a la Aplicación**

Una vez que veas este mensaje en terminal:
```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
○ Network: http://192.168.1.100:3000
```

### En cualquier sistema:
1. Abre tu navegador favorito (Chrome, Firefox, Safari, Edge)
2. Ve a: **http://localhost:3000**
3. ¡Deberías ver Cam.i funcionando!

---

## 🛑 **Detener la Aplicación**

En cualquier sistema:
- Presiona `Ctrl + C` en la terminal donde está ejecutándose
- Cierra la ventana de terminal

---

## 📱 **Ver en Móvil (Mismo WiFi)**

Si quieres ver la aplicación en tu teléfono:
1. Asegúrate de que tu computadora y teléfono están en la misma red WiFi
2. Busca la línea que dice "Network: http://192.168.x.x:3000"
3. Abre esa URL en el navegador de tu teléfono

---

## 🔄 **Comandos de Mantenimiento**

### Limpiar caché (cualquier sistema):
```bash
# Limpiar node_modules
rm -rf node_modules  # Linux/Mac
rmdir /s node_modules  # Windows

# Limpiar package-lock.json
rm package-lock.json  # Linux/Mac
del package-lock.json  # Windows

# Reinstalar todo
npm install
```

### Actualizar dependencias:
```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar todas
npm update

# Actualizar una específica
npm install package-name@latest
```

---

## 🆘 **Problemas Específicos por Sistema**

### Windows:
- **Error "execution policy"**: Ejecutar PowerShell como administrador
- **Error de permisos**: Usar `npm install --no-optional`
- **Puerto ocupado**: Usar `npm run dev -- --port 3001`

### macOS:
- **Error "command not found"**: Reinstalar Node.js desde nodejs.org
- **Error de permisos**: Usar `sudo npm install -g npm`
- **Xcode tools**: `xcode-select --install`

### Linux:
- **Error "EACCES"**: `sudo chown -R $(whoami) ~/.npm`
- **Error "node not found"**: `sudo ln -s /usr/bin/nodejs /usr/bin/node`
- **Puerto ocupado**: `sudo lsof -i :3000` para ver qué lo usa

---

## ✅ **Verificación Final**

Después de seguir los pasos, deberías ver:
- ✅ Mapa de Bogotá con vehículos
- ✅ Rutas visibles en el mapa
- ✅ Panel derecho con KPIs
- ✅ FleetCopilot funcionando
- ✅ Datos en tiempo real actualizándose

¡Si ves todo esto, **Cam.i** está funcionando perfectamente! 🚛✨
