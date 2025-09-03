# SvelteKit New Feature Development Plan: Search Results Page

## Design Guidelines

All components and styles must adhere to the design system defined in `guide/design_guideline.md`. This includes color palette, typography, spacing, and component styles. For icons, we will use the `lucide-svelte` library. The design for the search results page can be found at `guide/image/search-result.png`.

## Feature Overview

- **Feature Name**: Search Results Page
- **Description**: This feature will display search results based on user queries, allowing users to find restaurants, menu items, or other relevant content within the application.
- **User Stories**:
  - As a user, I want to search for restaurants or menu items so that I can easily find what I'm looking for.
  - As a user, I want to see a list of relevant search results so that I can quickly navigate to the desired content.
  - As a user, I want to be able to filter and sort search results so that I can refine my search.
- **Acceptance Criteria**:
  - The search results page must display results for restaurants and potentially menu items.
  - The page must handle no results gracefully.
  - Users should be able to navigate to individual restaurant or menu item pages from the search results.
  - The search query should be reflected in the URL.

## File Structure to Create

```
src/routes/search/
├── +page.svelte              # Main search results page
├── +page.server.ts           # Server-side logic for fetching search results
# Note: The existing application header should be used; no new header component is required for this feature.

src/lib/components/search/
├── SearchMain.svelte         # Main component for search results display
├── SearchResultsList.svelte  # Component to display a list of search results
├── SearchFilterSort.svelte   # Component for filtering and sorting options
├── SearchResultCard.svelte   # Individual card component for a search result
└── index.ts                  # Export all components

src/lib/types/search.ts       # TypeScript interfaces for search
src/lib/utils/search.ts       # Utility functions for search
src/lib/stores/search.ts      # Svelte stores for search state
```

## Development Steps

### 1. Type Definitions

Create `src/lib/types/search.ts`:

```typescript
export interface SearchQuery {
	query: string;
	filters?: Record<string, string>;
	sortBy?: string;
}

export interface SearchResultItem {
	id: string;
	type: 'restaurant' | 'menuItem'; // Or other types as needed
	name: string;
	description?: string;
	imageUrl?: string;
	// Add other relevant properties based on type
}

export interface SearchState {
	results: SearchResultItem[];
	loading: boolean;
	error: string | null;
	currentQuery: SearchQuery;
}
```

### 2. Utility Functions

Create `src/lib/utils/search.ts`:

```typescript
import type { SearchQuery, SearchResultItem } from '$lib/types/search';

export const buildSearchUrl = (query: SearchQuery): string => {
	const params = new URLSearchParams();
	params.append('q', query.query);
	if (query.filters) {
		Object.entries(query.filters).forEach(([key, value]) => {
			params.append(key, value);
		});
	}
	if (query.sortBy) {
		params.append('sortBy', query.sortBy);
	}
	return `/search?${params.toString()}`;
};

export const parseSearchUrl = (url: URL): SearchQuery => {
	const query = url.searchParams.get('q') || '';
	const filters: Record<string, string> = {};
	for (const [key, value] of url.searchParams.entries()) {
		if (key !== 'q' && key !== 'sortBy') {
			filters[key] = value;
		}
	}
	const sortBy = url.searchParams.get('sortBy') || undefined;
	return { query, filters, sortBy };
};

export const apiEndpoints = {
	search: '/api/search'
};
```

### 3. Store Management

Create `src/lib/stores/search.ts`:

```typescript
import { writable } from 'svelte/store';
import type { SearchState, SearchQuery, SearchResultItem } from '$lib/types/search';
import { apiEndpoints } from '$lib/utils/search';

export const searchStore = writable<SearchState>({
	results: [],
	loading: false,
	error: null,
	currentQuery: { query: '' }
});

export const searchActions = {
	async performSearch(query: SearchQuery) {
		searchStore.update((state) => ({ ...state, loading: true, error: null, currentQuery: query }));
		try {
			const params = new URLSearchParams();
			params.append('q', query.query);
			if (query.filters) {
				Object.entries(query.filters).forEach(([key, value]) => {
					params.append(key, value);
				});
			}
			if (query.sortBy) {
				params.append('sortBy', query.sortBy);
			}
			const response = await fetch(`${apiEndpoints.search}?${params.toString()}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			searchStore.update((state) => ({ ...state, results: data.results, loading: false }));
		} catch (error: any) {
			searchStore.update((state) => ({ ...state, error: error.message, loading: false }));
		}
	}
};
```

### 4. Main Components

#### Create `src/lib/components/search/SearchMain.svelte`:

```svelte
<script lang="ts">
	import type { SearchResultItem, SearchQuery } from '$lib/types/search';
	import SearchResultsList from './SearchResultsList.svelte';
	import SearchFilterSort from './SearchFilterSort.svelte';

	export let results: SearchResultItem[] = [];
	export let loading = false;
	export let error: string | null = null;
	export let currentQuery: SearchQuery;

	function handleFilterSortChange(newQuery: Partial<SearchQuery>) {
		// Dispatch event or call action to update search
		console.log('Filter/Sort changed:', newQuery);
		// This would typically trigger a new search via searchActions.performSearch
	}
</script>

<div class="search-main">
	<header>
		<h1>Search Results for "{currentQuery.query}"</h1>
		<SearchFilterSort on:change={handleFilterSortChange} />
	</header>

	<main>
		{#if loading}
			<div class="loading">Loading search results...</div>
		{:else if error}
			<div class="error">Error: {error}</div>
		{:else if results.length === 0}
			<div class="empty-state">
				<p>No results found for "{currentQuery.query}". Please try a different search term.</p>
			</div>
		{:else}
			<SearchResultsList {results} />
		{/if}
	</main>
</div>

<style>
	/* Component styles */
	.search-main {
		padding: 1rem;
	}

	header {
		margin-bottom: 1.5rem;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.loading,
	.error,
	.empty-state {
		text-align: center;
		padding: 2rem;
		font-size: 1.1rem;
		color: var(--text-color-secondary);
	}

	.error {
		color: var(--color-error);
	}
</style>
```

#### Create `src/lib/components/search/SearchResultsList.svelte`:

```svelte
<script lang="ts">
	import type { SearchResultItem } from '$lib/types/search';
	import SearchResultCard from './SearchResultCard.svelte';

	export let results: SearchResultItem[] = [];
</script>

<div class="search-results-list">
	<div class="results-grid">
		{#each results as item (item.id)}
			<SearchResultCard {item} />
		{/each}
	</div>
</div>

<style>
	/* List styles */
	.results-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}
</style>
```

#### Create `src/lib/components/search/SearchFilterSort.svelte`:

```svelte
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { SearchQuery } from '$lib/types/search';

	const dispatch = createEventDispatcher<{ change: Partial<SearchQuery> }>();

	let selectedSortBy: string = 'relevance';
	let selectedFilter: string = 'all';

	function applyChanges() {
		dispatch('change', {
			sortBy: selectedSortBy,
			filters: { type: selectedFilter === 'all' ? undefined : selectedFilter }
		});
	}
</script>

<div class="search-filter-sort">
	<label for="sort-by">Sort By:</label>
	<select id="sort-by" bind:value={selectedSortBy} on:change={applyChanges}>
		<option value="relevance">Relevance</option>
		<option value="rating">Rating</option>
		<option value="distance">Distance</option>
	</select>

	<label for="filter-by">Filter By:</label>
	<select id="filter-by" bind:value={selectedFilter} on:change={applyChanges}>
		<option value="all">All</option>
		<option value="restaurant">Restaurants</option>
		<option value="menuItem">Menu Items</option>
	</select>
</div>

<style>
	.search-filter-sort {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-top: 1rem;
	}

	label {
		font-weight: bold;
		color: var(--text-color-secondary);
	}

	select {
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		background-color: var(--background-color-light);
		color: var(--text-color-primary);
	}
</style>
```

#### Create `src/lib/components/search/SearchResultCard.svelte`:

```svelte
<script lang="ts">
	import type { SearchResultItem } from '$lib/types/search';
	import { goto } from '$app/navigation';

	export let item: SearchResultItem;

	function navigateToItem() {
		if (item.type === 'restaurant') {
			goto(`/restaurant/${item.id}`);
		} else if (item.type === 'menuItem') {
			// Assuming menu items might link to a restaurant page or a specific menu item detail
			// For now, let's link to the restaurant if available, or just log
			console.log('Navigating to menu item:', item);
			// Example: goto(`/restaurant/${item.restaurantId}/menu/${item.id}`);
		}
	}
</script>

<div class="search-result-card" on:click={navigateToItem}>
	{#if item.imageUrl}
		<img src={item.imageUrl} alt={item.name} class="card-image" />
	{/if}
	<div class="card-content">
		<h3 class="card-title">{item.name}</h3>
		<p class="card-type">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
		{#if item.description}
			<p class="card-description">{item.description}</p>
		{/if}
	</div>
</div>

<style>
	.search-result-card {
		background-color: var(--card-background);
		border-radius: var(--border-radius);
		box-shadow: var(--shadow-elevation-1);
		overflow: hidden;
		cursor: pointer;
		transition:
			transform 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.search-result-card:hover {
		transform: translateY(-5px);
		box-shadow: var(--shadow-elevation-2);
	}

	.card-image {
		width: 100%;
		height: 180px;
		object-fit: cover;
		border-bottom: 1px solid var(--border-color);
	}

	.card-content {
		padding: 1rem;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	.card-title {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		color: var(--text-color-primary);
	}

	.card-type {
		font-size: 0.85rem;
		color: var(--text-color-secondary);
		margin-bottom: 0.5rem;
		text-transform: capitalize;
	}

	.card-description {
		font-size: 0.9rem;
		color: var(--text-color-secondary);
		line-height: 1.4;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 3; /* Limit to 3 lines */
		-webkit-box-orient: vertical;
	}
</style>
```

#### Create `src/lib/components/search/index.ts`:

```typescript
export { default as SearchMain } from './SearchMain.svelte';
export { default as SearchResultsList } from './SearchResultsList.svelte';
export { default as SearchFilterSort } from './SearchFilterSort.svelte';
export { default as SearchResultCard } from './SearchResultCard.svelte';
```

### 5. Main Page Implementation

#### Search Bar Interaction (in `src/lib/components/layout/Header.svelte`)

When a user types in the search bar located in the application header (`src/lib/components/layout/Header.svelte`), the following logic should be implemented:

1.  **Debounce Input**: Implement a debounce mechanism (e.g., 300-500ms) to prevent excessive updates/navigations while the user is typing.
2.  **Conditional Navigation/Update**:
    - **If the current page is NOT `/search`**: When the user stops typing (after debounce), navigate to the `/search` route, passing the search query as a URL parameter (e.g., `/search?q=user_query`).
    - **If the current page IS `/search`**: When the user stops typing (after debounce), update the current URL's search parameter with the new query. This will trigger the `+page.svelte`'s reactive `currentQuery` and `searchActions.performSearch` to fetch new results without a full page reload.

#### Create `src/routes/search/+page.svelte`:

```svelte
<script lang="ts">
	import type { PageData } from './$types';
	import { SearchMain } from '$lib/components/search';
	import { searchStore, searchActions } from '$lib/stores/search';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { parseSearchUrl } from '$lib/utils/search';

	export let data: PageData;

	$: currentQuery = parseSearchUrl($page.url);

	onMount(() => {
		// Trigger search when the page loads or URL changes
		searchActions.performSearch(currentQuery);
	});

	// React to URL changes (e.g., back/forward navigation, or manual URL edit)
	$: if ($page.url.search !== $searchStore.currentQuery.query) {
		searchActions.performSearch(currentQuery);
	}
</script>

<svelte:head>
	<title>Search Results | Qpick</title>
	<meta name="description" content="Search results for restaurants and menu items on Qpick" />
</svelte:head>

<SearchMain
	results={$searchStore.results}
	loading={$searchStore.loading}
	error={$searchStore.error}
	{currentQuery}
/>
```

#### Create `src/routes/search/+page.server.ts`:

```typescript
import type { PageServerLoad } from './$types';
import type { SearchResultItem, SearchQuery } from '$lib/types/search';
import { parseSearchUrl } from '$lib/utils/search';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const searchQuery: SearchQuery = parseSearchUrl(url);

	// This server-side load function can optionally pre-fetch initial search results
	// or pass the query to the client-side store for fetching.
	// For simplicity, we'll let the client-side store handle the fetch in this plan.

	return {
		initialQuery: searchQuery // Pass the parsed query to the client
	};
};
```

## API Integration

### Create `src/routes/api/search/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SearchResultItem } from '$lib/types/search';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	const typeFilter = url.searchParams.get('type'); // Example filter
	const sortBy = url.searchParams.get('sortBy') || 'relevance';

	try {
		// Fetch restaurant information from the backend
		const backendUrl = `${PUBLIC_BACKEND_URL}/api/restaurants?q=${encodeURIComponent(query)}&type=${encodeURIComponent(typeFilter || '')}&sortBy=${encodeURIComponent(sortBy)}`;
		const response = await fetch(backendUrl);

		if (!response.ok) {
			throw new Error(`Backend API error: ${response.statusText}`);
		}

		const data = await response.json();
		// Assuming the backend returns an array of restaurant objects that can be mapped to SearchResultItem
		const results: SearchResultItem[] = data.map((restaurant: any) => ({
			id: restaurant.id,
			type: 'restaurant',
			name: restaurant.name,
			description: restaurant.description || '',
			imageUrl: restaurant.imageUrl || '' // Assuming imageUrl exists
		}));

		// Further filter and sort if needed on the frontend, or rely on backend
		const filteredResults = results.filter((item) => {
			const matchesQuery =
				item.name.toLowerCase().includes(query.toLowerCase()) ||
				(item.description && item.description.toLowerCase().includes(query.toLowerCase()));
			const matchesType = typeFilter ? item.type === typeFilter : true;
			return matchesQuery && matchesType;
		});

		// Simple sorting logic (can be expanded)
		filteredResults.sort((a, b) => {
			if (sortBy === 'name') {
				return a.name.localeCompare(b.name);
			} else if (sortBy === 'type') {
				return a.type.localeCompare(b.type);
			}
			return 0; // Relevance or other complex sorting
		});

		return json({ results: filteredResults });
	} catch (error: any) {
		console.error('Error fetching search results:', error);
		return json({ error: `Failed to fetch search results: ${error.message}` }, { status: 500 });
	}
};
```

## Testing Requirements

### Unit Tests

Create `src/lib/components/search/SearchMain.test.ts`:

```typescript
import { render, screen } from '@testing-library/svelte';
import SearchMain from './SearchMain.svelte';

describe('SearchMain', () => {
	it('renders correctly with a query', () => {
		render(SearchMain, {
			results: [],
			loading: false,
			error: null,
			currentQuery: { query: 'test' }
		});
		expect(screen.getByText('Search Results for "test"')).toBeInTheDocument();
	});

	it('displays loading state', () => {
		render(SearchMain, {
			results: [],
			loading: true,
			error: null,
			currentQuery: { query: 'test' }
		});
		expect(screen.getByText('Loading search results...')).toBeInTheDocument();
	});

	it('displays error state', () => {
		render(SearchMain, {
			results: [],
			loading: false,
			error: 'Failed to load',
			currentQuery: { query: 'test' }
		});
		expect(screen.getByText('Error: Failed to load')).toBeInTheDocument();
	});

	it('displays no results message', () => {
		render(SearchMain, {
			results: [],
			loading: false,
			error: null,
			currentQuery: { query: 'no match' }
		});
		expect(
			screen.getByText('No results found for "no match". Please try a different search term.')
		).toBeInTheDocument();
	});

	// Add more tests for SearchResultsList, SearchResultCard, SearchFilterSort
});
```

### Integration Tests

- Test API endpoint for search with various queries, filters, and sort options.
- Test form submissions from a search input (e.g., in the header) leading to the search results page.
- Test navigation from search results cards to detail pages.
- Test URL parameter handling for search queries.
- Test error handling for API calls.

## Accessibility Checklist

- [ ] Proper ARIA labels on interactive elements (e.g., search input, filter/sort selects).
- [ ] Keyboard navigation support for search input, filter/sort controls, and result cards.
- [ ] Screen reader announcements for state changes (e.g., loading, no results, error messages).
- [ ] Proper heading hierarchy on the search results page.
- [ ] Color contrast compliance for text and interactive elements.
- [ ] Focus management when navigating between search components.
- [ ] Error message association with form fields (if search input is part of a form).

## Performance Considerations

- [ ] Implement debounced search input if a live search is desired.
- [ ] Lazy loading for images in search result cards.
- [ ] Optimize API calls for search (e.g., efficient database queries).
- [ ] Implement pagination or infinite scrolling for large result sets.
- [ ] Proper loading states to indicate ongoing search.
- [ ] Code splitting if the search feature becomes very large.

## Security Considerations

- [ ] Input validation and sanitization for search queries to prevent XSS or injection attacks.
- [ ] Rate limiting for the search API endpoint to prevent abuse.
- [ ] Ensure proper authentication/authorization if search results are user-specific.
- [ ] Data validation on both client and server for search parameters.

## Review Checklist

- [ ] All TypeScript types are properly defined for search-related data.
- [ ] Components are reusable and well-structured (e.g., `SearchResultCard` can be used elsewhere).
- [ ] Error handling is implemented for API calls and display.
- [ ] Loading states are present and provide good UX.
- [ ] API endpoints are secure and handle various search parameters.
- [ ] Tests cover main functionality of search, including filtering and sorting.
- [ ] Accessibility requirements are met.
- [ ] Performance is optimized for a smooth search experience.
- [ ] Code follows project conventions and design guidelines.

## Documentation

- [ ] Add feature to main README (brief description).
- [ ] Document the search API endpoint (parameters, response format).
- [ ] Add inline code comments for complex logic.
- [ ] Update type definitions as needed.
- [ ] Add usage examples for the search components if they are generic.
