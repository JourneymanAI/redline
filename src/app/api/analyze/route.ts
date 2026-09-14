import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { documentText, redLines, governingLawState, operatingState } = await request.json();
    console.log('[/api/analyze] Request received, document length:', documentText?.length);

    const apiKey = process.env.OPENROUTER_API_KEY;
    const modelSlug = process.env.OPENROUTER_MODEL;

    console.log('[/api/analyze] apiKey present:', !!apiKey, 'modelSlug:', modelSlug);

    if (!apiKey || !modelSlug) {
      console.error('[/api/analyze] Missing credentials - apiKey:', !!apiKey, 'modelSlug:', !!modelSlug);
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

    console.log('[/api/analyze] Calling OpenRouter with model:', modelSlug);

    let response;
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await fetch('https://openrouter.io/api/v1/chat/completions', {
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
        console.log('[/api/analyze] OpenRouter response status:', response.status);
        break;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.error(`[/api/analyze] Attempt ${attempt}/3 failed:`, lastError.message);
        if (attempt < 3) {
          const delay = Math.pow(2, attempt - 1) * 100;
          console.log(`[/api/analyze] Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    if (!response) {
      throw lastError || new Error('Failed to connect to OpenRouter after 3 attempts');
    }

    if (!response.ok) {
      const error = await response.text();
      console.error('[/api/analyze] OpenRouter error response:', error);
      return NextResponse.json(
        { error: `OpenRouter API error (${response.status}): ${error.substring(0, 200)}` },
        { status: response.status }
      );
    }

    const data = (await response.json()) as Record<string, unknown>;
    const choices = data.choices as Array<{ message: { content: string } }> | undefined;
    const content = choices?.[0]?.message?.content;

    console.log('[/api/analyze] Got response, content length:', content?.length);

    if (!content) {
      console.error('[/api/analyze] No content in response:', JSON.stringify(data).substring(0, 200));
      return NextResponse.json(
        { error: 'No response content from OpenRouter' },
        { status: 500 }
      );
    }

    try {
      const analysis = JSON.parse(content);
      console.log('[/api/analyze] Successfully parsed analysis');
      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error('[/api/analyze] JSON parse error:', parseError, 'Content preview:', content.substring(0, 200));
      return NextResponse.json(
        { error: `Failed to parse model response: ${parseError instanceof Error ? parseError.message : 'unknown'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[/api/analyze] Unhandled error:', message, error);
    return NextResponse.json(
      { error: `API error: ${message}` },
      { status: 500 }
    );
  }
}
