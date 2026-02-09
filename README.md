🛒 NestJS E-Commerce API

A modular, scalable, and production-ready E-Commerce REST API built with NestJS and MongoDB.
Supports user roles, product catalog, cart & orders, reviews, brands, coupons, and Stripe payments.

⚡ Key Features

User Management: Admin & User roles, JWT authentication, hashed passwords, account verification.

Product Catalog: Categories, Subcategories, Brands, Products with stock, images, and ratings.

Shopping Flow: Cart management, order creation, total calculation, coupons, tax & shipping.

Reviews: Users can create, update, delete reviews; ratings auto-calculated.

Request Product: Users can request products not in catalog.

Role-Based Access Control: Admin vs User endpoints.

Validation & Security: DTOs, global ValidationPipe (whitelist & forbidNonWhitelisted), strong type validation.

Timestamps: CreatedAt & UpdatedAt automatically managed.

📁 Modules Overview
Module Key Responsibilities Roles
User CRUD, authentication, roles, profile Admin/User
Category Manage categories Admin/User (read)
SubCategory Subcategories linked to Category Admin/User (read)
Brand Manage brands Admin/User (read)
Product CRUD products, stock, images, ratings Admin/User (read)
Cart Add/remove products, apply coupons, calculate totals Admin/User
Order Process orders, payment, shipping Admin/User, Stripe integration
Review Add/update/delete reviews, calculate average rating Admin/User
Request Product Users request new products Admin/User
🔧 Technology Stack

Backend: NestJS (Modules, Controllers, Services, DTOs)

Database: MongoDB with Mongoose

Authentication: JWT + bcrypt

Validation: class-validator, class-transformer, global ValidationPipe

Payment: Stripe (optional)

API Docs: Swagger (optional)

Security: Role-based guards, input validation

🗂️ Recommended Development Flow

Users → Authentication & roles

Category → SubCategory → Brand

Product → Link to Category, SubCategory, Brand

Cart & Orders → Apply coupons, calculate totals

Reviews → Auto-update product ratings

Request Product → Users can request items

Stripe Integration → For card payments
