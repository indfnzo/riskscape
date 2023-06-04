import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server';

export async function GET({ params, request }) {
    const id = parseInt(params.id);
    if (isNaN(id)) throw error(404);

    const img = await prisma.image.findUnique({
        where: { id }
    });
    if (!img) throw error(404);

    return new Response(JSON.stringify({
        id: img.id,
        fileName: img.fileName,
        mimeType: img.mimeType,
        fileSize: img.fileSize,
        url: `/images/${img.id}/${img.fileName}`
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
