<script lang="ts">
	import { FormControl } from '.';

	export let label = '';
	export let placeholder = '';
	export let value = 0;
	export let name = '';
	export let disabled = false;
	export let step = '';
</script>

<FormControl {label} let:id>
	<input {id} type="number" bind:value {name} {placeholder} {disabled} {step} />
</FormControl>
