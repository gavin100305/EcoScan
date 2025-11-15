import { ApiError } from './ApiError.js';

// Helper function to convert image URL to base64
async function getBase64FromUrl(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

function extractJSONFromText(text) {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/m);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}


export async function callGeminiVision(imageUrl) {
  const endpoint = process.env.GEMINI_ENDPOINT || null;
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;

  if (!apiKey) {
    throw new ApiError(500, 'Gemini API key not configured (GEMINI_API_KEY missing)');
  }

  const prompt = `Analyze the product in this image and return ONLY a valid JSON object with these exact keys:
{
  "product_name": "name of the product",
  "material_type": "type of material (e.g., plastic, metal, paper)",
  "recyclability": "recyclable/non-recyclable/partially recyclable",
  "carbon_footprint": "low/medium/high",
  "disposal_method": "how to properly dispose of this item",
  "alternative_suggestions": "eco-friendly alternatives or tips"
}

If any field is unknown, set it to "unknown". Return ONLY the JSON object, no other text.`;

  // Call either a custom endpoint (if provided) using Bearer auth,
  // or fall back to Google Gemini API
  let res;
  if (endpoint) {
    const body = { model, input: prompt };
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
  } else {
    // Use Google Gemini API with vision
    const googleEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          { 
            inlineData: {
              mimeType: "image/jpeg",
              data: await getBase64FromUrl(imageUrl)
            }
          }
        ]
      }]
    };

    res = await fetch(googleEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });
  }

  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, `Gemini API error: ${text}`);
  }

  const data = await res.json();

  // Extract text from Gemini response
  const textOutput =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    data.outputText || 
    data.output_text || 
    data.result ||
    (data.choices && (data.choices[0]?.message?.content || data.choices[0]?.text)) ||
    data.prediction || 
    JSON.stringify(data);

  console.log('📝 Gemini raw response:', textOutput);

  const parsed = extractJSONFromText(String(textOutput));
  if (!parsed) {
    throw new ApiError(500, 'Could not parse JSON from Gemini response', [{ raw: textOutput }]);
  }

  return {
    product_name: parsed.product_name || parsed.product || 'unknown',
    material_type: parsed.material_type || parsed.material || 'unknown',
    recyclability: parsed.recyclability || 'unknown',
    carbon_footprint: parsed.carbon_footprint || parsed.carbon || 'unknown',
    disposal_method: parsed.disposal_method || parsed.disposal || 'unknown',
    alternative_suggestions: parsed.alternative_suggestions || parsed.alternatives || 'No suggestions available',
  };
}

// Export a simple mock function for local development if needed
export function mockGeminiResponse() {
  return {
    product_name: 'Sample Product',
    material_type: 'plastic',
    recyclability: 'recyclable',
    carbon_footprint: 'medium',
    disposal_method: 'recycle',
    alternative_suggestions: 'Consider using reusable containers instead of single-use plastic'
  };
}
