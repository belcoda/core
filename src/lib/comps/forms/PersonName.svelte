<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	import {
		formFieldProxy,
		type SuperForm,
		type FormPathLeaves,
		type FormPathType
	} from 'sveltekit-superforms';

	import type { SupportedCountry } from '$lib/i18n';

	type Props = {
		form: SuperForm<T>;
		given_name: FormPathLeaves<T>;
		given_name_alt: FormPathLeaves<T>;
		family_name: FormPathLeaves<T>;
		family_name_alt: FormPathLeaves<T>;
		full_name: FormPathLeaves<T>;
		preferred_name: FormPathLeaves<T>;
		country: SupportedCountry;
	};
	let {
		form,
		given_name,
		given_name_alt,
		family_name,
		family_name_alt,
		full_name,
		preferred_name,
		country
	}: Props = $props();

	let { value: givenName } = formFieldProxy(form, given_name);
	let { value: givenNameAlt } = formFieldProxy(form, given_name_alt);
	let { value: familyName } = formFieldProxy(form, family_name);
	let { value: familyNameAlt } = formFieldProxy(form, family_name_alt);
	let { value: fullName } = formFieldProxy(form, full_name);
	let { value: preferredName } = formFieldProxy(form, preferred_name);

	import { Input, Grid } from '$lib/comps/ui/forms';
	const JP_FORM_TYPES: SupportedCountry[] = ['jp'];
	const WESTERN_FORM_TYPES: SupportedCountry[] = ['us'];

	let generatedFullName = $derived.by(() => {
		if (JP_FORM_TYPES.includes(country)) {
			return `${$familyName}${$givenName}`;
		}
		return `${$givenName} ${$familyName}`;
	});
</script>

{#if JP_FORM_TYPES.includes(country)}
	<Grid cols={1} class="mt-6">
		<Grid cols={2}>
			<Input
				{form}
				name={family_name}
				oninput={() => {
					//@ts-expect-error
					$fullName = generatedFullName;
				}}
				label={m.less_plane_lionfish_lift()}
				bind:value={$familyName as string}
			/>
			<Input
				{form}
				oninput={() => {
					//@ts-expect-error
					$fullName = generatedFullName;
				}}
				name={given_name}
				label={m.game_quiet_swan_spark()}
				bind:value={$givenName as string}
			/>

			<Input
				{form}
				name={family_name_alt}
				label={m.low_mean_frog_accept()}
				bind:value={$familyNameAlt as string}
			/><Input
				{form}
				name={given_name_alt}
				label={m.still_legal_stingray_urge()}
				bind:value={$givenNameAlt as string}
			/>
		</Grid>
		<Input type="hidden" {form} name={full_name} label={null} value={generatedFullName} />
	</Grid>
{:else}
	<Grid cols={1}>
		<Grid cols={2}>
			<Input
				{form}
				oninput={() => {
					//@ts-expect-error
					$fullName = generatedFullName;
				}}
				name={given_name}
				label={m.pink_fair_mantis_drum()}
				bind:value={$givenName as string}
			/>
			<Input
				{form}
				name={family_name}
				oninput={() => {
					//@ts-expect-error
					$fullName = generatedFullName;
				}}
				label={m.gross_long_husky_dine()}
				bind:value={$familyName as string}
			/>
		</Grid>
		<input hidden name={full_name} value={generatedFullName} />
	</Grid>
{/if}
