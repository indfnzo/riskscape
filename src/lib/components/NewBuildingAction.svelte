<script lang="ts">
    import { onMount, getContext } from 'svelte';
    import { ModalContext, Modal, Input } from '.';
	import type { MapContext } from './MapView.svelte';
	import { Marker } from 'mapbox-gl';

    const mapContext = getContext<MapContext>('map');
    const { map } = mapContext;

    const building = {
        name: '',
        contactPerson: '',
        contactPhone: '',
        address: '',
        zipCode: '',
        lat: 0,
        lng: 0,
        seismicZone: '',
        distanceFromNearestFaultLine: 0,
        soilType: '',
    };

    let lat = 0;
    let lng = 0;

    $: coordsValid = (
        (lat > 14.576086849679715 && lat < 14.834106752379975) &&
        (lng > 120.91778658671723 && lng < 121.23275702637272)
    )

    const currentPinEl = document.createElement('div');
    currentPinEl.className = 'new-building-marker';
    let currentPinMarker = new Marker(currentPinEl);

    $: {
        if ($map) currentPinMarker.setLngLat($map.getCenter()).addTo($map);
    }

    $: {
        if ($map && coordsValid) {
            $map.flyTo({ center: { lat, lng }, zoom: 18, pitch: 15 });
            currentPinMarker.setLngLat({ lat, lng }).addTo($map);
        }
    }

    const useCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
        }, () => {
            alert('Failed to retrieve current location.');
        });
    }
</script>

<section class="new-building-action">
    <ModalContext let:modal>
        <button class="expand-button" on:click={modal.open} title="Submit New Building Record">
            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20" stroke="currentColor" stroke-linecap="square"/>
                <path d="M12 4L12 20" stroke="currentColor" stroke-linecap="square"/>
            </svg>
        </button>

        <Modal context={modal}>
            <h2>Submit Building Record</h2>
            
            <form class="new-building-form">
                <Input label="Building Name" bind:value={building.name} placeholder="Building Name" />
                <Input label="Contact Person" bind:value={building.contactPerson} placeholder="Contact Person" />
                <Input label="Contact Phone" bind:value={building.contactPhone} placeholder="+63 9XX XXX XXXX" />
                <Input label="Full Address" bind:value={building.contactPhone} placeholder="Street, Barangay, City/Municipality" />
                <Input label="Zip Code" bind:value={building.zipCode} placeholder="0000" />

                <hr />

                <div>set coords (from gps, from map click, ?)</div>
                <button on:click={useCurrentPosition}>use current location</button>
                <div style="display: flex; gap: 1rem;">
                    <input style="width: 100%;" type="number" bind:value={lat} step="0.00000000000000001" placeholder="lat" />
                    <input style="width: 100%;" type="number" bind:value={lng} step="0.00000000000000001" placeholder="long" />
                </div>

                <hr />

                <div style="display: flex; gap: 1rem;">
                    <Input label="Seismic Zone" bind:value={building.seismicZone} />
                    <Input label="Soil Type" bind:value={building.soilType} placeholder="XX" />
                </div>

                <hr />

                <div>distance from nearest fault line</div>
            </form>
        </Modal>
    </ModalContext>
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

    h2 {
        margin: 0 0 2rem;
    }

    .new-building-form {
        display: grid;
        gap: 1rem;
    }

    :global(.new-building-marker) {
        width: 0.5rem;
        height: 0.5rem;
        background: black;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 5px rgb(0 0 0 / 50%);
        cursor: pointer;
    }
</style>
