import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// /api/cover/[album]/[track]
// Maps to D:\contents\inhuman\old_albums\songs\[Album]\[Track]\square.png

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ path: string[] }> }
) {
    const params = await props.params;
    const pathSegments = params.path;

    if (!pathSegments || pathSegments.length < 2) {
        // Need at least Album and Track
        return new NextResponse("Invalid path", { status: 400 });
    }

    // Handle potential URL decoding for spaces in folder names
    const albumName = decodeURIComponent(pathSegments[0]);
    const trackName = decodeURIComponent(pathSegments[1]);

    const INHUMAN_ROOT = 'D:\\contents\\inhuman\\old_albums\\songs';

    // Construct path carefully
    const coverPath = path.join(INHUMAN_ROOT, albumName, trackName, 'square.png');

    // Security check: ensure we didn't traverse up
    if (!path.resolve(coverPath).startsWith(INHUMAN_ROOT)) {
        return new NextResponse("Access denied", { status: 403 });
    }

    if (fs.existsSync(coverPath)) {
        const fileBuffer = fs.readFileSync(coverPath);
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    }

    // Fallback? Or just 404. Let UI handle fallback to placeholder.
    return new NextResponse("Cover not found", { status: 404 });
}
