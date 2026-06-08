# AuraEcommerce Full Stack Application

A full-stack e-commerce demo application built with Angular 17, Node.js, Express, and MongoDB. Features product browsing, cart management, checkout processing, and rich animations.

---

## Features

### Frontend
- **Product Listing** — Browse products fetched dynamically from MongoDB via REST API
- **Product Details** — View individual product information with image, description, and pricing
- **Cart Management** — Add, update quantity, and remove items with real-time total calculation
- **Checkout** — Form validation, order summary, and order placement
- **Toast Notifications** — Replaces native `alert()` with animated slide-in notifications
- **Animations** — Route transitions, staggered card entrance, hover effects, image zoom, button scale, cart item removal fade, total update pulse, form validation shake, success checkmark draw
- **Cart Persistence** — Cart state preserved across browser refreshes via `localStorage`

### Backend
- **REST APIs** — Full CRUD operations for products, cart, and orders
- **MongoDB Integration** — Data persisted in MongoDB using Mongoose ODM
- **Cart Management** — Session-based in-memory cart with add, update quantity (PATCH), and delete operations
- **Order Management** — Order creation with validation and retrieval
- **Health Check** — `/api/health` endpoint for monitoring

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 17, TypeScript, Bootstrap 5, Angular Animations |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Styling** | Bootstrap 5, CSS3 Animations |

---

## Project Structure

```
aura-ecommerce/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   ├── environments/
│   │   └── environment.ts
│   └── app/
│       ├── app.component.ts
│       ├── app.component.html
│       ├── app.routes.ts
│       ├── models/
│       │   ├── product.model.ts
│       │   └── cart-item.model.ts
│       ├── services/
│       │   ├── product.service.ts
│       │   ├── cart.service.ts
│       │   ├── order.service.ts
│       │   └── toast.service.ts
│       ├── components/
│       │   └── toast/
│       │       └── toast.component.ts
│       └── pages/
│           ├── products/
│           │   ├── products.component.ts
│           │   └── products.component.html
│           ├── product-details/
│           │   ├── product-details.component.ts
│           │   └── product-details.component.html
│           ├── cart/
│           │   ├── cart.component.ts
│           │   └── cart.component.html
│           ├── checkout/
│           │   ├── checkout.component.ts
│           │   └── checkout.component.html
│           └── login/
│               ├── login.component.ts
│               └── login.component.html
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── seed.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   └── routes/
│       ├── products.js
│       ├── cart.js
│       └── orders.js
└── dist/              (generated build output)
```

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Angular CLI](https://angular.io/cli) v17 (`npm install -g @angular/cli@17`)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Frontend Setup

```bash
# Navigate to the project root
cd aura-ecommerce

# Install dependencies
npm install

# Start the development server
ng serve
```

The application will be available at `http://localhost:4200`.

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# (Optional) Seed the database with sample products
npm run seed

# Start the backend server
npm start
```

The API will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in the `backend/` directory or set these in your deployment environment:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Backend server port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/aura-ecommerce` | MongoDB connection string |

### Frontend API URL

The frontend targets the API at `http://localhost:3000/api` by default. Update `src/environments/environment.ts` for production:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.com/api'
};
```

---

## API Documentation

All API endpoints are prefixed with `/api`.

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Get all products (sorted by name) |
| `GET` | `/api/products/:id` | Get a single product by MongoDB ObjectId |

**Response (GET /api/products):**
```json
[
  {
    "_id": "6a26bd83caf9cfcc2b2887d5",
    "name": "Mobile",
    "price": 15999,
    "description": "A powerful smartphone...",
    "image": "https://via.placeholder.com/300x200?text=Mobile",
    "category": "Electronics"
  }
]
```

### Cart (Session-based, in-memory)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/cart` | Add item to cart |
| `GET` | `/api/cart?sessionId=` | Get cart contents |
| `PATCH` | `/api/cart/:productId` | Update item quantity |
| `DELETE` | `/api/cart/:productId?sessionId=` | Remove item from cart |

**POST /api/cart:**
```json
{
  "sessionId": "uuid-string",
  "productId": "6a26bd83caf9cfcc2b2887d5",
  "name": "Mobile",
  "price": 15999,
  "quantity": 1
}
```

**PATCH /api/cart/:productId:**
```json
{
  "sessionId": "uuid-string",
  "quantity": 3
}
```

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders` | Get all orders (sorted newest first) |

**POST /api/orders:**
```json
{
  "customerName": "John Doe",
  "address": "123 Main St",
  "mobile": "9876543210",
  "items": [
    {
      "productId": "6a26bd83caf9cfcc2b2887d5",
      "name": "Mobile",
      "price": 15999,
      "quantity": 2
    }
  ],
  "total": 31998
}
```

---

## MongoDB Setup

### Local MongoDB

1. [Install MongoDB Community Edition](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service:
   ```bash
   mongod
   ```
3. The application connects to `mongodb://127.0.0.1:27017/aura-ecommerce` by default

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (the free M0 tier is sufficient)
3. In **Database Access**, create a database user with read/write privileges
4. In **Network Access**, add `0.0.0.0/0` (allow from anywhere) or your deployment's IP
5. Click **Connect** → **Connect your application** → copy the connection string
6. Set the connection string as the `MONGO_URI` environment variable:
   ```bash
   MONGO_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/aura-ecommerce?retryWrites=true&w=majority"
   ```

### Seeding the Database

```bash
cd backend
npm run seed
```

This populates the `products` collection with four sample products: Mobile, Laptop, Headphones, and Smart Watch.

---

## Deployment

### Frontend — Netlify

1. Build the Angular project:
   ```bash
   ng build --configuration production
   ```
2. The output is in `dist/aura-ecommerce/browser/`
3. Drag and drop the `browser` folder into [Netlify](https://app.netlify.com/) or connect your Git repository
4. Configure build settings:
   - **Build command:** `ng build --configuration production`
   - **Publish directory:** `dist/aura-ecommerce/browser`
5. Add a `_redirects` file in the publish directory with:
   ```
   /* /index.html 200
   ```

### Backend — Render

1. Push the `backend/` directory to a Git repository
2. On [Render](https://render.com/), create a new **Web Service**
3. Connect your repository and configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables:
   - `MONGO_URI` — Your MongoDB Atlas connection string
   - `PORT` — `10000` (Render assigns this automatically)
5. Deploy and note the service URL (e.g., `https://aura-ecommerce-api.onrender.com`)
6. Update `src/environments/environment.ts` with the Render URL

---

## Screenshots

*Screenshots to be added.*

| Page | Preview |
|------|---------|
| Products Listing | |
| Product Details | |
| Shopping Cart | |
| Checkout | |
| Order Success | |

---

## Future Improvements

- **JWT Authentication** — User login and registration with guarded routes
- **Search & Filters** — Product search by name/category with price range filters
- **Order History** — Per-user order history page with order status tracking
- **Admin Dashboard** — Admin panel for product CRUD and order management
- **Wishlist** — Save products to a wishlist for later purchase
- **Pagination** — Server-side pagination for large product catalogs
- **Image Upload** — Product image upload to cloud storage (Cloudinary/S3)
- **Responsive Enhancements** — Further mobile optimization
- **Unit Tests** — Angular and Node.js test suites (Karma/Jasmine, Jest)
- **CI/CD Pipeline** — Automated testing and deployment via GitHub Actions

---

## Author

**Garv Kataria**

---

*Built with Angular 17, Node.js, Express, and MongoDB for the Full Stack Developer Assessment.*
