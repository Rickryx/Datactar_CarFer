# 🚀 Desplegar Cam.i en Producción

## 🎯 **Opciones de Despliegue Recomendadas**

### 🥇 **OPCIÓN 1: Vercel (Más Fácil - Recomendado)**
- ✅ **Gratis** hasta 100GB de ancho de banda
- ✅ **Deploy automático** desde GitHub
- ✅ **SSL automático** y CDN global
- ✅ **Variables de entorno** seguras
- ✅ **Dominio personalizado** incluido

### 🥈 **OPCIÓN 2: AWS (Más Control)**
- ✅ **Escalabilidad** empresarial
- ✅ **Integración** con otros servicios AWS
- ✅ **Control total** de infraestructura
- 💰 **Costo:** ~$10-50/mes según uso

### 🥉 **OPCIÓN 3: Google Cloud Platform (GCP)**
- ✅ **Créditos gratuitos** $300 para nuevos usuarios
- ✅ **Integración** con servicios Google
- ✅ **Cloud Run** serverless
- 💰 **Costo:** ~$5-30/mes según uso

---

## 🚀 **OPCIÓN 1: Vercel (Recomendado para Empezar)**

### **Paso 1: Preparar el Proyecto**
```bash
# Asegurarse de que todo esté en GitHub
git add .
git commit -m "Preparar para deploy en Vercel"
git push origin main
```

### **Paso 2: Crear Cuenta en Vercel**
1. Ve a: **https://vercel.com/**
2. Clic en **"Sign up"**
3. Conecta con tu cuenta de **GitHub**

### **Paso 3: Importar Proyecto**
1. En Vercel Dashboard, clic **"New Project"**
2. Selecciona **"Datactar_CarFer"** de tus repositorios
3. Clic **"Import"**

### **Paso 4: Configurar Variables de Entorno**
1. En la página de configuración, ve a **"Environment Variables"**
2. Agrega:
```
OPENAI_API_KEY = tu-api-key-de-openai
OPENAI_MODEL = gpt-3.5-turbo
OPENAI_MAX_TOKENS = 500
OPENAI_TEMPERATURE = 0.7
```

### **Paso 5: Deploy**
1. Clic **"Deploy"**
2. Esperar 2-3 minutos
3. ¡Listo! Tu app estará en: `https://datactar-car-fer.vercel.app`

### **Paso 6: Dominio Personalizado (Opcional)**
1. Ve a **"Settings" → "Domains"**
2. Agrega tu dominio: `cam-i.tudominio.com`
3. Configura DNS según instrucciones

---

## ☁️ **OPCIÓN 2: AWS (Amazon Web Services)**

### **Servicios AWS Recomendados:**
- **AWS Amplify** - Para aplicaciones Next.js (Más fácil)
- **EC2 + Load Balancer** - Para control total
- **ECS Fargate** - Para contenedores

### **🎯 MÉTODO A: AWS Amplify (Recomendado)**

#### **Paso 1: Crear Cuenta AWS**
1. Ve a: **https://aws.amazon.com/**
2. Clic **"Create AWS Account"**
3. Completa registro (requiere tarjeta de crédito)

#### **Paso 2: Acceder a AWS Amplify**
1. En AWS Console, busca **"Amplify"**
2. Clic **"Get Started"** en "Amplify Hosting"

#### **Paso 3: Conectar Repositorio**
1. Selecciona **"GitHub"**
2. Autoriza AWS a acceder a tu GitHub
3. Selecciona **"Datactar_CarFer"**
4. Branch: **"main"**

#### **Paso 4: Configurar Build**
```yaml
# amplify.yml (se crea automáticamente)
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

#### **Paso 5: Variables de Entorno**
1. En Amplify Console, ve a **"Environment variables"**
2. Agrega las mismas variables que en Vercel

#### **Paso 6: Deploy**
1. Clic **"Save and Deploy"**
2. Esperar 5-10 minutos
3. Tu app estará en: `https://main.d1234567890.amplifyapp.com`

### **🔧 MÉTODO B: EC2 + PM2 (Control Total)**

#### **Paso 1: Crear Instancia EC2**
1. En AWS Console, ve a **"EC2"**
2. Clic **"Launch Instance"**
3. Selecciona **"Ubuntu Server 22.04 LTS"**
4. Tipo: **t3.micro** (elegible para capa gratuita)
5. Configura Security Group:
   - SSH (22) - Tu IP
   - HTTP (80) - 0.0.0.0/0
   - HTTPS (443) - 0.0.0.0/0
   - Custom (3000) - 0.0.0.0/0

#### **Paso 2: Conectar a la Instancia**
```bash
# Descargar tu key pair (.pem)
chmod 400 tu-key.pem
ssh -i tu-key.pem ubuntu@tu-ip-publica
```

#### **Paso 3: Instalar Dependencias**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx -y

# Instalar Git
sudo apt install git -y
```

#### **Paso 4: Clonar y Configurar Proyecto**
```bash
# Clonar proyecto
git clone https://github.com/Rickryx/Datactar_CarFer.git
cd Datactar_CarFer

# Instalar dependencias
npm install

# Crear archivo de entorno
nano .env.local
# Agregar tus variables de entorno

# Build del proyecto
npm run build
```

#### **Paso 5: Configurar PM2**
```bash
# Crear archivo ecosystem
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'cam-i',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/Datactar_CarFer',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

```bash
# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

#### **Paso 6: Configurar Nginx**
```bash
sudo nano /etc/nginx/sites-available/cam-i
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/cam-i /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### **Paso 7: SSL con Let's Encrypt**
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🌐 **OPCIÓN 3: Google Cloud Platform (GCP)**

### **🎯 MÉTODO A: Cloud Run (Serverless)**

#### **Paso 1: Crear Cuenta GCP**
1. Ve a: **https://cloud.google.com/**
2. Clic **"Get started for free"**
3. Obtén $300 en créditos gratuitos

#### **Paso 2: Crear Proyecto**
1. En GCP Console, clic **"Select a project"**
2. **"New Project"**
3. Nombre: **"cam-i-fleet"**

#### **Paso 3: Habilitar APIs**
```bash
# Instalar Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Habilitar APIs necesarias
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

#### **Paso 4: Crear Dockerfile**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### **Paso 5: Deploy a Cloud Run**
```bash
# Build y deploy
gcloud run deploy cam-i \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=tu-api-key
```

### **🔧 MÉTODO B: Compute Engine**

#### **Paso 1: Crear VM**
```bash
gcloud compute instances create cam-i-vm \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=20GB \
  --tags=http-server,https-server
```

#### **Paso 2: Configurar Firewall**
```bash
gcloud compute firewall-rules create allow-cam-i \
  --allow tcp:3000 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow Cam.i app"
```

#### **Paso 3: SSH y Configurar**
```bash
gcloud compute ssh cam-i-vm --zone=us-central1-a

# Seguir los mismos pasos que en EC2 para instalar Node.js, PM2, etc.
```

---

## 💰 **Comparación de Costos**

### **Vercel:**
- **Gratis:** Hasta 100GB bandwidth/mes
- **Pro:** $20/mes - Bandwidth ilimitado
- **Enterprise:** $40/mes - Funciones avanzadas

### **AWS:**
- **Amplify:** ~$1-5/mes para tráfico bajo
- **EC2 t3.micro:** $8.5/mes + $0.09/GB bandwidth
- **Load Balancer:** $16/mes adicional

### **GCP:**
- **Cloud Run:** $0 hasta 2M requests/mes
- **Compute Engine e2-micro:** $6/mes + bandwidth
- **Load Balancer:** $18/mes adicional

---

## 🎯 **Recomendación Final**

### **Para Empezar (MVP):**
**🥇 Vercel** - Gratis, fácil, automático

### **Para Escalar (Startup):**
**🥈 AWS Amplify** - Más control, integración AWS

### **Para Empresa:**
**🥉 AWS EC2 + RDS** - Control total, alta disponibilidad

---

## 🔒 **Checklist de Seguridad**

### **Variables de Entorno:**
- ✅ Nunca hardcodear API keys
- ✅ Usar variables de entorno en producción
- ✅ Rotar keys periódicamente

### **HTTPS:**
- ✅ SSL/TLS habilitado
- ✅ Redirigir HTTP a HTTPS
- ✅ Headers de seguridad configurados

### **Monitoreo:**
- ✅ Logs de aplicación
- ✅ Métricas de rendimiento
- ✅ Alertas de errores

---

## 📊 **Monitoreo y Analytics**

### **Herramientas Recomendadas:**
- **Vercel Analytics** - Métricas de rendimiento
- **Google Analytics** - Comportamiento de usuarios
- **Sentry** - Monitoreo de errores
- **LogRocket** - Grabación de sesiones

---

¿Con cuál opción quieres empezar? Te recomiendo **Vercel** para comenzar rápido y gratis, luego migrar a AWS cuando necesites más control.
