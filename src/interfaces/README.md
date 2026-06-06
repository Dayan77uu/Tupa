# PLADDES - Sistema de Trámite Documentario UNSAAC

Plataforma web moderna inspirada en el sistema PLADDES (Plataforma de Documentos y Trámites) de la Universidad Nacional de San Antonio Abad del Cusco.

## 🎨 Características de diseño

- **Diseño limpio y minimalista** inspirado en el sistema PLADDES real
- **Colores institucionales de la UNSAAC:**
  - Rojo institucional: #8B1E1E
  - Tonos neutros y profesionales para mejor legibilidad
  
- **Diseño responsive** optimizado para escritorio, tablet y móvil
- **Interfaz intuitiva** con acceso rápido a funciones principales
- **Experiencia de usuario moderna** con componentes de shadcn/ui

## 🚀 Características principales

### Página de inicio
- ✅ **Acceso con Google OAuth** - Autenticación mediante cuenta Google
- ✅ **Login tradicional** - Usuario y contraseña
- ✅ **4 accesos rápidos principales:**
  - 💳 Pagar por trámite
  - 📈 Ver seguimiento
  - 📄 Trámite documentario
  - 👤 Crear usuario
- ✅ **Enlace directo al TUPA** oficial en PDF

### Para usuarios solicitantes (Estudiantes, Egresados, Docentes, Administrativos)
- ✅ Consulta del catálogo TUPA completo
- ✅ Registro de solicitudes con asistente paso a paso
- ✅ Seguimiento en tiempo real con línea de tiempo
- ✅ Gestión de documentos digitales
- ✅ Registro y seguimiento de pagos
- ✅ Centro de notificaciones en tiempo real
- ✅ Perfil de usuario personalizable

### Para Mesa de Partes
- ✅ Recepción y validación de solicitudes
- ✅ Revisión de requisitos
- ✅ Derivación a oficinas responsables
- ✅ Observación de documentos

### Para Oficinas Administrativas
- ✅ Gestión de expedientes asignados
- ✅ Evaluación de trámites
- ✅ Aprobación, observación o rechazo
- ✅ Registro de observaciones
- ✅ Finalización de trámites

### Para Jefes de Oficina
- ✅ Dashboard ejecutivo con estadísticas
- ✅ Indicadores de desempeño (KPIs)
- ✅ Gráficos de trámites por mes, tipo y estado
- ✅ Tiempo promedio de atención
- ✅ Reportes de productividad

### Para Administradores
- ✅ Gestión de usuarios y roles
- ✅ Matriz de permisos configurable
- ✅ Mantenimiento del catálogo TUPA
- ✅ Gestión de requisitos y costos
- ✅ Configuración de oficinas y sedes
- ✅ Generación de reportes
- ✅ Auditoría del sistema

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # Componentes UI de shadcn
│   │   └── figma/           # Componentes de Figma
│   ├── layouts/
│   │   ├── RootLayout.tsx
│   │   └── DashboardLayout.tsx
│   ├── pages/
│   │   ├── public/          # Páginas públicas
│   │   │   ├── LandingPage.tsx    # Página principal tipo PLADDES
│   │   │   ├── LoginPage.tsx      # Login simplificado
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── RecoverPasswordPage.tsx
│   │   │   ├── CataloguePage.tsx
│   │   │   └── ProcedureDetailPage.tsx
│   │   ├── student/         # Dashboard estudiante
│   │   ├── graduate/        # Dashboard egresado
│   │   ├── teacher/         # Dashboard docente
│   │   ├── administrative/  # Dashboard administrativo
│   │   ├── mesa-partes/     # Dashboard mesa de partes
│   │   ├── office/          # Dashboard oficina
│   │   ├── manager/         # Dashboard jefe de oficina
│   │   ├── admin/           # Dashboard administrador
│   │   └── errors/          # Páginas de error
│   ├── routes.tsx           # Configuración de rutas
│   └── App.tsx              # Componente principal
└── styles/
    ├── theme.css            # Colores institucionales UNSAAC
    └── fonts.css            # Fuentes del sistema
```

## 🎯 Tipos de usuario

1. **Visitante/Público general** - Consulta del catálogo TUPA
2. **Estudiante** - Solicitud de trámites académicos
3. **Egresado** - Trámites de grados y títulos
4. **Docente** - Trámites docentes y académicos
5. **Administrativo** - Solicitudes laborales y beneficios
6. **Mesa de Partes** - Recepción y validación
7. **Oficina Administrativa** - Evaluación de expedientes
8. **Jefe de Oficina** - Supervisión y estadísticas
9. **Administrador** - Gestión completa del sistema
10. **Superadministrador** - Control total

## 🎨 Estados de trámite

- **Registrado** (gris) - Solicitud ingresada al sistema
- **En revisión** (azul) - Mesa de partes validando
- **Pendiente de pago** (amarillo) - Esperando verificación de pago
- **Observado** (naranja) - Requiere correcciones
- **Subsanado** (morado) - Observaciones corregidas
- **Derivado** (celeste) - Enviado a oficina responsable
- **En evaluación** (azul oscuro) - Oficina evaluando
- **Aprobado** (verde) - Trámite aprobado
- **Rechazado** (rojo) - Trámite rechazado
- **Finalizado** (gris oscuro) - Proceso completado

## 🛠️ Tecnologías utilizadas

- **React 18.3.1** - Framework de UI
- **React Router 7** - Navegación y routing
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos utility-first
- **shadcn/ui** - Componentes UI modernos
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconos
- **Vite** - Build tool y dev server

## 🚦 Cómo iniciar el proyecto

El servidor de desarrollo ya está corriendo automáticamente. Para ver la aplicación, usa la vista previa proporcionada por Figma Make.

## 🔐 Acceso al sistema

La página de inicio ofrece múltiples formas de acceder:

1. **Autenticación con Google** - Inicio de sesión rápido con cuenta Google
2. **Usuario y contraseña** - Login tradicional
3. **Acceso sin login** para consultar seguimiento y catálogo TUPA

**Para el demo:** Cualquier credencial te permitirá acceder al sistema.

## 📝 Funcionalidades principales

### Desde la página de inicio puedes:
- 💳 **Pagar por trámite** - Acceso directo al módulo de pagos
- 📈 **Ver seguimiento** - Consulta el estado de tus trámites
- 📄 **Trámite documentario** - Ingresa al sistema completo
- 👤 **Crear usuario** - Regístrate en el sistema
- 📋 **Ver TUPA** - Consulta el catálogo oficial en PDF

## 🎓 Diseño institucional

El sistema refleja la identidad del sistema PLADDES real con:
- Header simple y limpio con el nombre "PLADDES"
- Diseño centrado y minimalista
- Colores institucionales UNSAAC
- Footer con información del sistema y versión
- Accesos rápidos con iconos descriptivos

## 📱 Responsive Design

La plataforma se adapta a diferentes tamaños de pantalla:
- **Desktop** - Experiencia completa optimizada
- **Tablet** - Layout adaptado
- **Mobile** - Navegación optimizada para móviles

## 🔗 Enlaces externos

- **TUPA oficial**: https://transparencia.unsaac.edu.pe/archivos/tupa/Tupa%202024.pdf
- **Sitio web UNSAAC**: https://www.unsaac.edu.pe/

---

**Universidad Nacional de San Antonio Abad del Cusco**  
© 2026 - Sistema de trámite documentario UNSAAC - Versión 2.0.1

*Este es un prototipo de demostración inspirado en el sistema PLADDES de la UNSAAC*
