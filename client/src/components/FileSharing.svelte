<script lang="ts">
	import { FormatFileSize } from '../lib/utils/FormatFileSize';
	import Peer from 'peerjs';
	import type { DataConnection } from 'peerjs';
	import { onMount } from 'svelte';
	import QRcode from 'qrious';
	import FaRegCopy from 'svelte-icons/fa/FaRegCopy.svelte';
	import FaExternalLinkAlt from 'svelte-icons/fa/FaExternalLinkAlt.svelte';

	export let file: FileList;
	const fileToSend = file[0];

	let senderPeerId: string = '';

	let receiverPeerId: string = '';

	let completionPercent = 0;

	let readyToShare = false;
	let startSending: any;

	onMount(() => {
		let peer: Peer = new Peer({
			host: '/',
			port: 5000
		});

		peer.on('open', function (id) {
			senderPeerId = id;
		});

		peer.on('connection', (dataConnection: DataConnection) => {
			receiverPeerId = dataConnection.peer;

			readyToShare = true;

			startSending = () => sendChunk(dataConnection);
		});

		const chunkSize = 1048576; // The size of each buffer in bytes
		let offset = 0; // The current offset in the file
		let totalSent = 0; // The total amount of data sent

		function sendChunk(dataConnection: DataConnection) {
			const chunk = fileToSend.slice(offset, offset + chunkSize);
			totalSent += chunk.size;

			completionPercent = parseFloat(((totalSent / fileToSend.size) * 100).toFixed(1));

			offset += chunkSize;

			dataConnection.send({
				file: chunk,
				filename: fileToSend.name,
				filetype: fileToSend.type,
				totalSize: fileToSend.size,
				totalSent: totalSent
			});

			if (offset < fileToSend.size) {
				setTimeout(() => {
					sendChunk(dataConnection);
				}, 0);
			}
		}
	});

	let qrCodeUrl: string;
	let qrCodeImg: typeof QRcode;
	let qrCodeEle: HTMLElement;

	onMount(() => {
		qrCodeImg = new QRcode({
			element: qrCodeEle,
			value: qrCodeUrl
		});
	});

	$: {
		qrCodeUrl = [window.location.host, senderPeerId].join('/');
		if (qrCodeImg) {
			qrCodeImg.value = qrCodeUrl;
			qrCodeImg.size = 250;
		}
	}
	$: {
		if (completionPercent) {
			document
				.getElementById('progress_btn')
				?.style.setProperty('--completionPercent', String(completionPercent) + '%');
		}
	}

	let copiedUrl = false;
</script>

<div class="w-screen flex justify-around items-center h-full max-lg:flex-col">
	<div class="p-8 mx-2 rounded-lg shadow-xl border-2 border-accent text-center">
		{#if !readyToShare}
			<h2 class="mt-2">Upload the File - {file[0].name}</h2>
		{:else if readyToShare && completionPercent === 0}
			<h2>Ready to upload - {file[0].name}</h2>
		{:else}
			<h2>Uploading - {file[0].name}</h2>
		{/if}
		<h3>File size - {FormatFileSize(file[0].size)}</h3>
		<h3>Your id: {senderPeerId}</h3>
		{#if !readyToShare}
			<br />
			<canvas class="mx-auto" bind:this={qrCodeEle} />
			<br />
			<div class="w-full flex justify-center items-center gap-3">
				<input
					type="text"
					class="input input-bordered input-primary w-3/4"
					value={qrCodeUrl}
					readonly
				/>
				<div
					class="tooltip tooltip-bottom"
					data-tip={copiedUrl ? 'Copied' : 'Copy'}
					on:mouseleave={() => {
						copiedUrl = false;
					}}
				>
					<button
						on:click={() => {
							navigator.clipboard.writeText(qrCodeUrl);
							copiedUrl = true;
						}}
						class="btn btn-outline btn-secondary p-2 w-10"
					>
						<FaRegCopy />
					</button>
				</div>
				<div class="tooltip tooltip-bottom" data-tip="Go To">
					<a href={`/${senderPeerId}`} target="_blank" rel="noopener noreferrer">
						<button class="btn btn-outline btn-secondary p-2 w-10">
							<FaExternalLinkAlt />
						</button>
					</a>
				</div>
			</div>
			<br />
		{:else}
			<h3>Receiver id: {receiverPeerId}</h3>
			{#if completionPercent === 0}
				<button on:click={startSending} class="btn btn-secondary w-1/2 mt-2">Send</button>
			{:else if completionPercent < 100}
				<button
					class="btn btn-info w-1/2 cursor-progress mt-2 relative"
					id="progress_btn"
					data-completionPercent={50}>Sending...</button
				>
			{:else}
				<button class="btn btn-success w-1/2 cursor-default mt-2">Complete</button>
			{/if}
		{/if}
	</div>
	<div class="w-4/5 lg:w-1/5">
		<h2>Now sharing your files directly from your device</h2>
		<p class="font-bold">⚠️ Please note:</p>
		<p>
			Closing this page means you stop sharing! Simply keep this page open in the background to keep
			sharing.
		</p>
	</div>
</div>

<style>
	#progress_btn {
		--completionPercent: 0%;
	}
	#progress_btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		height: 100%;
		width: var(--completionPercent);
		background-color: rgba(0, 0, 0, 0.25);
		transition: width 0.3s;
	}
</style>
