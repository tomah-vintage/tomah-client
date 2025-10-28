import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Restaurant } from '$lib/types/restaurant';

// Mock data for restaurants
const mockRestaurants: Restaurant[] = [
	{
		id: '1',
		name: 'The Golden Spoon',
		logo: '/logo.png',
		address: '123 Main St, Anytown',
		restaurant_img_urls: [
			'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0'
		],
		openingHours: '9 AM - 10 PM',
		is_liked: false
	},
	{
		id: '2',
		name: 'Pizza Palace',
		logo: '/logo.png',
		address: '456 Oak Ave, Anytown',
		restaurant_img_urls: [
			'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0'
		],
		openingHours: '11 AM - 11 PM',
		is_liked: false
	},
	{
		id: '3',
		name: 'Sushi Central',
		logo: '/logo.png',
		address: '789 Pine Ln, Anytown',
		restaurant_img_urls: [
			'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0'
		],
		openingHours: '12 PM - 9 PM',
		is_liked: false
	},
	{
		id: '4',
		name: 'Burger Barn',
		logo: '/logo.png',
		address: '101 Elm St, Anytown',
		restaurant_img_urls: [
			'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0'
		],
		openingHours: '10 AM - 10 PM',
		is_liked: false
	},
	{
		id: '5',
		name: 'Taco Tuesday',
		logo: '/logo.png',
		address: '202 Maple Dr, Anytown',
		restaurant_img_urls: [
			'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0'
		],
		openingHours: '8 AM - 9 PM',
		is_liked: false
	}
];

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';
	let restaurants = mockRestaurants;

	if (search) {
		restaurants = mockRestaurants.filter((restaurant) =>
			restaurant.name.toLowerCase().includes(search.toLowerCase())
		);
	}

	return json({ restaurants });
};
