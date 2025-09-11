<div class="container mx-auto flex flex-col gap-10 py-8 px-4 sm:px-6 lg:px-8">
	<!-- Banner Loading -->
	<div class="h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg animate-pulse"></div>
	
	<!-- Restaurant Carousel Loading -->
	<div>
		<div class="mb-4 flex justify-between items-center">
			<div class="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
		</div>
		<div class="flex space-x-6 overflow-hidden">
			{#each Array(4) as _}
				<div class="min-w-[300px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
					<div class="h-48 bg-gray-200 animate-pulse"></div>
					<div class="p-4">
						<div class="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
						<div class="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
						<div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	
	<!-- Restaurant Main Grid Loading -->
	<div>
		<div class="h-8 bg-gray-200 rounded w-40 animate-pulse mb-6"></div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each Array(6) as _}
				<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
					<div class="h-48 bg-gray-200 animate-pulse"></div>
					<div class="p-4">
						<div class="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
						<div class="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
						<div class="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-3"></div>
						<div class="flex justify-between items-center">
							<div class="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
							<div class="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>