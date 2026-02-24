¡Claro que sí! Un archivo `README.md` bien estructurado es la carta de presentación de cualquier desarrollador profesional. Demuestra orden, claridad y hace que tu repositorio destaque en GitHub como un proyecto serio (ideal para tu portafolio).

Crea un archivo llamado **`README.md`** en la raíz de tu proyecto (al mismo nivel que tu `package.json`) y pega todo este contenido. Lo he redactado con un tono técnico, profesional y detallando todas las funcionalidades increíbles que construimos:

```markdown
# 📖 Hallel Kehila - Himnario y Gestor de Repertorios Digital

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

Hallel Kehila es una aplicación web full-stack diseñada para gestionar y visualizar repertorios musicales para servicios de Shabat y congregacionales. Proporciona una interfaz elegante tanto para los asistentes (visualización de letras) como para los músicos (visualización de acordes dinámicos), junto con un panel de administración seguro para los directores de alabanza.

## ✨ Características Principales

### Para la Congregación y Músicos (Vista Pública)
* **Repertorios Inteligentes:** Visualización de listas de cantos programadas, ordenadas automáticamente priorizando los eventos futuros/actuales.
* **Catálogo General (Buscador):** Acceso a toda la base de datos de alabanzas con búsqueda en tiempo real (insensible a mayúsculas y acentos).
* **Motor de Acordes Dinámico:** Los músicos pueden alternar entre "Solo Letra" y "Letra con Acordes". Los acordes se renderizan dinámicamente sobre las sílabas exactas asegurando una lectura perfecta en cualquier tamaño de pantalla.
* **Accesibilidad:** Controles flotantes para aumentar o disminuir el tamaño de la tipografía de lectura.
* **Modo Oscuro/Claro:** Soporte nativo para *Dark Mode* con persistencia en el almacenamiento local del navegador (`localStorage`).
* **Diseño Responsivo:** Interfaz *Mobile-First* optimizada para lectura en celulares durante los servicios.

### Para Administradores (Vista Privada)
* **Autenticación Segura:** Sistema de login protegido con `NextAuth.js` y contraseñas encriptadas mediante `bcrypt`.
* **Gestión de Cantos (CRUD):** Creación, edición y eliminación de alabanzas. 
* **Gestión de Repertorios:** Constructor de listas *drag-and-drop* (visual) para armar los servicios semanales, asignar fechas y activar/desactivar su visibilidad pública.
* **Gestión de Perfil:** Actualización de credenciales de acceso de forma segura.

---

## 🎸 Sintaxis de Acordes (Modo Músico)

Para que el motor de acordes funcione correctamente, las letras deben registrarse en el panel de administración utilizando el **"Método de Corchetes"**. El acorde debe colocarse entre corchetes `[]` justo antes de la sílaba donde ocurre el cambio musical.

**Ejemplo de entrada en el Admin:**
```text
[G]Bendice a [C]Israel alma [G]mía
[G]Y YHWH te [C]dará de Su [D]bien
Yhwh ha permi[Em]tido [Eb/E]a tra[D/E]vés de Ye[Am]shúa

```

*El sistema se encargará de extraer los corchetes y renderizarlos flotando sobre el texto correspondiente cuando el usuario active el botón de la guitarra.*

---

## 🚀 Instalación y Despliegue Local

### Requisitos Previos

* [Node.js](https://nodejs.org/) (v18 o superior)
* [pnpm](https://pnpm.io/) (Recomendado) o npm/yarn
* Un clúster activo en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [https://github.com/tu-usuario/cantos-shabat-app.git](https://github.com/tu-usuario/cantos-shabat-app.git)
cd cantos-shabat-app

```


2. **Instalar dependencias**
```bash
pnpm install

```


3. **Configurar Variables de Entorno**
Crea un archivo llamado `.env.local` en la raíz del proyecto y agrega las siguientes variables:
```env
# Conexión a tu base de datos MongoDB
MONGODB_URI="mongodb+srv://<usuario>:<password>@cluster.mongodb.net/hallel_db"

# Autenticación (Puedes generar un secreto usando: openssl rand -base64 32)
NEXTAUTH_SECRET="tu_secreto_generado_aqui"
NEXTAUTH_URL="http://localhost:3000"

```


4. **Ejecutar el servidor de desarrollo**
```bash
pnpm run dev

```


*La aplicación estará disponible en `http://localhost:3000*`

---

## 🛠️ Tecnologías Utilizadas

* **Framework:** Next.js 16+ (App Router, Server Components, API Routes)
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS (con soporte Dark Mode)
* **Base de Datos:** MongoDB con Mongoose (Modelado de datos)
* **Autenticación:** NextAuth.js (Provider de Credenciales)
* **Iconografía:** Lucide React

---

## ☁️ Despliegue en Producción

Este proyecto está optimizado para ser desplegado fácilmente en **Vercel**.
Al desplegar, asegúrate de:

1. Configurar la IP de MongoDB Atlas a `0.0.0.0/0` (Network Access) para permitir conexiones desde los servidores *serverless* de Vercel.
2. Registrar las variables de entorno (`MONGODB_URI` y `NEXTAUTH_SECRET`) en la configuración del proyecto en Vercel.

---

*Desarrollado para facilitar la adoración y el orden en los servicios congregacionales.*

```
