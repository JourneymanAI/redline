import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { documentText, question } = await request.json();

  const apiKey = process.env.OPENROUTER_API_KEY;
  const modelSlug = process.env.OPENROUTER_MODEL;

  if (!apiKey || !modelSlug) {
    return NextResponse.json(
      { error: 'OpenRouter credentials not configured' },
      { status: 500 }
    );
  }

  const prompt = `Answer this question based ONLY on the contract text. Return JSON with: {answer: string, groundedIn?: string (exact quote from document), addressed: boolean}.

Contract:
${documentText}

Question: ${question}

If the document doesn't address the question, set addressed: false and explain that in the answer field.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
      keepalive: false,
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

    const answer = JSON.parse(content);
    return NextResponse.json(answer);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to answer question: ${message}` },
      { status: 500 }
    );
  }
}
