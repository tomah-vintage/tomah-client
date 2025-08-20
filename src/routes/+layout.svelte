<script>
  import '../app.css';
  import { Header, Footer } from '$lib/components/layout';
</script>

<div class="flex flex-col min-h-screen">
  <Header />
  <main class="container mx-auto p-4 flex-grow">
    <slot />
  </main>
  <Footer />
</div>
