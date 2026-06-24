# 📚 Centro de Documentación - EduPlataform

> Guía centralizada de toda la documentación técnica del proyecto

---

## 🎯 Por Dónde Empezar

### 👤 Soy Nuevo en el Proyecto

1. Leer [SETUP_INICIAL.md](#setup_inicial) — Instalación y primeros pasos
2. Revisar [ESTRUCTURA_PROYECTO.md](#estructura_proyecto) — Conocer el layout
3. Leer [Esquema Proyecto.md](#esquema) — Entender la arquitectura

### 👨‍💻 Quiero Contribuir al Código

1. Leer [REGLAS_COLABORACION.md](#reglas_colaboracion) — Normas de código
2. Ver [AUTH_GUIDE.md](#auth_guide) — Ejemplo de módulo
3. Revisar [IMPLEMENTACION_LOGIN_REGISTER.md](#implementacion_login) — Implementación detallada

### 🔒 Me Interesa la Seguridad

1. Leer [../SECURITY.md](#security) — Vulnerabilidades conocidas
2. Ver [SETUP_INICIAL.md](#setup_inicial) — Variables de entorno

### 🐛 Necesito Revisar Problemas Conocidos

Ver [../informe%20QA.md](#qa_issues) — Lista de bugs y malas prácticas

---

## 📖 Documentos Disponibles

### <a id="setup_inicial"></a>🚀 [SETUP_INICIAL.md](SETUP_INICIAL.md)

**Para**: Instalación del proyecto por primera vez

**Contiene**:
- Requisitos del sistema
- Pasos de instalación
- Configuración de variables de entorno
- Verificación de conexión a BD
- Troubleshooting común

**Leer si**: Acabas de clonar el repo y no sabes qué hacer

---

### <a id="estructura_proyecto"></a>🏗️ [ESTRUCTURA_PROYECTO.md](ESTRUCTURA_PROYECTO.md)

**Para**: Entender la organización del código

**Contiene**:
- Descripción de carpetas y archivos
- Propósito de cada módulo
- Convenciones de nombres
- Patrones de importación

**Leer si**: Necesitas navegar el codebase o entender dónde va el nuevo código

---

### <a id="esquema"></a>📊 [Esquema Proyecto.md](Esquema%20Proyecto.md)

**Para**: Visión arquitectónica del proyecto

**Contiene**:
- Diagrama de componentes
- Flujo de datos
- Relaciones entre módulos
- Stack tecnológico visual

**Leer si**: Necesitas entender cómo funciona todo junto

---

### <a id="auth_guide"></a>🔐 [AUTH_GUIDE.md](AUTH_GUIDE.md)

**Para**: Entender el sistema de autenticación

**Contiene**:
- Flujo de login/register
- Componente LoginRegister
- Manejo de tokens/sesiones
- Validación de credenciales

**Leer si**: Vas a trabajar con authentication o necesitas integrar login en otra sección

---

### <a id="implementacion_login"></a>⚙️ [IMPLEMENTACION_LOGIN_REGISTER.md](IMPLEMENTACION_LOGIN_REGISTER.md)

**Para**: Detalles técnicos de la implementación auth

**Contiene**:
- Handlers IPC específicos
- Modelos de datos de User
- Validaciones implementadas
- Errores posibles

**Leer si**: Necesitas debuggear o extender la funcionalidad de auth

---

### <a id="reglas_colaboracion"></a>👥 [REGLAS_COLABORACION.md](REGLAS_COLABORACION.md)

**Para**: Normas de contribución y código

**Contiene**:
- Estilo de código (ESLint, Prettier)
- Estructura de commits
- Proceso de PR
- Naming conventions
- Estructura de carpetas para nuevas features

**Leer si**: Vas a hacer un commit o PR

---

### <a id="security"></a>🛡️ [../SECURITY.md](../SECURITY.md)

**Para**: Política de seguridad y vulnerabilidades

**Contiene**:
- Vulnerabilidades críticas conocidas
- Medidas de seguridad obligatorias
- Checklist pre-producción
- Cómo reportar vulnerabilidades

**Leer si**: Vas a trabajar con datos sensibles o deploying a producción

---

### <a id="qa_issues"></a>🔴 [../informe QA.md](../informe%20QA.md)

**Para**: Problemas conocidos y deuda técnica

**Contiene**:
- Lista de bugs críticos
- CSS muerto y duplicado
- Problemas de diseño
- Componentes en construcción
- Recomendaciones de refactor

**Leer si**: Necesitas entender por qué algo no funciona bien

---

## 🗺️ Mapa Mental

```
EduPlataform/
│
├─ 📖 Documentación
│  ├─ README.md ........................ Inicio rápido
│  ├─ SECURITY.md ..................... Seguridad
│  ├─ informe QA.md ................... Problemas conocidos
│  └─ docs/ ........................... Centro de documentación
│     ├─ SETUP_INICIAL.md ............ Instalación
│     ├─ ESTRUCTURA_PROYECTO.md ...... Organización del código
│     ├─ Esquema Proyecto.md ......... Arquitectura
│     ├─ AUTH_GUIDE.md ............... Sistema de login
│     ├─ IMPLEMENTACION_LOGIN_REGISTER.md .. Detalles técnicos
│     ├─ REGLAS_COLABORACION.md ..... Normas de código
│     └─ DOCUMENTACION.md ............ Este archivo
│
├─ 💻 Código
│  ├─ packages/frontend/ ............. UI React
│  ├─ packages/main/ ................. Electron IPC backend
│  └─ packages/shared/ ............... Código compartido
│
└─ 📦 Build & Deploy
   ├─ dist-gh/ ....................... Build para GitHub Pages
   └─ package.json ................... Scripts npm

```

---

## 🔄 Flujos de Trabajo Comunes

### Flujo: "Quiero agregar una nueva feature"

1. 📖 Leer [ESTRUCTURA_PROYECTO.md](#estructura_proyecto) — Dónde va el código
2. 👥 Leer [REGLAS_COLABORACION.md](#reglas_colaboracion) — Normas de naming
3. 👨‍💻 Crear archivo en carpeta apropiada
4. 🔍 Leer [AUTH_GUIDE.md](#auth_guide) — Si es similar a auth
5. ✅ Ejecutar `npm run format && npm run lint`
6. 📤 Hacer commit siguiendo normas

### Flujo: "El código no funciona, necesito debuggear"

1. 🔴 Buscar el problema en [informe QA.md](#qa_issues)
2. 🏗️ Leer [ESTRUCTURA_PROYECTO.md](#estructura_proyecto) — Entender dónde está
3. ⚙️ Si es auth: ver [IMPLEMENTACION_LOGIN_REGISTER.md](#implementacion_login)
4. 🔍 Revisar [SECURITY.md](#security) — Si son problemas de IPC/BD

### Flujo: "Necesito setup por primera vez"

1. 🚀 Leer completamente [SETUP_INICIAL.md](#setup_inicial)
2. 📊 Revisar [Esquema Proyecto.md](#esquema) — Entender la arquitectura
3. 🏗️ Leer [ESTRUCTURA_PROYECTO.md](#estructura_proyecto) — Navegar el código

---

## ✅ Checklist de Documentación

Antes de commitear cambios, asegurate que:

- [ ] El código cumple [REGLAS_COLABORACION.md](#reglas_colaboracion)
- [ ] No introduces vulnerabilidades (revisar [SECURITY.md](#security))
- [ ] Si es una nueva feature importante, actualizas el README.md
- [ ] Si cambias la estructura, actualizas [ESTRUCTURA_PROYECTO.md](#estructura_proyecto)
- [ ] Si corriges un bug, lo documentes en una PR description

---

## 📝 Convenciones de Documentación

Todos los `.md` deben tener:

✅ **Tabla de Contenidos** (si >5 secciones)
✅ **Emojis** para identificar secciones
✅ **Ejemplos de código** donde aplique
✅ **Links internos** a otros documentos
✅ **Sección de problemas conocidos** (si corresponde)
✅ **Fecha de última actualización**

---

## 🔗 Enlaces Rápidos

| Necesito... | Ver... |
|------------|---------|
| Instalar la app | [SETUP_INICIAL.md](SETUP_INICIAL.md) |
| Encontrar un archivo | [ESTRUCTURA_PROYECTO.md](ESTRUCTURA_PROYECTO.md) |
| Contribuir código | [REGLAS_COLABORACION.md](REGLAS_COLABORACION.md) |
| Entender la arquitectura | [Esquema Proyecto.md](Esquema%20Proyecto.md) |
| Trabajar con auth | [AUTH_GUIDE.md](AUTH_GUIDE.md) |
| Ver detalles de implementación | [IMPLEMENTACION_LOGIN_REGISTER.md](IMPLEMENTACION_LOGIN_REGISTER.md) |
| Revisar seguridad | [../SECURITY.md](../SECURITY.md) |
| Ver bugs conocidos | [../informe QA.md](../informe%20QA.md) |
| Volver al README | [../README.md](../README.md) |

---

## 🐛 Reportar Problemas en la Documentación

Si encuentras errores o información faltante:

1. Crear un issue en GitHub
2. Describir qué documento, qué sección, qué falta
3. Sugerir la información que debería incluirse

---

## 📊 Estadísticas de Documentación

| Documento | Secciones | Estado |
|-----------|-----------|--------|
| README.md | 10 | ✅ Actualizado |
| SECURITY.md | 12 | ✅ Actualizado |
| SETUP_INICIAL.md | - | ℹ️ Existente |
| ESTRUCTURA_PROYECTO.md | - | ℹ️ Existente |
| AUTH_GUIDE.md | - | ℹ️ Existente |
| IMPLEMENTACION_LOGIN_REGISTER.md | - | ℹ️ Existente |
| REGLAS_COLABORACION.md | - | ℹ️ Existente |
| Esquema Proyecto.md | - | ℹ️ Existente |
| informe QA.md | 6 | ⚠️ Requiere acción |

---

**Última actualización**: 2025-12-23  
**Versión de documentación**: 1.0  
**Mantenedor**: EduPlataform Team
