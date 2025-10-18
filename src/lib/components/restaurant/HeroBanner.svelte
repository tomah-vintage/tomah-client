<script lang="ts">
	import type { Banner } from '$lib/types/banner';

	export let banner: Banner;
</script>

<div class="relative overflow-hidden rounded-lg">
	<img
		src={banner.image_url}
		alt="Restaurant Hero Banner"
		class="h-64 w-full object-cover md:h-80 lg:h-96"
		style={banner.width && banner.height ? `aspect-ratio: ${banner.width}/${banner.height}` : ''}
	/>
</div>