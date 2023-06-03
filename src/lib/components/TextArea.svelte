<script lang="ts">
	import { FormControl } from '.';

	export let label = '';
	export let placeholder = '';
	export let value = '';
	export let name = '';
	export let disabled = false;
</script>

<FormControl {label} let:id>
	<textarea {id} bind:value {name} {placeholder} {disabled}></textarea>
</FormControl>
