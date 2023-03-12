<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	let file: FileList;

	$: {
		const dispatch = createEventDispatcher();
		dispatch('fileInput', file);
	}
</script>

<div class="w-screen flex justify-around items-center h-full max-lg:flex-col">
	<div class="p-8 mx-2 rounded-lg shadow-xl border-2 border-accent">
		<h2>Upload the File</h2>
		<input
			bind:files={file}
			type="file"
			class="file-input file-input-bordered file-input-accent w-full max-w-xs"
		/>
	</div>
	<div class="w-4/5 lg:w-1/5">
		<h2>Share files privately & fast, without size limit</h2>
		<p>
			Send your files securely and fast, directly from your device without ever storing anything
			online
		</p>
		<ul>
			<li>No file size limit</li>
			<li>Lightning fast</li>
			<li>Peer to peer</li>
			<li>End to end encrypted</li>
		</ul>
	</div>
</div>
