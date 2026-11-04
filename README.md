# WasteZero — Full-Stack Waste Management Application

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-green.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue.svg)]()
[![Database](https://img.shields.io/badge/Database-MySQL-orange.svg)]()
[![Security](https://img.shields.io/badge/Security-Spring%20Security%20%2B%20JWT-red.svg)]()

**WasteZero** is a full-stack waste management, collection tracking, and environmental impact reporting platform. It bridges the gap between residential waste generators (Customers), field collection staff (Collectors), and platform administrators (Admin) through an automated pickup lifecycle, smart collector workload assignment, actual weight proof uploads, recycling verification, and environmental impact calculation.

---

## 🌟 Key Features

### 👤 1. Customer Role
* **Authentication**: Register with role `CUSTOMER` or log in via JWT-secured endpoints.
* **Pickup Creation**: Schedule waste collection requests specifying waste category (`PLASTIC`, `PAPER`, `GLASS`, `METAL`, `ORGANIC`, `E_WASTE`, `MIXED`, `OTHER`), preferred date, time slot, pickup address, and notes.
* **Pickup History & Lifecycle Tracking**: Track real-time progress through all stages (`REQUESTED` → `ASSIGNED` → `ACCEPTED` → `ON_THE_WAY` → `ARRIVED` → `COLLECTED` → `RECYCLED`).
* **Environmental Impact Dashboard**: View estimated cumulative $CO_2$ emissions saved, equivalent trees planted, water saved, and energy conserved based on actual collected weight and material-specific conversion factors.
* **Complaints Management**: Submit tickets for delayed, missed, or damaged pickups and track response status (`OPEN` → `UNDER_REVIEW` → `RESOLVED`).
* **Profile Management**: View personal details and system role permissions.

### 🚛 2. Collector Role
* **Collector Dashboard**: View real-time active workload, assigned pickups, accepted jobs, and completed history.
* **Availability Management**: Toggle operational state (`AVAILABLE`, `BUSY`, `OFFLINE`). System automatically transitions collector to `BUSY` upon job acceptance and returns to `AVAILABLE` when active workload is cleared.
* **Pickup Accept / Reject Workflow**: Claim assigned pickups or reject with a reason (triggering automatic smart reassignment to another candidate).
* **Progress Progression**: Update status dynamically (`ACCEPTED` → `ON_THE_WAY` → `ARRIVED`).
* **Collection Completion**: Input verified **actual weight** (in kg), collection notes, and mandatory **photo proof of collection**.
* **Pickup History**: Access comprehensive logs of past collections.

### 🛡️ 3. Admin Role
* **Platform Overview**: Real-time dashboard stats showing user breakdowns, pickup lifecycle counts, complaint statuses, and aggregate environmental metrics.
* **User & Collector Management**: Enable/disable user accounts, monitor collector active workloads, and view detailed user profiles.
* **Pickup & Recycling Confirmation**: Monitor system-wide pickups and confirm transition from `COLLECTED` to `RECYCLED` with optional facility notes.
* **Complaint Resolution**: Review customer support tickets, post official responses, and update complaint statuses.

---

## 🔄 Pickup Lifecycle Pipeline

```text
  Customer Creates Request
             │
             ▼
        [REQUESTED] ──────► Smart Assignment Algorithm
             │                        │
             ▼                        ▼
        [ASSIGNED] ◄──────────────────┘
             │
             ├───────────────────┐
             ▼                   ▼
        [ACCEPTED]          [REJECTED] ──► Smart Reassignment
             │
             ▼
       [ON_THE_WAY]
             │
             ▼
         [ARRIVED]
             │
             ▼
        [COLLECTED] ◄────── Actual Weight + Photo Proof Upload
             │
             ▼
        [RECYCLED]  ◄────── Admin Recycling Confirmation
             │
             ▼
  Environmental Impact Calculated
```

* **Exceptional Statuses**: `REJECTED`, `CANCELLED`, `REASSIGNABLE`, `FAILED`, `EXPIRED`.

---

## ⚡ Smart Collector Assignment Algorithm

WasteZero employs an automated workload-balancing algorithm for driver selection:

```text
Eligible Collectors (Active=True, Role=COLLECTOR, Availability=AVAILABLE)
                             │
                             ▼
  Exclude Collectors who previously Rejected this Pickup
                             │
                             ▼
         Select Collector with Lowest Active Workload
               (Active = ASSIGNED, ACCEPTED, ON_THE_WAY, ARRIVED)
                             │
                             ▼
         Deterministic Tie-Breaker (Lowest Collector User ID)
```

> **Note**: Service area / zone matching and GPS maps were intentionally excluded in favor of deterministic workload distribution.

---

## 🌿 Environmental Impact Calculation

Environmental metrics are derived strictly from **verified actual weight** of pickups that have reached `RECYCLED` status:

$$\text{CO}_2\text{ Saved (kg)} = \sum \left( \text{Actual Weight (kg)} \times \text{Category Conversion Factor} \right)$$

### Conversion Factors ($kg\ CO_2e$ saved / $kg$ material):
* **Plastic**: $1.5$
* **Metal**: $2.5$
* **E-Waste**: $3.0$
* **Paper**: $0.9$
* **Glass**: $0.3$
* **Organic**: $0.5$
* **Mixed / Other**: $0.7 / 0.5$

Derived metrics:
* **Trees Saved**: $\text{Total } CO_2 / 21.0\text{ kg}$
* **Water Conserved**: $\text{Total Weight} \times 12.5\text{ Liters}$
* **Energy Conserved**: $\text{Total Weight} \times 2.5\text{ kWh}$

---

## 🏗️ Technology Stack

### Backend
* **Language & Framework**: Java 17, Spring Boot 3.4.x
* **Security & Auth**: Spring Security, JWT (JSON Web Tokens), BCrypt Password Hashing
* **Persistence**: Spring Data JPA, Hibernate, MySQL 8.x
* **Documentation**: OpenAPI 3.0, Swagger UI
* **Build Tool**: Apache Maven

### Frontend
* **Core**: React 18, Vite 6
* **State Management**: Redux Toolkit, React Context API
* **UI Components & Icons**: Material-UI (MUI v6), Lucide React
* **HTTP Client**: Axios (with Request Interceptors for JWT & Global Error Handling)
* **Routing**: React Router v6 (with Role-Based Protected Routes)
* **Styling**: Modern Custom CSS & Glassmorphism Aesthetics

---

## 📁 Repository Structure

```text
wastezero/
├── backend/
│   ├── src/main/java/com/example/backend/
│   │   ├── config/          # Security, CORS, Swagger, Web MVC Config
│   │   ├── controller/      # Auth, Pickup, Collector, Admin, Complaint, Impact Controllers
│   │   ├── dto/             # Request & Response Data Transfer Objects
│   │   ├── entity/          # JPA Entities (User, Pickup, Complaint, History, Enums)
│   │   ├── exception/       # Global Exception Handler & Custom Errors
│   │   ├── repository/      # Spring Data JPA Repositories & Locking Queries
│   │   ├── security/        # JWT Filter, Authentication EntryPoint
│   │   └── service/         # Business Logic & Smart Assignment
│   ├── src/main/resources/  # application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── assets/          # Static Design Assets
│   │   ├── components/      # Shared Components & Protected Routes
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Customer, Collector, and Admin Pages
│   │   ├── services/        # Axios API Service Modules
│   │   ├── store/           # Redux Slices (Pickup, Collector, Admin, Complaint)
│   │   ├── App.jsx          # Main Router Setup
│   │   └── global.css       # Design System Styles
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 🚀 Local Setup & Installation

### Prerequisites
* **Java**: JDK 17 or higher
* **Node.js**: v18.x or higher
* **MySQL**: Server 8.0+

### 1. Database Setup
Create a MySQL database named `wastezero`:
```sql
CREATE DATABASE wastezero;
```

### 2. Backend Setup
Navigate to the `backend/` folder:
```bash
cd backend
```
Create a `.env` file or set environment variables:
```properties
DB_URL=jdbc:mysql://localhost:3306/wastezero?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
```
Run the Spring Boot application:
```bash
mvn clean spring-boot:run
```
The backend will launch at `http://localhost:8080`.

### 3. Swagger API Documentation
Access live Swagger UI at:
```text
http://localhost:8080/swagger-ui.html
```

### 4. Frontend Setup
Navigate to the `frontend/` folder:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🎬 End-to-End Demonstration Flow

1. **Register / Login**:
   - Register a `CUSTOMER` account (`john@example.com`).
   - Register a `COLLECTOR` account (`driver@example.com`).
   - Default `ADMIN` account (`admin@gmail.com` / `Admin@123`) is seeded automatically.

2. **Customer Lifecycle**:
   - Log in as Customer → Click **Create Pickup** → Select `PLASTIC` category, date, address → Submit.
   - Status becomes `REQUESTED` and Smart Assignment assigns `driver@example.com` (`ASSIGNED`).

3. **Collector Lifecycle**:
   - Log in as Collector → View **Assigned Pickups**.
   - Click **Accept Pickup** (Status becomes `ACCEPTED`, Collector state set to `BUSY`).
   - Progress through status updates: `ON_THE_WAY` → `ARRIVED`.
   - Upload **Collection Proof photo**, enter **Actual Weight** (e.g., $15.5\text{ kg}$), and click **Complete Collection** (Status becomes `COLLECTED`).

4. **Admin Lifecycle & Recycling**:
   - Log in as Admin (`admin@gmail.com`) → View **Pickups**.
   - Click **Confirm Recycling** on the collected item (Status moves to `RECYCLED`).

5. **Impact & Complaint Flow**:
   - Switch back to Customer → Check **Environmental Impact** page (reflecting updated $CO_2$ savings).
   - Customer submits a **Complaint** regarding a pickup.
   - Admin views **Complaints Manager**, posts response, and updates status to `RESOLVED`.

---

## 🔒 Security & Quality Assurance

* **JWT Authentication**: Stateless session management with bearer token authorization.
* **Role-Based Access Control (RBAC)**: Backend endpoint enforcement (`@PreAuthorize("hasRole(...)")`).
* **IDOR Protection**: Data access verified against authenticated identity (`SecurityContextHolder`).
* **Concurrency Protection**: Database pessimistic locking (`PESSIMISTIC_WRITE`) prevents double-claiming of pickups.
* **Input Validation**: Backend `@Valid` DTO constraint enforcement.
* **Zero Notifications**: Obsolete notification modules cleanly removed.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
