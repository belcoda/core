<script lang="ts">
	// This is a simple image upload component.
	// It directly uploads an image to the designated S3 bucket and returns the URL.
	// It cann be used as the basis for more complicated file upload components.
	const DEFAULT_FILE_TYPES: string[] = [
		'image/png',
		'image/jpeg',
		'image/jpg',
		'image/gif',
		'image/webp',
		'image/svg+xml'
	];
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/comps/ui/button/button.svelte';
	const MAXIMUM_FILE_SIZE: number = 10485760; //~10mb
	import { cn } from '$lib/utils';
	import { PUBLIC_AWS_S3_SITE_UPLOADS_BUCKET_NAME } from '$env/static/public';
	import { page } from '$app/stores';

	let {
		onUpload,
		fileTypes = DEFAULT_FILE_TYPES,
		maxSize = MAXIMUM_FILE_SIZE,
		label,
		description,
		value = $bindable(),
		class: className,
		bucketName = PUBLIC_AWS_S3_SITE_UPLOADS_BUCKET_NAME,
		siteUploadsUrl = '/api/v1/website/uploads/link',
		onResetUploads
	}: {
		onUpload?: ({
			url,
			type,
			size,
			fileName
		}: {
			url: string;
			type: string;
			size: number;
			fileName: string;
		}) => void;
		fileTypes?: string[];
		maxSize?: number;
		label?: string;
		description?: string;
		value?: string | null;
		class?: string;
		bucketName?: string;
		siteUploadsUrl?: string;
		onResetUploads?: () => void;
	} = $props();

	import Loader from 'lucide-svelte/icons/loader';
	import CheckCircle from 'lucide-svelte/icons/circle-check';
	import Input from '$lib/comps/ui/input/input.svelte';
	import * as Alert from '$lib/comps/ui/alert';
	import AlertTriangle from 'lucide-svelte/icons/triangle-alert';
	import X from 'lucide-svelte/icons/x';
	import { v4 as uuidv4 } from 'uuid';

	import {
		getAndCheckFile,
		renameFile,
		getSignedURL,
		uploadToS3
	} from '$lib/comps/ui/form/controls/file_upload/upload';
	const file_upload_widget_id = uuidv4();

	const bucket_url = `https://${bucketName}.s3.amazonaws.com`;

	const acceptable_file_types = fileTypes.join(', ');

	let loading = $state(false);
	let error: string | null = $state(null);
	let disabled = $state(false);
	let success = $state(false);

	async function handleUpload() {
		try {
			//reset
			error = null;
			value = null;
			success = false;
			//start process
			disabled = true;
			loading = true;
			const input = document.getElementById(file_upload_widget_id) as HTMLInputElement;
			const file = getAndCheckFile({
				fileInput: input,
				t: $page.data.t,
				maxFileSize: maxSize,
				allowedTypes: fileTypes
			});
			const fileToUpload = await renameFile(file);

			const signedURL = await getSignedURL(fileToUpload, siteUploadsUrl, $page.data.t);

			const awsPathName = await uploadToS3({
				file: fileToUpload,
				signedURL: signedURL,
				t: $page.data.t
			});
			const uploadedUrl = `${bucket_url}${awsPathName}`; //this is the URL to the uploaded file, no / needed
			if (onUpload)
				onUpload({ url: uploadedUrl, type: file.type, size: file.size, fileName: file.name });
			value = uploadedUrl;
			success = true;
		} catch (err) {
			error = err instanceof Error ? err.message : m.heavy_true_lark_amaze();
			console.error(err);
		} finally {
			disabled = false;
			loading = false;
		}
	}

	function resetUploads() {
		value = null;
		success = false;
		error = null;
		disabled = false;
		loading = false;
		const input = document.getElementById(file_upload_widget_id) as HTMLInputElement;
		//remove files from input file list
		if (input) {
			input.value = '';
		}
		if (onResetUploads) onResetUploads();
	}
</script>

{#if value}
	<div class="relative">
		<div class="absolute right-2 top-2 opacity-60 hover:opacity-100">
			<Button variant="destructive" size="xs" class="text-white" onclick={resetUploads}
				><X /></Button
			>
		</div>
		<img src={value} alt="Uploaded file" class="contain rounded-lg object-cover" />
	</div>
{:else}
	{#if label}<label
			class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			for={file_upload_widget_id}>{label}</label
		>{/if}

	<div class="flex items-center gap-2">
		<Input
			onchange={handleUpload}
			{disabled}
			accept={acceptable_file_types}
			class={cn(
				className,
				'block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
			)}
			aria-describedby="file_input_help"
			id={file_upload_widget_id}
			type="file"
		/>
		{#if loading}<Loader class="animate animate-spin" />{/if}
		{#if success}<CheckCircle />{/if}
	</div>
	{#if description}
		<p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
			{description}
		</p>
	{/if}

	{#if error}
		<Alert.Root variant="destructive" class="mt-1">
			<AlertTriangle class="h-4 w-4" />
			<Alert.Title>{m.teary_dizzy_earthworm_urge()}</Alert.Title>
			<Alert.Description>
				{error}
			</Alert.Description>
		</Alert.Root>
	{/if}
{/if}
