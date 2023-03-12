<script lang="ts">
	import FileInput from '../components/FileInput.svelte';
	import FileSharing from '../components/FileSharing.svelte';

	let file: FileList;
	let isFileUploaded: Boolean = false;

	function handleFileInput(event: CustomEvent) {
		isFileUploaded = true;
		file = event.detail;
	}
</script>

<main class="w-full h-full">
	{#if !isFileUploaded}
		<FileInput on:fileInput={handleFileInput} />
	{:else}
		<FileSharing {file} />
	{/if}
</main>
