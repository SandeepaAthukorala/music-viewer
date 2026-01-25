import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ album: string; track: string }> }
) {
    const { album, track } = await params;

    if (!album || !track) {
        return new NextResponse('Missing parameters', { status: 400 });
    }

    // Sanitize path to prevent traversal
    const safeAlbum = path.basename(decodeURIComponent(album));
    const safeTrack = path.basename(decodeURIComponent(track));

    const audioPath = path.join(
        'D:\\contents\\inhuman\\old_albums\\songs',
        safeAlbum,
        safeTrack,
        'song.mp3'
    );

    try {
        await fs.promises.access(audioPath);

        const fileBuffer = await fs.promises.readFile(audioPath);
        const stats = await fs.promises.stat(audioPath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': stats.size.toString(),
            },
        });
    } catch (e) {
        return new NextResponse('Audio not found', { status: 404 });
    }
}
