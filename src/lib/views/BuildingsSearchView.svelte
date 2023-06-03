<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { buildingsSearchState, searchBuildings, selectedBuilding, selectBuilding } from '$lib/stores';

    $: searchActive = $buildingsSearchState.active;
    $: activeSearchQuery = $buildingsSearchState.searchQuery;
    $: filteredBuildings = $buildingsSearchState.results;

    let value = '';
    $: query = value.trim();
</script>

{#if !$selectedBuilding}
    <section
        class="buildings-search-view"
        in:fly={{ x: -20, duration: 500, delay: 250, easing: quintOut }}
        out:fly={{ x: -20, duration: 500, easing: quintOut }}
    >
        <form class="buildings-search" on:submit|preventDefault={() => searchBuildings(query)}>
            <input type="text" name="search" placeholder={searchActive ? activeSearchQuery : 'Search buildings...'} bind:value={value} />
            <button type="submit" class="search-button" disabled={!searchActive && query.length === 0}>
                {#if query}
                    <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12H20M20 12L12 4M20 12L12 20" stroke="currentColor" stroke-linecap="square"/>
                    </svg>
                {:else if searchActive}
                    <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.34326 6.34314L17.657 17.6568" stroke="currentColor" stroke-linecap="square"/>
                        <path d="M17.6567 6.34314L6.34303 17.6568" stroke="currentColor" stroke-linecap="square"/>
                    </svg>
                {:else}
                    <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10.5" cy="10.5" r="8.5" stroke="currentColor"/>
                        <path d="M22 22L16.5 16.5" stroke="currentColor"/>
                    </svg>
                {/if}
            </button>
        </form>

        {#if searchActive}
            <div class="search-results-container">
                <div class="label">
                    {#if filteredBuildings.length > 0}
                        Showing {filteredBuildings.length} result{filteredBuildings.length > 1 ? 's' : ''} for "{activeSearchQuery}":
                    {:else}
                        No records found.
                    {/if}
                </div>
                <div class="search-results">
                    {#each filteredBuildings as bldg}
                        <button class="search-result-button" on:click={() => {selectBuilding(bldg.building)}}>
                            <div class="content">
                                <div class="name">{bldg.building.name}</div>
                                <div class="address">{bldg.building.address}</div>
                            </div>
                            <div class="meta">
                                <strong class="zone zone-{bldg.building.seismicZone}">Zone {bldg.building.seismicZone}</strong>
                                ({bldg.building.distanceFromFaultLine}km)
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
    </section>
{/if}

<style>
    .buildings-search-view {
        position: fixed;
        left: 2rem;
        right: 2rem;
        top: 8rem;
        display: grid;
        gap: 1rem;
    }

    @media (min-width: 640px) {
        .buildings-search-view {
            right: auto;
            width: 32rem;
        }
    }

    .buildings-search {
        position: relative;
        background: rgb(0 0 0 / 50%);
        border-radius: 5rem;
        backdrop-filter: blur(0.5rem);
        -webkit-backdrop-filter: blur(0.5rem);
    }

    input {
        display: block;
        width: calc(100% - 6rem);
        appearance: none;
        padding: 1rem 2rem;
        padding-right: 4rem;
        background: none;
        border: none;
        font-size: 1.25rem;
        font-family: inherit;
        color: white;
        outline: none;
    }

    .search-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 2.5rem;
        height: 2.5rem;

        display: flex;
        align-items: center;
        justify-content: center;

        background: rgb(255 255 255 / 90%);
        color: black;
        border: none;
        border-radius: 50%;
        cursor: pointer;
    }

    .search-button:hover,
    .search-button:focus {
        background: rgb(255 255 255 / 80%);
        outline: none;
    }

    .search-button:disabled {
        background: none;
        color: rgb(255 255 255 / 25%);
        pointer-events: none;
    }

    .search-button .icon {
        width: 1.5rem;
        height: 1.5rem;
        pointer-events: none;
    }

    .search-results-container {
        display: grid;
        gap: 1rem;
        padding: 1rem;
        background: rgb(0 0 0 / 50%);
        border-radius: 1rem;
        backdrop-filter: blur(0.5rem);
        -webkit-backdrop-filter: blur(0.5rem);
    }

    .search-results-container .label {
        display: block;
        color: rgb(255 255 255 / 50%);
        font-size: 0.9rem;
        font-weight: 600;
    }

    .search-results {
        display: grid;
        gap: 0.5rem;
    }

    .search-result-button {
        display: block;
        padding: 0;
        width: 100%;
        appearance: none;
        text-align: left;
        background: white;
        border: none;
        border-radius: 0.5rem;
        overflow: hidden;
        cursor: pointer;
        transition: all 100ms ease;
    }

    .search-result-button:hover,
    .search-result-button:focus {
        color: var(--theme-focus);
        box-shadow: 0 0 0 2px black, 0 0 0 4px rgb(255 255 255 / 50%);
        outline: none;
    }

    .search-result-button .content {
        padding: 0.75rem 1rem;
    }

    .search-result-button .name {
        margin: 0 0 0.5rem;
        font-weight: 600;
    }

    .search-result-button .address {
        font-size: 0.8rem;
        color: #808080;
    }

    .search-result-button .meta {
        padding: 0.75rem 1rem;
        background: #f7f7f7;
        border-top: 1px solid rgb(0 0 0 / 10%);
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 500;
        font-size: 0.9rem;
        color: #808080;
    }

    .search-result-button :global(.zone) {
        font-weight: 700;
    }

    .search-result-button :global(.zone.zone-2) {
        color: var(--theme-seismic-zone-2);
    }

    .search-result-button :global(.zone.zone-4) {
        color: var(--theme-seismic-zone-4);
    }
</style>
