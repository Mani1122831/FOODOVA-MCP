# 🍔 FOODOVA - Next-Generation Food Ordering & Delivery Platform

> **Good Food. Faster. Smarter.**  
> A production-ready, full-stack food delivery web application built with Node.js, Express, MongoDB, React, Tailwind CSS, Framer Motion, Hands-Free Gesture AI, Voice Command recognition, and Google Gemini AI culinary sommelier.

---

## 📸 Overview & Design System

FOODOVA provides an ultra-premium commercial dining experience inspired by modern quick-service restaurants while maintaining an original, clean brand identity:
- **Palette**: Warm cream background (`#FFFBF7`), deep charcoal typography (`#0A0A0A`), signature fiery orange accent (`#FF6B35`), and golden amber highlights (`#F59E0B`).
- **Signature 3-Column Menu Grid**:
  - **Left**: Animated category sidebar with custom food imagery.
  - **Center**: Food cards featuring dietary badges (Veg/Non-Veg), discount tags, star ratings, calorie indicators, and interactive quantity steppers.
  - **Right**: Floating shopping cart panel with animated empty state illustration, coupon code engine, itemized breakdown, and 1-click checkout.

---

## 🚀 Key Innovations

1. **🖐️ Hands-Free Gesture Control (No Mouse / No Keyboard Mode)**
   - Operates via your device webcam.
   - Recognizes real-time hand gestures:
     - **Index Finger**: Traverse and highlight interactive elements with an active glowing focus ring.
     - **Pinch**: Click or select highlighted dishes.
     - **Two Fingers**: Smoothly scroll menus and nutrition panels.
     - **Thumbs Up**: Add highlighted meal directly to your shopping cart.
     - **Fist**: Navigate back or dismiss modals.
     - **Swipe Left / Right**: Jump between Menu and Shopping Cart.
     - **Open Palm**: Scroll to top.
   - Built-in confidence threshold (>90%) with debounced input to prevent accidental triggers.
   - On-screen floating camera preview with privacy toggle.

2. **🎤 Safe Voice Command Ordering**
   - Built on native browser Speech Recognition.
   - Supports natural language vocal commands:
     - *"Open burgers"* / *"Show pizza"* / *"Show vegetarian food"*
     - *"Open cart"* / *"Scroll down"* / *"Search spicy chicken"*
     - *"Place order"* (Features mandatory voice confirmation safety check: *"Please say YES to confirm"*).

3. **⌨️ Animated On-Screen Virtual Keyboard**
   - Enables complete accessibility and touch/gesture typing for email and passwords without a physical keyboard.
   - Masked password security with eye-toggle.

4. **✨ Gemini AI Culinary Sommelier (Chef Nova)**
   - Live AI assistant embedded in a compact floating drawer.
   - Answers ingredient queries, explains allergens, suggests meals under customized budgets (e.g. *"Suggest a dinner for two under ₹300"*), and assists dietary goals (Keto, Vegan, High-Protein).
   - Grounded directly on the actual MongoDB catalog.

5. **🛡️ Enterprise Security & Authentication**
   - User Registration, Login, and Password Hashing using **bcrypt** (salt rounds = 12).
   - **JWT (JSON Web Tokens)** stored in HTTP-Only cookies with bearer header authorization.
   - **5-Minute Email OTP Password Reset Flow**:
     - One-Time Password generated via crypto random bytes.
     - Hashed with SHA-256 before saving to MongoDB (raw OTP is never stored in DB and never returned in API payloads).
     - Auto-expiring MongoDB TTL index (10 minutes max).
     - 3-attempt limit with 60s resend cooldown.
   - Brute-force rate limiting (`express-rate-limit`), NoSQL injection sanitization (`express-mongo-sanitize`), and parameter pollution prevention (`hpp`).

6. **📦 Real-time Order Tracking**
   - Multi-stage visual state tracker:
     `Confirmed` ➔ `Preparing` ➔ `Cooking` ➔ `Out for Delivery` ➔ `Delivered`.
   - Real-time client polling for instant status synchronization.
   - Automated dual email dispatch: Customer order confirmation + Admin new-order notification via Nodemailer SMTP.

7. **👑 Admin Control Tower**
   - Role-protected route guards (`/admin`, `/admin/orders`, `/admin/products`, `/admin/users`).
   - Live fulfillment control: Update status directly from confirmed to cooking, out for delivery, or delivered.
   - Menu inventory manager: 1-click toggle for dish availability (In Stock / Sold Out) and item deletion.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Framer Motion, Lucide Icons, React Hot Toast, Confetti |
| **Backend** | Node.js, Express, Mongoose, JWT, BcryptJS, Nodemailer, Morgan, Winston, Helmet |
| **Database** | MongoDB (Compass / Atlas / Local Docker) |
| **AI & MCP** | Google Gemini 1.5 Flash SDK (`@google/generative-ai`), Canva MCP Client Layer |
| **Container** | Docker & Docker Compose |

---

## 📁 Project Structure

```
foodova/
├── backend/
│   ├── src/
│   │   ├── auth/              # JWT middleware & guards
│   │   ├── controllers/       # Auth, Product, Cart, Order, AI, Admin controllers
│   │   ├── email/             # Nodemailer HTML templates (OTP, Order receipts)
│   │   ├── mcp/               # MCP Abstraction: Gemini & Canva services
│   │   ├── middleware/        # Security, sanitization, rate limiters
│   │   ├── models/            # Mongoose schemas: User, Product, Category, Order, Cart, OTP
│   │   ├── routes/            # Express REST endpoints
│   │   ├── utils/             # Winston logger, MongoDB seeder (30+ dishes)
│   │   └── server.js          # Main Express server entry point
│   ├── tests/                 # Supertest API test suite
│   ├── .env                   # Backend environment variables
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── ai/                # AIAssistant floating chat component
│   │   ├── components/        # Header, Footer, ProductCard, CartPanel, VirtualKeyboard, SearchBar
│   │   ├── context/           # AuthContext, CartContext
│   │   ├── gestures/          # GestureController (Webcam CV & gesture engine)
│   │   ├── hooks/             # useAuth, useCart
│   │   ├── pages/             # Home, Menu, ProductDetail, Cart, Checkout, Success, Orders, Profile, Auth
│   │   │   └── admin/         # AdminDashboard, AdminOrders, AdminProducts, AdminUsers
│   │   ├── services/          # Axios API client with token interception
│   │   ├── utils/             # Helpers, constants, formatters
│   │   ├── App.jsx            # React Router v6 setup
│   │   ├── main.jsx           # React DOM root & Toaster
│   │   └── index.css          # Tailwind design tokens & custom animations
│   ├── .env                   # Frontend public environment variables
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── docker-compose.yml         # Multi-container orchestration (Mongo, Backend, Frontend)
├── .env.example               # Template environment configuration
└── README.md
```

---

## ⚙️ Quick Start & Installation

### Prerequisites
- Node.js (v18 or v20+)
- MongoDB (Running locally on `mongodb://localhost:27017` or via MongoDB Atlas)
- npm or yarn

### 1. Database & Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install --legacy-peer-deps

# Create your .env file
cp ../.env.example .env
# Edit .env with your MongoDB URI, JWT secret, and SMTP settings

# Seed database with 30+ authentic dishes across 13 categories + test accounts
npm run seed

# Start development server
npm run dev
# Server will run on http://localhost:5000
```

### 2. Frontend Setup
```bash
# In a separate terminal, navigate to frontend
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start Vite development server
npm run dev
# Website will launch at http://localhost:5173
```

---

## 🔑 Test Credentials (Local Development)

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Customer** | `test@foodova.com` | `Test@1234` | Orders, Profile, Checkout |
| **Admin** | `admin@foodova.com` | `Admin@123` | Kitchen Command Center, Menu Management |

---

## 📧 Email & SMTP Configuration

In `backend/.env`:
```ini
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_google_app_password
FROM_EMAIL=noreply@foodova.com
ADMIN_EMAIL=admin@foodova.com
```
*Note: If SMTP credentials are left as placeholders, the server gracefully logs outgoing emails to Winston logs without failing API requests.*

---

## 🤖 Gemini & Canva MCP Configuration

```ini
GEMINI_API_KEY=your_gemini_api_key
CANVA_MCP_URL=
CANVA_MCP_TOKEN=
```
- When `GEMINI_API_KEY` is provided, Chef Nova uses Gemini 1.5 Flash for natural food suggestions.
- If unavailable, the internal fallback heuristic engine delivers curated dish suggestions.

---

## 🧪 Running Automated Tests

```bash
cd backend
npm test
```

---

## 📜 License
FOODOVA is open-source software licensed under the MIT License.
