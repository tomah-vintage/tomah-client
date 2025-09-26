import type { Restaurant, OpenHours } from '$lib/types/restaurant';

/**
 * Get current day of week (1 = Monday, 7 = Sunday)
 * Note: JavaScript Date.getDay() returns 0 = Sunday, 1 = Monday  
 * We want 1-based indexing: Monday=1, Tuesday=2, ..., Friday=5, Saturday=6, Sunday=7
 */
function getCurrentDayOfWeek(): number {
	const jsDay = new Date().getDay();
	return jsDay === 0 ? 7 : jsDay; // Convert Sunday from 0 to 7, others stay the same
}

/**
 * Convert time string (HH:MM:SS) to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
	const [hours, minutes] = timeStr.split(':').map(Number);
	return hours * 60 + minutes;
}

/**
 * Get current time in minutes since midnight
 */
function getCurrentTimeInMinutes(): number {
	const now = new Date();
	return now.getHours() * 60 + now.getMinutes();
}

/**
 * Format time string from HH:MM:SS to HH:MM
 */
function formatTime(timeStr: string): string {
	return timeStr.substring(0, 5); // Remove seconds
}

/**
 * Check if restaurant is currently open
 */
export function isRestaurantOpen(restaurant: Restaurant): boolean {
	if (!restaurant.open_hours || restaurant.open_hours.length === 0) {
		return false;
	}

	const currentDay = getCurrentDayOfWeek();
	const currentTime = getCurrentTimeInMinutes();

	const todayHours = restaurant.open_hours.find(hours => hours.day_of_week === currentDay);
	
	if (!todayHours) {
		return false; // Restaurant is closed today
	}

	const openTime = timeToMinutes(todayHours.opening_time);
	const closeTime = timeToMinutes(todayHours.closing_time);

	// Handle restaurants that close after midnight
	if (closeTime < openTime) {
		// Restaurant closes after midnight (e.g., open 18:00-02:00)
		return currentTime >= openTime || currentTime <= closeTime;
	} else {
		// Normal case (e.g., open 09:00-17:00)
		return currentTime >= openTime && currentTime <= closeTime;
	}
}

/**
 * Get formatted hours string for display
 */
export function getRestaurantHoursDisplay(restaurant: Restaurant): string {
	// Fallback to old format if available
	if (!restaurant.open_hours && restaurant.openingHours) {
		return restaurant.openingHours;
	}

	if (!restaurant.open_hours || restaurant.open_hours.length === 0) {
		return 'Hours not available';
	}

	const currentDay = getCurrentDayOfWeek();
	const todayHours = restaurant.open_hours.find(hours => hours.day_of_week === currentDay);

	if (!todayHours) {
		return 'Closed today';
	}

	const openTime = formatTime(todayHours.opening_time);
	const closeTime = formatTime(todayHours.closing_time);

	return `${openTime} - ${closeTime}`;
}

/**
 * Get status text (Open/Closed) with styling class
 */
export function getRestaurantStatus(restaurant: Restaurant): {
	text: string;
	isOpen: boolean;
} {
	const isOpen = isRestaurantOpen(restaurant);
	
	return {
		text: isOpen ? 'Open' : 'Closed',
		isOpen
	};
}

/**
 * Get next opening time if restaurant is currently closed
 */
export function getNextOpeningTime(restaurant: Restaurant): string | null {
	if (!restaurant.open_hours || restaurant.open_hours.length === 0) {
		return null;
	}

	if (isRestaurantOpen(restaurant)) {
		return null; // Restaurant is already open
	}

	const currentDay = getCurrentDayOfWeek();
	const currentTime = getCurrentTimeInMinutes();

	// Check if restaurant opens later today
	const todayHours = restaurant.open_hours.find(hours => hours.day_of_week === currentDay);
	if (todayHours && currentTime < timeToMinutes(todayHours.opening_time)) {
		return `Opens at ${formatTime(todayHours.opening_time)}`;
	}

	// Find next opening day
	for (let i = 1; i <= 7; i++) {
		const nextDay = (currentDay + i) % 7;
		const nextDayHours = restaurant.open_hours.find(hours => hours.day_of_week === nextDay);
		
		if (nextDayHours) {
			const dayName = nextDayHours.day_of_week_display;
			const openTime = formatTime(nextDayHours.opening_time);
			
			if (i === 1) {
				return `Opens tomorrow at ${openTime}`;
			} else {
				return `Opens ${dayName} at ${openTime}`;
			}
		}
	}

	return null;
}

/**
 * Get next opening time in Mongolian if restaurant is currently closed
 */
export function getNextOpeningTimeMongolian(restaurant: Restaurant): string {
	if (!restaurant.open_hours || restaurant.open_hours.length === 0) {
		return 'Цагийн мэдээлэл байхгүй';
	}

	if (isRestaurantOpen(restaurant)) {
		return ''; // Restaurant is already open
	}

	const currentDay = getCurrentDayOfWeek();
	const currentTime = getCurrentTimeInMinutes();

	// Check if restaurant opens later today
	const todayHours = restaurant.open_hours.find(hours => hours.day_of_week === currentDay);
	if (todayHours && currentTime < timeToMinutes(todayHours.opening_time)) {
		return `Өнөөдөр ${formatTime(todayHours.opening_time)}-д нээнэ`;
	}

	// Find next opening day
	for (let i = 1; i <= 7; i++) {
		const nextDay = (currentDay + i) % 7;
		// Handle day wrapping for 1-7 system
		const normalizedNextDay = nextDay === 0 ? 7 : nextDay;
		const nextDayHours = restaurant.open_hours.find(hours => hours.day_of_week === normalizedNextDay);
		
		if (nextDayHours) {
			const dayNames = ['', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням']; // 1-based indexing
			const openTime = formatTime(nextDayHours.opening_time);
			
			if (i === 1) {
				return `Маргааш ${openTime}-д нээнэ`;
			} else {
				return `${dayNames[normalizedNextDay]} гарагт ${openTime}-д нээнэ`;
			}
		}
	}

	return 'Цагийн мэдээлэл байхгүй';
}