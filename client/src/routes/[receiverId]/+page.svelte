<script lang="ts">
	import type { PageData } from './$types';
	import Peer from 'peerjs';
	import { onMount } from 'svelte';
	import { FormatFileSize } from '$lib/utils/FormatFileSize';

	export let data: PageData;

	let recievedDataArr: {
		file: Blob;
		filename: string;
		filetype: string;
		totalSize: number;
		totalSent: number;
	}[] = [];

	let peer: Peer;

	let receiverPeerId: string = '';
	let senderPeerId: string = '';

	onMount(() => {
		peer = new Peer({
			host: '/',
			port: 5000
		});
		peer.on('open', function (id) {
			receiverPeerId = id;
			startPeerConnection();
		});
	});

	function startPeerConnection() {
		const dataConnection = peer.connect(data.receiverId, { reliable: true });

		senderPeerId = dataConnection.peer;

		dataConnection.on('data', (receivedData: any) => {
			recievedDataArr = [...recievedDataArr, receivedData];
		});
	}

	let progressBar: { current: number; max: number } = { current: 0, max: 1 };

	let downloadLink: string = '';

	$: {
		if (recievedDataArr && recievedDataArr.length) {
			progressBar.max = recievedDataArr[recievedDataArr.length - 1].totalSize;
			progressBar.current = recievedDataArr[recievedDataArr.length - 1].totalSent;

			if (
				recievedDataArr[recievedDataArr.length - 1].totalSent ===
				recievedDataArr[recievedDataArr.length - 1].totalSize
			) {
				const mergedData = new Blob([...recievedDataArr.map((item) => item.file)], {
					type: recievedDataArr[0].filetype
				});
				downloadLink = URL.createObjectURL(mergedData);
				const downloadAnchor = document.createElement('a');
				document.body.appendChild(downloadAnchor);
				downloadAnchor.classList.add('hidden');
				downloadAnchor.href = downloadLink;
				downloadAnchor.download = recievedDataArr[0].filename;
				downloadAnchor.click();
				URL.revokeObjectURL(downloadLink);
			}
		}
	}
</script>

<div class="flex justify-center items-center w-screen h-full">
	<div class="p-8 mx-2 rounded-lg shadow-xl border-2 border-accent text-center">
		{#if recievedDataArr.length < 1}
			<h3>Upload hasn't started yet</h3>
		{:else}
			<h2>Downloading - {recievedDataArr[0].filename}</h2>
			<h3>File size - {FormatFileSize(recievedDataArr[0].totalSize)}</h3>
		{/if}
		<h4>Your id: {receiverPeerId}</h4>
		<h4>Sender id: {senderPeerId}</h4>
		{#if progressBar.current}
			<br />
			<div class="flex items-center gap-3">
				<progress
					class="progress progress-accent w-full"
					value={progressBar.current}
					max={progressBar.max}
				/>
				<h4 class="m-0">{((progressBar.current / progressBar.max) * 100).toFixed(0)}%</h4>
			</div>
		{/if}
	</div>
</div>
