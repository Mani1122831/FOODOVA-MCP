/**
 * FOODOVA - Gemini AI Image & Description Generation Service
 * Direct Google Gemini API integration (NO MCP)
 * Responsible for food image generation, culinary prompt engineering,
 * and structured gastronomic descriptions.
 */

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class GeminiImageService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.uploadsDir = path.join(__dirname, '../../public/uploads/ai-generated');
    this.ensureUploadsDir();
  }

  ensureUploadsDir() {
    try {
      if (!fs.existsSync(this.uploadsDir)) {
        fs.mkdirSync(this.uploadsDir, { recursive: true });
      }
    } catch (err) {
      logger.error('Failed to create uploads directory:', err.message);
    }
  }

  /**
   * Validate that the prompt is culinary/food related and contains no forbidden words.
   */
  validateFoodPrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return { valid: false, message: 'A text prompt is required.' };
    }

    const trimmed = prompt.trim();
    if (trimmed.length < 3) {
      return { valid: false, message: 'Prompt must be at least 3 characters long.' };
    }
    if (trimmed.length > 1000) {
      return { valid: false, message: 'Prompt cannot exceed 1000 characters.' };
    }

    // Prohibited content check
    const prohibited = [
      'nsfw', 'nude', 'violence', 'blood', 'weapon', 'gun', 'drug',
      'celebrity', 'politician', 'hate', 'racist', 'terror'
    ];
    const lower = trimmed.toLowerCase();
    for (const word of prohibited) {
      if (lower.includes(word)) {
        return {
          valid: false,
          message: 'Prompt contains disallowed words. Only culinary food items are permitted.'
        };
      }
    }

    return { valid: true, cleanPrompt: trimmed };
  }

  /**
   * Construct an optimized professional food photography prompt.
   */
  buildFoodPrompt({ foodName, category, description, style, background, aspectRatio }) {
    const styleDesc = style || 'Professional premium restaurant food photography';
    const bgDesc = background || 'dark luxury ambient restaurant background';
    
    return `${styleDesc} of ${foodName}, ${category ? `category: ${category}, ` : ''}${description ? `${description}, ` : ''}aromatic spices, realistic food texture, appetizing gourmet presentation, luxury restaurant presentation, ${bgDesc}, cinematic lighting, shallow depth of field, 8k resolution, photorealistic, highly detailed, realistic, fresh culinary masterpiece, no text, no watermark, no human face.`;
  }

  buildFoodImagePrompt(params) {
    return this.buildFoodPrompt(params);
  }

  /**
   * Generate food image via official Google Gemini API.
   * Uses Gemini Image models (gemini-3.1-flash-image, gemini-2.5-flash-image, imagen-3.0-generate-002)
   */
  async generateImage({ prompt, foodName, category, description, style, background, aspectRatio = '1:1' }) {
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key') {
      logger.warn('[GeminiImageService] GEMINI_API_KEY is not configured.');
      return {
        success: false,
        statusCode: 400,
        message: 'Image generation unavailable. Please configure a valid GEMINI_API_KEY.',
        error: 'API key not configured'
      };
    }

    // Determine final prompt
    let finalPrompt = prompt;
    if (!finalPrompt && foodName) {
      finalPrompt = this.buildFoodPrompt({ foodName, category, description, style, background, aspectRatio });
    }

    const validation = this.validateFoodPrompt(finalPrompt);
    if (!validation.valid) {
      return {
        success: false,
        statusCode: 400,
        message: validation.message,
        error: 'Validation failed'
      };
    }

    logger.info(`[GeminiImageService] Generating food image for: "${foodName || finalPrompt.substring(0, 50)}..."`);

    // Attempt 1: Interactions API with gemini-3.1-flash-image
    try {
      const interactionRes = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
        method: 'POST',
        headers: {
          'x-goog-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gemini-3.1-flash-image',
          input: validation.cleanPrompt
        })
      });

      const interactionData = await interactionRes.json();

      if (interactionRes.ok && interactionData.output_image?.data) {
        const saved = this.saveBase64Image(interactionData.output_image.data, foodName);
        return {
          success: true,
          imageUrl: saved.relativeUrl,
          dataUrl: saved.dataUrl,
          filename: saved.filename,
          prompt: validation.cleanPrompt,
          model: 'gemini-3.1-flash-image'
        };
      }

      // Check specific error codes like rate limit or unavailable
      if (interactionData.error) {
        logger.warn('[GeminiImageService] Interactions API returned error:', interactionData.error.message);
        if (interactionData.error.code === 'too_many_requests' || interactionData.error.code === 429) {
          return {
            success: false,
            statusCode: 429,
            message: 'Image generation unavailable. Please try again.',
            error: interactionData.error.message
          };
        }
      }
    } catch (err) {
      logger.warn('[GeminiImageService] Interactions API attempt failed:', err.message);
    }

    // Attempt 2: Predict endpoint with Imagen models (imagen-3.0-generate-002)
    try {
      const imagenRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instances: [{ prompt: validation.cleanPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: aspectRatio || '1:1',
            personGeneration: 'dont_allow'
          }
        })
      });

      const imagenData = await imagenRes.json();

      if (imagenRes.ok && imagenData.predictions?.[0]?.bytesBase64Encoded) {
        const saved = this.saveBase64Image(imagenData.predictions[0].bytesBase64Encoded, foodName);
        return {
          success: true,
          imageUrl: saved.relativeUrl,
          dataUrl: saved.dataUrl,
          filename: saved.filename,
          prompt: validation.cleanPrompt,
          model: 'imagen-3.0-generate-002'
        };
      }

      if (imagenData.error) {
        logger.warn('[GeminiImageService] Imagen API returned error:', imagenData.error.message);
        if (imagenData.error.code === 429) {
          return {
            success: false,
            statusCode: 429,
            message: 'Image generation unavailable. Please try again.',
            error: imagenData.error.message
          };
        }
      }
    } catch (err) {
      logger.warn('[GeminiImageService] Imagen API attempt failed:', err.message);
    }

    // Attempt 3: gemini-2.5-flash-image generateContent
    try {
      const flashRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: validation.cleanPrompt }]
          }],
          generationConfig: {
            responseModalities: ['IMAGE']
          }
        })
      });

      const flashData = await flashRes.json();
      const partWithImage = flashData.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);

      if (partWithImage?.inlineData?.data) {
        const saved = this.saveBase64Image(partWithImage.inlineData.data, foodName);
        return {
          success: true,
          imageUrl: saved.relativeUrl,
          dataUrl: saved.dataUrl,
          filename: saved.filename,
          prompt: validation.cleanPrompt,
          model: 'gemini-2.5-flash-image'
        };
      }

      if (flashData.error) {
        logger.warn('[GeminiImageService] Flash Image API error:', flashData.error.message);
      }
    } catch (err) {
      logger.warn('[GeminiImageService] Flash Image attempt failed:', err.message);
    }

    // Under Rule 9: Never substitute another food's image or pretend success when generation failed
    return {
      success: false,
      statusCode: 503,
      message: 'Image generation unavailable. Please try again.',
      error: 'Upstream image generation unavailable or rate limit reached.'
    };
  }

  /**
   * Save a base64 encoded PNG to disk.
   */
  saveBase64Image(base64String, foodName = 'dish') {
    const cleanFoodName = (foodName || 'dish').toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    const filename = `foodova_${cleanFoodName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.png`;
    const filepath = path.join(this.uploadsDir, filename);

    const buffer = Buffer.from(base64String, 'base64');
    fs.writeFileSync(filepath, buffer);

    const relativeUrl = `/uploads/ai-generated/${filename}`;
    const dataUrl = `data:image/png;base64,${base64String}`;

    return {
      filename,
      relativeUrl,
      dataUrl
    };
  }

  /**
   * Get supported Canva creative design destinations and templates.
   */
  getCanvaWorkflow({ foodName, category, price } = {}) {
    return {
      workflow: 'external_creative_suite',
      destinations: {
        posters: 'https://www.canva.com/create/food-posters/',
        instagram: 'https://www.canva.com/create/instagram-posts/',
        banners: 'https://www.canva.com/create/banners/',
        menus: 'https://www.canva.com/create/restaurant-menus/',
        flyers: 'https://www.canva.com/create/flyers/'
      },
      metadata: {
        foodName: foodName || 'Special Dish',
        category: category || 'Signature',
        price: price || 249
      }
    };
  }

  /**
   * Generate structured gastronomic description using Gemini text models.
   */
  async generateFoodDescription({ foodName, category, description }) {
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key') {
      return {
        success: false,
        statusCode: 400,
        message: 'AI description service unavailable. GEMINI_API_KEY is not configured.'
      };
    }

    if (!foodName || !foodName.trim()) {
      return {
        success: false,
        statusCode: 400,
        message: 'Food name is required to generate description.'
      };
    }

    const systemPrompt = `You are a world-class restaurant menu writer and chef for FOODOVA, a premium dining brand.
Generate an accurate, mouth-watering description for the following dish:
Food Name: "${foodName.trim()}"
Category: "${category || 'General'}"
${description ? `Chef Notes: "${description}"` : ''}

You MUST reply with ONLY a single raw JSON object (no markdown fences, no explanatory text) matching this schema:
{
  "shortDescription": "1-2 appetizing sentences highlighting key textures, aromas, and flavors.",
  "detailedDescription": "3-4 sentences detailing artisanal preparation, quality of ingredients, and culinary inspiration.",
  "ingredients": ["fresh ingredient 1", "spice 2", "herb 3", "key component 4", "key component 5"],
  "tasteProfile": "e.g. Savory, aromatic, mildly spiced with golden garlic and saffron undertones.",
  "isVeg": true or false,
  "spiceLevel": "none" or "mild" or "medium" or "spicy" or "extra_spicy",
  "servingInfo": "e.g. Serves 1-2 hungry diners (approx 450g)",
  "nutrition": {
    "calories": 480,
    "protein": 24,
    "carbs": 52,
    "fat": 16
  }
}`;

    // Candidate models to try in order of priority
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro'];

    for (const model of modelsToTry) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json'
            }
          })
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          // Parse JSON
          const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          return {
            success: true,
            data: parsed,
            model
          };
        }
      } catch (err) {
        logger.warn(`[GeminiImageService] Model ${model} description generation failed:`, err.message);
      }
    }

    return {
      success: false,
      statusCode: 503,
      message: 'Description generation temporarily unavailable. Please try again.'
    };
  }
}

const geminiImageService = new GeminiImageService();
module.exports = geminiImageService;
