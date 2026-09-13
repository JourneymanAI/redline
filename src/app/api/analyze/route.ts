import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { documentText, redLines, governingLawState, operatingState } = await request.json();

  const apiKey = process.env.OPENROUTER_API_KEY;
  const modelSlug = process.env.OPENROUTER_MODEL;

  if (!apiKey || !modelSlug) {
    return NextResponse.json(
      { error: 'OpenRouter credentials not configured' },
      { status: 500 }
    );
  }

  const prompt = `Analyze this contract for risk clauses. Return JSON with: summary, flags (array of {clauseType, sourceSentence (verbatim from document), severity: "Blocker"|"Push"|"Note", counterOffer, confidenceMarker: "clear"|"our-read"|"unclear-get-help", reason, isRedLineTrigger: boolean, jurisdictionSensitive: boolean}), alsoSeen (array of {clauseType, description}), verdict {kind: "flags"|"clean", notesCount?: number}.

Contract:
${documentText}

Red lines: ${redLines?.join(', ') || 'none'}
Governing law: ${governingLawState}
Operating state: ${operatingState}`;

  try {
    const response = await fetch('https://openrouter.io/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelSlug,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter error:', error);
      return NextResponse.json(
        { error: `OpenRouter API error (${response.status}): ${error.substring(0, 200)}` },
        { status: response.status }
      );
    }

    const data = (await response.json()) as Record<string, unknown>;
    const choices = data.choices as Array<{ message: { content: string } }> | undefined;
    const content = choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in response:', data);
      return NextResponse.json(
        { error: 'No response content from OpenRouter' },
        { status: 500 }
      );
    }

    try {
      const analysis = JSON.parse(content);
      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content.substring(0, 500));
      return NextResponse.json(
        { error: `Failed to parse model response: ${parseError instanceof Error ? parseError.message : 'unknown'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('API route error:', message);
    return NextResponse.json(
      { error: `API error: ${message}` },
      { status: 500 }
    );
  }
}
