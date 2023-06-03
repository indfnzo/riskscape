<script lang="ts">
	export let onClick: (evt: MouseEvent) => void = () => {};
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let disabled = false;
	export let secondary = false;
</script>

<button class="button" class:secondary {type} {disabled} on:click={onClick}>
	<slot></slot>
</button>

<style>
	.button {
		display: block;
		padding: 0 1.5rem;
		background: var(--theme-accent);
		color: white;
		border: none;
		border-radius: 0.33rem;
		white-space: nowrap;
		font-weight: 600;
		line-height: 3.5rem;
		transition: all 100ms ease;
		cursor: pointer;
	}

	.button:focus {
		box-shadow: 0 0 0 2px white, 0 0 0 4px var(--theme-focus);
		outline: none;
	}

	.button.secondary {
		background: #f7f7f7;
		box-shadow: 0 0 0 1px var(--theme-accent) inset;
		color: var(--theme-accent);
	}

	.button.secondary:focus {
		box-shadow: 0 0 0 1px var(--theme-accent) inset, 0 0 0 2px white, 0 0 0 4px var(--theme-focus);
	}

	.button:disabled {
		opacity: 0.75;
	}

	.button :global(.icon) {
		float: left;
		width: 2rem;
		height: 3.5rem;
	}

	:global(.button-group) {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	:global(.button-group.right) {
		justify-content: flex-end;
	}
</style>