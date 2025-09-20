<script lang="ts">
    export let open: boolean = false;
    export let message: string = "Ажилттай бүртгэгдлээ";
  
    const closeModal = () => {
      open = false;
      // Optional: emit event or navigate
      console.log("Modal closed");
    };
  </script>
  
  {#if open}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
      <!-- Success Icon -->
      <div class="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-lg bg-yellow-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
  
      <!-- Message -->
      <p class="text-lg font-medium text-gray-800 mb-6">{message}</p>
  
      <!-- Finish Button -->
      <button
        on:click={closeModal}
        class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg w-full"
      >
        Дуусгах
      </button>
    </div>
  </div>
  {/if}
  