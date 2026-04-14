# 🏦 Card Issuer Service - Reto Técnico (Arquitectura Event-Driven)

## 📌 Descripción del proyecto

Este repositorio implementa un sistema backend para la **emisión de tarjetas en un neobanco**, desarrollado como parte de un reto técnico.

El sistema simula el flujo completo de solicitud de tarjeta para nuevos clientes utilizando una **arquitectura basada en eventos**, garantizando escalabilidad, desacoplamiento y procesamiento asíncrono.

---

## ⚙️ Tecnologías utilizadas

- 🟢 NestJS (Backend Framework)
- 🟡 KafkaJS (Apache Kafka)
- 🐬 MySQL (Persistencia de datos)
- 🐳 Docker & Docker Compose
- 🧠 TypeScript
- 🏗️ Arquitectura Hexagonal (Ports & Adapters)

---

## 🧠 Arquitectura general

El sistema está basado en una arquitectura **event-driven** combinada con **arquitectura hexagonal**, lo que permite separar la lógica de negocio de la infraestructura.

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

## 📡 Endpoint principal

### ➤ Emitir tarjeta

```http
POST /cards/issue