<script lang="ts">
	import { onDestroy } from 'svelte';

	import { AppThemeStore } from '../store/ThemeStore';

	import FaRegMoon from 'svelte-icons/fa/FaRegMoon.svelte';
	import FaRegSun from 'svelte-icons/fa/FaRegSun.svelte';

	let currentTheme: string;

	const unsubTheme = AppThemeStore.subscribe((value) => {
		currentTheme = value;
	});

	function handleChangeTeme() {
		AppThemeStore.update((val) => (val === 'winter' ? 'synthwave' : 'winter'));
	}

	onDestroy(() => {
		unsubTheme();
	});
</script>

<div class="navbar shadow bg-secondary text-secondary-content z-50">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-3xl" href="/">P2P File Share</a>
	</div>
	<div class="flex-none">
		<button class="btn btn-accent py-2" on:click={handleChangeTeme}>
			{#if currentTheme === 'winter'}
				<FaRegSun />
			{:else}
				<FaRegMoon />
			{/if}
		</button>
	</div>
</div>
