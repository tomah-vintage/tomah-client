import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const restaurant = {
		id: params.restaurantId,
		name: 'The Golden Spoon',
		logo: '/logo.png',
		address: '123 Main St, Anytown',
		lat: 47.9187,
		lng: 106.917,
		restaurant_img_urls: [
			'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0',
			'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0',
			'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0'
		],
		openingHours: '9 AM - 10 PM',
		featuredItems: [
			{
				id: '1',
				name: 'Featured Item 1',
				description: 'This is a featured item.',
				price: 9.99,
				image_url:
					'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0'
			},
			{
				id: '2',
				name: 'Featured Item 2',
				description: 'This is another featured item.',
				price: 12.99,
				image_url:
					'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0'
			}
		],
		menu: {
			categories: [
				{ id: '1', name: 'Category 1' },
				{ id: '2', name: 'Category 2' }
			],
			items: [
				{
					id: '1',
					name: 'Menu Item 1',
					description: 'This is a menu item.',
					price: 10.99,
					image_url:
						'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0',
					categoryId: '1'
				},
				{
					id: '2',
					name: 'Menu Item 2',
					description: 'This is another menu item.',
					price: 15.99,
					image_url:
						'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0',
					categoryId: '2'
				}
			]
		},
		reviews: [
			{
				id: '1',
				user: { id: '1', name: 'John Doe' },
				rating: 4,
				comment: 'Great food!',
				createdAt: '2024-01-01'
			},
			{
				id: '2',
				user: { id: '2', name: 'Jane Doe' },
				rating: 5,
				comment: 'Excellent service!',
				createdAt: '2024-01-02'
			}
		]
	};

	return {
		restaurant
	};
};
