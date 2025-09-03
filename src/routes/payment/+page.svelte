<script>
	let payerType = 'company'; // "person" | "company"
	let regNumber = '';
</script>

<div class="flex w-full justify-center">
	<div class="relative m-5 w-[600px] self-center rounded-2xl bg-white p-6">
		<h2 class="mb-4 text-lg font-bold">Төлбөрийн нөхцлүүд</h2>

		<!-- Order Summary -->
		<div class="mb-4 rounded-lg border p-4">
			<p class="mb-2 font-semibold">Төлбөрийн дэлгэрэнгүй</p>
			<div class="flex justify-between text-sm">
				<span>Нийт дүн:</span>
				<span>51,000₮</span>
			</div>
			<div class="flex justify-between text-sm">
				<span>Хямдрал:</span>
				<span>-4,100₮</span>
			</div>
			<div class="flex justify-between text-sm">
				<span>Сав баглаа:</span>
				<span>2,000₮</span>
			</div>
			<div class="mt-2 flex justify-between text-lg font-bold">
				<span>Төлөх дүн:</span>
				<span>48,900₮</span>
			</div>
		</div>

		<!-- Payer type -->
		<div class="mb-4 rounded-lg border p-4">
			<div class="flex items-center gap-6">
				<label class="flex items-center gap-2">
					<input type="radio" bind:group={payerType} value="person" />
					Хувь хүн
				</label>
				<label class="flex items-center gap-2">
					<input type="radio" bind:group={payerType} value="company" />
					Байгууллага
				</label>
			</div>
			<input
				type="text"
				placeholder="Регистрийн дугаар"
				bind:value={regNumber}
				class="mt-3 w-full rounded border px-3 py-2 text-sm"
				disabled={payerType !== 'company'}
			/>
		</div>

		<!-- Payment Methods -->
		<div class="mb-4">
			<p class="mb-2 font-semibold">Төлбөрийн хэрэгслүүд</p>
			<div class="flex flex-wrap gap-2">
				<img src="/pay/qpay.png" class="h-10" alt="QPay" />
				<img src="/pay/applepay.png" class="h-10" alt="Apple Pay" />
				<img src="/pay/mongopay.png" class="h-10" alt="MonPay" />
				<img src="/pay/socialpay.png" class="h-10" alt="SocialPay" />
				<!-- add more -->
			</div>
		</div>

		<!-- QR Code -->
		<div class="rounded-lg border p-4 text-center">
			<p class="mb-2 text-sm">QR уншуулна уу</p>
			<img src="/qr-example.png" alt="QR" class="mx-auto h-40 w-40" />
			<p class="mt-2 text-xs text-gray-500">
				Жич: Хэрэв та төлбөрөө хийсэн бол “Төлбөрийг баталгаажуулах” товчийг дарна уу.
			</p>
			<button class="mt-3 w-full rounded-lg bg-red-500 py-3 text-white hover:bg-red-600">
				Баталгаажуулах
			</button>
		</div>
	</div>
</div>
