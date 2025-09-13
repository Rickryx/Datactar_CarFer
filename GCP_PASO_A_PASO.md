# 🌐 Google Cloud Platform Paso a Paso - Desplegar Cam.i

## 🎯 **Opción Recomendada: Cloud Run**

### **¿Por qué Google Cloud Run?**
- ✅ **Serverless** - Solo pagas por uso real
- ✅ **$300 créditos gratuitos** para nuevos usuarios
- ✅ **Escalamiento automático** de 0 a miles de instancias
- ✅ **Contenedores** - Máxima flexibilidad
- ✅ **Integración** con servicios Google

---

## 📋 **PASO 1: Crear Cuenta Google Cloud**

### **A) Registro en GCP**
1. Ve a: **https://cloud.google.com/**
2. Clic **"Get started for free"**
3. Inicia sesión con tu **cuenta de Google**
   - Si no tienes, crea una en gmail.com

### **B) Activar Cuenta de Facturación**
1. Completa información personal:
   - Nombre completo
   - Dirección
   - País: **Colombia**
2. Agrega **tarjeta de crédito**
   - **No se cobrará** durante el período gratuito
   - Solo para verificación de identidad

### **C) Obtener Créditos Gratuitos**
1. Recibirás **$300 USD** en créditos
2. Válidos por **90 días**
3. Suficientes para **6-12 meses** de Cam.i

### **D) Crear Primer Proyecto**
1. Nombre del proyecto: **"cam-i-fleet-management"**
2. ID del proyecto: **"cam-i-fleet-2024"** (debe ser único)
3. Clic **"Create"**

---

## 🚀 **PASO 2: Configurar Google Cloud CLI**

### **A) Instalar Google Cloud CLI**

**En Windows:**
```powershell
# Descargar e instalar desde:
# https://cloud.google.com/sdk/docs/install-sdk#windows

# O usar PowerShell:
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

**En Mac:**
```bash
# Usar Homebrew
brew install --cask google-cloud-sdk

# O descargar manualmente:
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**En Linux:**
```bash
# Ubuntu/Debian
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get update && sudo apt-get install google-cloud-cli

# O script universal:
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### **B) Inicializar CLI**
```bash
# Inicializar y autenticar
gcloud init

# Seguir las instrucciones:
# 1. Seleccionar cuenta de Google
# 2. Seleccionar proyecto: cam-i-fleet-2024
# 3. Seleccionar región: us-central1
```

### **C) Verificar Instalación**
```bash
# Verificar que todo funciona
gcloud auth list
gcloud config list
gcloud projects list
```

---

## 🐳 **PASO 3: Preparar Aplicación para Contenedores**

### **A) Crear Dockerfile**
```bash
# En la raíz de tu proyecto
cd Datactar_CarFer
```

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependencias basadas en el package manager preferido
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Imagen de producción, copiar todos los archivos y ejecutar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Aprovechar output traces para reducir el tamaño de la imagen
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **B) Crear .dockerignore**
```bash
# .dockerignore
node_modules
.next
.git
.gitignore
README.md
Dockerfile
.dockerignore
npm-debug.log
.env.local
.env.*.local
```

### **C) Configurar Next.js para Contenedores**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  images: {
    unoptimized: true
  }
}

const path = require('path')
module.exports = nextConfig
```

---

## 🚀 **PASO 4: Deploy a Cloud Run**

### **A) Habilitar APIs Necesarias**
```bash
# Habilitar Cloud Run API
gcloud services enable run.googleapis.com

# Habilitar Cloud Build API (para builds automáticos)
gcloud services enable cloudbuild.googleapis.com

# Habilitar Container Registry API
gcloud services enable containerregistry.googleapis.com
```

### **B) Deploy Directo desde Código**
```bash
# Desde la raíz de tu proyecto
gcloud run deploy cam-i \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "OPENAI_API_KEY=sk-proj-tu-api-key-aqui" \
  --set-env-vars "OPENAI_MODEL=gpt-3.5-turbo" \
  --set-env-vars "OPENAI_MAX_TOKENS=500" \
  --set-env-vars "OPENAI_TEMPERATURE=0.7"
```

### **C) Monitorear el Deploy**
El proceso tomará **5-10 minutos**:
1. **Building** - Construyendo imagen Docker 🔨
2. **Pushing** - Subiendo a Container Registry ⬆️
3. **Deploying** - Desplegando en Cloud Run 🚀
4. **Ready** - ¡Aplicación lista! ✅

### **D) Obtener URL**
Una vez completado, verás:
```bash
Service [cam-i] revision [cam-i-00001-abc] has been deployed 
and is serving 100 percent of traffic.
Service URL: https://cam-i-1234567890-uc.a.run.app
```

---

## 🌐 **PASO 5: Configurar Dominio Personalizado**

### **A) Mapear Dominio**
```bash
# Mapear tu dominio personalizado
gcloud run domain-mappings create \
  --service cam-i \
  --domain cam-i.tudominio.com \
  --region us-central1
```

### **B) Configurar DNS**
GCP te dará instrucciones específicas, generalmente:

**Para dominios en Cloudflare:**
```
Tipo: CNAME
Nombre: cam-i
Destino: ghs.googlehosted.com
```

**Para dominios en GoDaddy/Namecheap:**
```
Tipo: CNAME
Host: cam-i
Apunta a: ghs.googlehosted.com
```

### **C) Verificar SSL**
```bash
# Verificar estado del certificado SSL
gcloud run domain-mappings describe \
  --domain cam-i.tudominio.com \
  --region us-central1
```

---

## 📊 **PASO 6: Configurar CI/CD con GitHub**

### **A) Crear cloudbuild.yaml**
```yaml
# cloudbuild.yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/cam-i:$COMMIT_SHA', '.']
  
  # Push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/cam-i:$COMMIT_SHA']
  
  # Deploy container image to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
    - 'run'
    - 'deploy'
    - 'cam-i'
    - '--image'
    - 'gcr.io/$PROJECT_ID/cam-i:$COMMIT_SHA'
    - '--region'
    - 'us-central1'
    - '--platform'
    - 'managed'
    - '--allow-unauthenticated'
    - '--set-env-vars'
    - 'NODE_ENV=production,OPENAI_API_KEY=$$OPENAI_API_KEY,OPENAI_MODEL=gpt-3.5-turbo'

substitutions:
  _SERVICE_NAME: cam-i
  _REGION: us-central1

# Store images in Google Container Registry
images:
  - gcr.io/$PROJECT_ID/cam-i:$COMMIT_SHA

# Use substitutions for environment variables
availableSecrets:
  secretManager:
  - versionName: projects/$PROJECT_ID/secrets/openai-api-key/versions/latest
    env: 'OPENAI_API_KEY'
```

### **B) Configurar Secrets**
```bash
# Crear secret para API Key
echo "sk-proj-tu-api-key-aqui" | gcloud secrets create openai-api-key --data-file=-

# Dar permisos a Cloud Build
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### **C) Conectar con GitHub**
1. Ve a **Cloud Build** en GCP Console
2. Clic **"Triggers"**
3. Clic **"Create Trigger"**
4. Conecta tu repositorio GitHub
5. Configurar trigger:
   - **Name:** `cam-i-deploy`
   - **Event:** Push to branch
   - **Branch:** `^main$`
   - **Configuration:** Cloud Build configuration file
   - **Location:** `cloudbuild.yaml`

---

## 💰 **PASO 7: Optimización de Costos**

### **A) Configurar Escalamiento**
```bash
# Configurar escalamiento inteligente
gcloud run services update cam-i \
  --region us-central1 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 80 \
  --cpu-throttling \
  --memory 512Mi
```

### **B) Monitorear Costos**
```bash
# Ver uso actual
gcloud run services describe cam-i --region us-central1

# Configurar alertas de presupuesto
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Cam.i Budget" \
  --budget-amount=50USD \
  --threshold-rule=percent=90,basis=CURRENT_SPEND
```

### **C) Estimación de Costos**
```
Cloud Run Pricing (us-central1):
- CPU: $0.00002400 por vCPU-second
- Memory: $0.00000250 por GiB-second
- Requests: $0.40 por 1M requests

Ejemplo para Cam.i (1000 usuarios/día):
- ~50,000 requests/mes
- ~100 CPU-hours/mes
- ~200 GiB-hours/mes
TOTAL: ~$8-15/mes
```

---

## 📊 **PASO 8: Monitoreo y Logging**

### **A) Configurar Cloud Monitoring**
```bash
# Habilitar Monitoring API
gcloud services enable monitoring.googleapis.com

# Crear dashboard personalizado
gcloud alpha monitoring dashboards create --config-from-file=dashboard.json
```

### **B) Dashboard Configuration**
```json
{
  "displayName": "Cam.i Fleet Dashboard",
  "mosaicLayout": {
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Request Count",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=\"cam-i\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_RATE"
                  }
                }
              }
            }]
          }
        }
      }
    ]
  }
}
```

### **C) Configurar Alertas**
```bash
# Alerta por alta latencia
gcloud alpha monitoring policies create --policy-from-file=alert-policy.yaml
```

```yaml
# alert-policy.yaml
displayName: "Cam.i High Latency"
conditions:
  - displayName: "Response time too high"
    conditionThreshold:
      filter: 'resource.type="cloud_run_revision" resource.label.service_name="cam-i"'
      comparison: COMPARISON_GREATER_THAN
      thresholdValue: 2000
      duration: 300s
notificationChannels:
  - projects/cam-i-fleet-2024/notificationChannels/EMAIL_CHANNEL_ID
```

---

## 🔒 **PASO 9: Seguridad y Backup**

### **A) Configurar IAM**
```bash
# Crear service account específico
gcloud iam service-accounts create cam-i-service \
  --display-name="Cam.i Service Account"

# Asignar roles mínimos necesarios
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:cam-i-service@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.invoker"
```

### **B) Configurar VPC Connector (Opcional)**
```bash
# Para conectar con bases de datos privadas
gcloud compute networks vpc-access connectors create cam-i-connector \
  --region us-central1 \
  --subnet cam-i-subnet \
  --subnet-project $PROJECT_ID \
  --min-instances 2 \
  --max-instances 3
```

### **C) Backup de Configuración**
```bash
# Exportar configuración actual
gcloud run services describe cam-i \
  --region us-central1 \
  --format export > cam-i-backup.yaml

# Restaurar desde backup
gcloud run services replace cam-i-backup.yaml \
  --region us-central1
```

---

## 🚀 **PASO 10: Escalamiento Avanzado**

### **A) Múltiples Regiones**
```bash
# Deploy en múltiples regiones para alta disponibilidad
gcloud run deploy cam-i-europe \
  --image gcr.io/$PROJECT_ID/cam-i:latest \
  --region europe-west1 \
  --platform managed

# Configurar Load Balancer global
gcloud compute url-maps create cam-i-lb \
  --default-backend-bucket=cam-i-bucket
```

### **B) Base de Datos Cloud SQL**
```bash
# Crear instancia PostgreSQL
gcloud sql instances create cam-i-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# Crear base de datos
gcloud sql databases create cam_i_production \
  --instance=cam-i-db

# Conectar Cloud Run con Cloud SQL
gcloud run services update cam-i \
  --add-cloudsql-instances $PROJECT_ID:us-central1:cam-i-db \
  --region us-central1
```

### **C) Cache con Memorystore**
```bash
# Crear instancia Redis
gcloud redis instances create cam-i-cache \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_6_x
```

---

## 🚨 **Solución de Problemas Comunes**

### **❌ Build Failed**
```bash
# Ver logs detallados
gcloud builds log $(gcloud builds list --limit=1 --format="value(id)")

# Problemas comunes:
# 1. Dockerfile mal configurado
# 2. Dependencias faltantes
# 3. Variables de entorno incorrectas
```

### **❌ Service Not Accessible**
```bash
# Verificar permisos
gcloud run services get-iam-policy cam-i --region us-central1

# Hacer público si es necesario
gcloud run services add-iam-policy-binding cam-i \
  --region us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

### **❌ High Costs**
```bash
# Analizar uso
gcloud logging read "resource.type=cloud_run_revision" \
  --limit=50 \
  --format="table(timestamp,severity,textPayload)"

# Optimizar configuración
gcloud run services update cam-i \
  --region us-central1 \
  --memory 256Mi \
  --cpu 0.5 \
  --max-instances 5
```

---

## 📈 **Métricas de Éxito**

### **A) KPIs a Monitorear**
- **Latencia promedio:** < 500ms
- **Disponibilidad:** > 99.9%
- **Costo por usuario:** < $0.10/mes
- **Tiempo de build:** < 5 minutos

### **B) Dashboards Recomendados**
1. **Operacional:** Requests, latencia, errores
2. **Negocio:** Usuarios activos, sesiones, conversiones
3. **Costos:** Spend por servicio, proyecciones

---

## 🎉 **¡Felicitaciones!**

**Tu aplicación Cam.i ahora está en producción en Google Cloud con:**

✅ **URL pública:** `https://cam-i-1234567890-uc.a.run.app`
✅ **Escalamiento automático** de 0 a miles de usuarios
✅ **SSL automático** y seguridad empresarial
✅ **CI/CD automático** desde GitHub
✅ **Monitoreo completo** con alertas
✅ **Costos optimizados** - solo pagas por uso real

**Ventajas de GCP para Cam.i:**
- 🆓 **$300 créditos gratuitos** (6-12 meses gratis)
- ⚡ **Serverless real** - escala a 0 cuando no hay tráfico
- 🌍 **Red global** de Google para máxima velocidad
- 🔧 **Integración nativa** con servicios Google (Maps, Analytics, etc.)

**Próximos pasos recomendados:**
1. 🗄️ Configurar Cloud SQL para base de datos real
2. 📊 Integrar Google Analytics y Search Console
3. 🗺️ Usar Google Maps API para rutas reales
4. 📱 Desarrollar PWA con Workbox
5. 🤖 Integrar Dialogflow para IA conversacional avanzada

**¡Tu plataforma está lista para escalar globalmente!** 🚛🌍✨
