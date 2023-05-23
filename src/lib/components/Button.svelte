<script lang="ts">
	export let onClick: (evt: MouseEvent) => void = () => {};
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let disabled = false;
</script>

<button class="button" {type} {disabled} on:click={onClick}>
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

	.button:disabled {
		opacity: 0.75;
	}
</style>