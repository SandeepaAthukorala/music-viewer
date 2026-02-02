import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Track, Album, TrackCSV } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function getAlbums(): Promise<Album[]> {
    const filePath = path.join(DATA_DIR, 'albums.csv');
    const fileContent = await fs.promises.readFile(filePath, 'utf8');

    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const albums = results.data.map((row: any) => ({
                    album_id: row.album_id,
                    album_name: row.album_name,
                    track_count: parseInt(row.track_count || '0', 10),
                }));
                resolve(albums);
            },
            error: (err: Error) => reject(err),
        });
    });
}

export async function getTracks(): Promise<Track[]> {
    const filePath = path.join(DATA_DIR, 'tracks.csv');
    const fileContent = await fs.promises.readFile(filePath, 'utf8');

    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const tracks = results.data.map((row: any) => {
                    // Parse tags
                    let tagsArray: string[] = [];
                    if (row.tags) {
                        tagsArray = row.tags.split('|').map((t: string) => t.trim()).filter(Boolean);
                    }

                    return {
                        id: row.track_id, // Map track_id to id
                        track_id: row.track_id,
                        title: row.title,
                        album_name: row.album_name,
                        album_id: row.album_id,
                        filename: row.filename,
                        filepath: row.filepath,
                        description: row.description,
                        seo_keywords: row.seo_keywords,
                        prompt: row.prompt,
                        tags: tagsArray,
                        cover_prompt: row.cover_prompt,
                        seed: row.seed,
                        created_at: row.created_at,

                        // Computed/Default fields
                        coverUrl: `/covers/${row.seed}.jpg`,
                        hasAudio: false, // These would need actual file checks to be true
                        hasVideo: false,
                    } as Track;
                });
                resolve(tracks);
            },
            error: (err: Error) => reject(err),
        });
    });
}
