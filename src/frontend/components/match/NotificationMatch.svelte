<script lang="ts">
    import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
    import Util from '$lib/logic/frontend/generic/Util';

	export let message;
</script>

{#if message}
    <div 
        class="host-message is-size-6 nes-text" 
        in:fly={{ duration: 1000, x: 0, y: -40, easing: quintOut }}
    >
        {message}
    </div>
{/if}

<style lang="scss">

</style>
