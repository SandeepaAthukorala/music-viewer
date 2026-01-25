import { NextResponse } from 'next/server';

export async function GET() {
    // In isolated mode, we cannot scan the local disk for "Inhuman" tracks.
    // Return an empty array.
    return NextResponse.json([]);
}
