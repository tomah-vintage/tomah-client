<script lang="ts">
	export let images: string[] = [];

</script>

<div class="w-full">
	
{#if images.length === 1}
<!-- Single image full width -->
<div class="w-full h-[400px]">
  <img
	src={images[0]}
	alt="Restaurant"
	class="w-full object-cover rounded-lg h-[400px]"
  />
</div>

{:else if images.length === 2}
<!-- Two images side by side -->
<div class="grid grid-cols-2 gap-2 h-[400px]">
  {#each images as img}
	<img
	  src={img}
	  alt="Restaurant"
	  class="w-full object-cover rounded-lg h-[400px]"
	/>
  {/each}
</div>

{:else if images.length >= 3}
<!-- Layout with 3+ images (like screenshot) -->
<div class="grid grid-cols-3 gap-2 h-[400px]">
  <!-- Main image -->
  <div class="col-span-2 h-full">
	<img
	  src={images[0]}
	  alt="Main restaurant"
	  class="w-full object-cover rounded-lg h-[408px]"
	/>
  </div>

  <!-- Two stacked side images -->
  <div class="flex flex-col gap-2 h-[400px]">
	<img
	  src={images[1]}
	  alt="Restaurant side 1"
	  class="w-full h-1/2 object-cover rounded-lg"
	/>
	<img
	  src={images[2]}
	  alt="Restaurant side 2"
	  class="w-full h-1/2 object-cover rounded-lg"
	/>
  </div>
</div>
{/if}
	  
</div>
