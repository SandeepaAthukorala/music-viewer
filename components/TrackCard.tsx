'use client';

import { Track } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, FileAudio, Video as VideoIcon, CheckCircle2, XCircle } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "./ui/modal";
import { TrackDetailsModal } from "./TrackDetailsModal";
import { Info } from "lucide-react";

interface TrackCardProps {
    track: Track;
}

export function TrackCard({ track }: TrackCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCoverOpen, setIsCoverOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressRef = useRef(0); // Ref for smooth animation without re-render loop if needed, but state is used for UI

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVideoOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
        setIsVideoOpen(true);
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current || isDragging) return;
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration || 0;
        const pct = total > 0 ? (current / total) * 100 : 0;
        setProgress(pct);
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProgress(Number(e.target.value));
    };

    const handleSeekStart = () => setIsDragging(true);

    const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
        setIsDragging(false);
        if (audioRef.current) {
            const val = Number((e.currentTarget as HTMLInputElement).value);
            const newTime = (val / 100) * (audioRef.current.duration || 0);
            audioRef.current.currentTime = newTime;
        }
    };

    // Cover Art URL
    // Use the resolved URL from the backend if available, otherwise fallback to generating it
    const coverUrl = track.coverUrl ?? `/api/cover/${encodeURIComponent(track.album_name)}/${encodeURIComponent(track.title)}`;

    return (
        <>
            <Card className="overflow-hidden border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors group relative">
                {/* Background Blur Effect using Cover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none">
                    {/* Use img with error handling in real app, or CSS background */}
                    <div
                        className="w-full h-full bg-cover bg-center blur-xl"
                        style={{ backgroundImage: `url("${coverUrl}")` }}
                    />
                </div>

                <CardHeader className="p-4 pb-2 relative z-10">
                    <div className="flex justify-between items-start gap-3">
                        {/* Cover Art Thumbnail */}
                        <div
                            className="w-12 h-12 shrink-0 rounded bg-zinc-800 overflow-hidden border border-zinc-700 cursor-zoom-in"
                            onClick={() => setIsCoverOpen(true)}
                        >
                            <img
                                src={coverUrl}
                                alt={track.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><text x="50" y="50" font-family="Arial" font-size="40" fill="%2352525b" text-anchor="middle" dy=".3em">?</text></svg>';
                                }}
                            />
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <CardTitle className="text-lg font-bold text-zinc-100 truncate" title={track.title}>
                                {track.title}
                            </CardTitle>
                            <p className="text-sm text-zinc-400 truncate">{track.album_name}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                            {/* Status Icons */}
                            {track.hasAudio ? (
                                <div className="bg-emerald-500/10 text-emerald-500 p-1 rounded" title="Audio Found">
                                    <FileAudio size={16} />
                                </div>
                            ) : (
                                <div className="bg-red-500/10 text-red-500 p-1 rounded" title="Audio Missing">
                                    <FileAudio size={16} />
                                </div>
                            )}
                            {track.hasVideo ? (
                                <div className="bg-blue-500/10 text-blue-500 p-1 rounded" title="Video Rendered">
                                    <VideoIcon size={16} />
                                </div>
                            ) : (
                                <div className="bg-zinc-800 text-zinc-600 p-1 rounded" title="Video Missing">
                                    <VideoIcon size={16} />
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 relative z-10">
                    <div className="flex flex-col gap-3">
                        {/* Playback Controls */}
                        {track.hasAudio && track.audioPath && (
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={togglePlay}
                                    className="h-8 w-8 flex items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 transition-colors shrink-0"
                                >
                                    {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                                </button>

                                {/* Timeline Slider */}
                                <div className="flex-1 h-6 flex items-center group/slider relative">
                                    {/* Track Line */}
                                    <div className="absolute inset-x-0 h-1 bg-zinc-800 rounded-full overflow-hidden pointer-events-none">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-100 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    {/* Input Range */}
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        value={progress}
                                        onChange={handleSeekChange}
                                        onMouseDown={handleSeekStart}
                                        onMouseUp={handleSeekEnd}
                                        onTouchStart={handleSeekStart}
                                        onTouchEnd={handleSeekEnd}
                                        className="w-full h-full opacity-0 cursor-pointer absolute inset-0 z-20"
                                    />
                                </div>

                                <audio
                                    ref={audioRef}
                                    src={track.isInhuman ? `/api/stream/inhuman/${encodeURIComponent(track.album_name)}/${encodeURIComponent(track.title)}` : `/api/media/audio/${track.audioPath}`}
                                    onEnded={() => setIsPlaying(false)}
                                    onPause={() => setIsPlaying(false)}
                                    onPlay={() => setIsPlaying(true)}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                                />
                            </div>
                        )}

                        {/* Metadata Chips */}
                        <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                                BPM: {track.prompt.match(/(\d+ BPM)/)?.[1] || 'N/A'}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 truncate max-w-[150px]">
                                {Array.isArray(track.tags) ? track.tags[0] : track.tags}
                            </span>
                        </div>

                        {/* File Info */}
                        <div className="text-[10px] text-zinc-600 font-mono mt-1 break-all">
                            {track.seed}
                        </div>

                        {/* Video Preview Action */}
                        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-zinc-800/50">
                            {track.hasVideo && track.videoPath ? (
                                <button
                                    onClick={handleVideoOpen}
                                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                                >
                                    <VideoIcon size={12} /> Watch Video
                                </button>
                            ) : <span></span>}

                            <button
                                onClick={() => setIsDetailsOpen(true)}
                                className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
                            >
                                <Info size={12} /> Details
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Modal
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
                title={`${track.title} - ${track.album_name}`}
            >
                {isVideoOpen && track.videoPath && (
                    <video
                        controls
                        autoPlay
                        className="w-full h-full max-h-[80vh]"
                        src={`/api/media/video/${track.videoPath}`}
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
            </Modal>

            <TrackDetailsModal
                track={track}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
            />

            <Modal
                isOpen={isCoverOpen}
                onClose={() => setIsCoverOpen(false)}
                title={track.title}
            >
                <div className="flex justify-center items-center h-full w-full bg-black/90 p-4" onClick={() => setIsCoverOpen(false)}>
                    <img
                        src={coverUrl}
                        alt={track.title}
                        className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
                    />
                </div>
            </Modal>
        </>
    );
}
