<script>
	const steps = [
		{
			number: 1,
			title: 'Web болон app-аар захиалга өгөх',
			description:
				'Та өөрийн гар утас, компьютер ашиглан ойр байгаа хоолны газруудаас дуртай хоолоо хэдхэн товч дарж захиална.',
			image: '/src/lib/assets/how/one.png' // replace with your icon path
		},
		{
			number: 2,
			title: 'Хоол бэлтгэгдэх',
			description:
				'Таны захиалга тухайн ресторанны гал тогоонд автоматаар дамжиж, мэргэжлийн тогоочид шуурхай бэлтгэнэ.',
			image: '/src/lib/assets/how/two.png'
		},
		{
			number: 3,
			title: 'Халуун/хүйтэн хадгалалттай ухаалаг төхөөрөмжид хийх',
			description:
				'Хоол бэлэн болмогц халуунд хадгалах эсвэл хэрэгцээнд ухаалаг хоолны төхөөрөмжид таны захиалгыг байрлуулна.',
			image: '/src/lib/assets/how/three.png'
		},
		{
			number: 4,
			title: 'Мэдэгдэл хүлээн авах',
			description: 'Хоол тань бэлэн болсныг систем автоматаар таны утсанд мессежээр мэдэгдэнэ.',
			image: '/src/lib/assets/how/four.png'
		},
		{
			number: 5,
			title: 'Оочирлохгүй, шууд авах',
			description:
				'Та очихдоо зөвхөн төхөөрөмжийн кодоо оруулаад халуун, шинэхэн хоолоо шууд авч болно.',
			image: '/src/lib/assets/how/five.png'
		}
	];
</script>

<div class="container mx-auto max-w-[1200px] px-4 py-8">
	<div class="mx-auto max-w-3xl py-10">
	<h2 class="mb-10 text-center text-2xl font-bold md:text-3xl">Хэрхэн ажилдаг вэ?</h2>

	<div class="space-y-8">
		{#each steps as step}
			<div class="items-start gap-4 rounded-2xl bg-gray-50 p-5 shadow-sm">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-md border border-red-500 font-bold text-red-500"
				>
					{step.number}
				</div>
				<div class="flex">
					<div class="my-2 flex-1">
						<h3 class="mb-1 text-lg font-semibold">{step.title}</h3>
						<p class="text-sm text-gray-600">{step.description}</p>
					</div>
					<img src={step.image} alt="Step {step.number}" class="flex-1 h-[126px] w-[220px] object-contain" />
				</div>
			</div>
		{/each}
	</div>

	<!-- Video -->
	<div class="mt-10 flex justify-center">
		<iframe
			width="560"
			height="315"
			src="https://www.youtube.com/embed/Vo6XKkQ5Y7c"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			class="rounded-xl shadow-md"
		></iframe>
	</div>
	</div>
</div>
