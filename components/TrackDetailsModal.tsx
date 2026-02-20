'use client';

import { Track } from "@/lib/types";
import { Copy, FileText, Hash, Image as ImageIcon, Music, Tag, Sparkles, Loader2, Youtube } from "lucide-react";
import { useState } from "react";
import { Modal } from "./ui/modal";

interface TrackDetailsModalProps {
    track: Track | null;
    isOpen: boolean;
    onClose: () => void;
}

interface OptimizedSEO {
    title: string;
    tags: string;
    description: string;
    subscribeComment: string;
}

export function TrackDetailsModal({ track, isOpen, onClose }: TrackDetailsModalProps) {
    const [optimizing, setOptimizing] = useState(false);
    const [optimized, setOptimized] = useState<OptimizedSEO | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!track) return null;

    const handleOptimize = async () => {
        setOptimizing(true);
        setError(null);
        try {
            const res = await fetch('/api/optimize-seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: track.title,
                    album_name: track.album_name,
                    description: track.description,
                    prompt: track.prompt,
                    tags: track.tags,
                    seo_keywords: track.seo_keywords,
                    cover_prompt: track.cover_prompt
                })
            });

            if (!res.ok) {
                throw new Error('Optimization failed');
            }

            const data: OptimizedSEO = await res.json();
            setOptimized(data);
        } catch (err) {
            setError('Failed to optimize. Please try again.');
            console.error(err);
        } finally {
            setOptimizing(false);
        }
    };

    const tagsArray: string[] = Array.isArray(track.tags)
        ? track.tags
        : (track.tags as unknown as string || '').split('|');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Track Publishing Details">
            <div className="p-6 bg-zinc-950 text-zinc-200 overflow-y-auto max-h-[80vh] w-full max-w-4xl">
                <div className="grid gap-6">
                    {/* Header Info */}
                    <div className="border-b border-zinc-800 pb-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-1">{track.title}</h2>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Music size={16} />
                                    <span>{track.album_name}</span>
                                    <span className="text-zinc-600">•</span>
                                    <span className="font-mono text-zinc-500">{track.seed}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleOptimize}
                                disabled={optimizing}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg font-medium transition-all disabled:opacity-50 shrink-0"
                            >
                                {optimizing ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Optimizing...
                                    </>
                                ) : (
                                    <>
                                        <Youtube size={16} />
                                        Optimize for YouTube
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Optimized SEO Section */}
                    {optimized && (
                        <div className="bg-gradient-to-br from-red-950/30 to-orange-950/20 border border-red-800/50 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="text-red-400" size={20} />
                                <h3 className="text-lg font-bold text-white">AI-Optimized YouTube Metadata</h3>
                            </div>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label icon={<span className="text-red-400 font-bold">T</span>} text="Optimized Title" />
                                    <CopyableTextArea value={optimized.title} rows={1} highlight />
                                </div>
                                <div className="space-y-2">
                                    <Label icon={<Tag size={16} className="text-red-400" />} text="YouTube Tags (under 500 chars)" />
                                    <CopyableTextArea value={optimized.tags} rows={2} highlight />
                                    <span className="text-xs text-zinc-500">{optimized.tags.length}/500 characters</span>
                                </div>
                                <div className="space-y-2">
                                    <Label icon={<FileText size={16} className="text-red-400" />} text="Video Description" />
                                    <CopyableTextArea value={optimized.description} rows={5} highlight />
                                </div>
                                <div className="space-y-2">
                                    <Label icon={<span className="text-red-400">💬</span>} text="Pin Comment (Subscribe CTA)" />
                                    <CopyableTextArea value={optimized.subscribeComment} rows={2} highlight />
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Main Metadata Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label icon={<FileText size={16} />} text="Description" />
                            <CopyableTextArea value={track.description} rows={3} />
                        </div>

                        <div className="space-y-2">
                            <Label icon={<ImageIcon size={16} />} text="Cover Art Prompt" />
                            <CopyableTextArea value={track.cover_prompt} rows={3} />
                        </div>

                        <div className="col-span-1 lg:col-span-2 space-y-2">
                            <Label icon={<Music size={16} />} text="Audio Generation Prompt" />
                            <CopyableTextArea value={track.prompt} rows={2} />
                        </div>

                        <div className="space-y-2">
                            <Label icon={<Hash size={16} />} text="SEO Keywords" />
                            <CopyableTextArea value={track.seo_keywords.replace(/\|/g, ', ')} rows={2} />
                        </div>

                        <div className="space-y-2">
                            <Label icon={<Tag size={16} />} text="Tags" />
                            <div className="flex flex-wrap gap-2 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 min-h-[80px]">
                                {tagsArray.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs border border-blue-500/20">
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* File Technicals */}
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                        <h3 className="text-sm font-semibold text-zinc-500 mb-3">File Paths</h3>
                        <div className="grid gap-2 text-xs font-mono text-zinc-600">
                            <div className="flex gap-2">
                                <span className="w-16 shrink-0 text-zinc-500">Video:</span>
                                <span className="select-all text-zinc-400 hover:text-white transition-colors">{track.videoPath || "NOT RENDERED"}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="w-16 shrink-0 text-zinc-500">Audio:</span>
                                <span className="select-all text-zinc-400 hover:text-white transition-colors">{track.audioPath || "NOT FOUND"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

function Label({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
            {icon}
            <span>{text}</span>
        </div>
    );
}

function CopyableTextArea({ value, rows = 3, highlight = false }: { value: string, rows?: number, highlight?: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <textarea
                readOnly
                rows={rows}
                className={`w-full ${highlight ? 'bg-zinc-900 border-red-800/50 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-300'} border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 ${highlight ? 'focus:ring-red-500' : 'focus:ring-blue-500'} resize-none font-sans`}
                value={value}
            />
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Copy to clipboard"
            >
                {copied ? <span className="text-emerald-500 text-xs font-bold px-1">Copied!</span> : <Copy size={14} />}
            </button>
        </div>
    );
}
