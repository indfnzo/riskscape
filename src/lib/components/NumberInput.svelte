<script lang="ts">
	import { FormControl } from '.';

	export let label = '';
	export let placeholder = '';
	export let value = 0;
	export let name = '';
	export let disabled = false;
	export let step = '';

	export let required = false;
</script>

<FormControl {label} let:id {required}>
	<input {id} type="number" bind:value {name} {placeholder} {disabled} {step} {required} />
</FormControl>
