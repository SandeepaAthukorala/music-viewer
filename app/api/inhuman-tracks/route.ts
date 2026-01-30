import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Query for tracks that are flagged as 'inhuman' or from that collection
        // Based on CSV analysis, there might be a flag or we might need to filter by album/tag.
        // Assuming we added 'is_inhuman' column or check for tag 'Inhuman'

        const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .eq('is_inhuman', true);

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Inhuman Tracks API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
    }
}
