# 🔗 Instrucciones para Conectar Cam.i a GitHub

## 📋 Pasos para Subir el Proyecto a tu Repositorio

### 1. Verificar el Estado Actual
El proyecto ya está preparado con Git y tiene el remote configurado:
```bash
git remote -v
# origin  https://github.com/Rickryx/Datactar_CarFer.git (fetch)
# origin  https://github.com/Rickryx/Datactar_CarFer.git (push)
```

### 2. Autenticación con GitHub
Necesitas autenticarte con GitHub. Tienes varias opciones:

#### Opción A: Personal Access Token (Recomendado)
1. Ve a GitHub.com → Settings → Developer settings → Personal access tokens
2. Genera un nuevo token con permisos de `repo`
3. Usa el token como contraseña cuando Git te lo pida

#### Opción B: GitHub CLI
```bash
# Instalar GitHub CLI
gh auth login
# Seguir las instrucciones para autenticarte
```

#### Opción C: SSH (Más seguro)
```bash
# Generar clave SSH
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"

# Agregar la clave a GitHub
# Copiar el contenido de ~/.ssh/id_ed25519.pub a GitHub → Settings → SSH Keys

# Cambiar remote a SSH
git remote set-url origin git@github.com:Rickryx/Datactar_CarFer.git
```

### 3. Subir el Proyecto
Una vez autenticado, ejecuta:
```bash
# Verificar que todos los archivos están agregados
git status

# Si hay archivos nuevos, agregarlos
git add .

# Hacer commit si hay cambios
git commit -m "Update: Add README and setup instructions"

# Subir al repositorio
git push -u origin main
```

### 4. Verificar en GitHub
Ve a https://github.com/Rickryx/Datactar_CarFer.git para verificar que el proyecto se subió correctamente.

## 📁 Archivos Incluidos en el Commit

✅ **Aplicación Completa Cam.i:**
- Dashboard de gestión de flotas en español
- Mapa interactivo con rutas simuladas
- FleetCopilot IA conversacional
- Sistema de alertas y KPIs
- Componentes UI modernos con shadcn/ui

✅ **Documentación:**
- README.md completo con instrucciones
- Estructura del proyecto documentada
- Lista de funcionalidades implementadas

✅ **Configuración:**
- Next.js 15 con TypeScript
- Tailwind CSS y shadcn/ui
- Leaflet para mapas interactivos
- Datos simulados de 10 vehículos en Bogotá

## 🚀 Próximos Pasos Después de Subir

1. **Configurar GitHub Pages** (opcional):
   - Settings → Pages → Source: GitHub Actions
   - El proyecto se desplegará automáticamente

2. **Configurar Vercel** (recomendado):
   - Conectar el repo a Vercel.com
   - Deploy automático en cada push

3. **Agregar Colaboradores**:
   - Settings → Manage access → Invite collaborators

4. **Configurar Issues y Projects**:
   - Para gestionar nuevas funcionalidades
   - Tracking de bugs y mejoras

## 🔧 Comandos de Git Útiles

```bash
# Ver estado del repositorio
git status

# Ver historial de commits
git log --oneline

# Ver diferencias
git diff

# Crear nueva rama
git checkout -b nueva-funcionalidad

# Cambiar entre ramas
git checkout main

# Fusionar rama
git merge nueva-funcionalidad

# Actualizar desde GitHub
git pull origin main
```

## 🆘 Solución de Problemas Comunes

### Error: "Authentication failed"
- Verificar credenciales de GitHub
- Usar Personal Access Token en lugar de contraseña
- Configurar SSH si prefieres

### Error: "Repository not found"
- Verificar que el repositorio existe en GitHub
- Verificar permisos de acceso
- Verificar la URL del remote

### Error: "Permission denied"
- Verificar que tienes permisos de escritura
- Verificar configuración SSH
- Contactar al propietario del repositorio

---

💡 **Tip:** Una vez subido el proyecto, podrás colaborar fácilmente usando GitHub para gestionar versiones, issues y pull requests.
