'use client';

import { useEffect, useState } from 'react';
import { ScanResult, Track } from '@/lib/types';
import { StatsCard } from '@/components/StatsCard';
import { TrackCard } from '@/components/TrackCard';
import { RefreshCw, Search } from 'lucide-react';

interface InhumanTrack {
  title: string;
  album: string;
  coverUrl: string;
  isInhuman: boolean;
}

export default function Home() {
  const [data, setData] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'ready' | 'missing_video'>('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch CSV Baseline
      const res = await fetch('/api/scan');
      if (!res.ok) throw new Error('Failed to fetch scan');
      const csvData: ScanResult = await res.json();

      // 3. Merge Logic - For ISO/Vercel mode, we rely purely on library.json
      // The library.json already contains /covers/ paths which serve from public/

      const mergedTracks = [...csvData.tracks];

      // Update Stats
      csvData.stats.totalTracks = mergedTracks.length;
      csvData.stats.audioFound = mergedTracks.filter(t => t.hasAudio).length; // Likely 0 or based on JSON

      setData({
        ...csvData,
        tracks: mergedTracks
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTracks = data?.tracks.filter(track => {
    const s = search.toLowerCase();
    const contentMatch =
      (track.title?.toLowerCase()?.includes(s) ?? false) ||
      (track.album_name?.toLowerCase()?.includes(s) ?? false) ||
      (track.id?.toLowerCase()?.includes(s) ?? false) ||
      (track.track_id?.toLowerCase()?.includes(s) ?? false) ||
      (track.seed?.toLowerCase()?.includes(s) ?? false) ||
      (track.description?.toLowerCase()?.includes(s) ?? false) ||
      (track.prompt?.toLowerCase()?.includes(s) ?? false) ||
      (track.seo_keywords?.toLowerCase()?.includes(s) ?? false) ||
      (Array.isArray(track.tags) && track.tags.some(t => t?.toLowerCase()?.includes(s) ?? false));

    if (filter === 'ready') return contentMatch && track.hasAudio && track.hasVideo;
    if (filter === 'missing_video') return contentMatch && track.hasAudio && !track.hasVideo;
    return contentMatch;
  }) || [];

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              SPECTRAL ALDRIN
            </h1>
            <p className="text-zinc-500 mt-1">Project Status Dashboard</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Reload Data
          </button>
        </header>

        {data && <StatsCard stats={data.stats} />}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search tracks..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border text-zinc-400 transition-colors ${filter === 'all' ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent hover:bg-zinc-900'}`}
            >
              All Tracks
            </button>
            <button
              onClick={() => setFilter('missing_video')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border text-zinc-400 transition-colors ${filter === 'missing_video' ? 'bg-amber-900/20 border-amber-900/50 text-amber-500' : 'border-transparent hover:bg-zinc-900'}`}
            >
              Needs Render
            </button>
            <button
              onClick={() => setFilter('ready')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border text-zinc-400 transition-colors ${filter === 'ready' ? 'bg-emerald-900/20 border-emerald-900/50 text-emerald-500' : 'border-transparent hover:bg-zinc-900'}`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Track Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 bg-zinc-900/50 rounded-lg animate-pulse" />
            ))
          ) : (
            filteredTracks.map(track => (
              <TrackCard key={track.id} track={track} />
            ))
          )}
        </div>

        {!loading && filteredTracks.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            No tracks found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
