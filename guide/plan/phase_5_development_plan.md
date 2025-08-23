# Phase 5: Home Page (Sprint 5)

**Goal:** Implement a publicly accessible home page that showcases all available restaurants.

## Deliverables

- A fully functional home page displaying a list of all restaurants.
- A search functionality to filter restaurants.
- Public access to the home page and restaurant list without requiring authentication.

## Feature Overview: Restaurant Carousel

- **Description**: A carousel component on the homepage to showcase featured restaurants with interactive navigation.
- **User Stories**:
  - As a user, I want to see a visually appealing carousel of restaurant thumbnails on the homepage so that I can quickly browse featured options.
  - As a user, I want to be able to navigate through the restaurant thumbnails using left and right arrow icons so that I can view more restaurants.
- **Acceptance Criteria**:
  - The carousel displays at least three restaurant thumbnails at a time.
  - Left and right navigation icons are present and functional.
  - Clicking a thumbnail navigates to the respective restaurant's detail page.
  - The carousel is responsive and adapts to different screen sizes.

### Task 1: Home Page UI/UX

**Requirements:**

- **Header:**
  - Display the company logo.
  - Include "Log In" and "Sign Up" buttons that navigate to `/auth/login` and `/auth/register` respectively.
  - A prominent search bar for finding restaurants.
  - If a user is authenticated, display an "Orders" icon/link.
- **Restaurant Carousel:**
  - Implement the "Restaurant Carousel" feature as described in the "Feature Overview" section above.
- **Restaurant List:**
  - Display restaurants in a card-based layout.
  - Each restaurant card must show:
    - Thumbnail image.
    - Restaurant name.
    - Address.
    - Opening hours.
- **Footer:**
  - Display the company logo.
  - Include contact information.
- **Design:**
  - Adhere to the design guidelines in `design_guideline.md` and `base_guideline.md`.

### Task 2: API Endpoint for Restaurants

**Requirements:**

- Create a `GET /api/restaurants` endpoint to fetch a list of all restaurants.
  - This endpoint should be publicly accessible (no authentication required).
  - The response should be a JSON array of restaurant objects.
- **Restaurant Model:**
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

- Implement a search feature on the home page.
- The search should filter restaurants by name.
- The search should be triggered as the user types (debounced for performance).
- Update the `GET /api/restaurants` endpoint to accept a search query parameter (e.g., `GET /api/restaurants?search=query`).

### Task 4: SvelteKit Implementation

**Requirements:**

- Create a `+page.svelte` for the home page route (`/`).
- Create a `+page.server.ts` to fetch the restaurant data from the API.
- Create a `RestaurantCard.svelte` component to display individual restaurant information.
- Create a `RestaurantList.svelte` component to display the grid of restaurant cards.
-

### Task 5: Restaurant Card Design

- The card should have rounded corners (16px), a shadow, and 4px spacing between elements.
- Opening hours:
  - Show a clock icon w=16 h=16 before the text.
  - Keep a 4px gap between the icon and the text.
  - Only the title text should be red.
- Address:
  - Show a map pin icon w=16 h=16 before the text.
  - Keep a 4px gap between the icon and the text.
  - If the text is too long, use ellipsis (…) to cut it off.
