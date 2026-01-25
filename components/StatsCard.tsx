import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStats } from "@/lib/types";
import { Music, Video, Database } from "lucide-react";

export function StatsCard({ stats }: { stats: ProjectStats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Total Tracks</CardTitle>
                    <Database className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalTracks}</div>
                    <p className="text-xs text-zinc-500">From tracks.csv</p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-400">Audio Ready</CardTitle>
                    <Music className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-400">{stats.audioFound}</div>
                    <p className="text-xs text-zinc-500">
                        {((stats.audioFound / stats.totalTracks) * 100).toFixed(1)}% Coverage
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-400">Videos Rendered</CardTitle>
                    <Video className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-400">{stats.videosRendered}</div>
                    <p className="text-xs text-zinc-500">
                        {((stats.videosRendered / stats.totalTracks) * 100).toFixed(1)}% Complete
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
