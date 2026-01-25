'use client';

import { Track } from "@/lib/types";
import { Copy, FileText, Hash, Image as ImageIcon, Music, Tag } from "lucide-react";
import { useState } from "react";
import { Modal } from "./ui/modal";

interface TrackDetailsModalProps {
    track: Track | null;
    isOpen: boolean;
    onClose: () => void;
}

export function TrackDetailsModal({ track, isOpen, onClose }: TrackDetailsModalProps) {
    if (!track) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Track Publishing Details"
        >
            <div className="p-6 bg-zinc-950 text-zinc-200 overflow-y-auto max-h-[80vh] w-full max-w-4xl">
                <div className="grid gap-6">
                    {/* Header Info */}
                    <div className="border-b border-zinc-800 pb-4">
                        <h2 className="text-3xl font-black text-white mb-1">{track.title}</h2>
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Music size={16} />
                            <span>{track.album_name}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="font-mono text-zinc-500">{track.seed}</span>
                        </div>
                    </div>

                    {/* Main Metadata Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Description Section */}
                        <div className="space-y-2">
                            <Label icon={<FileText size={16} />} text="Description" />
                            <CopyableTextArea value={track.description} rows={3} />
                        </div>

                        {/* Visual Prompt Section */}
                        <div className="space-y-2">
                            <Label icon={<ImageIcon size={16} />} text="Cover Art Prompt" />
                            <CopyableTextArea value={track.cover_prompt} rows={3} />
                        </div>

                        {/* Audio Prompt Section */}
                        <div className="col-span-1 lg:col-span-2 space-y-2">
                            <Label icon={<Music size={16} />} text="Audio Generation Prompt" />
                            <CopyableTextArea value={track.prompt} rows={2} />
                        </div>

                        {/* SEO Keywords */}
                        <div className="space-y-2">
                            <Label icon={<Hash size={16} />} text="SEO Keywords" />
                            <CopyableTextArea value={track.seo_keywords.replace(/\|/g, ', ')} rows={2} />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label icon={<Tag size={16} />} text="Tags" />
                            <div className="flex flex-wrap gap-2 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 min-h-[80px]">
                                {(Array.isArray(track.tags) ? track.tags : (track.tags || '').split('|')).map((tag, i) => (
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

function CopyableTextArea({ value, rows = 3 }: { value: string, rows?: number }) {
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
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-sans"
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
