import { NextResponse } from 'next/server';
import { getTracks, getAlbums } from '@/lib/csv';
import { Track } from '@/lib/types';

export async function GET() {
    try {
        console.log('Loading data from CSVs...');
        const tracks = await getTracks();
        const albums = await getAlbums();

        const totalTracks = tracks.length;
        console.log(`Loaded ${totalTracks} tracks and ${albums.length} albums from CSV.`);

        return NextResponse.json({
            tracks,
            albums,
            stats: {
                totalTracks,
                audioFound: 0,
                videosRendered: 0,
                lastScan: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Scan API Error:', error);
        return NextResponse.json({ error: 'Failed to load library from CSV' }, { status: 500 });
    }
}
