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
					50: '#FFF5F5',
					100: '#FED7D7',
					200: '#FEB2B2',
					300: '#FC8181',
					400: '#F56565',
					500: '#E53E3E',
					600: '#C53030',
					700: '#9B2C2C',
					800: '#822727',
					900: '#63171B',
					DEFAULT: '#E53E3E',
					dark: '#C53030'
				},
				secondary: {
					50: '#F0F4F8',
					100: '#D9E2EC',
					200: '#BCCCDC',
					300: '#9FB3C8',
					400: '#829AB1',
					500: '#627D98',
					600: '#486581',
					700: '#334E68',
					800: '#243B53',
					900: '#102A43',
					DEFAULT: '#627D98'
				},
				accent: {
					50: '#FFFBEB',
					100: '#FEF3C7',
					200: '#FDE68A',
					300: '#FCD34D',
					400: '#FBBF24',
					500: '#F59E0B',
					600: '#D97706',
					700: '#B45309',
					800: '#92400E',
					900: '#78350F',
					DEFAULT: '#F59E0B',
					light: '#FCD34D'
				},
				neutral: {
					50: '#F9FAFB',
					100: '#F3F4F6',
					200: '#E5E7EB',
					300: '#D1D5DB',
					400: '#9CA3AF',
					500: '#6B7280',
					600: '#4B5563',
					700: '#374151',
					800: '#1F2937',
					900: '#111827',
					DEFAULT: '#6B7280'
				},
				success: '#10B981',
				warning: '#F59E0B',
				error: '#EF4444',
				info: '#3B82F6'
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
			},
			gridTemplateColumns: {
				'auto-fill-minmax-280px': 'repeat(auto-fill, minmax(280px, 1fr))'
			},
			keyframes: {
				shimmer: {
					'0%': { backgroundPosition: '200% 0' },
					'100%': { backgroundPosition: '-200% 0' }
				},
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				slideIn: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				}
			},
			animation: {
				shimmer: 'shimmer 2s ease-in-out infinite',
				fadeInUp: 'fadeInUp 0.5s ease-out',
				slideIn: 'slideIn 0.3s ease-out'
			}
		}
	},
	plugins: [
		require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')(),
		require('@tailwindcss/line-clamp')
	]
};
