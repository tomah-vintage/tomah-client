
# Phase 2: Menu and Ordering Development Plan

**Goal:** Implement the core functionality of viewing menus and placing orders.

---

## 1. Menu Viewing

**User Story:** As a customer, I want to view a restaurant's menu by visiting a specific link so that I can see what they offer.

### Tasks:

- **Dynamic Routing:**
  - Create a dynamic route `src/routes/menu/[restaurantId]/+page.svelte` to display the menu for a specific restaurant.
  - Implement the corresponding `+page.server.ts` to fetch menu data based on the `restaurantId`.

- **API Integration:**
  - Define and integrate with the backend API endpoint to fetch menu data (e.g., `GET /api/restaurants/[restaurantId]/menu`).
  - Implement robust error handling for cases where the menu can't be fetched.

- **UI Components:**
  - **Menu Layout:** Design a clear and organized layout for the menu page.
  - **Category Sections:** Create components to display menu items grouped by category (e.g., Appetizers, Main Courses, Desserts).
  - **Menu Item Card:** Develop a card component to display individual menu items with details like name, price, description, and an image.
  - **Item Details View:** Implement a modal or a separate page to show more detailed information about a menu item, including customization options (if any).

---

## 2. Shopping Cart

**User Story:** As a customer, I want to add items to a shopping cart so that I can review my selections before placing an order.

### Tasks:

- **State Management:**
  - Create a Svelte store (`src/lib/stores/cart.ts`) to manage the state of the shopping cart across the application.
  - The store should handle adding, updating, and removing items, as well as calculating the total price.

- **UI Components:**
  - **Add to Cart Button:** Add a button to the menu item card to add items to the cart.
  - **Cart Icon:** Display a cart icon in the main layout that shows the number of items in the cart.
  - **Cart View:** Create a detailed cart view (e.g., a sidebar or a separate page) that lists all selected items, their quantities, and prices.
  - **Quantity Controls:** Allow users to increase, decrease, or remove items directly from the cart view.

---

## 3. Order Placement

**User Story:** As a customer, I want to place my order for either dine-in or takeout and receive confirmation.

### Tasks:

- **Order Flow:**
  - **Order Type Selection:** Implement a mechanism for users to choose between "Dine-in" and "Takeout".
  - **Dine-in:** If selected, prompt the user to enter their table number.
  - **Takeout:** If selected, provide an estimated pickup time.

- **API Integration:**
  - Define and integrate with the backend API endpoint to submit the order (e.g., `POST /api/orders`).
  - The request payload should include the cart items, order type, and any other relevant details (table number, etc.).

- **UI Components:**
  - **Checkout Form:** Create a form to gather any final information needed before placing the order.
  - **Order Summary:** Display a final summary of the order for confirmation before submission.
  - **Confirmation Message:** Show a success message with an order confirmation number after the order is placed successfully.
  - **Error Handling:** Provide clear feedback if the order fails to be placed.

---

## 4. Testing

- **Unit Tests:**
  - Write unit tests for the cart store logic (adding, removing, calculating totals).
  - Test individual components to ensure they render correctly with different props.
- **Integration Tests:**
  - Test the full menu-to-order flow.
  - Verify that the application correctly interacts with the backend API for fetching menus and placing orders.
- **End-to-End (E2E) Tests:**
  - Simulate a user journey from opening a menu link to receiving an order confirmation.
