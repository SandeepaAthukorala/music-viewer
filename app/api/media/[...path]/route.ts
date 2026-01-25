import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function serveFile(request: NextRequest, filePath: string, contentType: string) {
    const fileStat = fs.statSync(filePath);
    const fileSize = fileStat.size;
    const range = request.headers.get('range');

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });

        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize.toString(),
            'Content-Type': contentType,
        };

        // @ts-ignore
        return new NextResponse(file as any, { status: 206, headers: head });
    } else {
        const head = {
            'Content-Length': fileSize.toString(),
            'Content-Type': contentType,
        };
        const file = fs.createReadStream(filePath);
        // @ts-ignore
        return new NextResponse(file as any, { status: 200, headers: head });
    }
}

export async function GET() {
    return new NextResponse("Media playback disabled in Isolated Mode", { status: 404 });
}
