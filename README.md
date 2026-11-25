# CaféSense ☕

## CaféSense – Café Sales and Customer Behavior Analytics System

A full-stack café management and Point of Sale (POS) application designed to record café transactions, manage products and inventory, and transform sales data into meaningful business insights.

Built using HTML, CSS, Vanilla JavaScript, Node.js, Express.js, MySQL, and Chart.js, following a **3-Layer Architecture**.

---

## 📌 Project Overview

CaféSense is a web-based café management and analytics system designed to help café owners monitor and manage their daily business operations through a centralized platform.

Traditional café operations often rely on manual transaction records and separate inventory monitoring, making it difficult to track sales performance, monitor product availability, and identify customer purchasing patterns.

CaféSense addresses these challenges by integrating transaction processing, product and inventory management, analytics, reporting, and user management into one system.

Through its centralized database and integrated modules, the system transforms recorded sales transactions into visual reports and business insights that support better business decision-making.

---

## ✨ Key Features

### 1. Dashboard
- Displays key business performance indicators.
- Shows total revenue and transaction counts.
- Highlights best-selling products and peak business hours.
- Provides sales and customer analytics through visual charts.
- Displays recent transactions.
- Supports dashboard overview filters.

### 2. Point of Sale (POS) / Transactions
- Records customer purchases.
- Supports multiple products in one transaction.
- Supports multiple customer types within one transaction.
- Automatically calculates subtotals, discounts, and totals.
- Supports configured payment methods.
- Generates transaction receipts.
- Automatically deducts product stock after successful checkout.
- Maintains transaction history.

### 3. Product and Inventory Management
- Displays and manages café products.
- Records product prices and stock quantities.
- Supports adding and editing products.
- Supports product deactivation and reactivation.
- Allows stock adjustments.
- Tracks inventory movement history.
- Records stock changes resulting from sales and manual adjustments.
- Provides product search and filtering.

### 4. Analytics
- Analyzes recorded sales transactions.
- Displays sales performance and trends.
- Provides product performance analysis.
- Presents customer purchasing patterns.
- Shows payment method distribution.
- Identifies peak business hours.
- Provides date-based analytics and filtering.
- Uses interactive charts and tables for data visualization.

### 5. Sales Reports
- Generates sales summaries and performance reports.
- Provides daily, weekly, and monthly sales breakdowns.
- Displays product sales and customer sales breakdowns.
- Supports date filtering.
- Exports report data into CSV files.
- Supports printing reports.

### 6. User Management
- Allows authorized users to create and manage accounts.
- Supports editing user information and account roles.
- Supports account deactivation and reactivation.
- Provides account status filtering.
- Prevents unauthorized account management operations.
- Protects account information and password data.

### 7. Authentication and Access Control
- Provides user login and logout functionality.
- Uses JWT-based authentication.
- Stores authentication tokens in HTTP-only cookies.
- Supports password resetting.
- Implements role-based access control.
- Restricts system features according to user roles.

---

## 👥 User Roles and Permissions

CaféSense implements three user roles:

| Role | Access and Responsibilities |
|---|---|
| Owner | Full system access, including Dashboard, Transactions, Product and Inventory Management, Analytics, Reports, and User Management. |
| Manager | Access to operational modules, including Transactions, Product and Inventory Management, Analytics, and Reports. |
| Staff | Access to authorized operational features, primarily recording and processing transactions. |

Access to protected operations is controlled through backend authentication and authorization middleware.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Database Driver | mysql2 |
| Data Visualization | Chart.js |
| API Communication | REST API |
| Authentication | JSON Web Token (JWT) |
| Password Security | bcrypt |
| Cookie Handling | cookie-parser |
| Development Tool | Nodemon |
| Version Control | Git and GitHub |

---

## 🏛️ Architecture Overview

CaféSense follows a **3-Layer Architecture**, separating presentation, business logic, and data access responsibilities.

### Layer 1: Presentation Layer

Handles the user interface and communication between the frontend and backend.

Responsibilities:
- HTML, CSS, and Vanilla JavaScript views.
- Express controllers.
- API route definitions.
- HTTP request and response handling.
- User interaction and presentation of system data.

### Layer 2: Business Logic Layer

Handles application rules, validations, calculations, and business processes.

Responsibilities:
- Authentication and authorization logic.
- Product management operations.
- Transaction processing.
- Discount calculations.
- Stock validation.
- Inventory-related business rules.
- Analytics and report processing.
- User management operations.

### Layer 3: Data Access Layer

Handles communication with the MySQL database.

Responsibilities:
- Database queries.
- Data retrieval and storage.
- Product repository.
- Transaction repository.
- Inventory data access.
- User and authentication data access.
- Other database-related operations.

### Architecture Structure

```text
CafeSense/
│
├── database/
│   └── CafeSenseDB.sql
│
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
├── README.md
│
└── src/
    ├── presentation/
    │   ├── controllers/
    │   ├── routes/
    │   └── views/
    │       ├── index.html
    │       ├── pages/
    │       └── assets/
    │           ├── css/
    │           └── js/
    │               ├── api/
    │               └── pages/
    │
    ├── business/
    │   ├── services/
    │   ├── models/
    │   └── validators/
    │
    ├── data/
    │   └── repositories/
    │
    └── config/
        ├── database.js
        ├── app.js
        ├── index.js
        └── middlewares/
```

*Note: The structure above presents the main application layers and folders. Individual files are organized within their respective directories.*

---

## 🔄 System Integration

CaféSense integrates multiple technologies and internal modules to provide a unified café management platform.

### 1. Frontend and Backend Integration

The frontend communicates with the backend through REST API endpoints using JavaScript Fetch API.

The Express.js backend receives requests, processes them through the appropriate controllers and business services, and returns responses to the frontend.

### 2. Backend and Database Integration

The backend connects to the MySQL database using the mysql2 driver.

Repositories handle database queries and operations, allowing the application to retrieve, insert, update, and manage system records.

### 3. Authentication Integration

The system uses JSON Web Tokens (JWT) for authentication.

After successful login, the backend stores the authentication token in an HTTP-only cookie. Authentication middleware validates the token when users access protected resources.

### 4. Internal Module Integration

The system's modules share information through the backend and centralized database.

For example, when a transaction is successfully completed:
- Transaction information is stored in the database.
- Transaction items are recorded with their corresponding product and customer type information.
- Product stock quantities are automatically updated.
- Inventory movements are recorded.
- The transaction data becomes available for analytics and reports.

This integration ensures that operational records and business insights are based on the same stored transaction data.

---

## 🗄️ Database

CaféSense uses **MySQL** as its relational database management system.

**Database Name:**

```sql
CafeSenseDB
```

The database contains tables for managing:
- Users and roles.
- Products and product categories.
- Customer types.
- Payment methods.
- Transactions.
- Transaction items.
- Inventory movements.

The database stores user accounts, product information, sales transactions, customer classifications, payment methods, and inventory movement history.

The centralized database allows the system's modules to access and share relevant information while maintaining data consistency.

### Database SQL Script

The project includes a database SQL script located in:

```text
database/CafeSenseDB.sql
```

This script contains the database structure and required initial records for setting up the CaféSense database.

To prepare the database:

1. Open MySQL Workbench.
2. Connect to your local MySQL Server.
3. Open the `database/CafeSenseDB.sql` file.
4. Execute the SQL script.
5. Verify that the `CafeSenseDB` database and its required tables have been created successfully.

*Note: The SQL script should be kept updated whenever changes are made to the database structure or required initial records.*

---

## ⚙️ Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MySQL Server
- MySQL Workbench (recommended)
- Visual Studio Code (recommended)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/kyeverse/CafeSense.git
```

Navigate to the project directory:

```bash
cd CafeSense
```

### 2. Install Dependencies

```bash
npm install
```

For Windows PowerShell environments where the npm PowerShell script is restricted, use:

```powershell
npm.cmd install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root directory.

Add your local MySQL configuration using the environment variable names required by the project's configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=CafeSenseDB
DB_PORT=3306
```

Replace `your_mysql_password` with your actual MySQL password.

**Important:** Never commit or upload your `.env` file or actual database credentials to GitHub.

### 4. Prepare the Database

Follow the instructions in the [Database SQL Script](#database-sql-script) section to create and initialize the `CafeSenseDB` database.

Make sure the database tables and required reference records are available before starting the application.

---

## 🚀 Running the Application

### 1. Start the Server

For normal execution:

```bash
npm start
```

For development mode with automatic server restarting:

```bash
npm run dev
```

For Windows PowerShell environments where npm scripts are restricted, use:

```powershell
npm.cmd start
```

The CaféSense Unified Server runs at:

```text
http://localhost:5000
```

### 2. Open the Web Application

Open the following address in your browser:

```text
http://localhost:5000
```

The Express server serves the frontend and REST API through the same application.

Alternatively, the frontend can be accessed through VS Code Live Server while the backend is running, provided the required CORS configuration is maintained.

---

## 🔗 API Endpoints

**Base URL:**

```text
http://localhost:5000/api/v1
```

The backend provides the following endpoint groups:

### Authentication
Handles login, current-user retrieval, password resetting, and logout.

### Products
Handles product retrieval, creation, editing, stock adjustments, and inventory movement records.

### Transactions
Handles transaction retrieval and POS transaction processing.

### Analytics
Provides transaction and transaction-item data used for analytics and reporting.

### User Management
Handles authorized user account management operations, including account creation, editing, deactivation, and reactivation.

*Note: Refer to the corresponding route files under `src/presentation/routes/` for the exact HTTP methods and endpoint paths.*

---

## 📊 Transaction and Discount Rules

CaféSense supports the following customer types and discount rates:

| Customer Type | Discount |
|---|---:|
| General Customer | 0% |
| Student | 10% |
| Senior/PWD | 20% |

Discount calculations are applied based on the customer type assigned to each transaction item.

Transaction codes follow this format:

```text
CS-YYYYMM-NNN
```

Example:

```text
CS-202611-062
```

---

## 🔐 Security and Access Control

CaféSense implements several security mechanisms:

- Password hashing using bcrypt.
- JWT-based authentication.
- HTTP-only authentication cookies.
- Authentication middleware for protected routes.
- Role-based authorization.
- Backend validation of authorized operations.
- Restricted access to User Management functions.

**Password Reset Limitation:**

The current password-reset implementation does not use OTP or email-based identity verification. This is a known security limitation of the project's current implementation and may be improved in future versions.

---

## 👥 Project Information

**Project:** CaféSense – Café Sales and Customer Behavior Analytics System

**Courses:** IT 314 – Web Systems and Technologies; IT 312 – Systems Integration and Architecture

**Architecture:** 3-Layer Architecture

**Frontend:** HTML, CSS, Vanilla JavaScript

**Backend:** Node.js and Express.js

**Database:** MySQL (`CafeSenseDB`)

**Repository:** https://github.com/kyeverse/CafeSense

---

## 📄 License

This project was developed for academic purposes as part of the Web Systems and Technologies and Systems Integration and Architecture coursework at Batangas State University.
