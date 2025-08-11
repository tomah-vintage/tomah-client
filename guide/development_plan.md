# Development Plan: Customer Side Web Application

This document outlines the development plan for the Customer Side Web Application. The plan is divided into several phases, each with specific goals and tasks.

## Phase 1: Project Setup & Core Functionality (1 week)

**Goal:** Set up the project structure and implement the basic menu viewing functionality.

*   **Tasks:**
    *   Initialize a new SvelteKit project.
    *   Set up TypeScript, Tailwind CSS, and Skeleton UI.
    *   Create the basic project structure (folders for routes, components, stores, etc.).
    *   Implement the `Menu` component to display a static list of menu items.
    *   Create the `MenuItemCard` and `CategoryFilter` components.
    *   Set up TanStack Query for API requests.
    *   Connect to the `GET /api/restaurants/{restaurant_id}/menu-items` endpoint to fetch and display real menu data.

## Phase 2: "Dine-In" Order Flow (2 weeks)

**Goal:** Implement the complete ordering and payment flow for dine-in customers.

*   **Tasks:**
    *   Implement the `Cart` component and its related `CartItem` component.
    *   Use Svelte stores to manage the cart state, including adding/removing items and updating quantities.
    *   Persist the cart state in `localStorage`.
    *   Create the `Checkout` component with the `OrderSummary`.
    *   Implement the `PaymentMethodSelector` component.
    *   Integrate with the `POST /api/orders` endpoint to create a new dine-in order.
    *   Implement the `OrderStatus` component to display the order status.
    *   Connect to the `GET /api/orders/{order_id}` endpoint to fetch and display the order status.
    *   Handle QR code scanning to pre-fill restaurant and table information.

## Phase 3: "Take-Out" Order Flow (1 week)

**Goal:** Add the functionality for take-out orders.

*   **Tasks:**
    *   Adapt the checkout flow to handle take-out orders.
    *   Create the `UserInfoForm` component to collect the user's name and phone number.
    *   Modify the `POST /api/orders` request to include the order type and user information.
    *   Update the `OrderStatus` page to show relevant information for take-out orders (e.g., estimated pickup time).

## Phase 4: User Authentication & Order History (1.5 weeks)

**Goal:** Implement user accounts and order history.

*   **Tasks:**
    *   Create the `Login` and `Register` pages and components.
    *   Integrate with the `POST /api/auth/login` and `POST /api/auth/register` endpoints.
    *   Use Svelte stores and `localStorage` to manage the user's session.
    *   Create the `OrderHistory` component to display a list of the user's past orders.
    *   Connect to the `GET /api/users/me/orders` endpoint to fetch the user's order history.
    *   Create a user profile page where users can view their information.

## Phase 5: Polishing & Deployment (1 week)

**Goal:** Refine the application, perform thorough testing, and deploy to production.

*   **Tasks:**
    *   Conduct a thorough review of the UI/UX and make improvements.
    *   Ensure the application is fully responsive and works well on all target devices.
    *   Perform accessibility testing and address any issues.
    *   Write unit and integration tests for critical components and flows.
    *   Set up a CI/CD pipeline for automated testing and deployment.
    *   Deploy the application to Vercel.
