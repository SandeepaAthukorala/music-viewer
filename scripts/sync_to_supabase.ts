
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';

// Read CSVs from the parent directory
const albumsCsvPath = path.join(process.cwd(), '../albums.csv');
const tracksCsvPath = path.join(process.cwd(), '../tracks.csv');

interface AlbumCSV {
    album_id: string;
    album_name: string;
    track_count: string; // CSV parses as string
}

interface TrackCSV {
    track_id: string;
    title: string;
    album_name: string;
    album_id: string;
    filename: string;
    filepath: string;
    description: string;
    seo_keywords: string;
    prompt: string;
    tags: string; // Pipe separated in CSV usually? Or JSON string? Let's check format.
    // Looking at previously viewed tracks.csv: 
    // tags column: "Dubstep|Pirate|Epic"
    // So we need to split by pipe.
    cover_prompt: string;
    seed: string;
    created_at: string;
}

// Helper to parse CSV
function parseCsv<T>(filePath: string): Promise<T[]> {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: true,
            complete: (results) => resolve(results.data as T[]),
            error: (err: Error) => reject(err),
            skipEmptyLines: true,
        });
    });
}

async function sync() {
    console.log('Starting sync...');

    // 1. Sync Albums
    console.log('Reading albums.csv...');
    const albums = await parseCsv<AlbumCSV>(albumsCsvPath);
    console.log(`Found ${albums.length} albums.`);

    for (const album of albums) {
        if (!album.album_id) continue;
        const { error } = await supabase.from('albums').upsert({
            album_id: album.album_id,
            album_name: album.album_name,
            track_count: parseInt(album.track_count),
        }, { onConflict: 'album_id' });

        if (error) {
            console.error(`Error syncing album ${album.album_name}:`, error);
        } else {
            console.log(`Synced album: ${album.album_name}`);
        }
    }

    // 2. Sync Tracks
    console.log('Reading tracks.csv...');
    const tracks = await parseCsv<TrackCSV>(tracksCsvPath);
    console.log(`Found ${tracks.length} tracks.`);

    for (const track of tracks) {
        if (!track.track_id) continue;

        // Parse tags
        let tagsArray: string[] = [];
        if (track.tags) {
            // Handle "Tag1|Tag2" format
            tagsArray = track.tags.split('|').map(t => t.trim()).filter(Boolean);
        }

        const { error } = await supabase.from('tracks').upsert({
            track_id: track.track_id,
            title: track.title,
            album_name: track.album_name,
            album_id: track.album_id,
            filename: track.filename,
            filepath: track.filepath,
            description: track.description,
            seo_keywords: track.seo_keywords,
            prompt: track.prompt,
            tags: tagsArray,
            cover_prompt: track.cover_prompt,
            seed: track.seed,
            // Construct cover URL from seed if following convention
            // convention: /covers/{SEED}.jpg
            cover_url: `/covers/${track.seed}.jpg`,
            created_at: track.created_at ? new Date(track.created_at).toISOString() : new Date().toISOString(),
        }, { onConflict: 'track_id' });

        if (error) {
            console.error(`Error syncing track ${track.title}:`, error);
        } else {
            // console.log(`Synced track: ${track.title}`); // too noisy
            process.stdout.write('.');
        }
    }
    console.log('\nSync complete.');
}

sync();
