# Technical Design Document: Customer Side Web Application

## 1. Background

This document outlines the technical design for the customer-facing web application, which allows users to browse menus, place orders, and make payments for both dine-in and take-out services. This application is a key component of the overall Digital Menu & Food Ordering System.

## 2. Requirements

### 2.1. Functional Requirements

- **Menu Viewing:** Users can view a restaurant's menu by scanning a QR code or visiting a URL.
- **Order Placement:** Users can add items to a cart, customize them if options are available, and place an order.
- **Ordering Options:** The application must support two distinct order types:
  - **Dine-In:** Orders are associated with a specific table.
  - **Take-Out:** Orders are for pickup.
- **Payment:** Users can pay for their orders using various payment methods.
- **Order Status:** Users can view the status of their order in real-time.
- **User Authentication:** Users can create an account, log in, and view their order history.

### 2.2. Non-functional Requirements

- **Performance:** The application should be fast and responsive, with a target page load time of under 3 seconds.
- **Usability:** The UI should be intuitive and easy to use for non-technical users.
- **Accessibility:** The application should adhere to WCAG 2.1 AA standards.
- **Security:** All communication with the backend will be over HTTPS, and user data will be handled securely.

## 3. User Stories and Flows

### 3.1. Dine-In Order

1.  **User scans QR code:** The user scans a QR code on a table, which opens the web application with the restaurant and table information pre-filled.
2.  **View Menu:** The user sees the menu for the specific restaurant.
3.  **Add to Cart:** The user selects items and adds them to their cart.
4.  **Place Order:** The user reviews their cart and proceeds to checkout.
5.  **Payment:** The user selects a payment method and completes the payment.
6.  **Order Confirmation:** The user sees an order confirmation screen with their order details and status.
7.  **View Order Status:** The user can track the status of their order (e.g., "Preparing", "Served").

### 3.2. Take-Out Order

1.  **User visits URL:** The user accesses the restaurant's online ordering page via a direct link.
2.  **View Menu:** The user sees the menu for the specific restaurant.
3.  **Add to Cart:** The user selects items and adds them to their cart.
4.  **Place Order:** The user reviews their cart and proceeds to checkout.
5.  **User Information:** The user provides their name and phone number.
6.  **Payment:** The user selects a payment method and completes the payment.
7.  **Order Confirmation:** The user sees an order confirmation screen with their order details and an estimated pickup time.
8.  **SMS Notification:** The user receives an SMS when their order is ready for pickup, including a pickup code.

### 3.3. User Account

1.  **User Registration:** A user can create an account using their email, name, and password.
2.  **User Login:** A registered user can log in to their account.
3.  **Order History:** A logged-in user can view their past orders.

## 4. UI/UX Design

The application will use a clean, modern design, with a focus on simplicity and ease of use. The primary color scheme will be based on the restaurant's branding, with a consistent layout across all pages.

- **Menu Page:** A grid-based layout with images, names, and prices of menu items. Categories will be used to filter the menu.
- **Cart:** A slide-in panel or a separate page that shows the items in the cart, with options to adjust quantities or remove items.
- **Checkout Flow:** A multi-step process for entering user information, selecting payment methods, and confirming the order.
- **Order Status Page:** A simple page that displays the current status of the order in a clear, visual way.

## 5. System Architecture

The customer web application will be a single-page application (SPA) built with SvelteKit. It will communicate with the Django backend via a REST API.

- **Frontend:** SvelteKit, TypeScript, Tailwind CSS, Skeleton UI
- **Backend Communication:** TanStack Query for API requests
- **State Management:** Svelte stores for managing global state (e.g., cart, user session).

## 6. Component Breakdown

- **`Menu`:** Displays the list of menu items.
  - **`MenuItemCard`:** A card for a single menu item.
  - **`CategoryFilter`:** A component to filter the menu by category.
- **`Cart`:** Manages the user's shopping cart.
  - **`CartItem`:** Represents a single item in the cart.
- **`Checkout`:** The main component for the checkout process.
  - **`UserInfoForm`:** A form for entering user details (for take-out).
  - **`PaymentMethodSelector`:** A component for choosing a payment method.
  - **`OrderSummary`:** Displays a summary of the order before payment.
- **`OrderStatus`:** Shows the current status of an order.
- **`Login`:** The login form.
- **`Register`:** The registration form.
- **`OrderHistory`:** Displays a list of the user's past orders.

## 7. API Integration

The application will use the following API endpoints provided by the Django backend:

- `GET /api/restaurants/{restaurant_id}/menu-items`: To fetch the menu for a restaurant.
- `POST /api/orders`: To create a new order.
- `GET /api/orders/{order_id}`: To get the status of an order.
- `POST /api/auth/login`: For user login.
- `POST /api/auth/register`: For user registration.
- `GET /api/users/me/orders`: To get the order history for the logged-in user.

## 8. State Management

- **Cart:** The shopping cart state will be managed using a Svelte writable store. The cart data will be persisted in `localStorage` to handle page reloads.
- **User Session:** The user's authentication token and profile information will be stored in a Svelte store and `localStorage`.
- **Order Status:** The status of an active order will be fetched periodically from the backend to provide real-time updates.
