"# MERN-Expense-Tracker" 
# 💰 Expense Manager - Full Stack MERN Application

A powerful, intuitive, and responsive expense tracking application built with the MERN stack. This tool helps users manage their personal finances by tracking income and expenses, visualizing spending patterns, and managing budgets effectively.

## 🚀 Features

### 🔹 Core Functionality
- **Dynamic Dashboard**: Real-time overview of total balance, total income, and total expenses.
- **Transaction History**: List view of all financial activities with filtering and sorting capabilities.
- **Categorization**: Group spending into categories (e.g., Groceries, Rent, Salary, Freelance).
- **Data Visualization**: Interactive charts (Line/Pie) to track monthly trends using Chart.js or Recharts.

### 🔹 Security & UX
- **JWT Authentication**: Secure user registration and login with encrypted passwords (bcrypt).
- **State Management**: Efficient data flow using React Context API or Redux.
- **Form Validation**: Robust client-side and server-side validation for financial entries.
- **Responsive UI**: Optimized for mobile, tablet, and desktop views.

## 🛠️ Tech Stack

**Frontend:** 
- React.js, Axios (API Calls), Chart.js (Visualization), CSS3/Sass/Tailwind.

**Backend:** 
- Node.js, Express.js, Mongoose (ODM).

**Database:** 
- MongoDB (NoSQL).

**Tools:** 
- JSON Web Tokens (JWT), Bcrypt.js, Dotenv.

## 📋 Prerequisites

Ensure you have the following installed:
- Node.js (v16.x or higher)
- MongoDB (Local instance or MongoDB Atlas)
- npm or yarn

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/expenseManager.git
```

### 2. Backend Configuration
- Navigate to the backend directory:
  ```bash
  cd backend
  ```
- Install the dependencies:
  ```bash
  npm install
  ```
- Create a `.env` file in the `backend` folder:
  ```env
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_super_secret_key
  ```
- Start the backend server:
  ```bash
  npm start
  ```

### 3. Frontend Configuration (Optional)
- Navigate to the frontend directory:
  ```bash
  cd ../frontend
  ```
- Install the dependencies:
  ```bash
  npm install
  ```
- Start the development server:
  ```bash
  npm start
  ```

## 📂 Project Structure

```text
expenseManager/
├── backend/            # Express.js server and API logic
│   ├── controllers/    # Request handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
├── frontend/           # Client-side application
└── README.md           # Documentation
```

## 📄 License
This project is licensed under the MIT License.
