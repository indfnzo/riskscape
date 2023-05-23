<script lang="ts">
	import { FormControl } from '.';

	export let label = '';
	export let value = '';
	export let name = '';
	export let disabled = false;
</script>

<FormControl {label} let:id>
	<select {id} bind:value {name} {disabled}>
		<slot></slot>
	</select>
</FormControl>
