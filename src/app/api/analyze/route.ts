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
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `OpenRouter error: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'No response from OpenRouter' },
        { status: 500 }
      );
    }

    const analysis = JSON.parse(content);
    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to analyze contract: ${message}` },
      { status: 500 }
    );
  }
}
