# TUPA UNSAAC — Plataforma Web de Gestión de Trámites

Plataforma web para la gestión digital del TUPA (Texto Único de Procedimientos Administrativos) de la Universidad Nacional de San Antonio Abad del Cusco. Permite a estudiantes iniciar trámites, hacer seguimiento de expedientes y recibir notificaciones, mientras que el personal administrativo gestiona y procesa solicitudes desde una bandeja digital.

---

## Integrantes del equipo

| Nombre | Rama asignada | Responsabilidad |
|--------|--------------|-----------------|
| Dayan | `feature/interfaces` | Prototipos de interfaces y GUI |
| (nombre) | `feature/database` | Esquema de base de datos |
| (nombre) | `feature/docs` | Documentación y diagramas |

---

## Estructura del repositorio

```
Tupa/
├── src/
│   └── interfaces/        # Prototipos HTML de las pantallas
├── database/              # Esquema SQL, migraciones y diagramas ER
├── docs/                  # Documentación, wireframes y avances
└── README.md
```

---

## Ramas del proyecto

| Rama | Propósito |
|------|-----------|
| `main` | Código estable y entregable |
| `develop` | Integración del equipo (se fusionan aquí las features) |
| `feature/interfaces` | Desarrollo de interfaces y GUI |
| `feature/database` | Diseño e implementación de la base de datos |

---

## Guía de inicio para colaboradores

Sigue estos pasos la **primera vez** que vayas a trabajar en el proyecto.

### Requisitos previos

- Tener [Git](https://git-scm.com/downloads) instalado
- Tener una cuenta en [GitHub](https://github.com)
- Haber sido añadido como colaborador del repositorio por el líder del proyecto

---

### Paso 1 — Configurar Git con tus datos

Abre una terminal (CMD o Git Bash en Windows) y ejecuta:

```bash
git config --global user.name "Tu Nombre Completo"
git config --global user.email "tu_correo@unsaac.edu.pe"
```

Solo necesitas hacer esto una vez en tu computadora.

---

### Paso 2 — Clonar el repositorio

```bash
git clone https://github.com/Dayan77uu/Tupa.git
cd Tupa
```

---

### Paso 3 — Ver las ramas disponibles

```bash
git branch -a
```

Deberías ver algo así:

```
  remotes/origin/feature/database
  remotes/origin/feature/interfaces
  remotes/origin/main
```

---

### Paso 4 — Moverte a tu rama de trabajo

Cada integrante trabaja en su propia rama. Nunca trabajen directamente en `main`.

```bash
# Si trabajas en interfaces:
git checkout feature/interfaces

# Si trabajas en base de datos:
git checkout feature/database
```

Con esto ya estás listo para trabajar.

---

## Flujo de trabajo diario

Sigue este orden **cada vez** que te sientes a trabajar en el proyecto.

### 1. Antes de empezar — jalar cambios del equipo

```bash
git pull origin feature/interfaces
```

> Reemplaza `feature/interfaces` por tu rama. Esto evita conflictos con el trabajo de tus compañeros.

### 2. Trabajar — hacer tus cambios normalmente

Edita, crea o elimina archivos según tu tarea.

### 3. Guardar tus cambios — commit

```bash
git add .
git commit -m "feat: descripción breve de lo que hiciste"
```

### 4. Subir a GitHub — push

```bash
git push origin feature/interfaces
```

---

## Convención de commits

Usa estos prefijos para que el historial sea claro y ordenado:

| Prefijo | Cuándo usarlo | Ejemplo |
|---------|--------------|---------|
| `feat:` | Nueva pantalla o funcionalidad | `feat: agregar pantalla de login` |
| `fix:` | Corrección de un error | `fix: corregir validación del formulario` |
| `db:` | Cambios en base de datos | `db: agregar tabla expedientes` |
| `docs:` | Documentación o diagramas | `docs: agregar diagrama ER` |
| `style:` | Cambios visuales sin lógica | `style: ajustar colores del dashboard` |

---

## Cómo integrar tu trabajo (Pull Request)

Cuando termines una funcionalidad completa:

1. Asegúrate de haber hecho `push` de todos tus cambios
2. Entra a [github.com/Dayan77uu/Tupa](https://github.com/Dayan77uu/Tupa)
3. Verás un botón **"Compare & pull request"** — haz clic
4. Selecciona como destino la rama `develop`
5. Escribe una descripción breve de lo que hiciste
6. Haz clic en **"Create pull request"**

El líder del equipo revisará y aprobará la fusión.

---

## Resolución de conflictos

Si al hacer `git pull` aparece un conflicto, Git marcará los archivos así:

```
<<<<<<< HEAD
tu versión del código
=======
versión de tu compañero
>>>>>>> develop
```

**Solución:**
1. Abre el archivo en tu editor
2. Quédate con la versión correcta (o combina ambas)
3. Elimina las líneas `<<<<<<<`, `=======` y `>>>>>>>`
4. Guarda el archivo y ejecuta:

```bash
git add .
git commit -m "fix: resolver conflicto en nombre-del-archivo"
```

---

## Comandos de referencia rápida

```bash
git status                         # Ver qué archivos cambiaste
git branch                         # Ver en qué rama estás
git branch -a                      # Ver todas las ramas
git log --oneline                  # Ver historial de commits
git diff                           # Ver cambios antes de hacer commit
git pull origin feature/interfaces # Jalar cambios de tu rama
git push origin feature/interfaces # Subir tus cambios
```

---

## Tecnologías utilizadas

- HTML / CSS / JavaScript — interfaces de usuario
- SQL — diseño de base de datos
- Git + GitHub — control de versiones

---

*UNSAAC — Facultad de Ingeniería de Sistemas — 2024*
