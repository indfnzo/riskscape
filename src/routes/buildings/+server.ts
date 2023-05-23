import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

export async function GET() {
    const prisma = new PrismaClient();

    try {
        const buildings = await prisma.building.findMany();
        return new Response(JSON.stringify(buildings), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch {
        throw error(400, 'beep boop');
    } finally {
        await prisma.$disconnect();
    }
}
