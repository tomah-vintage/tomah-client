/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#FF6B35',
					dark: '#E05A2B'
				},
				accent: {
					light: '#FFD700'
				},
				'dark-charcoal': '#2C2C2C',
				'light-gray': '#F8F9FA',
				white: '#FFFFFF',
				yellow: '#FFD700',
				'light-blue': '#E3F2FD',
				purple: '#9C27B0',
				green: '#4CAF50',
				success: '#4CAF50',
				warning: '#FF9800',
				error: '#F44336',
				info: '#2196F3'
			},
			fontFamily: {
				sans: [
					'Roboto',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'"Helvetica Neue"',
					'Arial',
					'"Noto Sans"',
					'sans-serif',
					'"Apple Color Emoji"',
					'"Segoe UI Emoji"',
					'"Segoe UI Symbol"',
					'"Noto Color Emoji"'
				]
			}
		}
	},
	plugins: [require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()]
};
