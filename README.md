# TechLearn Frontend

Interfaz web del proyecto **TechLearn**, un catálogo de cursos de tecnología con tres roles: administrador, instructor y estudiante.

> Backend: repositorio `techlearn-backend` (Node.js + Express + MySQL). Este frontend necesita la API corriendo para funcionar.

## Tecnologías

| Uso | Tecnología |
|---|---|
| Librería de interfaz | React 19 |
| Entorno de desarrollo y build | Vite |
| Navegación | React Router |
| Consumo de la API | `fetch` con un cliente propio (`src/api/client.js`) |
| Estilos | CSS propio con metodología BEM y variables CSS |
| Íconos | lucide-react |
| Calidad de código | ESLint (con reglas de React Hooks) |

No se usan librerías de componentes ni frameworks de CSS: toda la interfaz está hecha a mano.

## Requisitos

- Node.js **20 o superior**
- npm
- La API de TechLearn corriendo (por defecto en `http://localhost:3000`)

## Instalación y ejecución local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de variables de entorno
cp .env.example .env
#    → VITE_API_URL debe apuntar a la API (por defecto http://localhost:3000/api/v1)

# 3. Iniciar en modo desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

> La API solo acepta peticiones del dominio configurado en su variable `CORS_ORIGIN`. En local debe ser `http://localhost:5173`.

### Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión de producción |
| `npm run lint` | Revisa el código con ESLint |

### Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:3000/api/v1` |

En Vite, las variables deben empezar con `VITE_` para que estén disponibles en el navegador. No guardes datos secretos en ellas: cualquiera puede verlas en el código publicado.

## Funcionalidades

### Sitio público

- **Página principal** basada en el Wireframe 1: hero con beneficios, catálogo, categorías destacadas e instructores destacados.
- **Catálogo llenado con la API**, con filtro por categoría y botón "Cargar más cursos" (de 6 en 6).
- **Vista lista + detalle**: en escritorio, el detalle del curso aparece a la derecha sin salir de la lista; en móvil, se abre en una hoja deslizable que se cierra arrastrándola hacia abajo.
- **Directorio de instructores** (`/instructores`) con buscador y perfil: especialidad, biografía, estadísticas y cursos publicados.
- **Registro e inicio de sesión**, con los errores de validación de la API mostrados en cada campo.
- **Imágenes desde el dispositivo**: portadas de cursos, categorías y fotos de perfil se suben desde la computadora o el celular, con vista previa y validación de formato y tamaño.

### Estudiante (`/mis-cursos`)

- Inscripción a cursos desde el catálogo (los cursos de pago registran un pago simulado).
- Inscripciones activas y canceladas, detalle de cada curso, cancelación y reinscripción.

### Instructor (`/instructor`)

- Estadísticas de sus cursos.
- Crear y editar cursos (nacen como borrador hasta que el administrador los publica).
- Consultar los estudiantes inscritos y dar de baja cursos.
- Editar su perfil público, con vista previa.

### Administrador (`/admin`)

- **Resumen**: totales de la plataforma, cursos por categoría y cursos más populares.
- **Cursos**: filtros por estado, revisión, publicación, ocultar, dar de baja y reactivar. Al revisar un curso puede abrir el perfil del instructor en un panel a la derecha.
- **Categorías**: crear, editar, dar de baja y reactivar.
- **Usuarios**: búsqueda, filtro por rol, alta de instructores y habilitar o deshabilitar cuentas.

## Arquitectura

```
src/
├── api/          Cliente de la API y un archivo por recurso (courses, categories, ...)
├── components/   Componentes reutilizables (CourseCard, Modal, BottomSheet, ...)
├── sections/     Secciones de la página principal (Hero, Catalog, ...)
├── pages/        Pantallas completas; admin/ e instructor/ contienen las pestañas de cada panel
├── hooks/        Lógica reutilizable (useQuery, useCatalog, useEnrollment, ...)
├── context/      Estado global: sesión, notificaciones y diálogos de confirmación
├── routes/       Rutas protegidas por rol
├── styles/       Variables de la paleta, estilos base, formularios y paneles
└── utils/        Formato de precios y fechas, manejo de errores
```

### Flujo de datos

```
Componente → hook (useQuery / useCatalog) → src/api/*.api.js → client.js → API REST
```

- **`client.js`** es el único lugar que usa `fetch`. Agrega el token de sesión, construye los parámetros de la URL y convierte las respuestas de error en un `ApiError` con el mensaje y los detalles de validación de la API.
- **`useQuery`** maneja la carga, el error y la recarga de los datos. Si cambian los filtros antes de que llegue la respuesta, descarta la respuesta vieja.
- **`AuthProvider`** guarda al usuario en sesión. Al recargar la página, valida el token contra `/auth/me` y lo descarta si ya expiró.

### Rutas

| Ruta | Acceso |
|---|---|
| `/`, `/instructores`, `/login`, `/registro` | Público |
| `/mis-cursos` | Estudiante |
| `/instructor` | Instructor |
| `/admin` | Administrador |

Las rutas protegidas solo evitan mostrar pantallas que no le corresponden al usuario. **La seguridad real está en la API**, que valida el token y el rol en cada petición.

La pestaña activa de los paneles y el instructor seleccionado se guardan en la URL (por ejemplo `/admin?tab=cursos` o `/instructores?id=1`), así al recargar o compartir el enlace se abre la misma vista.

## Estilos (BEM)

Cada componente tiene su propio archivo `.css` con nombres `bloque__elemento--modificador`:

```css
.course-card { }               /* bloque */
.course-card__title { }        /* elemento */
.course-card--selected { }     /* modificador */
```

La paleta del documento de Turing-IA está definida como variables en `src/styles/index.css`:

| Variable | Color |
|---|---|
| `--color-navy` | `#112E40` |
| `--color-gray` | `#C8D3D9` |
| `--color-green-dark` | `#025949` |
| `--color-green` | `#1FBF92` |
| `--color-green-light` | `#6CD9BA` |

## Diseño responsive

- **Escritorio**: lista y detalle lado a lado.
- **Tablet y móvil**: menú hamburguesa, filtros con desplazamiento horizontal, detalle en hoja deslizable y tablas que se convierten en tarjetas.

## Accesibilidad

- Etiquetas HTML semánticas (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`).
- Botones con `aria-label` cuando solo muestran un ícono, y `aria-pressed` o `aria-selected` en filtros y pestañas.
- Formularios con etiquetas asociadas y mensajes de error vinculados a cada campo.
- Ventanas modales que se cierran con Escape.

## Mejoras futuras

- Pruebas de componentes con Vitest y React Testing Library.
- Lecciones y seguimiento del progreso dentro de cada curso.
- Pasarela de pago real para los cursos de pago.
