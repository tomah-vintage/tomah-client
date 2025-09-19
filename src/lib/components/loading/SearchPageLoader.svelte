<div class="container mx-auto max-w-[1200px] px-4 py-8">
	<!-- Header Section -->
	<div class="mb-6 flex items-center justify-between">
		<div class="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
		
		<!-- View Toggle (Mobile) -->
		<div class="flex rounded-lg bg-gray-100 p-1 lg:hidden">
			<div class="h-8 bg-gray-200 rounded w-16 animate-pulse mr-1"></div>
			<div class="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- List View -->
		<div class="lg:block">
			<!-- Filter/Sort Section -->
			<div class="mb-6">
				<div class="flex flex-wrap gap-4 mb-4">
					{#each Array(4) as _}
						<div class="h-9 bg-gray-200 rounded-full px-4 animate-pulse w-20"></div>
					{/each}
				</div>
				<div class="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
			</div>

			<!-- Search Results Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each Array(6) as _}
					<!-- Restaurant Card Skeleton -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
						<!-- Image Skeleton -->
						<div class="h-48 sm:h-52 bg-gray-200 animate-pulse"></div>
						
						<!-- Content Skeleton -->
						<div class="p-4 space-y-3">
							<!-- Title -->
							<div class="h-5 bg-gray-200 rounded animate-pulse"></div>
							
							<!-- Hours/Status -->
							<div class="flex items-center gap-2">
								<div class="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
								<div class="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
								<div class="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
							</div>
							
							<!-- Address -->
							<div class="flex items-center gap-2">
								<div class="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
								<div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Map View -->
		<div class="lg:block" style="height: 716px;">
			<div class="sticky top-24 h-full">
				<div class="h-full bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
					<div class="text-gray-400 text-lg">Loading map...</div>
				</div>
			</div>
		</div>
	</div>
</div>