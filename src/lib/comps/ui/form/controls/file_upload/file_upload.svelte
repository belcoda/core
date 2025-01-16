<script lang="ts">
	import { PUBLIC_AWS_S3_SITE_UPLOADS_BUCKET_NAME } from '$env/static/public';
	import { page } from '$app/stores';
	import readable_file_size from '$lib/comps/ui/form/controls/file_upload/readable_file_size';
	import * as Alert from '$lib/comps/ui/alert';
	import Loader from 'lucide-svelte/icons/loader';
	import CheckCircle from 'lucide-svelte/icons/circle-check';
	import Input from '$lib/comps/ui/input/input.svelte';
	import { cn } from '$lib/utils';
	import AlertTriangle from 'lucide-svelte/icons/triangle-alert';
	const file_upload_widget_id = crypto.randomUUID();
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let label: string | null = null;
	export let description: string | null = null;

	export let maximum_file_size: number = 10485760; //~10mb
	export let file_types: string[] = [
		'image/png',
		'image/jpeg',
		'image/jpg',
		'image/gif',
		'image/webp',
		'image/svg+xml'
	];
	export let site_uploads_url: string = '/api/v1/website/uploads/link';
	export let bucket_name = PUBLIC_AWS_S3_SITE_UPLOADS_BUCKET_NAME;
	export let url: string | null | undefined = undefined;
	//export let upload_id: string | null | undefined = undefined;
	export let uploaded_file_name: string | null | undefined = undefined;

	const acceptable_file_types = file_types.join(', ');
	const bucket_url = `https://${bucket_name}.s3.amazonaws.com`;
	const file_name_prefix: string = crypto.randomUUID();

	let loading = false;
	let className = '';
	export { className as class };
	let error: string | null = null;
	let disabled = false;
	let success = false;
	async function handleUpload(ev: Event) {
		try {
			//reset
			loading = true;
			disabled = true;
			error = null;
			success = false;

			//process
			const files = (<HTMLInputElement>ev.target).files;
			if (!files) throw new Error($page.data.t.errors.file_upload.no_file_selected());

			const latest_file = files[files.length - 1];
			function isBigger(a: number, b: number) {
				return Math.sign(a - b) === 1; // Returns true if a is bigger than b
			}
			const fileSizeBigger = isBigger(latest_file.size, maximum_file_size);
			if (fileSizeBigger) {
				throw new Error(
					$page.data.t.errors.file_upload.too_large(readable_file_size(maximum_file_size))
				);
			}

			if (file_types.includes(latest_file.type) !== true) {
				new Error($page.data.t.errors.file_upload.unsupported_type(acceptable_file_types));
			}
			const file_name = latest_file.name;
			const uploadFileName = file_name_prefix + '-' + file_name;
			const file_to_upload = new File([latest_file], uploadFileName, {
				type: latest_file.type
			});

			//get a signed url from the server
			const push_file_request_response = await fetch(site_uploads_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					file_name: uploadFileName
				})
			});
			if (!push_file_request_response.ok)
				throw new Error($page.data.t.errors.file_upload.upload_error());
			const push_file_request_body = await push_file_request_response.json();
			const put_url = push_file_request_body.put_url;

			//upload the file to the signed url
			const aws_response = await fetch(put_url, {
				method: 'put',
				body: file_to_upload
			});
			if (!aws_response.ok) {
				console.log('file upload failed');
				console.log(await aws_response.text());
				throw new Error($page.data.t.errors.file_upload.upload_error());
			} else {
				console.log('file uploaded');
				console.log(file_to_upload.size);
				console.log(await aws_response.text());
			}

			url = `${bucket_url}${new URL(aws_response.url).pathname}`;
			uploaded_file_name = file_name;
			loading = false;
			success = true;
			dispatch('uploaded', {
				url,
				file_name: uploaded_file_name,
				mimeType: latest_file.type,
				size: latest_file.size
			});
		} catch (err) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'An error occurred';
			}
			disabled = false;
			success = false;
			loading = false;
		}
	}
</script>

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
			'block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400',
			className
		)}
		aria-describedby="file_input_help"
		id="file_input"
		type="file"
	/>
	{#if loading}<Loader class="animate animate-spin" />{/if}
	{#if success}<CheckCircle />{/if}
</div>
{#if description}
	<p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id={file_upload_widget_id}>
		{description}
	</p>
{/if}

{#if error}
	<Alert.Root variant="destructive" class="mt-1">
		<AlertTriangle class="h-4 w-4" />
		<Alert.Title>{$page.data.t.errors.generic()}</Alert.Title>
		<Alert.Description>
			{error}
		</Alert.Description>
	</Alert.Root>
{/if}
