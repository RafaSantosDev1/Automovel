# Documentação da Base de Dados — Automovel

Este documento descreve a estrutura da base de dados relacional utilizada pelo projeto **Automovel**, incluindo as tabelas, colunas, chaves primárias, chaves estrangeiras, restrições e relacionamentos.

> Base de dados configurada em `application.properties`: H2 em memória, com criação automática de tabelas via JPA/Hibernate (`spring.jpa.hibernate.ddl-auto=update`).

---

## Tabelas

### customers

Representa os clientes da oficina.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Identificador único do cliente |
| `name` | `VARCHAR(255)` | `NOT NULL` | Nome completo do cliente |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` | Email do cliente (único) |
| `phone_number` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` | Número de telefone (único) |

- **Chave primária:** `id`
- **Índices únicos:** `email`, `phone_number`

---

### vehicles

Representa os veículos pertencentes aos clientes.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Identificador único do veículo |
| `license_plate` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` | Matrícula do veículo |
| `brand` | `VARCHAR(255)` | `NOT NULL` | Marca do veículo |
| `model` | `VARCHAR(255)` | `NOT NULL` | Modelo do veículo |
| `vehicle_year` | `INTEGER` | `NOT NULL` | Ano de fabrico |
| `mileage` | `INTEGER` | `NOT NULL` | Quilometragem atual |
| `customer_id` | `BIGINT` | `NOT NULL`, `FK → customers(id)` | Cliente proprietário |

- **Chave primária:** `id`
- **Chave estrangeira:** `customer_id` → `customers(id)`
- **Índice único:** `license_plate`

> Nota: a coluna `vehicle_year` usa nome explícito para evitar conflito com palavras reservadas do H2.

---

### appointments

Representa as marcações de serviço na oficina.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Identificador único da marcação |
| `vehicle_id` | `BIGINT` | `NOT NULL`, `FK → vehicles(id)` | Veículo associado |
| `appointment_date` | `TIMESTAMP` | `NOT NULL` | Data e hora da marcação |
| `description` | `TEXT` | — | Descrição do problema/serviço |
| `appointment_status` | `VARCHAR(20)` | `NOT NULL` | Estado da marcação |

- **Chave primária:** `id`
- **Chave estrangeira:** `vehicle_id` → `vehicles(id)`
- **Valores possíveis de `appointment_status`:** `SCHEDULED`, `CANCELLED`, `COMPLETED`

> Nota: a coluna `appointment_status` usa nome explícito para evitar conflito com palavras reservadas do H2.

---

## Relacionamentos

```
customers (1) ──── (N) vehicles (1) ──── (N) appointments
```

- **Um cliente pode ter vários veículos.**
  - `customers.id` → `vehicles.customer_id`
  - Relação: `@OneToMany` / `@ManyToOne`

- **Um veículo pode ter várias marcações.**
  - `vehicles.id` → `appointments.vehicle_id`
  - Relação: `@OneToMany` / `@ManyToOne`

---

## Regras de integridade

- Ao eliminar um **cliente**, os veículos associados são também eliminados (`CascadeType.ALL` + `orphanRemoval = true`).
- Ao eliminar um **veículo**, as marcações associadas são também eliminadas (`CascadeType.ALL` + `orphanRemoval = true`).
- O email e o telefone são únicos em toda a tabela `customers`.
- A matrícula é única em toda a tabela `vehicles`.
- O estado da marcação é armazenado como texto (`EnumType.STRING`), com valor padrão `SCHEDULED` (`@PrePersist`).

---

## Consultas úteis no H2 Console

O H2 Console está disponível em `http://localhost:8080/h2-console` com as credenciais definidas em `application.properties`.

```sql
-- Listar todos os clientes
SELECT * FROM customers;

-- Listar todos os veículos com o nome do cliente
SELECT v.*, c.name AS customer_name FROM vehicles v JOIN customers c ON v.customer_id = c.id;

-- Listar todas as marcações com detalhe do veículo e cliente
SELECT a.*, v.license_plate, c.name AS customer_name
FROM appointments a
JOIN vehicles v ON a.vehicle_id = v.id
JOIN customers c ON v.customer_id = c.id;

-- Contar veículos por cliente
SELECT c.name, COUNT(v.id) AS vehicle_count
FROM customers c
LEFT JOIN vehicles v ON c.id = v.customer_id
GROUP BY c.id, c.name;
```
