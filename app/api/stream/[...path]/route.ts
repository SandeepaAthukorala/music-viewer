import { NextResponse } from 'next/server';

export async function GET() {
    return new NextResponse("Streaming disabled in Isolated Mode", { status: 404 });
}
