## **1. Mini Project: Task Manager API**

**Goal:** Manage tasks for users with CRUD and status updates.

**Models:**

```js
// User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }
});

userSchema.pre('save', async function(next) {
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password,10);
  }
  next();
});

userSchema.methods.comparePassword = function(pw){ return bcrypt.compare(pw,this.password); }

module.exports = mongoose.model('User', userSchema);
```

```js
// Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
}, { timestamps:true });

module.exports = mongoose.model('Task', taskSchema);
```

**Routes / Features:**

* `POST /auth/register` → create user
* `POST /auth/login` → login & get JWT
* `GET /tasks` → list tasks for logged-in user
* `POST /tasks` → add task
* `PATCH /tasks/:id` → mark task complete
* `DELETE /tasks/:id` → delete task

**Edge Cases:**

* Only owner can update/delete tasks
* Cannot create task without title
* JWT-protected routes

---

## **2. Mini Project: Product Catalog**

**Goal:** Manage products and categories with inventory checks.

**Models:**

```js
// Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0.01 },
  inventory: { type: Number, default:0, min:0 },
  category: String,
}, { timestamps:true });

module.exports = mongoose.model('Product', productSchema);
```

**Routes / Features:**

* `GET /products` → list all products (filter by category)
* `POST /products` → add product
* `PATCH /products/:id` → update price/inventory
* `DELETE /products/:id` → remove product

**Edge Cases:**

* Cannot reduce inventory below 0
* Unique product names
* Optional: paginate `GET /products` results

---

## **3. Mini Project: Simple Order System**

**Goal:** Users can place orders for products, inventory is decremented automatically.

**Models:**

```js
// Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref:'Product', required:true },
    quantity: { type: Number, required:true, min:1 }
  }],
  total: { type: Number, required:true },
  status: { type: String, enum:['pending','shipped','delivered'], default:'pending' }
},{timestamps:true});

module.exports = mongoose.model('Order', orderSchema);
```

**Routes / Features:**

* `POST /orders` → create order (check product inventory, decrement stock)
* `GET /orders/:id` → get order details
* `PATCH /orders/:id` → update status (pending → shipped → delivered)
* `DELETE /orders/:id` → cancel order (restore stock)

**Edge Cases:**

* Cannot order more than inventory
* Order must have valid user and products
* Handle concurrent orders for same product

---

These **mini projects hit:**

* CRUD operations
* Validation / edge cases
* JWT auth & middleware
* Mongoose hooks & methods
* Async/await patterns
