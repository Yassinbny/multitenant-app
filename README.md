# Multitenant Accident Report API

API REST multi-tenant para gestionar partes de accidente de coche, con autenticacion, autorizacion por roles y aislamiento de datos por tenant.

## Stack Tecnologico

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- JWT
- Zod
- bcrypt
- Helmet
- Docker para PostgreSQL

## Requisitos

- Node.js 22+
- pnpm
- Docker Desktop

## Variables De Entorno

Crear un archivo `.env` en la raiz del proyecto:

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
DATABASE_URL="postgresql://multitenant_user:multitenant_password@localhost:5432/multitenant_db?schema=public"
```

## Instalacion

```bash
pnpm install
```

## Base De Datos

Levantar PostgreSQL con Docker:

```bash
docker compose up -d
```

Ejecutar migraciones:

```bash
pnpm exec prisma migrate dev
```

Generar Prisma Client:

```bash
pnpm exec prisma generate
```

Ejecutar seed para crear el superadmin:

```bash
pnpm prisma:seed
```

Credenciales del superadmin:

```txt
email: superadmin@example.com
password: Admin123456
```

## Ejecucion

Modo desarrollo:

```bash
pnpm dev
```

Compilar:

```bash
pnpm build
```

Ejecutar version compilada:

```bash
pnpm start
```

Health check:

```txt
GET /health
```

## Modelo De Datos

### Tenant

Representa una empresa u organizacion dentro del sistema.

Campos principales:

- `id`
- `name`
- `createdAt`
- `updatedAt`

Relaciones:

- Tiene muchos usuarios.
- Tiene muchos partes de accidente.

### User

Representa un usuario autenticado.

Campos principales:

- `id`
- `email`
- `passwordHash`
- `role`
- `tenantId`
- `createdAt`
- `updatedAt`

Roles:

- `SUPER_ADMIN`
- `ADMIN`
- `USER`

### FormSubmission

Representa un parte de accidente de coche.

Campos principales:

- `id`
- `firstName`
- `lastName`
- `place`
- `accidentTime`
- `licensePlate`
- `damageDescription`
- `userId`
- `tenantId`
- `createdAt`
- `updatedAt`

## Roles Y Permisos

### SUPER_ADMIN

Usuario de plataforma.

Puede:

- Crear tenants.
- Listar tenants.
- Consultar un tenant por ID.
- Crear admins dentro de un tenant.

No gestiona directamente los partes operativos.

### ADMIN

Usuario administrador de un tenant.

Puede:

- Crear usuarios normales dentro de su tenant.
- Listar usuarios de su tenant.
- Crear partes de accidente.
- Listar partes de su tenant.
- Consultar partes de su tenant por ID.

### USER

Usuario normal de un tenant.

Puede:

- Crear partes de accidente.
- Listar partes de su tenant.
- Consultar partes de su tenant por ID.

## Endpoints

### Auth

```txt
POST /auth/login
GET  /auth/me
```

### Tenants

Requieren rol `SUPER_ADMIN`.

```txt
POST /tenants
GET  /tenants
GET  /tenants/:id
POST /tenants/:tenantId/admins
```

Crear tenant:

```json
{
  "name": "Aseguradora Norte"
}
```

Crear admin de tenant:

```json
{
  "email": "admin@aseguradora.com",
  "password": "Admin123456"
}
```

### Users

Requieren rol `ADMIN`.

```txt
POST /users
GET  /users
```

Crear usuario:

```json
{
  "email": "user@aseguradora.com",
  "password": "User123456"
}
```

### Submissions

Requieren rol `USER` o `ADMIN`.

```txt
POST /submissions
GET  /submissions
GET  /submissions/:id
```

Crear parte:

```json
{
  "firstName": "Yassin",
  "lastName": "Benyaiche",
  "place": "Las Palmas",
  "accidentTime": "08:30",
  "licensePlate": "1234ABC",
  "damageDescription": "Danos en la parte trasera del vehiculo"
}
```

## Flujo De Uso

1. Ejecutar el seed para crear el `SUPER_ADMIN`.
2. Iniciar sesion como `SUPER_ADMIN`.
3. Crear un tenant.
4. Crear un `ADMIN` dentro del tenant.
5. Iniciar sesion como `ADMIN`.
6. Crear usuarios normales dentro del tenant.
7. Iniciar sesion como `USER`.
8. Crear y consultar partes de accidente.

## Aislamiento Multi-Tenant

El aislamiento multi-tenant se garantiza asociando cada usuario a un `tenantId`.

Cuando un usuario inicia sesion, el backend genera un JWT que contiene:

```txt
userId
tenantId
role
```

El frontend nunca envia ni decide el `tenantId` para operaciones sensibles. El backend obtiene el `tenantId` desde el token autenticado.

Al crear partes de accidente, el backend asigna automaticamente:

```txt
userId = usuario autenticado
tenantId = tenant del usuario autenticado
```

Al consultar partes o usuarios, las queries filtran siempre por el `tenantId` del usuario autenticado:

```ts
where: {
  tenantId: authUser.tenantId
}
```

Ademas, al consultar un parte por ID se filtra por `id` y `tenantId`. Si el parte existe pero pertenece a otro tenant, la API responde `404`, evitando revelar informacion de otros tenants.

## Seguridad

- Las contrasenas se almacenan hasheadas con bcrypt.
- La autenticacion se realiza mediante JWT.
- Las rutas protegidas requieren token Bearer.
- La autorizacion se controla mediante roles.
- Los datos de entrada se validan con Zod.
- Helmet anade headers basicos de seguridad.
- El backend no devuelve `passwordHash` en las respuestas.
