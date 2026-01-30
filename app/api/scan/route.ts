import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Track, Album } from '@/lib/types';

export async function GET() {
    try {
        // Fetch all tracks and albums
        const { data: tracksData, error: tracksError } = await supabase
            .from('tracks')
            .select('*');

        if (tracksError) throw tracksError;

        // Fetch albums to get track counts if needed, though we can compute it
        // Or just return the tracks as the main scan result
        // The original response structure had: { tracks: [], stats: {} }
        // We will try to match that.

        const { data: albumsData, error: albumsError } = await supabase
            .from('albums')
            .select('*');

        if (albumsError) throw albumsError;

        const tracks = tracksData.map((t: any) => ({
            ...t,
            id: t.track_id, // Map track_id to id for frontend compatibility if needed
            // Default status for now
            hasAudio: false,
            hasVideo: false,
        })) as Track[];

        const totalTracks = tracks.length;

        return NextResponse.json({
            tracks,
            stats: {
                totalTracks,
                audioFound: 0, // In Supabase mode we might need another way to check file existence? Or assume false for checking?
                videosRendered: 0,
                lastScan: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Scan API Error:', error);
        return NextResponse.json({ error: 'Failed to load library from Supabase' }, { status: 500 });
    }
}
