<script lang="ts">
    import { getContext, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { selectedBuilding, selectBuilding } from '$lib/stores';
	import type { MapContext } from '$lib/components';
	import { AssessmentTabView } from '$lib/views';
	import { SEISMIC_ZONES, SOIL_TYPES, getSidebarAwareMapPadding, getStandardPadding } from '$lib/helpers';
	import NewBuildingModal from '$lib/components/NewBuildingModal.svelte';

    const mapContext = getContext<MapContext>('map');
    const { map } = mapContext;

    $: loading = $selectedBuilding?.loading;
    $: building = $selectedBuilding?.building;
    $: images = $selectedBuilding?.images || [];

    // fly to building on activate
    $: {
        if ($map && !loading) {
            if (building) {
                $map.flyTo({
                    center: { lat: building.lat, lng: building.lng },
                    pitch: 45,
                    zoom: 18,
                    padding: getSidebarAwareMapPadding(),
                });
            } else {
                $map.flyTo({
                    center: $map.getCenter(),
                    pitch: 0,
                    zoom: $map.getZoom(),
                    padding: getStandardPadding(),
                })
            }
        }
    }

    const closeBuilding = () => {
        selectBuilding(null);
    }

    let swiper: HTMLElement & { initialize: () => void };
    $: {
        if (!loading && building) setTimeout(() => {
            swiper.initialize();
        }, 500)
    }
</script>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-element-bundle.min.js"></script>
</svelte:head>

{#if building}
    <div
        class="selected-building-view"
        in:fly={{ y: 20, duration: 500, delay: 250, easing: quintOut }}
        out:fly={{ y: 20, duration: 500, easing: quintOut }}
    >
        <div class="building-panel" class:loading>
            <div class="media-section">
                <button class="back-button" on:click={closeBuilding}>
                    {#if loading}
                        <svg class="icon spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 12C21 10.0188 20.3463 8.09295 19.1402 6.52115C17.9341 4.94935 16.2431 3.81945 14.3294 3.30667C12.4157 2.7939 10.3863 2.92691 8.55589 3.68509C6.72549 4.44326 5.19641 5.78423 4.20581 7.5" stroke="currentColor"/>
                            <path d="M2.99996 12C2.99996 13.9812 3.6537 15.9071 4.85978 17.4788C6.06586 19.0506 7.75689 20.1806 9.67059 20.6933C11.5843 21.2061 13.6137 21.0731 15.4441 20.3149C17.2745 19.5567 18.8036 18.2158 19.7942 16.5" stroke="currentColor"/>
                            <path d="M9.20581 7.5L4.20581 7.5L4.20581 2.5" stroke="currentColor"/>
                            <path d="M14.7942 16.5L19.7942 16.5L19.7942 21.5" stroke="currentColor"/>
                        </svg>
                    {:else}
                        <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 12L4 12M4 12L12 20M4 12L12 4" stroke="currentColor" stroke-linecap="square" />
                        </svg>
                    {/if}
                </button>
                <h2 class="title">
                    {building.name}
                    {#if building && !loading}
                        <NewBuildingModal editBuilding={building} let:modal>
                            <button type="button" class="edit-building-button" on:click={modal.open}>Edit</button>
                        </NewBuildingModal>
                    {/if}
                </h2>

                <swiper-container bind:this={swiper} init="false" loop="true">
                    {#each images as img}
                        <swiper-slide>
                            <img src={img.url} alt={img.fileName}>
                        </swiper-slide>
                    {/each}
                </swiper-container>
            </div>
            <div class="details-section">
                <div class="detail-row">
                    <div class="detail-block">
                        <div class="label">Address</div>
                        <div class="value">{building.address}</div>
                    </div>
                    <div class="detail-block">
                        <div class="label">Zip</div>
                        <div class="value">{building.zipCode || '-'}</div>
                    </div>
                </div>
                <div class="detail-block">
                    <div class="label">Contact Person</div>
                    <div class="value">
                        {building.contactName || '-'}
                        {#if building.contactPhone}
                            ({building.contactPhone})
                        {/if}
                    </div>
                </div>
                <hr />
                <div class="detail-block">
                    <div class="label">Seismic Zone</div>
                    <div class="value">
                        {#if SEISMIC_ZONES[building.seismicZone]}
                            <div class="zone-block">
                                {@html SEISMIC_ZONES[building.seismicZone].icon}
                                <div class="zone-info">
                                    <span class="zone-name" style="color: {SEISMIC_ZONES[building.seismicZone].color};">{SEISMIC_ZONES[building.seismicZone].name}</span>
                                    <span class="zone-description">{SEISMIC_ZONES[building.seismicZone].description}</span>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
                <div class="detail-row">
                    <div class="detail-block">
                        <div class="label">Soil Type</div>
                        <div class="value">{SOIL_TYPES[building.soilType] || '-'}</div>
                    </div>
                    <div class="detail-block">
                        <div class="label">Distance</div>
                        <div class="value">
                            {#if building.distanceFromFaultLine}
                                {#if building.distanceFromFaultLine <= 5.0}
                                    <strong style="color: var(--theme-seismic-zone-4);" title="Near Source">{building.distanceFromFaultLine}km</strong>
                                {:else}
                                    <span>{building.distanceFromFaultLine}km</span>
                                {/if}
                            {:else}
                                -
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            in:fly={{ y: 20, duration: 500, delay: 500, easing: quintOut }}
            out:fly={{ y: 20, duration: 500, easing: quintOut }}
        >
            <AssessmentTabView />
        </div>
    </div>
{/if}

<style>
    .selected-building-view {
        position: fixed;
        left: 2rem;
        right: 2rem;
        top: 8rem;
        max-height: calc(100% - 8rem);
        display: grid;
        gap: 1rem;
        backdrop-filter: blur(0.5rem);
        -webkit-backdrop-filter: blur(0.5rem);
        border-radius: 0.5rem;
        overflow: auto;
    }

    .selected-building-view::-webkit-scrollbar {
        height: 0.25rem;
        width: 0.25rem;
	}

	.selected-building-view::-webkit-scrollbar-track,
	.selected-building-view::-webkit-scrollbar-corner {
        background-color: transparent;
	}

	.selected-building-view::-webkit-scrollbar-thumb {
        outline: none;
        background-color: rgb(255 255 255 / 25%);
		overflow: hidden;
	}

	.selected-building-view::-webkit-scrollbar-thumb:hover {
        background-color: rgb(255 255 255 / 50%);
	}

    @media (min-width: 640px) {
        .selected-building-view {
            right: auto;
            width: 32rem;
        }
    }

    .building-panel {
        background: rgb(0 0 0 / 25%);
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .media-section {
        position: relative;
        padding: 10rem 2rem 1rem;
        color: white;
        z-index: 1;
    }

    .media-section::after {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 100%;
        background: linear-gradient(to bottom, rgb(26 26 26 / 50%), rgb(26 26 26 / 75%));
        z-index: -1;
        pointer-events: none;
    }

    .back-button {
        position: absolute;
        left: 1rem;
        top: 1rem;

        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.5rem;
        height: 3.5rem;

        appearance: none;
        background: none;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: all 100ms ease;
    }

    .back-button:hover,
    .back-button:focus {
        background: rgb(0 0 0 / 25%);
    }

    .back-button .icon {
        width: 2rem;
        height: 2rem;
    }

    .back-button .spin {
        animation: building-back-button-loading-spin 500ms infinite linear;
    }

    @keyframes building-back-button-loading-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
    }

    .media-section .title {
        display: block;
        margin: 0;
        font-size: 1.75rem;
        font-weight: 700;
        line-height: 1.25;
    }

    swiper-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: -1;
        transition: all 500ms ease;
        opacity: 0;
    }

    swiper-container:global(.swiper-initialized) {
        opacity: 1;
    }

    swiper-slide img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    .edit-building-button {
        display: inline-block;
        margin: 0 0.5rem;
        padding: 0 0.75rem;
        font-size: 0.9rem;
        line-height: 1.5rem;
        font-weight: 800;
        text-transform: uppercase;
        appearance: none;
        background: white;
        color: black;
        border: none;
        border-radius: 2rem;
        cursor: pointer;
        vertical-align: middle;
        transition: all 100ms ease;
    }

    .edit-building-button:hover,
    .edit-building-button:focus {
        background: rgb(255 255 255 / 75%);
    }

    .details-section {
        padding: 1.5rem 2rem;
        display: grid;
        gap: 1.5rem;
        background: white;
    }

    .details-section .detail-row {
        display: grid;
        grid-template-columns: 1fr 6rem;
        gap: 2rem;
    }

    .details-section .detail-block .label {
        display: block;
        margin: 0 0 0.5rem;
        font-size: 0.8rem;
        font-weight: 600;
        color: rgb(0 0 0 / 50%);
        text-transform: uppercase;
    }

    .details-section .detail-block .value {
        font-size: 1.125rem;
        font-weight: 500;
    }

    .details-section .zone-block {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .details-section .zone-info {
        margin: 0.25rem 0;
    }

    .details-section .zone-name {
        display: block;
        margin: 0 0 0.25rem;
        font-weight: 600;
    }

    .details-section .zone-description {
        display: block;
        font-size: 0.9rem;
        color: rgb(0 0 0 / 50%);
    }
</style>
