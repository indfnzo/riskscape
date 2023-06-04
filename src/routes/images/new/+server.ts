import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server';
import sharp from 'sharp';

export async function POST({ request }) {
    try {
        const data = await request.formData();
        const image = data.get('image')?.valueOf() as File;
        const imageData = Buffer.from(await image.arrayBuffer());

        const processedImage = await sharp(imageData)
            .resize({ width: 1280, height: 720, fit: 'outside', withoutEnlargement: true })
            .toBuffer();

        const img = await prisma.image.create({ data: {
            fileName: image.name.replace(/[^a-z0-9.-_]/gi, '-'),
            mimeType: image.type,
            fileSize: processedImage.byteLength,
            data: processedImage
        } });
        return new Response(JSON.stringify(img), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch(err) {
        if (err instanceof Error) throw error(400, err.message);
        throw error(400, 'Failed to upload image.');
    }
}
