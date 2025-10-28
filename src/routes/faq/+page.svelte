<script lang="ts">
	import { Plus, Minus } from 'lucide-svelte';

	// FAQ data
	const faqItems = [
		{
			id: 1,
			question: 'Smart Locker гэж юу вэ?',
			answer:
				'Smart Locker бол дижитал технологиор удирдагддаг ухаалаг шүүгээ юм. Энэ нь хэрэглэгчдэд аюулгүй, хялбар байдлаар бараагаа хадгалах, авах боломжийг олгодог.'
		},
		{
			id: 2,
			question: 'Хоолоо яаж авах вэ?',
			answer:
				'QR код уншуулж, захиалга өгснөөс хойш SMS-ээр ирэх кодыг оруулан locker-аас хоолоо авна.'
		},
		{
			id: 3,
			question: 'Миний хоол хэр удаан хадгалагдах вэ?',
			answer:
				'Таны захиалсан хоол 2 цагийн турш хадгалагдана. Энэ хугацаанд авахгүй бол автоматаар устгагдана.'
		},
		{
			id: 4,
			question: 'Миний захиалга хэзээ болсоны лав мэдэх вэ?',
			answer: 'Та SMS мессеж болон апп-н мэдэгдлээр захиалгын статусын талаар мэдээлэл авна.'
		},
		{
			id: 5,
			question: 'QPick нь бүсад шүүгээний системэос зоргоорон ялгаатай вэ?',
			answer:
				'QPick нь Монголын анхны хоолны захиалгын smart locker систем бөгөөд 24/7 үйлчилгээ, олон төрлийн төлбөрийн хэрэгсэл дэмждэг.'
		},
		{
			id: 6,
			question: 'QPick нь халаах эсвэл хөргөх боломжтой юу?',
			answer:
				'Тийм, манай smart locker нь халаах болон хөргөх функцтэй тул хоол тань тохиромжтой температурт хадгалагдана.'
		},
		{
			id: 7,
			question: 'Би хоолоо бүсдээ өгч болох уу?',
			answer: 'Тийм, та өөрийн захиалгын кодыг бусдад өгч, тэд таны оронд хоолыг авч болно.'
		},
		{
			id: 8,
			question: 'Locker-д хүвийн эд зүйл хадгалж болох уу?',
			answer:
				'Үгүй, smart locker нь зөвхөн хоолны захиалгад зориулагдсан тул хүвийн эд зүйл хадгалахыг хориглоно.'
		}
	];

	let expandedItems: Set<number> = new Set();

	function toggleItem(id: number) {
		if (expandedItems.has(id)) {
			expandedItems.delete(id);
		} else {
			expandedItems.add(id);
		}
		expandedItems = new Set(expandedItems);
	}
</script>

<svelte:head>
	<title>Түгээмэл асуулт хариулт - QPick</title>
	<meta
		name="description"
		content="QPick Smart Locker системийн талаарх түгээмэл асуулт хариултууд"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Roboto:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Hero Section -->
<section>
	<div
		class="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 py-8 lg:flex-row lg:gap-[180px] lg:px-[120px] lg:py-[60px]"
	>
		<!-- Left Content -->
		<div
			class="flex w-full flex-col items-start justify-center gap-4 lg:h-[200px] lg:w-[550px] lg:gap-6"
		>
			<h1
				class="font-roboto w-full text-2xl leading-[110%] font-semibold text-[#494B57] lg:text-[32px] lg:leading-[100%]"
			>
				Танай өдөр тутмын ачааллыг хөнгөвчлөх хамтын шийдэл
			</h1>
			<p
				class="font-inter w-full text-base leading-[140%] font-medium text-[#494B57] lg:text-[20px]"
			>
				Орчин үеийн хэрэглэгчид хүлээлтгүй, хурдан, аюулгүй үйлчилгээг илүүд үздэг болсон энэ үед,
				танай байгууллагад QPick-ийн дэвшилтэт шийдлийг санал болгож байна.
			</p>
		</div>

		<!-- Right Image -->
		<div class="w-full flex-shrink-0 lg:w-auto">
			<div
				class="mx-auto flex w-full max-w-sm items-center justify-center rounded-xl lg:h-[502px] lg:w-[457px] lg:max-w-none"
			>
				<img
					src="/FAQ-locker.png"
					alt="Smart Locker"
					class="h-auto w-full rounded-xl object-contain lg:h-full"
					loading="eager"
				/>
			</div>
		</div>
	</div>
</section>

<!-- FAQ Section -->
<section class="py-12 lg:py-16">
	<div class="container mx-auto max-w-4xl px-4">
		<h2 class="mb-8 text-center text-2xl font-bold text-gray-900 lg:mb-12 lg:text-3xl xl:text-4xl">
			Түгээмэл асуулт хариулт
		</h2>

		<div class="space-y-3 lg:space-y-4">
			{#each faqItems as item}
				<div class="overflow-hidden rounded-lg border border-gray-200">
					<button
						class="flex w-full items-center justify-between bg-white px-4 py-3 text-left transition-colors duration-200 hover:bg-gray-50 lg:px-6 lg:py-4"
						on:click={() => toggleItem(item.id)}
					>
						<span
							class="pr-3 text-base leading-relaxed font-medium text-gray-900 lg:pr-4 lg:text-lg"
						>
							{item.question}
						</span>
						<div class="flex-shrink-0">
							{#if expandedItems.has(item.id)}
								<Minus size={20} class="text-gray-600 lg:h-6 lg:w-6" />
							{:else}
								<Plus size={20} class="text-gray-600 lg:h-6 lg:w-6" />
							{/if}
						</div>
					</button>

					{#if expandedItems.has(item.id)}
						<div class="border-t border-gray-100 bg-gray-50 px-4 pb-3 lg:px-6 lg:pb-4">
							<p class="pt-3 text-sm leading-relaxed text-gray-700 lg:pt-4 lg:text-base">
								{item.answer}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	.font-roboto {
		font-family: 'Roboto', sans-serif;
	}

	.font-inter {
		font-family: 'Inter', sans-serif;
	}
</style>
