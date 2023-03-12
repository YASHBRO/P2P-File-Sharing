<script>
	import '../app.css';
	import AppNavBar from '../components/AppNavBar.svelte';
	import { AppThemeStore } from '../store/ThemeStore';
</script>

<svelte:head>
	<title>P2P File Sharing</title>
</svelte:head>
<div class="flex flex-col h-screen prose max-w-none" data-theme={$AppThemeStore}>
	<AppNavBar />
	<slot />
</div>
