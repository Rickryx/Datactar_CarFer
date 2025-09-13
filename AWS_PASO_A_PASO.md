# 🚀 AWS Paso a Paso - Desplegar Cam.i

## 🎯 **Opción Recomendada: AWS Amplify**

### **¿Por qué AWS Amplify?**
- ✅ **Específico para Next.js** - Optimizado para tu stack
- ✅ **Deploy automático** desde GitHub
- ✅ **SSL gratuito** y CDN global
- ✅ **Escalamiento automático** según demanda
- ✅ **Costo bajo** - Solo pagas por uso

---

## 📋 **PASO 1: Crear Cuenta AWS**

### **A) Registro en AWS**
1. Ve a: **https://aws.amazon.com/**
2. Clic **"Create an AWS Account"**
3. Completa el formulario:
   - Email
   - Contraseña
   - Nombre de cuenta AWS: `cam-i-fleet-management`

### **B) Verificación de Identidad**
1. Ingresa tu **número de teléfono**
2. Recibirás un **código de verificación**
3. Ingresa el código

### **C) Información de Pago**
1. Agrega tu **tarjeta de crédito**
2. **No te preocupes:** AWS tiene capa gratuita
3. Para Cam.i, el costo será **$0-5/mes** inicialmente

### **D) Plan de Soporte**
1. Selecciona **"Basic Support - Free"**
2. Clic **"Complete Sign Up"**

### **E) Verificación Final**
1. Recibirás email de confirmación
2. Puede tomar **2-24 horas** activar la cuenta
3. Una vez activa, podrás acceder a **AWS Console**

---

## 🚀 **PASO 2: Configurar AWS Amplify**

### **A) Acceder a AWS Console**
1. Ve a: **https://console.aws.amazon.com/**
2. Inicia sesión con tu cuenta
3. En la barra de búsqueda, escribe: **"Amplify"**
4. Clic en **"AWS Amplify"**

### **B) Crear Nueva App**
1. En AWS Amplify, clic **"New app"**
2. Selecciona **"Host web app"**
3. Clic **"Get started"**

### **C) Conectar Repositorio**
1. Selecciona **"GitHub"**
2. Clic **"Continue"**
3. **Autorizar AWS Amplify** en GitHub:
   - Se abrirá ventana de GitHub
   - Clic **"Authorize aws-amplify-console"**
   - Ingresa tu contraseña de GitHub si es necesario

### **D) Seleccionar Repositorio**
1. En la lista, busca **"Datactar_CarFer"**
2. Selecciónalo
3. Branch: **"main"**
4. Clic **"Next"**

---

## ⚙️ **PASO 3: Configurar Build Settings**

### **A) Configuración Automática**
AWS detectará automáticamente que es un proyecto Next.js y configurará:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### **B) Variables de Entorno**
1. En la sección **"Environment variables"**, clic **"Add environment variable"**
2. Agrega cada variable:

```
Variable 1:
Key: OPENAI_API_KEY
Value: sk-proj-tu-api-key-completa-aqui

Variable 2:
Key: OPENAI_MODEL
Value: gpt-3.5-turbo

Variable 3:
Key: OPENAI_MAX_TOKENS
Value: 500

Variable 4:
Key: OPENAI_TEMPERATURE
Value: 0.7

Variable 5:
Key: NODE_ENV
Value: production
```

### **C) Configuración Avanzada (Opcional)**
```yaml
# Si necesitas personalizar el build
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - echo "Preparando build para producción..."
    build:
      commands:
        - npm run build
        - echo "Build completado exitosamente"
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

---

## 🚀 **PASO 4: Deploy Inicial**

### **A) Iniciar Deploy**
1. Revisa toda la configuración
2. Clic **"Save and deploy"**
3. **¡Paciencia!** El primer deploy toma **5-10 minutos**

### **B) Monitorear el Proceso**
Verás 4 fases:
1. **Provision** - Preparando infraestructura ⏳
2. **Build** - Compilando tu aplicación 🔨
3. **Deploy** - Subiendo archivos ⬆️
4. **Verify** - Verificando funcionamiento ✅

### **C) ¡Deploy Exitoso!**
Una vez completado, verás:
- ✅ **URL de tu app:** `https://main.d1234567890.amplifyapp.com`
- ✅ **Estado:** Deployed
- ✅ **Tiempo:** ~8 minutos

---

## 🌐 **PASO 5: Configurar Dominio Personalizado**

### **A) Agregar Dominio**
1. En tu app de Amplify, ve a **"Domain management"**
2. Clic **"Add domain"**
3. Ingresa tu dominio: `cam-i.tudominio.com`

### **B) Configurar DNS**
Si tu dominio está en:

**GoDaddy/Namecheap:**
1. Ve a tu panel de DNS
2. Agrega registro CNAME:
   - Name: `cam-i`
   - Value: `d1234567890.amplifyapp.com`

**Cloudflare:**
1. Ve a tu panel de Cloudflare
2. Agrega registro CNAME:
   - Name: `cam-i`
   - Target: `d1234567890.amplifyapp.com`
   - Proxy status: DNS only

### **C) Verificación SSL**
1. AWS generará automáticamente certificado SSL
2. Proceso toma **15-45 minutos**
3. Una vez listo: `https://cam-i.tudominio.com` ✅

---

## 📊 **PASO 6: Monitoreo y Optimización**

### **A) Métricas en AWS**
1. En Amplify Console, ve a **"Monitoring"**
2. Verás:
   - **Requests** por minuto
   - **Data transfer** (bandwidth)
   - **Build duration**
   - **Error rate**

### **B) Logs de Build**
1. Ve a **"Build history"**
2. Clic en cualquier build para ver logs detallados
3. Útil para debuggear errores

### **C) Configurar Alertas**
```bash
# Opcional: Configurar CloudWatch Alarms
aws cloudwatch put-metric-alarm \
  --alarm-name "Cam-i-High-Error-Rate" \
  --alarm-description "Alert when error rate > 5%" \
  --metric-name ErrorRate \
  --namespace AWS/Amplify \
  --statistic Average \
  --period 300 \
  --threshold 5.0 \
  --comparison-operator GreaterThanThreshold
```

---

## 🔄 **PASO 7: Deploy Automático**

### **A) Configuración Automática**
¡Ya está configurado! Cada vez que hagas push a GitHub:

```bash
# En tu computadora local
git add .
git commit -m "Nueva funcionalidad agregada"
git push origin main

# AWS Amplify automáticamente:
# 1. Detecta el cambio
# 2. Inicia nuevo build
# 3. Despliega la nueva versión
# 4. ¡Tu app se actualiza en 5-8 minutos!
```

### **B) Branches de Desarrollo**
```bash
# Crear branch de desarrollo
git checkout -b desarrollo
git push origin desarrollo

# En AWS Amplify:
# 1. Ve a "App settings" > "General"
# 2. Clic "Connect branch"
# 3. Selecciona "desarrollo"
# 4. Tendrás: desarrollo.d1234567890.amplifyapp.com
```

---

## 💰 **PASO 8: Optimización de Costos**

### **A) Capa Gratuita AWS**
**Incluye (por 12 meses):**
- ✅ **1,000 build minutes** por mes
- ✅ **15 GB** de almacenamiento
- ✅ **100 GB** de data transfer
- ✅ **SSL certificados** gratuitos

### **B) Costos Después de Capa Gratuita**
```
Build minutes: $0.01 por minuto
Storage: $0.023 por GB/mes
Data transfer: $0.15 por GB

Ejemplo para Cam.i:
- 50 builds/mes × 3 min = $1.50
- 5 GB storage = $0.12
- 20 GB transfer = $3.00
TOTAL: ~$4.62/mes
```

### **C) Optimizaciones**
```javascript
// next.config.js - Optimizar build
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: true,
  images: {
    unoptimized: true
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  }
}

module.exports = nextConfig
```

---

## 🔒 **PASO 9: Seguridad y Backup**

### **A) Configurar HTTPS Headers**
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

### **B) Backup Automático**
AWS Amplify automáticamente:
- ✅ **Guarda historial** de todos los builds
- ✅ **Rollback fácil** a versiones anteriores
- ✅ **Redundancia** en múltiples zonas

### **C) Monitoreo de Seguridad**
1. Ve a **AWS CloudTrail** para logs de acceso
2. Configura **AWS Config** para compliance
3. Usa **AWS Security Hub** para alertas

---

## 🚨 **Solución de Problemas Comunes**

### **❌ Build Failed**
```bash
# Error común: Dependencias
# Solución: Verificar package.json
npm install
npm run build  # Probar localmente primero
```

### **❌ Environment Variables Not Working**
1. Ve a **App settings** > **Environment variables**
2. Verifica que estén **exactamente** como en `.env.local`
3. **Redeploy** después de cambiar variables

### **❌ Domain Not Working**
1. Verifica configuración DNS (puede tomar 24-48 horas)
2. Usa herramientas como `dig` o `nslookup`
3. Contacta soporte de tu proveedor de dominio

### **❌ High Costs**
1. Ve a **AWS Billing Dashboard**
2. Configura **Budget Alerts**
3. Optimiza imágenes y assets estáticos

---

## 📈 **PASO 10: Escalamiento**

### **A) Cuando Crecer**
Considera migrar a **EC2 + RDS** cuando tengas:
- **>10,000 usuarios** activos
- **>1TB** de data transfer/mes
- **Necesidad de base de datos** real
- **Integraciones complejas**

### **B) Arquitectura Escalada**
```
Internet → CloudFront (CDN) → ALB → EC2 (Auto Scaling) → RDS
                                ↓
                           ElastiCache (Redis)
```

### **C) Servicios Adicionales**
- **RDS PostgreSQL** - Base de datos real
- **ElastiCache** - Cache de sesiones
- **S3** - Almacenamiento de archivos
- **SES** - Envío de emails
- **SNS** - Notificaciones push

---

## 🎉 **¡Felicitaciones!**

**Tu aplicación Cam.i ahora está en producción en AWS con:**

✅ **URL pública:** `https://main.d1234567890.amplifyapp.com`
✅ **SSL automático** y seguridad empresarial
✅ **Deploy automático** desde GitHub
✅ **Escalamiento automático** según demanda
✅ **Monitoreo** y métricas en tiempo real
✅ **Backup automático** y rollback fácil

**Próximos pasos recomendados:**
1. 🌐 Configurar dominio personalizado
2. 📊 Configurar Google Analytics
3. 🔔 Configurar alertas de monitoreo
4. 📱 Desarrollar app móvil complementaria
5. 🗄️ Migrar a base de datos real cuando sea necesario

**¡Tu plataforma de gestión de flotas está lista para conquistar el mercado!** 🚛✨
