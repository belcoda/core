<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { setLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	import {
		Button,
		Error,
		Select,
		Grid,
		Debug,
		superForm,
		valibotClient,
		type Infer
	} from '$lib/comps/ui/forms';
	import { type SuperValidated } from 'sveltekit-superforms';
	import { update } from '$lib/schema/core/instance';
	import { type SupportedLanguage } from '$lib/i18n';
	const items: { value: SupportedLanguage; label: string }[] = [
		{ value: 'en', label: 'English' },
		{ value: 'ja', label: '日本語' },
		{ value: 'pt', label: 'Português' },
		{ value: 'es', label: 'Español' },
		{ value: 'fr', label: 'Français' },
		{ value: 'sw', label: 'Kiswahili' },
		{ value: 'th', label: 'ไทย' },
		{ value: 'zh', label: '中文' }
	];
	const selected = items.find((o) => o.value === $page.data.instance.language);

	type Props = {
		superform: SuperValidated<Infer<typeof update>>;
	};
	const { superform }: Props = $props();

	const form = superForm(superform, {
		validators: valibotClient(update),
		dataType: 'json',
		onSubmit: async () => {
			if ($formData.language) {
				setLocale($formData.language);
			}
		}
	});
	const { form: formData, enhance, message } = form;
</script>

<form method="post" use:enhance>
	<Grid cols={1}>
		<Error error={$message}></Error>
		<div class="flex items-center gap-4">
			<div class="flex-grow">
				<Select
					label={m.watery_such_jackal_flow()}
					{form}
					name="language"
					options={items}
					bind:value={$formData.language as string}
				/>
			</div>
			<Button type="submit" class="mt-3" />
		</div>
		<Debug data={$formData}></Debug>
	</Grid>
</form>
