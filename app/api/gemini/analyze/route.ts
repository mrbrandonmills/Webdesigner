// /app/api/gemini/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { geminiModel, MIND_VISUALIZER_SYSTEM_PROMPT, MindAnalysis } from '@/lib/gemini-client'
import { put } from '@vercel/blob'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    // Check for API key first
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        {
          error: 'GOOGLE_AI_API_KEY is not configured. Please add it to your environment variables.',
          hint: 'Add GOOGLE_AI_API_KEY=your_api_key_here to your .env.local file'
        },
        { status: 503 }
      )
    }

    const { text } = await request.json()

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: 'Text must be at least 50 characters' },
        { status: 400 }
      )
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: 'Text must be under 10,000 characters' },
        { status: 400 }
      )
    }

    // Step 1: Analyze text structure
    const analysisPrompt = `Analyze this text and return a JSON object with the following structure:
{
  "concepts": [{"name": "string", "importance": 1-10, "category": "analytical|emotional|growth|creative", "x": -5 to 5, "y": -5 to 5, "z": -5 to 5}],
  "connections": [{"from": "concept name", "to": "concept name", "strength": 1-10}],
  "dominantArchetype": "Warrior|King|Magician|Lover",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendedMeditation": "meditation slug from: inner-warrior, deep-focus, creative-flow, emotional-clarity, morning-energy, stress-relief, sleep-sanctuary, confidence-builder, gratitude-practice, mindful-breathing"
}

TEXT TO ANALYZE:
${text}`

    const analysisResult = await geminiModel.generateContent(analysisPrompt)
    const analysisText = analysisResult.response.text()

    // Extract JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse analysis response')
    }

    const analysis: MindAnalysis = JSON.parse(jsonMatch[0])

    // Step 2: Generate Three.js visualization code
    const vizPrompt = `${MIND_VISUALIZER_SYSTEM_PROMPT}

Based on this analysis, generate the Three.js visualization:
${JSON.stringify(analysis, null, 2)}

Return ONLY the JavaScript code, no markdown or explanations.`

    const vizResult = await geminiModel.generateContent(vizPrompt)
    let vizCode = vizResult.response.text()

    // Clean up code (remove markdown if present)
    vizCode = vizCode.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim()

    // Step 3: Create HTML wrapper
    const visualizationId = nanoid(10)
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mind Visualization</title>
  <style>
    body { margin: 0; overflow: hidden; background: #000; }
    canvas { display: block; }
    #loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #C9A050;
      font-family: system-ui;
      font-size: 18px;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>
  <div id="loading">Rendering your mind...</div>
  <script>
    try {
      ${vizCode}
      document.getElementById('loading').style.display = 'none';
    } catch (e) {
      document.getElementById('loading').textContent = 'Visualization error: ' + e.message;
      console.error(e);
    }
  </script>
</body>
</html>`

    // Step 4: Upload to Vercel Blob
    const blob = await put(`visualizations/${visualizationId}.html`, htmlContent, {
      access: 'public',
      contentType: 'text/html'
    })

    // Step 5: Return results
    return NextResponse.json({
      id: visualizationId,
      url: blob.url,
      analysis: {
        dominantArchetype: analysis.dominantArchetype,
        insights: analysis.insights,
        recommendedMeditation: analysis.recommendedMeditation,
        conceptCount: analysis.concepts.length,
        connectionCount: analysis.connections.length
      }
    })

  } catch (error) {
    console.error('Gemini analysis error:', error)

    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          {
            error: 'Invalid or missing Google AI API key',
            hint: 'Please check your GOOGLE_AI_API_KEY in .env.local'
          },
          { status: 503 }
        )
      }
      if (error.message.includes('quota') || error.message.includes('rate')) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    )
  }
}
