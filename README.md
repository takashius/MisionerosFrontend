# Misioneros — Frontend

Portal de la **I Asamblea de Misioneros Digitales**. React 18 + Vite 6 + Ant Design 5 + TanStack Query + Axios (`ERDEAxios`).

El **portal** (`/`) es la pantalla pública. Desde ahí se entra al registro, al pase (si el pago ya está confirmado), al escáner (personal de logística) o al panel CEV.

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

En el PC: `https://localhost:3050` (certificado de desarrollo; acéptalo una vez).

Desde otro dispositivo en la misma Wi‑Fi usa la IP LAN de este equipo, por ejemplo `https://192.168.0.120:3050`. El escáner de cámara del teléfono exige HTTPS.

Si `VITE_API_URL` está vacío, Vite proxea `/user`, `/participant` y `/scan` al API en el puerto 3040. Así el teléfono no tiene que hablar con `localhost`.

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_API_URL` | URL del API. Vacío = mismo origen (proxy de Vite). Directo: `http://localhost:3040` |
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
| `/` | Portal público |
| `/registro` | Inscripción pública (aforo máximo 80) |
| `/pase/:token` | Credencial digital con QR (solo si el pago está confirmado) |
| `/escaner` | Check-in / check-out. Requiere `LOGISTICA`, `ADMIN` o `SUPER_ADMIN` |
| `/login` | Login del personal CEV |
| `/recuperar` | Olvidé mi contraseña (pide código al correo) |
| `/recuperar/codigo` | Código + nueva clave |
| `/admin` | Dashboard con KPIs. Staff (`ADMIN`, `COORDINADOR`, `LOGISTICA`, `SUPER_ADMIN`) |
| `/admin/participantes` | Listado, confirmar pago, corrección tipográfica |
| `/admin/usuarios` | CRUD de usuarios. Solo `ADMIN` / `SUPER_ADMIN` |

Cronograma, ponentes, mapa, etc. son placeholders.

## Login de personal

El login abre el panel (`/admin`). El escáner también exige sesión de staff con permiso de logística.

1. Arranca MongoDB y el backend (`npm run dev` en `backend`).
2. El seed crea `USER_ADMIN_EMAIL` / `USER_ADMIN_PASSWORD` (por defecto `admin@misioneros.local` / `cambia-esta-clave`).
3. En **Usuarios** se pueden crear cuentas `COORDINADOR` (confirmar pagos) y `LOGISTICA` (escáner y tipografía).
4. **Olvidé mi contraseña** pide un código por correo (Mailjet).

El JWT se guarda en `localStorage` (`Token`). Un 401 fuera de rutas públicas limpia la sesión y redirige a `/login`.

## Flujo de acreditación

1. El asistente se inscribe en `/registro` (estado `registrado`).
2. Coordinación confirma el pago en `/admin/participantes` y Mailjet envía el enlace `/pase/:token`.
3. El asistente consulta su cédula en el portal o abre el correo.
4. Logística escanea el QR en `/escaner` (check-in / check-out).

## Estructura

```
src/
  api/           # ERDEAxios, usuarios, participantes, escaneos
  context/       # sesión de staff
  pages/         # Portal, Registro, Pase, Escáner, Admin
  layouts/
  components/
  types/
```
