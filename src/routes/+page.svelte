<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  export let data;

  onMount(() => {
    const saved = localStorage.getItem('starfighter:lastPath');
    goto(saved || data.defaultPath || '/', { replaceState: true });
  });
</script>
