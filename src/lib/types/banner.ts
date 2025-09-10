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

export type LayoutType = Banner['layout_type'];
export type Position = Banner['position'];