<script lang="ts">
    import { onMount } from 'svelte';
    let code: string[] = ['', '', '', ''];
    let timer = 20;
    let intervalTime: number = 20000;
    let interval : NodeJS.Timer;
  
    // Countdown timer
    onMount(() => {
      startTimer();
    });
  
    function startTimer() {
      clearInterval(intervalTime);
      timer = 20;
      interval = setInterval(() => {
        if (timer > 0) {
          timer--;
        } else {
          clearInterval(intervalTime);
        }
      }, 1000);
    }
  
    function resendCode() {
      startTimer();
      // call backend API to resend OTP
      console.log("Resend OTP...");
    }
  
    function submitCode() {
      const otp = code.join('');
      console.log("OTP Entered:", otp);
      // send OTP to backend
    }
  
    function handleInput(e: Event, index: number) {
      const input = e.target as HTMLInputElement;
      code[index] = input.value.slice(-1); // only last digit
      if (input.value && index < code.length - 1) {
        (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
      }
    }
  </script>
  
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
      <button class="absolute left-4 top-4">←</button>
      <h2 class="text-lg font-bold mb-2">Бүртгүүлэх</h2>
      <p class="text-gray-600 mb-4">
        Бид таны утас руу идэвхжүүлэх код бүхий SMS илгээсэн <br />
        <span class="font-semibold">99308877</span>
      </p>
  
      <!-- OTP inputs -->
      <div class="flex justify-center space-x-2 mb-4">
        {#each code as c, i}
          <input
            id={"otp-" + i}
            type="text"
            bind:value={code[i]}
            maxlength="1"
            class="w-12 h-12 text-center border-2 rounded-lg text-xl"
            on:input={(e) => handleInput(e, i)}
          />
        {/each}
      </div>
  
      <!-- Resend and timer -->
      <div class="flex justify-center items-center space-x-2 text-gray-600 mb-4">
        <button
          on:click={resendCode}
          class="text-blue-500 disabled:text-gray-400"
          disabled={timer > 0}
        >
          Код дахин илгээх үү
        </button>
        <span>{timer > 0 ? `00:${String(timer).padStart(2, '0')}` : ''}</span>
      </div>
  
      <!-- Continue button -->
      <button
        on:click={submitCode}
        class="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded-lg font-semibold"
      >
        Үргэлжлүүлэх
      </button>
    </div>
  </div>
  
  <style>
    input::-webkit-inner-spin-button,
    input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  </style>
  