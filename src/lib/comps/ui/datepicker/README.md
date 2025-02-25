# DatePicker Component

A customizable date picker component with optional time picker functionality.

## Features

- Date selection with calendar
- Optional time picker
- Customizable formatting
- Keyboard accessible
- Mobile-friendly

## Basic Usage

```svelte
<script>
	import { DatePicker } from '$lib/comps/ui/datepicker';
	import { CalendarDate } from '@internationalized/date';

	let selectedDate = null;
</script>

<DatePicker bind:date={selectedDate} />
```

## With Time Picker

```svelte
<script>
	import { DatePicker } from '$lib/comps/ui/datepicker';
	import { CalendarDate } from '@internationalized/date';

	let selectedDate = null;
	let selectedTime = '12:00';
</script>

<DatePicker bind:date={selectedDate} bind:time={selectedTime} includeTime={true} />
```

## Props

| Prop          | Type                   | Default         | Description                         |
| ------------- | ---------------------- | --------------- | ----------------------------------- |
| `date`        | `CalendarDate \| null` | `null`          | The selected date                   |
| `time`        | `string \| null`       | `null`          | The selected time (HH:MM format)    |
| `includeTime` | `boolean`              | `false`         | Whether to include a time picker    |
| `format`      | `string`               | `"yyyy-MM-dd"`  | Date format (not fully implemented) |
| `placeholder` | `string`               | `"Select date"` | Input placeholder text              |
| `disabled`    | `boolean`              | `false`         | Whether the input is disabled       |
| `required`    | `boolean`              | `false`         | Whether the input is required       |
| `name`        | `string`               | `""`            | Form input name                     |
| `class`       | `string`               | `""`            | Additional CSS classes              |

## Examples

### Form Usage

```svelte
<form on:submit|preventDefault={handleSubmit}>
	<div class="space-y-4">
		<div>
			<label for="appointment-date" class="block text-sm font-medium">
				Appointment Date & Time
			</label>
			<DatePicker
				bind:date={appointmentDate}
				bind:time={appointmentTime}
				includeTime={true}
				name="appointment"
				placeholder="Select appointment date & time"
				required
			/>
		</div>

		<button type="submit" class="btn btn-primary"> Schedule Appointment </button>
	</div>
</form>
```

### Custom Styling

```svelte
<DatePicker bind:date={selectedDate} class="border-primary" />
```
