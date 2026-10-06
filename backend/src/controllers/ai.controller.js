const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const logger = require('../utils/logger');
const geminiImageService = require('../services/geminiImageService');

// AI Provider abstraction for general chat and recommendations
class AIProvider {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.available = false;
    this.init();
  }

  init() {
    try {
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key') {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use gemini-1.5-flash or gemini-3.8-flash
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        this.available = true;
        logger.info('✅ Gemini AI initialized');
      } else {
        logger.warn('⚠️  Gemini API key not configured. Using fallback AI.');
      }
    } catch (err) {
      logger.error('AI init error:', err.message);
    }
  }

  async generateResponse(prompt) {
    if (this.available && this.model) {
      try {
        const result = await this.model.generateContent(prompt);
        return result.response.text();
      } catch (e) {
        logger.warn('generateResponse failed, using fallback');
      }
    }
    return null;
  }
}

const aiProvider = new AIProvider();

// Build context from products
const buildMenuContext = async () => {
  const products = await Product.find({ isAvailable: true })
    .select('name description price discountPrice isVeg category rating tags spiceLevel')
    .populate('category', 'name')
    .limit(100)
    .lean();
  
  return products.map(p => 
    `${p.name} (${p.isVeg ? 'Veg' : 'Non-Veg'}, ₹${p.discountPrice || p.price}, ${p.category?.name}, Rating: ${p.rating?.average}/5)`
  ).join('\n');
};

// Smart fallback responses
const getFallbackResponse = (userMessage) => {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('veg') || msg.includes('vegetarian')) {
    return "We have a great selection of vegetarian options! Check out our Veg Royale Burgers, Paneer Tikka Wraps, and Farmhouse Pizzas. Would you like to explore the veg menu?";
  }
  if (msg.includes('budget') || msg.includes('under') || msg.includes('cheap') || msg.includes('₹')) {
    return "We have plenty of budget-friendly options! Our Sides start from ₹49, and Combos offer up to 40% OFF. Would you like me to show budget meals?";
  }
  if (msg.includes('spicy') || msg.includes('hot')) {
    return "If you love heat, try our Spicy Fiesta Chicken Burger or Fiery Peri Peri Fries! They are customer favorites with authentic spicy seasoning.";
  }
  if (msg.includes('combo') || msg.includes('meal')) {
    return "Our Saver Combos are the best value! They include a main burger/pizza + crispy fries + drink at a discounted price.";
  }
  if (msg.includes('dessert') || msg.includes('sweet')) {
    return "Satisfy your sweet tooth with our Molten Choco Lava Cake, Sundaes, or Belgian Waffles in the Desserts section!";
  }
  if (msg.includes('order') || msg.includes('track')) {
    return "To track your active order in real time, go to the Orders section in the top navigation bar.";
  }
  return "I'm Chef Nova, your FOODOVA culinary assistant! I can help you find dishes, suggest pairings, recommend meals under your budget, and explain ingredients.";
};

// POST /api/ai/chat and /api/v1/ai/chat
const chat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const menuContext = await buildMenuContext();
    
    let orderContext = '';
    if (req.user) {
      const recentOrders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('orderId status total createdAt')
        .lean();
      if (recentOrders.length) {
        orderContext = `\nUser's recent orders:\n${recentOrders.map(o => `#${o.orderId} - ${o.status} - ₹${o.total}`).join('\n')}`;
      }
    }

    const systemPrompt = `You are Chef Nova, FOODOVA's premium AI food assistant. You help customers find the perfect meal, explain ingredients, suggest combos, and answer menu questions.

Current FOODOVA Menu:
${menuContext}
${orderContext}

Guidelines:
- Be helpful, friendly, and concise (2-3 sentences max)
- Always recommend from the actual menu items shown above
- Use ₹ for prices (Indian Rupees)
- Never place orders directly - guide users to add items themselves
- For order tracking, direct users to the Orders section
- Respond in the same language as the user`;

    let response;
    
    if (aiProvider.available) {
      try {
        const history = conversationHistory.slice(-6).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));

        const chatSession = aiProvider.model.startChat({
          history,
          generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.7
          }
        });

        const result = await chatSession.sendMessage(`${systemPrompt}\n\nUser: ${message}`);
        response = result.response.text();
      } catch (aiErr) {
        logger.error('Gemini AI chat error:', aiErr.message);
        response = getFallbackResponse(message);
      }
    } else {
      response = getFallbackResponse(message);
    }

    res.status(200).json({ success: true, response, provider: aiProvider.available ? 'gemini' : 'fallback' });
  } catch (err) {
    logger.error('AI chat error:', err.message);
    res.status(500).json({ success: false, message: 'AI assistant temporarily unavailable.' });
  }
};

// POST /api/ai/recommend and /api/v1/ai/recommend
const recommend = async (req, res) => {
  try {
    const { preferences = {}, budget } = req.body;
    const { isVeg, category } = preferences;

    const query = { isAvailable: true };
    if (isVeg !== undefined) query.isVeg = isVeg;
    if (category) query.category = category;
    if (budget) query['$or'] = [
      { discountPrice: { $lte: budget } },
      { price: { $lte: budget }, discountPrice: { $exists: false } }
    ];

    const products = await Product.find(query)
      .sort({ 'rating.average': -1, isFeatured: -1 })
      .limit(6)
      .populate('category', 'name')
      .lean();

    let aiReasoning = null;
    if (aiProvider.available && products.length) {
      try {
        const productList = products.map(p => `${p.name} (₹${p.discountPrice || p.price})`).join(', ');
        const prompt = `Given these food options: ${productList}. A customer wants: ${JSON.stringify(preferences)}, budget: ₹${budget || 'any'}. Give a 1-sentence recommendation.`;
        aiReasoning = await aiProvider.generateResponse(prompt);
      } catch (err) {
        logger.error('AI recommend error:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      recommendations: products,
      aiReasoning: aiReasoning || 'Here are our top-rated dishes matching your taste profile!'
    });
  } catch (err) {
    logger.error('Recommend error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to get recommendations.' });
  }
};

/**
 * POST /api/v1/ai/generate-image and /api/ai/generate-image
 * Generates an appetizing food/product image using Gemini Image API
 */
const generateImage = async (req, res) => {
  try {
    const { prompt, foodName, category, description, style, background, aspectRatio } = req.body;

    if (!prompt && !foodName) {
      return res.status(400).json({
        success: false,
        message: 'Either prompt or foodName is required.'
      });
    }

    const result = await geminiImageService.generateImage({
      prompt,
      foodName,
      category,
      description,
      style,
      background,
      aspectRatio
    });

    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        success: false,
        message: result.message || 'Image generation unavailable. Please try again.',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      imageUrl: result.imageUrl,
      dataUrl: result.dataUrl,
      prompt: result.prompt,
      model: result.model
    });
  } catch (err) {
    logger.error('Generate image controller error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Image generation unavailable. Please try again.',
      error: err.message
    });
  }
};

/**
 * POST /api/v1/ai/generate-description and /api/ai/generate-description
 * Generates structured culinary attributes using Gemini text models
 */
const generateDescription = async (req, res) => {
  try {
    const { foodName, category, description } = req.body;

    if (!foodName || !foodName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Food name is required.'
      });
    }

    const result = await geminiImageService.generateFoodDescription({
      foodName,
      category,
      description
    });

    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        success: false,
        message: result.message || 'Description generation temporarily unavailable. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      data: result.data,
      model: result.model
    });
  } catch (err) {
    logger.error('Generate description controller error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Description generation failed. Please try again.'
    });
  }
};

/**
 * POST /api/v1/ai/save-food-image and /api/ai/save-food-image
 * Saves and associates the generated image with a food item in MongoDB
 */
const saveFoodImage = async (req, res) => {
  try {
    const {
      productId,
      imageUrl,
      foodName,
      category,
      description,
      price,
      isVeg = true,
      spiceLevel,
      ingredients,
      nutrition
    } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required to save image reference.'
      });
    }

    let product = null;

    // Option 1: Update existing product by ID
    if (productId) {
      product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found with specified ID.'
        });
      }

      product.thumbnail = imageUrl;
      product.image = imageUrl;
      product.aiGenerated = true;

      // Add to images list as primary
      if (!product.images) product.images = [];
      product.images.unshift({
        url: imageUrl,
        alt: product.name,
        isPrimary: true
      });

      if (description) product.description = description;
      if (ingredients && Array.isArray(ingredients)) product.ingredients = ingredients;
      if (nutrition) product.nutrition = nutrition;
      if (spiceLevel) product.spiceLevel = spiceLevel;

      await product.save();
    } else {
      // Option 2: Create new product in MongoDB with aiGenerated = true
      if (!foodName) {
        return res.status(400).json({
          success: false,
          message: 'Food name is required to create a new product.'
        });
      }

      // Resolve category
      let categoryDoc = null;
      if (category) {
        categoryDoc = await Category.findOne({
          $or: [{ name: new RegExp(`^${category}$`, 'i') }, { slug: category }]
        });
      }
      if (!categoryDoc) {
        categoryDoc = await Category.findOne();
      }

      product = new Product({
        name: foodName,
        category: categoryDoc ? categoryDoc._id : undefined,
        description: description || `Delicious freshly prepared ${foodName}`,
        price: Number(price) || 249,
        thumbnail: imageUrl,
        image: imageUrl,
        images: [{ url: imageUrl, alt: foodName, isPrimary: true }],
        isVeg: Boolean(isVeg),
        spiceLevel: spiceLevel || 'none',
        ingredients: Array.isArray(ingredients) ? ingredients : [],
        nutrition: nutrition || { calories: 450, protein: 18, carbs: 55, fat: 16 },
        aiGenerated: true,
        isAvailable: true
      });

      await product.save();
    }

    logger.info(`[AI Studio] Saved AI-generated image for product: ${product.name} (ID: ${product._id})`);

    res.status(200).json({
      success: true,
      message: `Image successfully saved and linked to ${product.name}.`,
      product: {
        _id: product._id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        image: product.image,
        thumbnail: product.thumbnail,
        aiGenerated: product.aiGenerated
      }
    });
  } catch (err) {
    logger.error('Save food image error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to save product image in database.',
      error: err.message
    });
  }
};

/**
 * GET /api/v1/ai/canva-workflow and /api/ai/canva-workflow
 * Returns officially supported Canva creative destinations without MCP
 */
const getCanvaWorkflow = (req, res) => {
  res.status(200).json({
    success: true,
    workflow: 'external_creative_suite',
    destinations: [
      {
        id: 'food_poster',
        name: 'Food & Restaurant Poster',
        description: 'Design printable high-res posters for stores, events & tables',
        url: 'https://www.canva.com/create/food-posters/'
      },
      {
        id: 'instagram_post',
        name: 'Instagram Square & Story',
        description: 'Engaging social media graphics optimized for Instagram & Facebook',
        url: 'https://www.canva.com/create/instagram-posts/'
      },
      {
        id: 'promo_banner',
        name: 'Promotional Offer Banner',
        description: 'Header and web banners for deals, discounts & seasonal specials',
        url: 'https://www.canva.com/create/banners/'
      },
      {
        id: 'menu_card',
        name: 'Digital & Print Menu Card',
        description: 'Artisanal menu layouts showcasing dishes and pricing',
        url: 'https://www.canva.com/create/restaurant-menus/'
      },
      {
        id: 'festival_promo',
        name: 'Festival & Holiday Specials',
        description: 'Celebratory holiday templates for Diwali, Eid, Christmas & New Year',
        url: 'https://www.canva.com/templates/?query=food+festival+promotion'
      }
    ]
  });
};

module.exports = {
  chat,
  recommend,
  generateImage,
  generateDescription,
  saveFoodImage,
  getCanvaWorkflow
};
