<script lang="ts">
	import { FormControl } from '.';

	export let label = '';
	export let placeholder = '';
	export let value = '';
	export let name = '';
	export let disabled = false;

	export let required = false;
</script>

<FormControl {label} let:id {required}>
	<textarea {id} bind:value {name} {placeholder} {disabled} {required}></textarea>
</FormControl>
