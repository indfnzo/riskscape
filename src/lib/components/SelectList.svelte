<script lang="ts" context="module">
	import type { Writable } from 'svelte/store';
	export type SelectListContext = {
		valueStore: Writable<string>,
		setValue: (value: string) => void
	};
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let label = '';
	export let value = '';

	let valueStore = writable('');
	$: $valueStore = value;

	setContext<SelectListContext>('selectList', {
		valueStore,
		setValue: (v) => {
			value = v;
		}
	});
</script>

<div class="select-list">
	<div class="label">
		<strong>{label}</strong>
		(pick one)
	</div>
	<slot></slot>
</div>

<style>
	.select-list {
		display: grid;
		gap: 0.5rem;
	}

	.label {
		font-size: 0.8rem;
		font-weight: 500;
		color: rgb(0 0 0 / 50%);
	}

	.label strong {
		font-weight: 700;
		color: black;
	}
</style>