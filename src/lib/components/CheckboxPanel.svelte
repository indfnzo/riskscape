<script lang="ts">
	export let checked = false;
	export let disabled = false;

	const toggle = () => {
		checked = !checked;
	}
</script>

<button type="button" class="checkbox-panel" class:checked on:click={toggle} {disabled}>
	<div class="checkbox">
		<svg class="chechmark" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M19.3136 6.34322L9.65682 17.6569L4.5 13.5" stroke="currentColor" stroke-linecap="square"/>
		</svg>
	</div>
	<div class="content">
		<slot></slot>
	</div>
</button>

<style>
	:global(.checkbox-group) {
		display: grid;
		gap: 0.5rem;
	}

	.checkbox-panel {
		position: relative;
		width: 100%;
		padding: 0;
		padding-left: 3rem;
		background: none;
		color: black;
		border: 2px solid rgb(0 0 0 / 10%);
		border-radius: 0.33rem;
		text-align: left;
		transition: all 100ms ease;
		cursor: pointer;
	}

	.checkbox-panel:hover,
	.checkbox-panel:focus {
		border-color: rgb(0 0 0 / 20%);
	}

	.checkbox-panel.checked {
		background: #213F6005;
		border-color: var(--theme-accent);
	}

	.checkbox {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		width: 1.5rem;
		height: 1.5rem;
		background: #f7f7f7;
		color: #e7e7e7;
		border-radius: 0.25rem;
		z-index: 1;
	}

	.checkbox-panel.checked .checkbox {
		background: var(--theme-accent);
		color: white;
	}

	.checkbox :global(svg) {
		display: block;
		width: 1.5rem;
		height: 1.5rem;
	}

	.content {
		display: grid;
		gap: 0.5rem;
		padding: 1rem;
	}

	.content :global(img) {
		display: block;
		max-width: 100%;
		height: auto;
	}
</style>
