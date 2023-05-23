import { fetchBuildings } from '$lib/stores';

export const ssr = false;

export async function load() {
    await fetchBuildings();
}
