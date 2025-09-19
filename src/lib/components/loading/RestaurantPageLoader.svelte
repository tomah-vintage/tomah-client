<!-- Banner Loading -->
<div class="container mx-auto max-w-[1200px] mt-3 w-full px-4">
	<!-- Banner Skeleton -->
	<div class="h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg animate-pulse"></div>

	<!-- Featured Items Loading -->
	<div class="mt-8">
		<div class="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each Array(4) as _}
				<div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
					<div class="h-40 bg-gray-200 animate-pulse"></div>
					<div class="p-4">
						<div class="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
						<div class="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
						<div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Menu Tabs Loading -->
	<div class="mt-10">
		<div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<div class="h-8 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
				<div class="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
			</div>
			<div class="h-12 bg-gray-200 rounded-lg w-full max-w-sm animate-pulse"></div>
		</div>
		<div class="border-b border-gray-200">
			<div class="flex space-x-1">
				{#each Array(4) as _}
					<div class="h-10 bg-gray-200 rounded animate-pulse px-6 py-3 mr-2"></div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Menu Items Loading -->
	<div class="mt-4">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each Array(8) as _}
				<div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
					<div class="h-40 bg-gray-200 animate-pulse"></div>
					<div class="p-4">
						<div class="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
						<div class="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
						<div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Info Sections Loading -->
	<div class="mt-8 space-y-6">
		<div class="max-w-2xl">
			<div class="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
			<div class="space-y-2">
				{#each Array(4) as _}
					<div class="h-4 bg-gray-200 rounded animate-pulse"></div>
				{/each}
			</div>
		</div>
		
		<div class="max-w-2xl">
			<div class="h-6 bg-gray-200 rounded w-20 animate-pulse mb-4"></div>
			<div class="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
		</div>
		
		<div class="max-w-4xl">
			<div class="h-6 bg-gray-200 rounded w-24 animate-pulse mb-4"></div>
			<div class="space-y-4">
				{#each Array(3) as _}
					<div class="bg-white rounded-lg p-4 border border-gray-100">
						<div class="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
						<div class="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
						<div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>