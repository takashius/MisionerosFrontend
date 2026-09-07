# Misioneros — Frontend

Portal de la **I Asamblea de Misioneros Digitales**. React 18 + Vite 6 + Ant Design 5 + TanStack Query + Axios (`ERDEAxios`).

El **portal** (`/`) es la pantalla pública. Desde ahí se entra al pase, al escáner o al panel CEV.

## Requisitos

- Node.js 20+
- Backend en `http://localhost:3040` (ver `backend/README.md`)

## Arranque

```bash
cd frontend
cp .env.example .env   # si aún no tienes .env
npm install
npm run dev
```

La app queda en `http://localhost:3050`.

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_API_URL` | URL del API (`http://localhost:3040`) |
| `VITE_API_DEBUG` | `true` para logs de Axios |

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Vite en el puerto 3050 |
| `npm run build` | Typecheck + build |
| `npm run preview` | Preview del build |
| `npm run lint` | ESLint |

## Rutas

| Ruta | Quién |
|---|---|
| `/` | Portal público (info, cédula, login CEV) |
| `/pase` | Credencial digital (cualquier cédula, sin validar aún) |
| `/escaner` | Check-in de puerta |
| `/login` | Login del panel CEV |
| `/recuperar` | Olvidé mi contraseña (pide código al correo) |
| `/recuperar/codigo` | Código + nueva clave |
| `/admin` | Dashboard. Solo `ADMIN` / `SUPER_ADMIN` |
| `/admin/usuarios` | CRUD de usuarios y cambio de clave aparte |

Cronograma, ponentes, mapa, etc. son placeholders.

## Login administrativo

El login **solo** abre el panel (`/admin`). El pase y el escáner no piden cuenta.

1. Arranca MongoDB y el backend (`npm run dev` en `backend`).
2. El seed crea `USER_ADMIN_EMAIL` / `USER_ADMIN_PASSWORD` (por defecto `admin@misioneros.local` / `cambia-esta-clave`).
3. En el portal, tarjeta **Gestión CEV**, o en `/login`, entra con ese correo.
4. **Olvidé mi contraseña** pide un código por correo (Mailjet). Si el correo no está configurado, el código no llega; en desarrollo revisa los logs del backend.

Si las credenciales no son de un admin, el API puede responder 200 pero el frontend no deja pasar al dashboard.

El JWT se guarda en `localStorage` (`Token`). Un 401 fuera de `/user/login` y `/user/recovery` limpia la sesión y redirige a `/login`.

En **Usuarios** se dan de alta, editan y eliminan cuentas. La contraseña inicial se pide al crear; el cambio posterior es el botón **Cambiar clave**, no el formulario de editar.

## Estructura

```
src/
  api/           # ERDEAxios, login
  context/       # sesión admin
  pages/         # Portal, Pase, Escáner, Admin, Login
  layouts/
  components/
  data/          # participantes de demostración
```
