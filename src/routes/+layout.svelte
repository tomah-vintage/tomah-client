<script>
  import '../app.css';
  import { Header } from '$lib/components/layout';
</script>

<Header />
<main class="container mx-auto p-4">
  <slot />
</main>
