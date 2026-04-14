# 🏦 Card Issuer Service - Reto Técnico (Arquitectura Event-Driven)

## 📌 Descripción del proyecto

Este repositorio implementa un sistema backend para la **emisión de tarjetas en un neobanco**, desarrollado como parte de un reto técnico.

El sistema simula el flujo completo de solicitud de tarjeta para nuevos clientes utilizando una **arquitectura basada en eventos**, garantizando escalabilidad, desacoplamiento y procesamiento asíncrono.

---

## ⚙️ Reglas de negocio

- Un cliente solo puede tener una tarjeta
- Cada solicitud genera un requestId único
- Procesamiento asíncrono con Kafka


## ⚙️ Tecnologías utilizadas

- NestJS (Backend Framework)
- KafkaJS (Apache Kafka)
- MySQL (Persistencia de datos)
- Docker & Docker Compose
- TypeScript
- Arquitectura Hexagonal (Ports & Adapters)

---

## 🧠 Arquitectura general

El sistema está basado en una arquitectura **event-driven** combinada con **arquitectura hexagonal**, lo que permite separar la lógica de negocio de la infraestructura.

## Diseño

**Patrones de Diseño**:
Al haber usado Arquitectura Hexagonal eso con lleva a usar algunos patrones de diseño tales como:
- Repository Pattern: Me permitíó que la lógica de negocio trabaje con interfaces y no con detalles de persistencia.
- Dependency Inversion: Las capas internas no dependes de las capas de afuera. En mi caso, por ejemplo, la capa de Dominio no depende de la capa Aplicación o Infraestructura
- Strategy Pattern: Se aplica el patrón Strategy al desacoplar la lógica de negocio del repositorio de persistencia, permitiendo intercambiar fácilmente la implementación concreta. En un un futuro si se decide cambiar de base de datos o publicadot de eventos simplemente se cambia la implementacion sin afectar el dominio del negocio.


### 🔄 Flujo del sistema:

Cliente → API REST → Kafka Producer → Topic Kafka → Consumer → Base de datos

---

## 🧩 Diseño de arquitectura hexagonal

El proyecto está organizado en capas:

- **Dominio:** reglas de negocio puras
- **Aplicación:** casos de uso del sistema
- **Infraestructura:** Kafka, MySQL, servicios externos
- **Interfaces:** controladores REST

### ✔ Beneficios:
- Código más mantenible
- Alta escalabilidad
- Bajo acoplamiento
- Fácil de testear

---

## Instalación (recomendada)

Sigue estos pasos para correr el proyecto en tu máquina local usando Docker y MongoDB.

### 1. Clona el repositorio

```bash
git clone https://github.com/cesarxa14/backend-reto-bcp.git
cd backend-reto-bcp
```

### 2. Levanta los contenedores de docker

```bash
docker-compose up -d
```

### 4. Verifica el arranque de la aplicación
Abre tu navegador y entra a http://localhost:3000/api
Desde ahí podras visualizar la interfaz de Swagger

## 📡 Endpoint principal

### ➤ Emitir tarjeta

```http
POST /cards/issue