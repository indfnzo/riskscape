<script lang="ts">
	import { FormControl } from '.';

	export let label = '';
	export let value = '';
	export let name = '';
	export let disabled = false;

	export let required = false;

	export let onChange: (value: string) => void = () => {};
</script>

<FormControl {label} let:id>
	<select {id} bind:value {name} {disabled} on:change={(evt) => onChange(evt.currentTarget.value)} {required}>
		<slot></slot>
	</select>
	<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M20 9L12 17L4 9" stroke="currentColor" stroke-linecap="square"/>
	</svg>
</FormControl>

<style>
	.icon {
		position: absolute;
		right: 0.75rem;
		top: 0.5rem;
		width: 1rem;
		height: 1rem;
		color: rgb(0 0 0 / 50%);
		pointer-events: none;
	}
</style>