export interface Banner {
	id: string;
	restaurant: string;
	image_url: string;
	layout_type: 'HERO' | 'CAROUSEL' | 'FEATURED' | 'PROMOTIONAL' | 'Magazine';
	position: 'TOP' | 'MIDDLE' | 'BOTTOM' | 'SIDEBAR';
	order_index: number;
	width?: number;
	height?: number;
	animation_type?: string;
	responsive_settings: Record<string, any>;
	created_at: string;
	updated_at: string;
}

export interface PlatformBanner {
	id: number;
	image_url: string;
	restaurant: number;
	restaurant_name: string;
	order_index: number;
	created_at: string;
	updated_at: string;
}

export interface CreatePlatformBannerRequest {
	image_url: string;
	restaurant: number;
	order_index: number;
}

export type LayoutType = Banner['layout_type'];
export type Position = Banner['position'];
