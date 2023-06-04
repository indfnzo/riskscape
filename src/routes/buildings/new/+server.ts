import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server';
import type { Building } from '@prisma/client';

export async function POST({ request }) {
    const data: Partial<Building> = await request.json();

    // manual validation
    if (!data.name) throw error(400, 'Please specify building name.');
    if (!data.address) throw error(400, 'Please specify building address.');
    if (!data.contactName || !data.contactPhone) throw error(400, 'Building contact details are required.');

    if (
        // coordinate must be within the rough boundaries of Metro Manila
        !data.lat || data.lat < 14.345319 || data.lat > 14.790334 ||
        !data.lng || data.lng < 120.903803 || data.lng > 121.139286
    ) {
        throw error(400, 'Building coordinates out of bounds.');
    }

    if (!data.seismicZone || !data.soilType) throw error(400, 'Please specify building seismic zone and soil type.');

    try {
        const building = await prisma.building.create({ data: data as Building });
        return new Response(JSON.stringify(building), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch(err) {
        if (err instanceof Error) throw error(400, err.message);
        throw error(400, 'Failed to create building record.');
    }
}
