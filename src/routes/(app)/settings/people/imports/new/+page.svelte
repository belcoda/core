<script lang="ts">
	import { page } from '$app/stores';
	export let data;
	import { PUBLIC_AWS_S3_USER_IMPORT_BUCKET_NAME } from '$env/static/public'; //only the bucket name is public. The bucket does not have public permissions.
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { Input, Button, superForm, valibotClient, Debug, Error } from '$lib/comps/ui/forms';
	import FileUpload from '$lib/comps/ui/form/controls/file_upload/simple_file_upload.svelte';
	import { create } from '$lib/schema/people/imports';
	const form = superForm(data.form, {
		validators: valibotClient(create),
		dataType: 'json'
	});
	const { form: formData, message, enhance } = form;
	const file_types: string[] = [
		'text/plain',
		'text/x-csv',
		'text/csv',
		'application/csv',
		'text/x-csv',
		'application/vnd.ms-excel',
		'application/x-csv',
		'text/comma-separated-values',
		'text/x-comma-separated-values',
		'text/tab-separated-values'
	];
</script>

<PageHeader title={$page.data.t.pages.config.settings.admins.new()} />

<form method="post" use:enhance class="grid grid-cols-1 gap-4 mt-6">
	<Error error={$message} />
	<FileUpload
		label="CSV File"
		description="Upload a CSV file"
		onUpload={(data) => {
			if (data.url) {
				$formData.csv_url = data.url;
			}
		}}
		fileTypes={file_types}
		bucketName={PUBLIC_AWS_S3_USER_IMPORT_BUCKET_NAME}
		siteUploadsUrl="/api/v1/people/imports/link"
	/>
	<Button type="submit" class="col-span-2">{$page.data.t.forms.buttons.submit()}</Button>
	<Debug data={$formData} />
</form>
