<script lang="ts">
	import SkeletonLoader from '$lib/components/common/SkeletonLoader.svelte';
</script>

<div class="space-y-4">
	{#each Array(3) as _}
		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
			<SkeletonLoader />
		</div>
	{/each}
</div>