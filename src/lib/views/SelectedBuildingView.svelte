<script lang="ts">
    import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { selectedBuilding, selectBuilding } from '$lib/stores';
	import { Panel, type MapContext } from '$lib/components';
	import { getSidebarAwareMapPadding } from '$lib/helpers';

    const mapContext = getContext<MapContext>('map');
    const { map } = mapContext;

    $: loading = $selectedBuilding?.loading;
    $: building = $selectedBuilding?.building;

    // fly to building on activate
    $: {
        if (building && !loading) {
            $map.flyTo({
                center: { lat: building.lat, lng: building.lng },
                pitch: 0,
                zoom: 18,
                padding: getSidebarAwareMapPadding(),
            });
        }
    }

    const closeBuilding = () => {
        selectBuilding(null);
    }
</script>

{#if building}
    <div
        class="selected-building-view"
        in:fly={{ x: 20, duration: 500, delay: 250, easing: quintOut }}
        out:fly={{ x: 20, duration: 500, easing: quintOut }}
    >
        <Panel>
            <button on:click={closeBuilding}>
                Back
            </button>
            <h2>{building.name}</h2>
        </Panel>
    </div>
{/if}

<style>
    .selected-building-view {
        position: fixed;
        left: 2rem;
        right: 2rem;
        top: 8rem;
        display: grid;
        gap: 1rem;
    }

    @media (min-width: 640px) {
        .selected-building-view {
            right: auto;
            width: 32rem;
        }
    }
</style>
