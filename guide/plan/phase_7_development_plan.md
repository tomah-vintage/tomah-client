# Phase 7: Order Management (Sprint 6)

**Goal:** Implement a client-side shopping cart and order submission system.

## User Stories

- As a customer, I want to add items from a restaurant's menu to my order cart.
- As a customer, I want to view the items in my cart, including quantities and total price.
- As a customer, I want to adjust the quantity of items in my cart or remove them.
- As a customer, I want my cart to be saved in my browser so I can come back to it later.
- As a customer, I want to proceed to checkout from my cart.
- As a customer, I must be logged in to place an order. If I'm not, I should be prompted to log in.

## Acceptance Criteria

- A shopping cart component is available and displays added items.
- The cart icon in the header shows the number of items in the cart.
- Cart data persists across page reloads using `localStorage`.
- Users can add, remove, and update item quantities in the cart.
- A "Pay" or "Place Order" button initiates the checkout process.
- The checkout process verifies user authentication before proceeding.

---

## Technical Tasks

### Task 1: Cart State Management

- **Create `src/lib/stores/cart.ts`:**
  - Implement a Svelte writable store to manage the cart's state.
  - The store should hold an array of `CartItem` objects (`{ menuItemId: string, quantity: number, price: number }`).
  - Implement functions to add, remove, and update items in the store.
  - The store should synchronize its state with `localStorage` to persist the cart.

### Task 2: UI Components

- **Develop Cart Components:**
  - Create a `CartModal.svelte` or `CartView.svelte` component to display the cart's contents.
  - This component should show a list of items, quantities, individual prices, and the total price.
  - It should include controls to change item quantities or remove items from the cart.
  - Create a `CartIcon.svelte` component to be placed in the header, displaying the total number of items in the cart.

### Task 3: API Endpoint for Order Submission

- **Create a `POST /api/order` endpoint:**
  - This endpoint will receive the cart contents and create a new order in the database.
  - **Authentication:** This endpoint must be protected and only accessible by authenticated users.
  - **Request Body:** The endpoint should expect a JSON object containing the order details (e.g., items, restaurant ID, total price).
  - **Response:** On success, it should return the newly created order object. On failure, it should return an appropriate error message and status code.

### Task 4: Checkout Flow Logic

- **Implement Checkout Process:**
  - When the user clicks "Pay" or "Place Order":
    1. Check if the user is authenticated (using the `auth` store).
    2. If not authenticated, redirect the user to the `/auth/login` page.
    3. If authenticated, send the cart data to the `POST /api/order` endpoint.
    4. On a successful order creation, clear the cart from the store and `localStorage`.
    5. Optionally, redirect the user to an order confirmation page.

---

## Data Models

### Cart Item (Client-Side)

```typescript
// src/lib/types/cart.ts
export interface CartItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}
```

### Order Payload (API Request)

```json
{
  "restaurantId": "string",
  "items": [
    { "menuItemId": "string", "quantity": "number" }
  ],
  "totalPrice": "number"
}
```

### Order Response (API Response)

```json
{
    "id": "string",
    "user": {
      "id": "string",
      "username": "string"
    },
    "restaurant": {
      "id": "string",
      "name": "string"
    },
    "order_status": "PENDING",
    "total_price": "number",
    "order_type": "DINE_IN",
    "created_at": "string",
    "updated_at": "string"
}
```