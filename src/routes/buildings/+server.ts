import { prisma } from '$lib/server';

export async function GET() {
    const buildings = await prisma.building.findMany({
        select: {
            id: true,
            name: true,
            address: true,
            lat: true,
            lng: true,
            seismicZone: true,
            distanceFromFaultLine: true,
        },
    });
    return new Response(JSON.stringify(buildings), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
