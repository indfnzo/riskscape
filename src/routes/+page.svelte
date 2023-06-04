<script lang="ts">
	import { get } from 'svelte/store';
	import { MapView } from '$lib/components';
    import { HeaderView, BuildingsSearchView, SelectedBuildingView, NewBuildingView } from '$lib/views';
    import { selectedBuilding } from '$lib/stores';

    let satellite = false;
</script>

<MapView fullscreen let:map>
    <HeaderView />
    <SelectedBuildingView />
    <BuildingsSearchView />
    <NewBuildingView />
    {#if !$selectedBuilding}
        <button class="map-control" class:active={satellite} on:click={() => {
            const m = get(map);
            m.setLayoutProperty('mapbox-satellite', 'visibility', satellite ? 'none' : 'visible');
            satellite = !satellite;
        }}>
            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 9L12 5L20 9L12 13L4 9Z" stroke="currentColor"/>
                <path d="M4 12L12 16L20 12" stroke="currentColor"/>
                <path d="M4 15L12 19L20 15" stroke="currentColor"/>
            </svg>
        </button>
    {/if}
    <div class="map-overlay"></div>
</MapView>

<style>
    .map-overlay {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 12rem;
        background: linear-gradient(
            to top,
            rgb(26 26 26 / 75%),
            rgb(26 26 26 / 0%)
        );
        z-index: -1;
        pointer-events: none;
    }

    .map-control {
        position: fixed;
        left: 2rem;
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
        transition: all 100ms ease;
    }

    .map-control.active {
        background: black;
        color: white;
    }

    .map-control .icon {
        width: 2rem;
        height: 2rem;
    }
</style>
