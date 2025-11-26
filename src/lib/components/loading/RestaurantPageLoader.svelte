<!-- Banner Loading -->
<div class="container mx-auto mt-3 w-full max-w-[1200px] px-4">
	<!-- Banner Skeleton -->
	<div class="h-64 animate-pulse rounded-lg bg-gray-200 md:h-80 lg:h-96"></div>

	<!-- Featured Items Loading -->
	<div class="mt-8 mb-4">
		<div class="mb-2 h-6 w-48 animate-pulse rounded bg-gray-200"></div>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each Array(4) as _, index}
				<div
					class="relative flex w-full flex-col gap-1 rounded-2xl bg-white shadow-md md:w-[280px]"
					style="animation-delay: {index * 100}ms"
				>
					<!-- Image Skeleton -->
					<div
						class="h-[180px] w-full animate-pulse rounded-t-2xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
					></div>

					<!-- Content Skeleton -->
					<div class="flex flex-col gap-2 px-5 py-3">
						<!-- Title -->
						<div
							class="h-4 w-3/4 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
						></div>

						<!-- Description -->
						<div
							class="h-3 w-full animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
						></div>
						<div
							class="h-3 w-2/3 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
						></div>

						<!-- Price -->
						<div
							class="mt-1 h-5 w-20 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Menu Tabs Loading -->
	<div class="mt-10">
		<div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<div class="mb-2 h-8 w-20 animate-pulse rounded bg-gray-200"></div>
				<div class="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
			</div>
			<div class="h-12 w-full max-w-sm animate-pulse rounded-lg bg-gray-200"></div>
		</div>
		<div class="border-b border-gray-200">
			<div class="flex space-x-1">
				{#each Array(4) as _}
					<div class="mr-2 h-10 animate-pulse rounded bg-gray-200 px-6 py-3"></div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Menu Items Loading -->
	<div class="mt-4">
		<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each Array(8) as _, index}
				<div
					class="relative flex w-full flex-col gap-1 rounded-2xl bg-white shadow-md md:w-[280px]"
					style="animation-delay: {index * 100}ms"
				>
					<!-- Image Skeleton -->
					<div
						class="h-[180px] w-full animate-pulse rounded-t-2xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
					></div>

					<!-- Content Skeleton -->
					<div class="flex flex-col gap-2 px-5 py-3">
						<!-- Title -->
						<div
							class="h-4 w-3/4 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
						></div>

						<!-- Description -->
						<div
							class="h-3 w-full animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
						></div>
						<div
							class="h-3 w-2/3 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
						></div>

						<!-- Price -->
						<div
							class="mt-1 h-5 w-20 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Info Sections Loading -->
	<div class="mt-8 space-y-6">
		<div class="max-w-2xl">
			<div class="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
			<div class="space-y-2">
				{#each Array(4) as _}
					<div class="h-4 animate-pulse rounded bg-gray-200"></div>
				{/each}
			</div>
		</div>

		<div class="max-w-2xl">
			<div class="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
			<div class="h-48 animate-pulse rounded-lg bg-gray-200"></div>
		</div>

		<div class="max-w-2xl">
			<div class="mb-4 h-6 w-24 animate-pulse rounded bg-gray-200"></div>
			<div class="h-64 animate-pulse rounded-lg bg-gray-200"></div>
		</div>

		<div class="max-w-4xl">
			<div class="mb-4 h-6 w-24 animate-pulse rounded bg-gray-200"></div>
			<div class="space-y-4">
				{#each Array(3) as _}
					<div class="rounded-lg border border-gray-100 bg-white p-4">
						<div class="mb-2 h-4 animate-pulse rounded bg-gray-200"></div>
						<div class="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
						<div class="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
