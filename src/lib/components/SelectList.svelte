<script lang="ts" context="module">
	import type { Writable } from 'svelte/store';
	export type SelectListContext = {
		valueStore: Writable<string>,
		disabledStore: Writable<boolean>,
		setValue: (value: string) => void
	};
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let label = '';
	export let value = '';

	export let required = false;
	export let disabled = false;

	let valueStore = writable('');
	$: $valueStore = value;

	let disabledStore = writable(false);
	$: $disabledStore = disabled;

	setContext<SelectListContext>('selectList', {
		valueStore,
		disabledStore,
		setValue: (v) => {
			if (disabled) return;
			value = v;
		}
	});
</script>

<div class="select-list">
	<div class="label">
		<strong>
			{label}

			{#if required}
				<span class="required">*</span>
			{/if}
		</strong>
		{#if !disabled}
			(pick one)
		{/if}
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

	.required {
		color: var(--theme-error);
	}
</style>