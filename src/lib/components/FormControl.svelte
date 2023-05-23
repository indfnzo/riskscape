<script lang="ts">
	import { generateId } from '$lib/helpers';

	export let label = '';

	const id = generateId('form-control');
</script>

<div class="form-control" class:has-label={label}>
	{#if label}
		<label for={id}>{label}</label>
	{/if}
	<slot {id}></slot>
</div>

<style>
	.form-control {
		display: block;
		position: relative;
		width: 100%;
	}

	/* label styles */

	.form-control :global(label) {
		position: absolute;
		left: 0.75rem;
		top: 0.5rem;
		font-size: 0.8rem;
		font-weight: 700;
		z-index: 1;
		pointer-events: none;
	}

	.form-control.has-label :global(input),
	.form-control.has-label :global(select) {
		padding-top: 1.25rem;
		line-height: 2.25rem;
	}

	/* field styles */

	.form-control :global(input),
	.form-control :global(select) {
		display: block;
		appearance: none;
		width: calc(100% - 1.5rem);
		padding: 0 0.75rem;
		margin: 0;
		line-height: 3.5rem;
		background: none;
		border: none;
		outline: 1px solid rgb(0 0 0 / 25%);
		border-radius: 0.25rem;
		transition: all 100ms ease;
	}

	/* handle weird select padding difference & other css */
	.form-control :global(select) {
		width: 100%;
	}

	.form-control :global(select[value=""]) {
		color: rgb(0 0 0 / 50%);
	}

	/* focus styles */

	.form-control :global(input:focus),
	.form-control :global(select:focus) {
		border-color: var(--theme-focus);
		outline: 2px solid var(--theme-focus);
	}

	/* disabled styles */

	.form-control :global(input:disabled),
	.form-control :global(select:disabled) {
		background: rgb(0 0 0 / 2.5%);
	}

	.form-control:has(input:disabled) :global(label),
	.form-control:has(select:disabled) :global(label) {
		opacity: 0.5;
	}
</style>
