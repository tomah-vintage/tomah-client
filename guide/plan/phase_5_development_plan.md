# Phase 5: Home Page (Sprint 5)

**Goal:** Implement a publicly accessible home page that showcases all available restaurants.

## Deliverables

*   A fully functional home page displaying a list of all restaurants.
*   A search functionality to filter restaurants.
*   Public access to the home page and restaurant list without requiring authentication.

### Task 1: Home Page UI/UX

**Requirements:**

*   **Header:**
    *   Display the company logo.
    *   Include "Log In" and "Sign Up" buttons that navigate to `/auth/login` and `/auth/register` respectively.
    *   A prominent search bar for finding restaurants.
    *   If a user is authenticated, display an "Orders" icon/link.
*   **Restaurant List:**
    *   Display restaurants in a card-based layout.
    *   Each restaurant card must show:
        *   Thumbnail image.
        *   Restaurant name.
        *   Address.
        *   Opening hours.
*   **Footer:**
    *   Display the company logo.
    *   Include contact information.
*   **Design:**
    *   Adhere to the design guidelines in `design_guideline.md` and `base_guideline.md`.

### Task 2: API Endpoint for Restaurants

**Requirements:**

*   Create a `GET /api/restaurants` endpoint to fetch a list of all restaurants.
    *   This endpoint should be publicly accessible (no authentication required).
    *   The response should be a JSON array of restaurant objects.
*   **Restaurant Model:**
    ```json
    {
      "id": "string",
      "name": "string",
      "logoUrl": "string (url)",
      "address": "string",
      "imageUrl": "string (url)",
      "openingHours": "string"
    }
    ```

### Task 3: Search Functionality

**Requirements:**

*   Implement a search feature on the home page.
*   The search should filter restaurants by name.
*   The search should be triggered as the user types (debounced for performance).
*   Update the `GET /api/restaurants` endpoint to accept a search query parameter (e.g., `GET /api/restaurants?search=query`).

### Task 4: SvelteKit Implementation

**Requirements:**

*   Create a `+page.svelte` for the home page route (`/`).
*   Create a `+page.server.ts` to fetch the restaurant data from the API.
*   Create a `RestaurantCard.svelte` component to display individual restaurant information.
*   Create a `RestaurantList.svelte` component to display the grid of restaurant cards.