<script lang="ts">
	import { getContext } from 'svelte';
	import type { SelectListContext } from './SelectList.svelte';

	const context = getContext<SelectListContext>('selectList');
	const currentValue = context.valueStore;

	export let value = '';
	export let title = '';

	const setValue = () => {
		context.setValue(value);
	}
</script>

<button type="button" class="select-list-item" class:active={$currentValue === value} on:click={setValue}>
	<div class="image">
		<slot name="image"></slot>
	</div>
	<div class="content">
		<div class="title"><slot name="title">{title}</slot></div>
		<div class="description"><slot></slot></div>
	</div>
</button>

<style>
	.select-list-item {
		display: grid;
		grid-template-columns: 4rem 1fr;
		padding: 0;
		background: none;
		color: black;
		border: 2px solid rgb(0 0 0 / 10%);
		border-radius: 0.33rem;
		text-align: left;
		transition: all 100ms ease;
		cursor: pointer;
	}

	.select-list-item:hover,
	.select-list-item:focus {
		border-color: rgb(0 0 0 / 20%);
	}

	.select-list-item.active {
		background: #213F6005;
		border-color: var(--theme-accent);
	}

	.select-list-item.active .title {
		color: var(--theme-accent);
	}

	.image {
		padding: 0.75rem;
		padding-right: 0.25rem;
	}

	.image :global(img),
	.image :global(svg) {
		display: block;
		max-width: 100%;
		height: auto;
	}

	.content {
		display: grid;
		gap: 0.5rem;
		padding: 1rem;
	}

	.title {
		font-weight: 700;
	}

	.description {
		font-size: 0.9rem;
	}
</style>
