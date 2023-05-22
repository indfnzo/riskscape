<script lang="ts">
	export let label = '';
	export let placeholder = '';
	export let value = '';
	export let name = '';
</script>

<div class="form-control" class:has-label={label}>
	{#if label}
		<label for="">{label}</label>
	{/if}
	<input type="text" bind:value {name} {placeholder} />
</div>

<style>
	.form-control {
		display: block;
		position: relative;
	}

	label {
		position: absolute;
		left: 0.75rem;
		top: 0.5rem;
		font-size: 0.8rem;
		font-weight: 700;
		z-index: 1;
		pointer-events: none;
	}

	input {
		display: block;
		appearance: none;
		width: calc(100% - 1.5rem);
		padding: 0 0.75rem;
		height: 3.5rem;
		background: none;
		border: none;
		outline: 1px solid rgb(0 0 0 / 25%);
		border-radius: 0.25rem;
		transition: all 100ms ease;
	}

	input:focus {
		border-color: var(--theme-focus);
		outline: 2px solid var(--theme-focus);
	}

	.form-control.has-label input {
		padding-top: 1.25rem;
		height: 2.25rem;
	}
</style>
