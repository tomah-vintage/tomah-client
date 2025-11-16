<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte';
	import { Mail, MapPin, Phone, Instagram, Facebook, Youtube } from 'lucide-svelte';
	import QpickLogo from '../assets/QpickLogo.svelte';
</script>

<footer class="bg-[#EB1600] text-white">
	<div class="container mx-auto px-6 py-12">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-12">
			<div class="col-span-1 self-center md:col-span-3">
				<!-- <img src={logo} alt="QPICK Logo" class="h-16" /> -->
				<QpickLogo />
			</div>

			<div class="col-span-1 md:col-span-1"></div>

			<div class="col-span-1 md:col-span-2">
				<h3 class="mb-4 font-bold">Бүтээгдэхүүн</h3>
				<ul class="space-y-2 text-sm">
					<li><a href="/" class="hover:underline">Шийдлүүд</a></li>
					<li><a href="/" class="hover:underline">Үнийн санал</a></li>
					<li><a href="/faq" class="hover:underline">Түгээмэл асуултууд</a></li>
				</ul>
			</div>

			<div class="col-span-1 md:col-span-2">
				<h3 class="mb-4 font-bold">Компани</h3>
				<ul class="space-y-2 text-sm">
					<li><a href="/about" class="hover:underline">Бидний тухай</a></li>
					<li><a href="/how_to_work" class="hover:underline">Хэрхэн ажилладаг вэ</a></li>
				</ul>
			</div>

			<div class="col-span-1 md:col-span-4">
				<h3 class="mb-4 font-bold">Холбоо барих</h3>
				<ul class="space-y-3 text-sm">
					<li class="flex items-start">
						<span class="mt-1 mr-3 flex-shrink-0">
							<Icon icon={Mail} size={20} />
						</span>
						<span>Tomax.2k21@gmail.com</span>
					</li>
					<li class="flex items-start">
						<span class="mt-1 mr-3 flex-shrink-0">
							<Icon icon={Phone} size={20} />
						</span>
						<span>(976) 8844-5135</span>
					</li>
					<li class="flex items-start">
						<span class="mt-1 mr-3 flex-shrink-0">
							<Icon icon={MapPin} size={20} />
						</span>
						<span
							>Монгол улс, Улаанбаатар хот, Хан-Уул дүүрэг, 1-р хороо Чингисийн өргөн чөлөө 33/5,
							Үйлдвэр 10/17042</span
						>
					</li>
				</ul>
			</div>
		</div>

		<hr class="my-8 border-t border-white/20" />

		<div class="flex flex-col items-center justify-between sm:flex-row">
			<p class="text-sm text-white/80">© 2025 Made by Tungaa</p>

			<div class="mt-4 flex space-x-4 sm:mt-0">
				<a
					href="/"
					class="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white"
				>
					<Icon icon={Instagram} size={20} />
				</a>
				<a
					href="/"
					class="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white"
				>
					<Icon icon={Facebook} size={20} />
				</a>
				<a
					href="/"
					class="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white"
				>
					<Icon icon={Youtube} size={20} />
				</a>
			</div>
		</div>
	</div>
</footer>
