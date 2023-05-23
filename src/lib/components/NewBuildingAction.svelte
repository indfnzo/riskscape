<script lang="ts">
    import { getContext } from 'svelte';
    import { ModalContext, Modal, SectionalForm, Input, NumberInput, Button, Select, SelectList, SelectListItem } from '.';
	import type { MapContext } from './MapView.svelte';
	import { LngLat, Marker } from 'mapbox-gl';
	import type { Building } from '@prisma/client';
    import { fetchBuildings } from '$lib/stores';
	import { sleep } from '$lib/helpers';

    const mapContext = getContext<MapContext>('map');
    const { map } = mapContext;

    let modalContext: ModalContext;

    let building: Partial<Building> = {};

    const markerEl = document.createElement('div');
    markerEl.className = 'new-building-marker';
    markerEl.title = 'New Building Location';
    let marker = new Marker(markerEl);
    let markerActive = false;

    const setBuildingLocation = (loc: { lat: number, lng: number }) => {
        building.lat = loc.lat;
        building.lng = loc.lng;
        marker.setLngLat(loc);
        if (!markerActive) {
            marker.addTo($map);
            markerActive = true;
        }
    }

    const unsetBuildingLocation = () => {
        building.lat = 0;
        building.lng = 0;
        if (markerActive) {
            marker.remove();
            markerActive = false;
        }
    }

    let gpsLoading = false;

    const useCurrentPosition = () => {
        gpsLoading = true;

        const currentLat = building.lat;
        const currentLng = building.lng;

        navigator.geolocation.getCurrentPosition(async (position) => {
            gpsLoading = false;
            // prompt location with the current GPS location as the starting point
            setBuildingLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });

            // revert to old value if prompt was not accepted
            if (!(await promptLocation())) {
                if (currentLat && currentLng) setBuildingLocation({ lat: currentLat, lng: currentLng });
                else unsetBuildingLocation();
            }
        }, () => {
            gpsLoading = false;
            alert('Failed to retrieve current location.');
        });
    }

    const promptLocation = async () => {
        modalContext.modal.close();
        await sleep(250);

        const currentLocation = building.lat && building.lng ? new LngLat(building.lng, building.lat) : undefined;

        const location = await mapContext.promptLocation(currentLocation);
        if (location) setBuildingLocation(location);

        modalContext.modal.open();
        return location;
    }

    const resetForm = () => {
        unsetBuildingLocation();
        building = {};
    }

    let saving = false;
    let error = '';

    const createBuildingRecord = async () => {
        if (saving) return;
        saving = true;

        const response = await fetch('/buildings/new', {
            method: 'POST',
            body: JSON.stringify(building),
        });

        const data = await response.json();

        if (response.ok) {
            const center = { lat: building.lat as number, lng: building.lng as number };

            resetForm();
            modalContext.modal.close();
            $map.flyTo({ center, zoom: 19, pitch: 45 })
            fetchBuildings();
        } else {
            error = data.message || 'Failed to create building record.';
        }

        saving = false;
    }
</script>

<section class="new-building-action">
    <ModalContext bind:this={modalContext} let:modal>
        <button class="expand-button" on:click={modal.open} title="Submit New Building Record">
            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20" stroke="currentColor" stroke-linecap="square"/>
                <path d="M12 4L12 20" stroke="currentColor" stroke-linecap="square"/>
            </svg>
        </button>

        <Modal context={modal}>
            <SectionalForm onSubmit={createBuildingRecord}>
                <section>
                    <aside></aside>
                    <main><h2>Submit Building Record</h2></main>
                </section>
                <section>
                    <aside><h3>Basic Details</h3></aside>
                    <main>
                        <Input label="Building Name" bind:value={building.name} placeholder="Building Name" />
                        <div class="control-group">
                            <Input label="Full Address" bind:value={building.address} placeholder="Street, Barangay, City/Municipality" />
                            <div style="flex-basis: 10rem;">
                                <Input label="Zip Code" bind:value={building.zipCode} placeholder="0000" />
                            </div>
                        </div>
                        <div class="control-group">
                            <Input label="Contact Person" bind:value={building.contactName} placeholder="Contact Person" />
                            <Input label="Contact Phone" bind:value={building.contactPhone} placeholder="+63 9XX XXX XXXX" />
                        </div>
                    </main>
                </section>
                <section>
                    <aside><h3>Building Location</h3></aside>
                    <main>
                        <div class="control-group">
                            <NumberInput label="Latitude" bind:value={building.lat} step="0.000000000001" disabled />
                            <NumberInput label="Longitude" bind:value={building.lng} step="0.000000000001" disabled />
                            <Button onClick={useCurrentPosition} disabled={gpsLoading}>
                                {gpsLoading ? 'Please wait...' : 'Use Current Location'}
                            </Button>
                        </div>
                        <!-- svelte-ignore a11y-invalid-attribute -->
                        <a class="manual-location-link" href="javascript:void(0)" on:click={promptLocation}>Set location manually</a>
                    </main>
                </section>
                <section>
                    <aside><h3>Seismic Zone & Soil Type</h3></aside>
                    <main>
                        <SelectList label="Seismic Zone" bind:value={building.seismicZone}>
                            <SelectListItem value="2" title="Zone 2">
                                <svg slot="image" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M37.7846 55.2983C48.2451 52.7097 56 43.2605 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 43.1205 15.5634 52.4746 25.8267 55.1986L32 41L21 32L35 13.5L29 28L43 39L37.7846 55.2983Z" fill="#D4A52B"/>
                                </svg>
                                Low to moderate probability of damaging ground motion.
                            </SelectListItem>
                            <SelectListItem value="4" title="Zone 4">
                                <svg slot="image" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M37.7846 55.2983C48.2451 52.7097 56 43.2605 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 43.1205 15.5634 52.4746 25.8267 55.1986L32 41L21 32L35 13.5L29 28L43 39L37.7846 55.2983Z" fill="#C53333"/>
                                </svg>
                                High probability of damaging ground motion.
                            </SelectListItem>
                        </SelectList>
                        <hr />
                        <div class="control-group">
                            <NumberInput label="Distance from Fault Line (km)" placeholder="0.00" step="0.001" bind:value={building.distanceFromFaultLine} />
                            <Select label="Soil Type" bind:value={building.soilType}>
                                <option value="" disabled>Soil Type</option>
                                <option value="SA">SA (Hard rock)</option>
                                <option value="SB">SB (Rock)</option>
                                <option value="SC">SC (Very dense soil and soft rock)</option>
                                <option value="SD">SD (Stiff soil profile)</option>
                                <option value="SE">SE (Soft soil profile)</option>
                                <option value="SF">SF (Soil requiring site-specific evaluation)</option>
                            </Select>
                        </div>
                    </main>
                </section>
                <section>
                    <aside></aside>
                    <main>
                        {#if error}
                            <div class="error">{error}</div>
                        {/if}
                        <Button type="submit" disabled={saving}>Submit Building Record</Button>
                    </main>
                </section>
            </SectionalForm>
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

    :global(.new-building-marker) {
        width: 0.5rem;
        height: 0.5rem;
        border: 2px solid rgb(255 255 255 / 50%);
        border-radius: 50%;
        box-shadow: 0 3px 5px rgb(0 0 0 / 50%);
        cursor: default;
    }

    .manual-location-link {
        display: inline-block;
        margin: -0.5rem 0 0;
        color: var(--theme-accent);
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 700;
    }

    .error {
        color: var(--theme-error);
        font-weight: 700;
    }
</style>
