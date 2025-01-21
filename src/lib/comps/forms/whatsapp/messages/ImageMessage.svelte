<script>
	import { page } from '$app/stores';
	import FileUpload from '$lib/comps/ui/form/controls/file_upload/simple_file_upload.svelte';
</script>

<FileUpload label={$page.data.t.forms.fields.generic.file_upload.label()} />
