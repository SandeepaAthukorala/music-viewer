import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
    try {
        // In Vercel/Isolated mode, we only read the library.json
        // We do NOT check disk for video/audio existence dynamically.

        const jsonPath = path.join(process.cwd(), 'data', 'library.json');

        // In Vercel, data might need to be in `public` or bundled. 
        // But assuming `data/library.json` is deployed:
        if (!fs.existsSync(jsonPath)) {
            // Fallback for Vercel if not copied?
            // Ideally library.json should be imported or read.
            return NextResponse.json({
                tracks: [],
                stats: {
                    totalTracks: 0,
                    audioFound: 0,
                    videosRendered: 0,
                    styles: [],
                    lastScan: new Date().toISOString()
                }
            });
        }

        const fileContents = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(fileContents);

        // FORCE "Lite Mode" -> Disable all media playback in UI
        if (data.tracks) {
            data.tracks.forEach((t: any) => {
                t.hasAudio = false;
                t.hasVideo = false;
            });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Scan API Error:', error);
        return NextResponse.json({ error: 'Failed to load library' }, { status: 500 });
    }
}
