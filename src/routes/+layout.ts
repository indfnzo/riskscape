import { buildings } from '$lib/stores';

export const ssr = false;

export async function load() {
    const response = await fetch('/buildings');
    if (!response.ok) return;

    const data = await response.json();
    buildings.set(data || []);
}
