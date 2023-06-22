<script lang="ts">
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
    import { NewBuildingModal } from '$lib/components';
    import { selectedBuilding } from '$lib/stores';
</script>

<section class="new-building-view">
    <NewBuildingModal let:modal>
        {#if !$selectedBuilding}
            <button
                class="expand-button"
                on:click={modal.open}
                title="Submit New Building Record"
                transition:scale|local={{ duration: 250, easing: quintOut }}
            >
                <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12H20" stroke="currentColor" stroke-linecap="square"/>
                    <path d="M12 4L12 20" stroke="currentColor" stroke-linecap="square"/>
                </svg>
            </button>
        {/if}
    </NewBuildingModal>
</section>

<style>
    .expand-button {
        position: fixed;
        right: 2rem;
        bottom: 4rem;
        width: 4rem;
        height: 4rem;

        display: flex;
        align-items: center;
        justify-content: center;

        appearance: none;
        background: white;
        border: none;
        border-radius: 5rem;
        cursor: pointer;
        transition: background 100ms ease;
    }

    .expand-button:hover {
        background: #f0f0f0;
    }

    .icon {
        width: 2rem;
        height: 2rem;
    }
</style>
