# 🚗 CaminoSeguro - Sistema de Seguridad Vial

Sistema web completo para la gestión de seguridad vial en el Perú. CaminoSeguro permite a usuarios reportar incidentes, visualizar zonas de riesgo, planificar rutas seguras y acceder a información preventiva sobre seguridad vial. El sistema cuenta con dos tipos de usuarios (Usuario Regular y Autoridad) con funcionalidades específicas para cada rol.

## 📋 Descripción

CaminoSeguro es una aplicación web desarrollada en HTML, CSS y JavaScript que facilita la gestión integral de seguridad vial en las carreteras peruanas. El sistema conecta a ciudadanos comunes con autoridades de seguridad para crear una red colaborativa de información sobre incidentes viales en tiempo real.

## 🎓 Información Académica

Este proyecto fue desarrollado como trabajo académico por un equipo de estudiantes comprometidos con mejorar la seguridad vial en el Perú.

- **Equipo de Desarrollo**: 5 miembros
- **Objetivo**: Crear una plataforma de seguridad vial colaborativa
- **Enfoque**: Prevención de accidentes mediante información en tiempo real

## 🚀 Características Principales

### Para Usuarios Regulares
📝 **Reportes de Incidentes**: Reportar accidentes, obstáculos y peligros en tiempo real  
🗺️ **Rutas Seguras**: Planificar viajes con rutas optimizadas y seguras  
🔥 **Mapas de Calor**: Visualizar zonas de mayor riesgo en el país  
📍 **Puntos de Ayuda**: Localizar estaciones de policía, hospitales y centros de asistencia  
📚 **Educación Preventiva**: Acceder a contenido educativo sobre seguridad vial  
📊 **Dashboard Personal**: Ver historial de reportes y estadísticas  

### Para Autoridades
👮 **Gestión de Patrullajes**: Administrar y coordinar patrullajes de seguridad  
📊 **Reportes**: Ver todos los incidentes reportados por ciudadanos  
🗺️ **Visualización de Incidentes**: Mapa en tiempo real de todos los reportes  
📈 **Análisis de Datos**: Estadísticas y tendencias de incidentes viales  
✅ **Validación de Reportes**: Verificar y actualizar estado de incidentes  

### Características Técnicas
🔐 **Sistema de Autenticación**: Login diferenciado para usuarios y autoridades  
📱 **Diseño Responsivo**: Compatible con dispositivos móviles y desktop  
🗺️ **Integración con Mapas**: Visualización interactiva de incidentes y rutas  
🎨 **Interfaz Moderna**: UI/UX diseñada con Tailwind CSS  
☁️ **API RESTful**: Backend desplegado en Render  
💾 **Almacenamiento Local**: Gestión de sesiones con localStorage  

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura de frontend web con API REST:

```
frontend-caminoseguro/
│
├── index.html                    # Página de inicio / landing page
│
├── pages/                        # Páginas de la aplicación
│   ├── login.html               # Login de usuarios regulares
│   ├── login-autoridad.html     # Login de autoridades
│   ├── registro.html            # Registro de usuarios
│   ├── registro-autoridad.html  # Registro de autoridades
│   ├── dashboard.html           # Panel de control principal
│   ├── reportes.html            # Sistema de reportes de incidentes
│   ├── rutas-seguras.html       # Planificador de rutas seguras
│   ├── mapas-calor.html         # Visualización de zonas de riesgo
│   ├── puntos-ayuda.html        # Mapa de centros de asistencia
│   ├── patrullajes.html         # Gestión de patrullajes (Autoridades)
│   └── educacion.html           # Contenido educativo preventivo
│
├── js/                          # Lógica de la aplicación
│   ├── app.js                   # Funciones de autenticación y API
│   └── maps.js                  # Funciones de mapas y geolocalización
│
└── imagenes/                    # Recursos visuales
    ├── logoconnombre.jpeg       # Logo de CaminoSeguro
    └── [fotos del equipo]       # Fotos de los miembros del equipo
```

## 📦 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework CSS**: Tailwind CSS (vía CDN)
- **Tipografía**: Google Fonts (Inter, Noto Sans)
- **Mapas**: Integración con servicios de mapas
- **API Backend**: API REST en Render (https://caminoseguro-api.onrender.com/api)
- **Almacenamiento**: LocalStorage para gestión de sesiones

## 🔧 Requisitos del Sistema

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet
- Geolocalización habilitada (para funciones de mapas)
- JavaScript habilitado

## ⚙️ Instalación

### Instalación Local

1. **Clonar el repositorio**

```bash
git clone https://github.com/Rafaxxz/frontend-caminoseguro.git
```

2. **Navegar al directorio**

```bash
cd frontend-caminoseguro
```

3. **Abrir con un servidor local**

Opción 1 - Con Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Opción 2 - Con Node.js (http-server):
```bash
npx http-server -p 8000
```

Opción 3 - Con VS Code Live Server:
- Instalar extensión "Live Server"
- Click derecho en index.html → "Open with Live Server"

4. **Acceder a la aplicación**

Abrir navegador en: `http://localhost:8000`

## 📚 Módulos del Sistema

### 1. Sistema de Autenticación
- **Login de Usuarios** (login.html): Acceso para ciudadanos regulares
- **Login de Autoridades** (login-autoridad.html): Acceso para personal de seguridad
- **Registro de Usuarios** (registro.html): Creación de cuenta ciudadana
- **Registro de Autoridades** (registro-autoridad.html): Registro de personal autorizado

### 2. Panel de Control (dashboard.html)
- Vista general del sistema
- Acceso rápido a todas las funcionalidades
- Estadísticas personales
- Navegación principal

### 3. Sistema de Reportes (reportes.html)
- Reportar incidentes viales en tiempo real
- Tipos de incidentes: accidentes, obstáculos, obras, peligros
- Incluir ubicación, descripción y severidad
- Visualización de reportes propios
- Historial de incidentes reportados

### 4. Rutas Seguras (rutas-seguras.html)
- Planificador de rutas optimizado para seguridad
- Evaluación de rutas alternativas
- Alertas de zonas peligrosas en la ruta
- Integración con sistema de mapas
- Estimación de tiempo de viaje

### 5. Mapas de Calor (mapas-calor.html)
- Visualización de zonas de alto riesgo
- Análisis de concentración de incidentes
- Filtros por tipo de incidente
- Datos históricos y tendencias
- Leyenda de niveles de peligrosidad

### 6. Puntos de Ayuda (puntos-ayuda.html)
- Localización de comisarías
- Ubicación de hospitales y centros de salud
- Estaciones de bomberos
- Centros de asistencia vial
- Información de contacto y disponibilidad

### 7. Educación Preventiva (educacion.html)
- Artículos sobre seguridad vial
- Tips de conducción segura
- Señales de tránsito
- Procedimientos de emergencia
- Recursos educativos multimedia

### 8. Gestión de Patrullajes (patrullajes.html) - Solo Autoridades
- Programación de rutas de patrullaje
- Asignación de unidades
- Control de zonas de cobertura
- Coordinación de equipos
- Reportes de actividades

## 🔐 Uso del Sistema

### Para Usuarios Regulares

1. **Crear una cuenta**
   - Ir a "Registrarse" en la página principal
   - Completar formulario con datos personales
   - Verificar cuenta (si aplica)

2. **Iniciar sesión**
   - Usar credenciales creadas
   - Acceder al dashboard principal

3. **Reportar un incidente**
   - Ir a "Reportes"
   - Seleccionar tipo de incidente
   - Agregar ubicación y descripción
   - Enviar reporte

4. **Planificar ruta segura**
   - Ir a "Rutas Seguras"
   - Ingresar origen y destino
   - Ver rutas sugeridas con nivel de seguridad
   - Seleccionar ruta preferida

### Para Autoridades

1. **Registro como autoridad**
   - Usar formulario de registro de autoridades
   - Incluir credenciales oficiales
   - Esperar aprobación (si aplica)

2. **Gestionar patrullajes**
   - Acceder a "Patrullajes"
   - Crear nueva ruta de patrullaje
   - Asignar unidades y horarios
   - Monitorear ejecución

3. **Revisar reportes**
   - Ver todos los incidentes reportados
   - Validar información
   - Actualizar estado de incidentes
   - Coordinar respuesta

## 🌟 Nuestro Equipo

El proyecto CaminoSeguro fue desarrollado por un equipo multidisciplinario comprometido con mejorar la seguridad vial en el Perú:

### **Alvaro Erick Jordan Villa**
*Frontend Developer & UX Designer*

Responsable del diseño de interfaz y experiencia de usuario. Se destaca por trabajar bien en equipo y por mantener siempre una actitud empática. Ha contribuido al desarrollo de los módulos de reportes y dashboard, enfocándose en crear interfaces intuitivas y accesibles.

### **Marco Antonio Huamancayo Rojas**
*Backend Integration & API Developer*

Especializado en la integración del frontend con la API REST. Se destaca por ser alguien centrado y determinado a la hora de trabajar en grupo. Ha desarrollado las funcionalidades de autenticación y gestión de patrullajes, asegurando comunicación eficiente con el backend.

### **Felix Ignacio Cortes Rojas**
*Maps & Geolocation Specialist*

Responsable de la implementación de funcionalidades geoespaciales. Se caracteriza por trabajar bien bajo presión y tener una actitud predominantemente positiva. Ha liderado el desarrollo de los módulos de mapas de calor, rutas seguras y puntos de ayuda.

### **Josue Gonzalo Fernandez Quille**
*Frontend Developer & Content Manager*

Enfocado en el desarrollo de páginas y gestión de contenido educativo. Se considera una persona colaborativa y empática. Ha contribuido al módulo de educación preventiva y a la estructuración del contenido informativo de la plataforma.

### **Fernando José Zamora Solis**
*Quality Assurance & Testing Lead*

Responsable de asegurar la calidad y funcionalidad del sistema. Es una persona proactiva y adaptable con buena comunicación. Ha coordinado las pruebas de usabilidad, testing cross-browser y validación de funcionalidades en diferentes dispositivos.

## 🎯 Objetivos del Proyecto

- **Seguridad Vial Mejorada**: Reducir accidentes y mejorar la seguridad de conductores y peatones
- **Cobertura Nacional**: Ofrecer protección en todas las carreteras del país
- **Comunidad Colaborativa**: Crear una red de usuarios que comparten información en tiempo real
- **Prevención**: Educar y concientizar sobre prácticas de conducción segura
- **Respuesta Rápida**: Facilitar la coordinación entre ciudadanos y autoridades

## 🔗 API Backend

La aplicación se conecta a una API REST desplegada en Render:

**Base URL**: `https://caminoseguro-api.onrender.com/api`

### Endpoints principales:
- `POST /auth/login` - Autenticación de usuarios
- `POST /auth/register` - Registro de nuevos usuarios
- `GET /reportes` - Obtener reportes de incidentes
- `POST /reportes` - Crear nuevo reporte
- `GET /rutas` - Calcular rutas seguras
- `GET /patrullajes` - Gestión de patrullajes (autoridades)

> 📌 **Nota**: La API maneja autenticación mediante tokens JWT almacenados en localStorage. El backend puede tener tiempo de inicialización en servicios gratuitos de Render (cold start).

## 📱 Acceso a la Aplicación

- **Repositorio**: [https://github.com/Rafaxxz/frontend-caminoseguro](https://github.com/Rafaxxz/frontend-caminoseguro)
- **Demo**: Puede estar disponible en GitHub Pages

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork del repositorio
2. Crear rama de feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abrir Pull Request

## 📞 Contacto

Para consultas sobre el proyecto:

- **GitHub**: [github.com/Rafaxxz/frontend-caminoseguro](https://github.com/Rafaxxz/frontend-caminoseguro)
- **Ubicación**: Lima, Perú

> 📧 **Nota**: Este es un proyecto académico. Para contacto con el equipo de desarrollo, usar el sistema de Issues en GitHub.

