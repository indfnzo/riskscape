import { get, writable } from 'svelte/store';
import type { Building } from '@prisma/client';
import MiniSearch from 'minisearch';
import { buildings } from './';

/**
 * Set up fast local search using minisearch.
 * 
 * Available fields:
 * - id: number
 * - name: string
 * - address: string
 * - zipCode: string
 * - contactName: string
 * - contactPhone: string
 * - lat: number
 * - lng: number
 * - seismicZone: string
 * - distanceFromFaultLine: number
 * - soilType: string
 */

const minisearch = new MiniSearch<Building>({
    fields: ['name', 'address', 'zipCode', 'contactName'],
    searchOptions: {
        fuzzy: 0.2,
        prefix: true,
        boost: { name: 2 }
    },
});

// Keep an object reference of all records so we can fetch these by index in full later.
const buildingsById = writable<Record<number, Building>>({});

// Update both the minisearch index and our id-indexed mega-object when the full local copy is updated.
buildings.subscribe(bldgs => {
    minisearch.removeAll();
    minisearch.addAll(bldgs);

    buildingsById.set(bldgs.reduce<Record<number, Building>>((all, bldg) => {
        all[bldg.id] = bldg;
        return all;
    }, {}));
});

// Set up buildings search storage & implementation.

export type BuildingSearchResult = ReturnType<(typeof minisearch.search)>[0] & { building: Building };

export type BuildingsSearchState = {
    active: boolean;
    searchQuery: string;
    results: BuildingSearchResult[];
};

export const buildingsSearchState = writable<BuildingsSearchState>({ active: false, searchQuery: '', results: [] });

/**
 * Executes search over local copy of buildings and updates buildingsSearchState store.
 */
export const searchBuildings = async (query: string) => {
    const q = query.trim();

    // query is empty, we cancel the search & deactivate
    if (!q) {
        buildingsSearchState.set({
            active: false,
            searchQuery: '',
            results: []
        });
        return;
    }

    // filter buildings w/ minisearch and generate new state
    const results = minisearch.search(q);
    const byId = get(buildingsById);
    const fullResults: BuildingSearchResult[] = results.map(r => {
        return { ...r, building: byId[r.id] };
    });

    buildingsSearchState.set({
        active: true,
        searchQuery: q,
        results: fullResults
    });
}
