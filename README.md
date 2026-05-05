<div align="center">

# 🛒 E-Commerce REST API

### Built with NestJS · MongoDB · TypeScript · JWT · Stripe

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

A **production-ready e-commerce backend** built to demonstrate real-world NestJS architecture, authentication systems, and scalable REST API design.

[Features](#-features) · [Architecture](#-architecture) · [API Endpoints](#-api-endpoints) · [Installation](#-installation) · [Author](#-author)

</div>

---

## ✨ Features

### 🔐 Authentication & Users

- JWT Authentication (access tokens)
- Password hashing with bcrypt
- Role-based access control (Admin / User)
- Forgot password & reset password via email token
- Google OAuth login
- User profile management

### 🏷️ Product System

- Categories & Subcategories management
- Brands & Suppliers management
- Full Product CRUD with stock tracking
- Advanced filtering, sorting, pagination, and field selection
- Product image support
- Auto rating calculation from reviews

### 🛒 Shopping Flow

- Cart management (add / remove / update quantities)
- Apply coupons & discounts
- Tax & shipping price via settings
- Automatic total calculation
- Order creation & status tracking (paid / delivered)
- Cash & card payment methods

### ⭐ Reviews System

- Add / update / delete reviews
- Rating system per product
- Auto recalculation of product average rating
- Get all reviews by product or by user

### 📦 Request Product Feature

- Users can request missing products with details & quantity
- Admin can review and manage requests

### 💳 Payments

- Stripe integration ready
- Secure payment flow

---

## 🧠 Architecture

Built using **NestJS Modular Architecture** — each feature is a self-contained module.

```
src/
├── auth/               # JWT login, register, forgot/reset password
├── user/               # User profile & admin management
├── product/            # Product CRUD, stock, images, filtering
├── category/           # Top-level categories
├── sub-category/       # Nested subcategories
├── brand/              # Brand management
├── suppliers/          # Supplier management
├── cart/               # Cart logic & totals
├── order/              # Order creation & tracking
├── review/             # Reviews & auto rating
├── coupon/             # Coupon codes & discounts
├── req-product/        # User product requests
├── oauth/              # Google OAuth
├── settings/           # Tax & shipping configuration
└── utils/              # Shared helpers & utilities
```

Each module follows a consistent structure:

```
module/
├── module.controller.ts   → API layer (routes)
├── module.service.ts      → Business logic
├── dto/                   → Validation layer (class-validator)
└── schema/                → MongoDB models (Mongoose)
```

---

## 📡 API Endpoints

Base URL: `/api/v1`

### 🔐 Auth

| Method | Endpoint                      | Description               | Auth   |
| ------ | ----------------------------- | ------------------------- | ------ |
| POST   | `/auth/sign-up`               | Register new user         | Public |
| POST   | `/auth/log-in`                | Login & get JWT token     | Public |
| POST   | `/auth/forgot-password`       | Send reset link to email  | Public |
| POST   | `/auth/reset-password/:token` | Reset password with token | Public |

### 👤 Users

| Method | Endpoint    | Description                   | Auth  |
| ------ | ----------- | ----------------------------- | ----- |
| POST   | `/user`     | Create user                   | Admin |
| GET    | `/user`     | Get all users (filter by age) | Admin |
| GET    | `/user/:id` | Get single user               | Admin |
| PATCH  | `/user/:id` | Update user                   | Admin |
| DELETE | `/user/:id` | Delete user                   | Admin |
| GET    | `/user/me`  | Get my profile                | User  |

### 🏷️ Category

| Method | Endpoint        | Description         | Auth   |
| ------ | --------------- | ------------------- | ------ |
| POST   | `/category`     | Create category     | Admin  |
| GET    | `/category`     | Get all categories  | Public |
| GET    | `/category/:id` | Get single category | Public |
| PATCH  | `/category/:id` | Update category     | Admin  |
| DELETE | `/category/:id` | Delete category     | Admin  |

### 🗂️ Sub-Category

| Method | Endpoint            | Description            | Auth   |
| ------ | ------------------- | ---------------------- | ------ |
| POST   | `/sub-category`     | Create subcategory     | Admin  |
| GET    | `/sub-category`     | Get all subcategories  | Public |
| GET    | `/sub-category/:id` | Get single subcategory | Public |
| PATCH  | `/sub-category/:id` | Update subcategory     | Admin  |
| DELETE | `/sub-category/:id` | Delete subcategory     | Admin  |

### 🏭 Brand

| Method | Endpoint     | Description      | Auth   |
| ------ | ------------ | ---------------- | ------ |
| POST   | `/brand`     | Create brand     | Admin  |
| GET    | `/brand`     | Get all brands   | Public |
| GET    | `/brand/:id` | Get single brand | Public |
| PATCH  | `/brand/:id` | Update brand     | Admin  |
| DELETE | `/brand/:id` | Delete brand     | Admin  |

### 🚚 Suppliers

| Method | Endpoint         | Description         | Auth  |
| ------ | ---------------- | ------------------- | ----- |
| POST   | `/suppliers`     | Create supplier     | Admin |
| GET    | `/suppliers`     | Get all suppliers   | Admin |
| GET    | `/suppliers/:id` | Get single supplier | Admin |
| PATCH  | `/suppliers/:id` | Update supplier     | Admin |
| DELETE | `/suppliers/:id` | Delete supplier     | Admin |

### 📦 Product

| Method | Endpoint       | Description        | Auth   |
| ------ | -------------- | ------------------ | ------ |
| POST   | `/product`     | Create product     | Admin  |
| GET    | `/product`     | Get all products   | Public |
| GET    | `/product/:id` | Get single product | Public |
| PATCH  | `/product/:id` | Update product     | Admin  |
| DELETE | `/product/:id` | Delete product     | Admin  |

> Supports query params: `sort`, `page`, `limit`, `fields`, `price[gte]`, etc.

```
GET /api/v1/product?sort=-price&page=1&limit=10&fields=title,price,ratingsAverage&price[gte]=999
```

### 🎟️ Coupon

| Method | Endpoint               | Description          | Auth  |
| ------ | ---------------------- | -------------------- | ----- |
| POST   | `/coupon`              | Create coupon        | Admin |
| GET    | `/coupon`              | Get all coupons      | Admin |
| GET    | `/coupon/:id`          | Get single coupon    | Admin |
| PATCH  | `/coupon/:id`          | Update coupon        | Admin |
| DELETE | `/coupon/:id`          | Delete coupon        | Admin |
| POST   | `/coupon/apply-coupon` | Apply coupon to cart | User  |

### 🛒 Cart

| Method | Endpoint    | Description           | Auth |
| ------ | ----------- | --------------------- | ---- |
| POST   | `/cart`     | Add product to cart   | User |
| GET    | `/cart/:id` | Get cart              | User |
| PATCH  | `/cart/:id` | Update item quantity  | User |
| DELETE | `/cart/:id` | Remove item from cart | User |

### 📋 Order

| Method | Endpoint     | Description                          | Auth  |
| ------ | ------------ | ------------------------------------ | ----- |
| POST   | `/order`     | Create order (cash or card)          | User  |
| GET    | `/order`     | Get my orders (filter by isPaid)     | User  |
| GET    | `/order/:id` | Get single order                     | User  |
| PATCH  | `/order/:id` | Update order status (paid/delivered) | Admin |
| DELETE | `/order/:id` | Delete order                         | Admin |

### ⭐ Reviews

| Method | Endpoint                     | Description                   | Auth       |
| ------ | ---------------------------- | ----------------------------- | ---------- |
| POST   | `/review`                    | Create review                 | User       |
| PATCH  | `/review/:id`                | Update review                 | User       |
| DELETE | `/review/:id`                | Delete review                 | User/Admin |
| GET    | `/review/:productId/product` | Get all reviews for a product | Public     |
| GET    | `/review/:userId`            | Get all reviews by a user     | Public     |

### 📩 Request Product

| Method | Endpoint           | Description               | Auth       |
| ------ | ------------------ | ------------------------- | ---------- |
| POST   | `/req-product`     | Request a missing product | User       |
| GET    | `/req-product`     | Get all requests          | Admin      |
| GET    | `/req-product/:id` | Get single request        | Admin      |
| PATCH  | `/req-product/:id` | Update request            | User       |
| DELETE | `/req-product/:id` | Delete request            | User/Admin |

### ⚙️ Settings

| Method | Endpoint    | Description                 | Auth  |
| ------ | ----------- | --------------------------- | ----- |
| GET    | `/settings` | Get app settings            | Admin |
| PATCH  | `/settings` | Update tax & shipping price | Admin |

### 🔑 OAuth

| Method | Endpoint              | Description       | Auth   |
| ------ | --------------------- | ----------------- | ------ |
| GET    | `/oauth/google/login` | Login with Google | Public |

---

## 🔄 Example Flow

```
1. Register       →  POST /api/v1/auth/sign-up
2. Login          →  POST /api/v1/auth/log-in           → receive JWT token
3. Browse         →  GET  /api/v1/product?sort=-price
4. Add to cart    →  POST /api/v1/cart                   (JWT required)
5. Apply coupon   →  POST /api/v1/coupon/apply-coupon
6. Place order    →  POST /api/v1/order
7. Admin updates  →  PATCH /api/v1/order/:id             { isPaid: true, isDelivered: true }
```

---

## 🛠️ Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | NestJS (TypeScript)                 |
| Database       | MongoDB + Mongoose                  |
| Authentication | JWT + bcrypt                        |
| OAuth          | Google OAuth 2.0                    |
| Validation     | class-validator + class-transformer |
| Security       | Guards + Role-based Authorization   |
| Payments       | Stripe                              |
| API Docs       | Swagger (optional)                  |

---

## 📦 Installation

```bash
git clone https://github.com/Mahmoud-Elashwah/E-Commerce-Nestjs.git
cd E-Commerce-Nestjs
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 🚀 Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

---

## 🔐 Security

- ✅ JWT Protected Routes
- ✅ Role-based Guards (Admin / User)
- ✅ Input Validation with Whitelist enabled
- ✅ DTO validation on all requests
- ✅ Password hashing with bcrypt
- ✅ Secure password reset via email token

---

## 👨‍💻 Author

**Mahmoud Mohamed Elashwah**  
Back-End Developer — Node.js / NestJS

📧 [mahmoud28841@gmail.com](mailto:mahmoud28841@gmail.com)  
🔗 [github.com/Mahmoud-Elashwah](https://github.com/Mahmoud-Elashwah)

---

> ⭐ If you found this project useful, consider giving it a star!
