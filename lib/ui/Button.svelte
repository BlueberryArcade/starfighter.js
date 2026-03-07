<script>
  import { createEventDispatcher } from 'svelte';
  import Spinner from 'lib/ui/Spinner.svelte';

  const dispatch = createEventDispatcher();

  export let caption = '';
  export let type = '';
  export let wait = false;
  export let disabled = false;
  export let size = 'regular';

  let waiting = false;
  $: spanClass = waiting || $$slots.default ? 'ml-2' : '';

  function onClick() {
    if (wait) {
      disabled = true;
      waiting = true;
    }
    dispatch(
      'click',
      {
        done: () => {
          disabled = false;
          waiting = false;
        }
      },
      'test'
    );
  }

  const styles = {
    primary: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    secondary: 'border-slate-200 hover:border-slate-300 text-indigo-500',
    default: 'border-slate-200 hover:border-slate-300 text-slate-600',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    info: 'bg-cyan-500 hover:bg-cyan-600 text-white',
    dark: 'bg-slate-500 hover:bg-slate-600 text-white'
  };

  const sizeStyle = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    regular: 'btn',
    lg: 'btn-lg'
  };
</script>

<button
  on:click={onClick}
  {disabled}
  class="{sizeStyle[size]} {styles[
    type
  ]} disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
>
  {#if waiting}<Spinner />{/if}
  <slot />
  {#if caption}<span class={spanClass}>{caption}</span>{/if}
</button>
