<script lang="ts">
	import { Mail, MapPin, Phone, Users, Target, Heart, Award } from 'lucide-svelte';

	const features = [
		{
			icon: Target,
			title: 'Манай эрхэм зорилго',
			description:
				'Орчин үеийн технологийн шийдлээр хоолны захиалгын үйлчилгээг илүү хурдан, найдвартай, хялбар болгох.'
		},
		{
			icon: Heart,
			title: 'Үнэт зүйлс',
			description: 'Харилцагчийн сэтгэл ханамж, чанарын баталгаа, инновац, найдвартай байдал.'
		},
		{
			icon: Award,
			title: 'Бидний онцлог',
			description:
				'Smart Locker систем ашиглан 24/7 үйлчилгээ, халуун/хүйтэн хадгалалт, ухаалаг захиалгын систем.'
		}
	];

	const teamValues = [
		'Харилцагчийн сэтгэл ханамжийг тэргүүн эрэмбэд тавих',
		'Инновацийн шийдлээр хөгжих',
		'Найдвартай, хурдан үйлчилгээ үзүүлэх',
		'Байгаль орчинд ээлтэй технологи ашиглах'
	];
</script>

<svelte:head>
	<title>Бидний тухай - QPick</title>
	<meta
		name="description"
		content="QPick нь Монголын анхны ухаалаг хоолны захиалгын систем бөгөөд орчин үеийн технологиор хэрэглэгчдэд хурдан, найдвартай үйлчилгээ үзүүлдэг."
	/>
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- Hero Section -->
	<section class="bg-gradient-to-b from-red-50 to-white">
		<div class="container mx-auto max-w-[1200px] px-4 py-16 md:py-[60px]">
			<div class="flex flex-col items-center gap-8 lg:flex-row lg:gap-[180px]">
				<!-- Left Content -->
				<div class="flex flex-1 flex-col gap-6">
					<h1 class="text-3xl leading-tight font-bold text-[#494B57] md:text-4xl lg:text-5xl">
						Бидний тухай
					</h1>
					<p class="text-base leading-relaxed text-gray-700 md:text-lg lg:text-xl">
						QPick нь Монголын анхны ухаалаг хоолны захиалгын систем бөгөөд орчин үеийн технологиор
						хэрэглэгчдэд хурдан, найдвартай үйлчилгээ үзүүлдэг. Smart Locker технологи ашиглан та
						дуртай хоолоо хүссэн цагтаа авах боломжтой.
					</p>
					<div class="flex flex-wrap gap-4">
						<div class="flex items-center gap-2">
							<div class="rounded-full bg-red-100 p-2">
								<Users class="h-6 w-6 text-red-600" />
							</div>
							<div>
								<p class="text-2xl font-bold text-red-600">1000+</p>
								<p class="text-sm text-gray-600">Идэвхтэй хэрэглэгч</p>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<div class="rounded-full bg-red-100 p-2">
								<Award class="h-6 w-6 text-red-600" />
							</div>
							<div>
								<p class="text-2xl font-bold text-red-600">50+</p>
								<p class="text-sm text-gray-600">Хамтрагч ресторан</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Right Image -->
				<div class="flex-1">
					<div class="relative">
						<img
							src="/about-hero.png"
							alt="QPick Smart Locker"
							class="h-auto w-full rounded-2xl object-cover shadow-lg"
							on:error={(e) => {
								e.currentTarget.src = '/FAQ-locker.png';
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="bg-white py-16">
		<div class="container mx-auto max-w-[1200px] px-4">
			<h2 class="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
				Бид юунд итгэдэг вэ?
			</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each features as feature}
					<div
						class="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
					>
						<div
							class="mb-4 inline-flex items-center justify-center rounded-full bg-red-100 p-4 transition-colors duration-300 group-hover:bg-red-600"
						>
							<svelte:component
								this={feature.icon}
								class="h-8 w-8 text-red-600 transition-colors duration-300 group-hover:text-white"
							/>
						</div>
						<h3 class="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
						<p class="leading-relaxed text-gray-600">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Values Section -->
	<section class="bg-gray-50 py-16">
		<div class="container mx-auto max-w-[1200px] px-4">
			<h2 class="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
				Бидний үнэт зүйлс
			</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each teamValues as value, index}
					<div class="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm">
						<div
							class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-600 font-bold text-white"
						>
							{index + 1}
						</div>
						<p class="text-lg text-gray-700">{value}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Contact Section -->
	<section class="bg-white py-16">
		<div class="container mx-auto max-w-[1200px] px-4">
			<h2 class="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
				Бидэнтэй холбогдох
			</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="rounded-xl bg-gray-50 p-8 text-center">
					<div class="mb-4 flex justify-center">
						<div class="rounded-full bg-red-100 p-4">
							<Phone class="h-8 w-8 text-red-600" />
						</div>
					</div>
					<h3 class="mb-2 text-lg font-semibold text-gray-900">Утас</h3>
					<p class="text-gray-600">(976) 8844-5135</p>
				</div>

				<div class="rounded-xl bg-gray-50 p-8 text-center">
					<div class="mb-4 flex justify-center">
						<div class="rounded-full bg-red-100 p-4">
							<Mail class="h-8 w-8 text-red-600" />
						</div>
					</div>
					<h3 class="mb-2 text-lg font-semibold text-gray-900">И-мэйл</h3>
					<p class="text-gray-600">Tomax.2k21@gmail.com</p>
				</div>

				<div class="rounded-xl bg-gray-50 p-8 text-center">
					<div class="mb-4 flex justify-center">
						<div class="rounded-full bg-red-100 p-4">
							<MapPin class="h-8 w-8 text-red-600" />
						</div>
					</div>
					<h3 class="mb-2 text-lg font-semibold text-gray-900">Хаяг</h3>
					<p class="text-gray-600">Чингисийн өргөн чөлөө 33/5, Үйлдвэр 10/17042</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-gradient-to-r from-red-600 to-red-700 py-16 text-white">
		<div class="container mx-auto max-w-[1200px] px-4 text-center">
			<h2 class="mb-4 text-3xl font-bold md:text-4xl">Хамт ажиллахад бэлэн үү?</h2>
			<p class="mb-8 text-lg text-red-100">
				Таны бизнест QPick-ийн дэвшилтэт шийдлийг санал болгож байна
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="/help"
					class="rounded-lg bg-white px-8 py-3 font-semibold text-red-600 shadow-lg transition-all duration-300 hover:bg-red-50 hover:shadow-xl"
				>
					Дэлгэрэнгүй мэдээлэл
				</a>
				<a
					href="tel:+97688445135"
					class="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-red-600"
				>
					Холбогдох
				</a>
			</div>
		</div>
	</section>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
