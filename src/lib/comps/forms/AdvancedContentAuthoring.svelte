<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { page } from '$app/stores';
	import H2 from '$lib/comps/typography/H2.svelte';
	import H3 from '$lib/comps/typography/H3.svelte';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import Collapsible from '$lib/comps/ui/custom/collapsible/collapsible.svelte';
	import * as m from '$lib/paraglide/messages';
	import {
		superForm,
		valibotClient,
		Grid,
		Input,
		Textarea,
		Checkbox,
		Code,
		Switch,
		Error,
		Debug,
		Button
	} from '$lib/comps/ui/forms';
	import { update as updateEvent } from '$lib/schema/events/events';
	import { update as updatePetition } from '$lib/schema/petitions/petitions';
	import { update as updateContent } from '$lib/schema/website/content';
	const { type, actionUrl }: { type: 'petition' | 'event' | 'content'; actionUrl: string } =
		$props();
	const schema = {
		petition: updatePetition,
		event: updateEvent,
		content: updateContent
	};
	const form = superForm($page.data.form, {
		validators: valibotClient(schema[type]),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;
</script>

<form method="post" action={actionUrl} use:enhance>
	<Grid cols={1}>
		<Error error={$message} />
		{#if type === 'petition' || type === 'event'}
			<Collapsible class="mb-4">
				{#snippet trigger()}
					<div class="text-xl">
						{m.plane_patient_porpoise_prosper()}
					</div>
				{/snippet}
				<Grid cols={1}>
					<Grid cols={2} class="border rounded p-4">
						<Checkbox
							{form}
							name="ask_email"
							label={m.bright_long_ant_breathe()}
							bind:checked={$formData.ask_email}
						/>
						<Checkbox
							{form}
							name="require_email"
							label={m.green_ago_newt_find()}
							bind:checked={$formData.require_email}
						/>
					</Grid>
					<Grid cols={2} class="border rounded p-4">
						<Checkbox
							{form}
							name="ask_phone_number"
							label={m.long_shy_ocelot_kick()}
							bind:checked={$formData.ask_phone_number}
						/>
						<Checkbox
							{form}
							name="require_phone_number"
							label={m.strong_ago_shad_pull()}
							bind:checked={$formData.require_phone_number}
						/>
					</Grid>
					<Grid cols={2} class="border rounded p-4">
						<Checkbox
							{form}
							name="ask_address"
							label={m.polite_red_martin_hike()}
							bind:checked={$formData.ask_address}
						/>
						<Checkbox
							{form}
							name="require_address"
							label={m.topical_mealy_koala_roar()}
							bind:checked={$formData.require_address}
						/>
					</Grid>
					<Grid cols={2} class="border rounded p-4">
						<Checkbox
							{form}
							name="ask_postcode"
							label={m.knotty_ago_cod_launch()}
							bind:checked={$formData.ask_postcode}
						/>
						<Checkbox
							{form}
							name="require_postcode"
							label={m.bad_royal_stork_endure()}
							bind:checked={$formData.require_postcode}
						/>
					</Grid>
				</Grid>
			</Collapsible>
		{/if}
		<Collapsible class="mb-4">
			{#snippet trigger()}
				<div class="text-xl">{m.agent_jumpy_warthog_spark()}</div>
			{/snippet}
			<Grid cols={1}>
				<div class="justify-end">
					<Switch
						{form}
						name="html_metatags.isManuallySet"
						label={m.factual_moving_raven_flow()}
						description={m.gray_trite_marten_sew()}
						bind:checked={$formData.html_metatags.isManuallySet}
					/>
				</div>
				<Input
					{form}
					name="html_metatags.title"
					label={m.elegant_neat_sawfish_spark()}
					description={m.long_true_weasel_seek()}
					bind:value={$formData.html_metatags.title as string}
				/>
				<Textarea
					{form}
					name="html_metatags.description"
					label={m.loved_sound_tortoise_persist()}
					description={m.alert_mild_ox_create()}
					bind:value={$formData.html_metatags.description as string}
				/>
				<Input
					{form}
					name="html_metatags.subject"
					label={m.quiet_extra_tortoise_boost()}
					description={m.mellow_extra_lynx_treasure()}
					bind:value={$formData.html_metatags.subject as string}
				/>
				<Input
					{form}
					name="html_metatags.keywords"
					label={m.clear_proud_warthog_stab()}
					description={m.ideal_left_jackal_aim()}
					bind:value={$formData.html_metatags.keywords as string}
				/>
				<Input
					{form}
					name="html_metatags.openGraph.title"
					label={m.that_witty_wolf_quiz()}
					description={m.misty_short_cockroach_trim()}
					bind:value={$formData.html_metatags.openGraph.title as string}
				/>
				<Input
					{form}
					name="html_metatags.openGraph.description"
					label={m.full_extra_newt_tear()}
					description={m.even_happy_ox_rise()}
					bind:value={$formData.html_metatags.openGraph.description as string}
				/>
				<Input
					{form}
					name="html_metatags.openGraph.image"
					label={m.inner_fuzzy_chicken_jest()}
					description={m.loud_watery_cougar_trim()}
					bind:value={$formData.html_metatags.openGraph.image as string}
				/>
				<Input
					{form}
					name="html_metatags.openGraph.image_alt"
					label={m.actual_nice_lark_cry()}
					description={m.suave_alert_flea_drop()}
					bind:value={$formData.html_metatags.openGraph.image_alt as string}
				/>
			</Grid>
		</Collapsible>
		<Collapsible class="mb-4">
			{#snippet trigger()}
				<div class="text-xl">{m.wacky_safe_mule_revive()}</div>
			{/snippet}
			<Grid cols={1}>
				<Code
					{form}
					name="custom_code.custom_css"
					label={m.sea_tasty_manatee_attend()}
					options={{
						language: 'css',
						lineNumbers: true,
						value: $formData.custom_code.custom_css as string
					}}
					bind:value={$formData.custom_code.custom_css as string}
				/>
				<Code
					{form}
					name="custom_code.custom_js"
					label={m.sad_gross_seahorse_care()}
					options={{
						language: 'js',
						lineNumbers: true,
						value: $formData.custom_code.custom_js as string
					}}
					bind:value={$formData.custom_code.custom_js as string}
				/>
				<Code
					{form}
					name="custom_code.custom_html_head"
					label={m.bold_civil_clownfish_zip()}
					bind:value={$formData.custom_code.custom_html_head as string}
				/>
				<Code
					{form}
					name="custom_code.custom_html_body"
					label={m.zesty_front_tapir_trip()}
					bind:value={$formData.custom_code.custom_html_body as string}
				/>
			</Grid>
		</Collapsible>

		<Button>{m.just_away_horse_urge()}</Button>
		<Debug data={$formData} />
	</Grid>
</form>
