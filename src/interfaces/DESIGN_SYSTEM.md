# Design System - Sistema Web de Gestión del TUPA UNSAAC

## 📋 Índice
1. [Paleta de Colores](#paleta-de-colores)
2. [Tipografía](#tipografía)
3. [Componentes Base](#componentes-base)
4. [Espaciado y Layout](#espaciado-y-layout)
5. [Reglas Críticas](#reglas-críticas)

---

## 🎨 Paleta de Colores

### Colores Institucionales UNSAAC

```css
--unsaac-red: #8B1E1E          /* Rojo institucional - Botones primarios, headings */
--unsaac-red-hover: #6B1515    /* Hover de botones rojos */
--unsaac-gold: #D4A017         /* Dorado - Botones secundarios, acentos */
--unsaac-gold-hover: #A07812   /* Hover de botones dorados */
--unsaac-white: #FFFFFF        /* Blanco */
--unsaac-gray-page: #F5F5F5    /* Fondo de página */
--unsaac-gray-border: #E0E0E0  /* Bordes */
--unsaac-gray-dark: #2B2B2B    /* Sidebar admin, fondos oscuros */
```

### Colores de Texto

```css
--unsaac-text-primary: #1F2933    /* Texto principal */
--unsaac-text-secondary: #6B7280  /* Texto secundario */
```

### Colores Semánticos de Estado (Badges)

#### Pendiente
```css
background: #F3F4F6
color: #6B7280
border: 1px solid #D1D5DB
border-radius: 99px (pill)
```

#### En Revisión
```css
background: #DBEAFE
color: #1E40AF
border: 1px solid #93C5FD
border-radius: 99px
```

#### Observado
```css
background: #FEF3C7
color: #92400E
border: 1px solid #FCD34D
border-radius: 99px
```

#### Aprobado
```css
background: #D1FAE5
color: #065F46
border: 1px solid #6EE7B7
border-radius: 99px
```

#### Rechazado
```css
background: #FEE2E2
color: #991B1B
border: 1px solid #FCA5A5
border-radius: 99px
```

#### Vencido
```css
background: #FEE2E2
color: #7F1D1D
border: 1px solid #F87171
border-radius: 99px
```

### Colores de Acción

```css
--color-danger: #DC2626          /* Botón peligro */
--color-danger-hover: #B91C1C
--color-success: #059669         /* Botón éxito */
--color-success-hover: #047857
--color-warning: #D97706         /* Botón advertencia */
--color-warning-hover: #B45309
```

### Banners Informativos

#### Info (Azul)
```css
background: #DBEAFE
color: #1E40AF
border: 1px solid #93C5FD
```

#### Éxito (Verde)
```css
background: #D1FAE5
color: #065F46
border: 1px solid #6EE7B7
```

#### Advertencia (Naranja)
```css
background: #FEF3C7
color: #92400E
border: 1px solid #FCD34D
```

#### Error (Rojo)
```css
background: #FEE2E2
color: #991B1B
border: 1px solid #FCA5A5
```

### Semáforo de Plazo

```css
--deadline-safe: #10B981      /* Verde: ≥2 días hábiles */
--deadline-warning: #F59E0B   /* Amarillo: 1 día */
--deadline-critical: #EF4444  /* Rojo: VENCIDO */
```

---

## ✍️ Tipografía

**Familia:** Inter (o similar sans-serif)

### Jerarquía de Texto

```css
H1: 28px / 600 (semibold) / line-height 1.25
H2: 22px / 600 (semibold) / line-height 1.25
H3: 18px / 500 (medium) / line-height 1.5
H4: 16px / 500 (medium) / line-height 1.5
Body: 16px / 400 (regular) / line-height 1.5
Body Small: 14px / 400 (regular) / line-height 1.5
Caption: 12px / 400 (regular) / line-height 1.5
Label (formularios): 13px / 500 (medium) / line-height 1.5
```

### Variables CSS

```css
--font-size-h1: 28px
--font-size-h2: 22px
--font-size-h3: 18px
--font-size-h4: 16px
--font-size-body: 16px
--font-size-body-small: 14px
--font-size-caption: 12px
--font-size-label: 13px

--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
```

---

## 🧩 Componentes Base

### 1. Botones

#### Botón Primario (Rojo)
```
Estados: Default / Hover / Disabled / Loading
background: #8B1E1E
hover: #6B1515
disabled: opacity 50%, cursor not-allowed
padding: 10px 20px
border-radius: 8px
font-weight: 500
```

#### Botón Secundario (Dorado)
```
Estados: Default / Hover / Disabled / Loading
background: #D4A017
hover: #A07812
text: #2B2B2B
padding: 10px 20px
border-radius: 8px
font-weight: 500
```

#### Botón Outline
```
Estados: Default / Hover
border: 2px solid #8B1E1E
color: #8B1E1E
hover: background #8B1E1E, color #FFFFFF
padding: 10px 20px
border-radius: 8px
```

#### Botones de Acción Específica
```
Peligro: background #DC2626, hover #B91C1C
Éxito: background #059669, hover #047857
Advertencia: background #D97706, hover #B45309
```

### 2. Campos de Formulario

#### Campo de Texto Default
```
background: #FFFFFF
border: 1px solid #E5E7EB
border-radius: 8px
padding: 10px 14px
font-size: 16px
```

#### Campo Focus
```
border: 2px solid #8B1E1E
outline: none
```

#### Campo Error
```
border: 2px solid #DC2626
+ mensaje error en rojo debajo
```

#### Campo Disabled
```
background: #F9FAFB
color: #9CA3AF
cursor: not-allowed
```

#### ⚠️ Campo BLOQUEADO (Datos del Sistema)
```
background: #F9FAFB (DIFERENTE al blanco)
border: 1px solid #E5E7EB
ícono: candado pequeño (Lock icon)
NO tiene border-focus
cursor: not-allowed
pointer-events: none
```

**REGLA CRÍTICA:** Los campos bloqueados (datos precargados del sistema académico como DNI, código, nombres) SIEMPRE tienen fondo #F9FAFB + ícono candado. Son visualmente IMPOSIBLES de confundir con campos editables.

### 3. Dropdown/Select

```
Estados: Default / Open / Error / Disabled
height: 40px
border: 1px solid #E5E7EB
border-radius: 8px
chevron-down icon derecha
open: border #8B1E1E
```

### 4. Badges de Estado

**Forma:** PILL (border-radius 99px)
**Padding:** 4px 12px
**Font-size:** 12px
**Font-weight:** 500

Usar colores exactos definidos en "Colores Semánticos de Estado"

### 5. Tarjeta Base

```
background: #FFFFFF
border: 1px solid #E5E7EB
border-radius: 12px
padding: 20px
shadow: 0 1px 2px rgba(0,0,0,0.05) (opcional)
```

### 6. Sidebar Institucional (Usuario)

```
width: 220px
background: #FFFFFF
border-right: 1px solid #E5E7EB

Header:
- Logo UNSAAC (40px)
- Texto "TUPA-UNSAAC" rojo

Ítem de navegación:
- default: text #1F2933
- hover: background #FEF2F2
- active: border-left 3px #8B1E1E, background #FEE2E2

Badge contador:
- circular, background #8B1E1E, text white, font-size 11px

Footer:
- Avatar 36px
- Nombre usuario
- Código/cargo (caption)
```

### 7. Sidebar Administrador (Oscuro)

```
width: 220px
background: #2B2B2B
color: #FFFFFF

Badge "ADMINISTRADOR":
- background #D4A017
- text #2B2B2B
- font-size 10px
- uppercase
- padding 2px 8px
- border-radius 99px

Ítem de navegación:
- default: text #FFFFFF
- hover: background #3D3D3D
- active: background #8B1E1E
```

### 8. Topbar

```
height: 60px
background: #FFFFFF
border-bottom: 1px solid #E5E7EB
padding: 0 24px

Elementos:
- Breadcrumb (separador ">", color #6B7280)
- Campana con badge rojo contador
- Avatar circular 36px + chevron
```

### 9. Semáforo de Plazo

```
Verde (#10B981): ≥2 días hábiles restantes
Amarillo (#F59E0B): 1 día hábil restante
Rojo (#EF4444): VENCIDO (0 días)

Visualización: dot + texto
Tamaño dot: 8px circular
```

### 10. Timeline de Historial

```
Línea vertical: 2px, color #E5E7EB
Nodos: 
- círculo 12px
- completado: background #10B981
- actual: background #3B82F6
- pendiente: background #E5E7EB

Cada evento:
- Título (font-weight 500)
- Fecha/hora (caption)
- Usuario/oficina (caption)
- Descripción (body small)

⚠️ SIN botones editar/eliminar
```

### 11. Zona Drag-and-Drop

```
border: 2px dashed #D1D5DB
border-radius: 12px
padding: 40px
text-align: center
hover: border-color #8B1E1E, background #FEF2F2

Ícono: Upload (32px)
Texto: "Arrastra archivos o haz clic para seleccionar"
Restricción: "Solo PDF, JPG, PNG — Máx. 5MB"
```

### 12. Banner Informativo

**4 variantes** (usar colores de "Banners Informativos"):
- Info (azul)
- Éxito (verde)
- Advertencia (naranja)
- Error (rojo)

```
border-radius: 8px
padding: 12px 16px
border-left: 4px solid (color-border)
ícono izquierda: Info/CheckCircle/AlertTriangle/XCircle
```

---

## 📐 Espaciado y Layout

### Sistema de Espaciado

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

### Border Radius

```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-pill: 99px
```

### Sombras

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

### Layout Principal

```
Sidebar: 220px fijo
Topbar: 60px altura
Content: calc(100vw - 220px), padding 24px
Max-width content: 1400px
```

---

## ⚠️ Reglas Críticas

### 1. Campos Bloqueados vs Editables

**OBLIGATORIO:** Los campos que contienen datos precargados del sistema (DNI, código universitario, nombres académicos) DEBEN tener:

✅ Fondo #F9FAFB (diferente al blanco #FFFFFF)  
✅ Ícono candado visible  
✅ NO border de focus  
✅ cursor: not-allowed  
✅ pointer-events: none  

**Nunca** usar el mismo estilo visual para campos editables y bloqueados.

### 2. Badges de Estado

**SIEMPRE** usar forma pill (border-radius: 99px)  
**SIEMPRE** usar los colores exactos definidos (no inventar variantes)  
**SIEMPRE** incluir borde de 1px  

### 3. Consistencia de Colores

- Botones primarios: **SOLO** #8B1E1E
- Botones secundarios: **SOLO** #D4A017
- NO usar variaciones de rojo/dorado que no estén en la paleta

### 4. Tipografía

- H1-H4: **SIEMPRE** usar font-weight 600 (semibold) para H1-H2
- Labels: **SIEMPRE** 13px / 500
- NO usar tamaños de fuente fuera del sistema definido

### 5. Accesibilidad

- Contraste mínimo texto/fondo: 4.5:1
- Campos de formulario: label siempre presente
- Estados focus: siempre visibles
- Ícono + texto en botones importantes

### 6. Sidebar

- Institucional (usuario): fondo blanco, ítem activo con borde izquierdo rojo
- Administrador: fondo oscuro #2B2B2B, ítem activo fondo rojo
- **NO** mezclar estilos entre sidebar institucional y admin

---

## 📦 Uso de Variables CSS

Todas las variables están definidas en `/src/styles/theme.css`

### Ejemplo de uso:

```css
/* Botón primario */
.btn-primary {
  background-color: var(--unsaac-red);
  color: var(--unsaac-white);
}

.btn-primary:hover {
  background-color: var(--unsaac-red-hover);
}

/* Campo bloqueado */
.input-locked {
  background-color: var(--input-bg-locked);
  cursor: not-allowed;
  pointer-events: none;
}

/* Badge aprobado */
.badge-approved {
  background-color: var(--status-approved-bg);
  color: var(--status-approved-text);
  border: 1px solid var(--status-approved-border);
  border-radius: var(--radius-pill);
}
```

---

## 🎯 Checklist de Implementación

Al crear un nuevo componente, verificar:

- [ ] Usa colores de la paleta institucional
- [ ] Tipografía según jerarquía definida
- [ ] Espaciado usando variables del sistema
- [ ] Border-radius según tipo de componente
- [ ] Estados (hover, focus, disabled) implementados
- [ ] Campos bloqueados claramente diferenciados
- [ ] Badges con forma pill
- [ ] Accesibilidad (contraste, labels, focus)
- [ ] Responsive design
- [ ] Consistente con otros componentes del sistema

---

**Universidad Nacional de San Antonio Abad del Cusco**  
*Design System v2.0 - Sistema Web de Gestión del TUPA*
