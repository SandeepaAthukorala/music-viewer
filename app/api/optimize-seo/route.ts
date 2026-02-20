import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface TrackData {
    title: string;
    album_name: string;
    description: string;
    prompt: string;
    tags: string[];
    seo_keywords: string;
    cover_prompt: string;
}

interface SEOResult {
    title: string;
    tags: string;
    description: string;
    subscribeComment: string;
}

export async function POST(request: NextRequest) {
    try {
        if (!OPENROUTER_API_KEY) {
            return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
        }

        const track: TrackData = await request.json();

        const systemPrompt = `You are a SUPERLY ENGINEERED SEO and music marketing expert AI agent. Your specialty is optimizing music track metadata for maximum YouTube visibility, engagement, and viral potential. You understand YouTube's algorithm, trending music keywords, and what makes titles and descriptions click-worthy.

Your responses must be:
1. ATTENTION-GRABBING - Use power words, emotional triggers
2. SEO-OPTIMIZED - Include high-volume search terms naturally
3. CLICK-WORTHY - Create curiosity and urgency
4. AUTHENTIC - Sound human, not robotic
5. COMPLIANT - Follow YouTube best practices

You MUST respond in valid JSON format only, no markdown, no explanation.`;

        const userPrompt = `Optimize this music track for YouTube. Create viral-ready metadata.

CURRENT TRACK DATA:
- Title: ${track.title}
- Album: ${track.album_name}
- Current Description: ${track.description}
- Audio Style/Prompt: ${track.prompt}
- Genre Tags: ${track.tags?.join(', ') || 'N/A'}
- SEO Keywords: ${track.seo_keywords}

Generate optimized metadata and respond ONLY with this JSON structure (no markdown, no code blocks):
{
    "title": "A catchy, SEO-optimized YouTube title (max 100 chars). Use power words, numbers, or intrigue. Include key genre/artist vibe.",
    "tags": "Comma-separated tags for YouTube (max 500 chars total). Include: genre, mood, trending keywords, artist style references. Format: tag1, tag2, tag3",
    "description": "A compelling YouTube description (150-300 words). Include: hook opening, what viewers will experience, emotional journey, call-to-action for likes/shares, relevant keywords naturally woven in. Make it feel authentic and exciting.",
    "subscribeComment": "A natural, friendly comment (2-3 sentences) to pin that encourages subscription without being pushy. Sound like a real person excited about their music journey."
}`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://spectral-aldrin.app',
                'X-Title': 'Spectral Aldrin Music Dashboard'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-001',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.8,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenRouter error:', error);
            return NextResponse.json({ error: 'AI optimization failed' }, { status: 500 });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
        }

        let result: SEOResult;
        try {
            let cleanedContent = content.trim();
            if (cleanedContent.startsWith('```')) {
                cleanedContent = cleanedContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
            }
            result = JSON.parse(cleanedContent);
        } catch (e) {
            console.error('Failed to parse AI response:', content);
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('SEO Optimize API Error:', error);
        return NextResponse.json({ error: 'Failed to optimize' }, { status: 500 });
    }
}
