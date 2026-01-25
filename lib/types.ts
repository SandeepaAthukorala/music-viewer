export interface Album {
    album_id: string;
    album_name: string;
    track_count: number;
}

export interface TrackCSV {
    id: string;
    track_id: string;
    title: string;
    album_name: string;
    album_id: string;
    filename: string;
    filepath: string;
    description: string;
    seo_keywords: string;
    prompt: string;
    tags: string[];
    cover_prompt: string;
    seed: string;
    created_at: string;
}

export interface TrackStatus {
    hasAudio: boolean;
    hasVideo: boolean;
    audioPath?: string;
    videoPath?: string;
}

export interface Track extends TrackCSV, TrackStatus {
    coverUrl?: string; // Resolved URL for cover image
    isInhuman?: boolean; // Flag to indicate if track is from Inhuman collection
}

export interface ProjectStats {
    totalTracks: number;
    audioFound: number;
    videosRendered: number;
}

export interface ScanResult {
    tracks: Track[];
    albums: Album[];
    stats: ProjectStats;
}
