import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowLeft, 
  Image as ImageIcon, 
  RefreshCw, 
  Save, 
  ExternalLink, 
  Copy, 
  Check, 
  ChefHat, 
  Layers, 
  AlertCircle,
  Flame,
  CheckCircle2,
  Tag,
  Palette,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatPrice } from '../../utils/helpers';

export const AIFoodStudio = () => {
  const [categories, setCategories] = useState([]);
  const [existingProducts, setExistingProducts] = useState([]);

  // Form State
  const [foodName, setFoodName] = useState('Chicken Biryani');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('Premium Restaurant Photography');
  const [background, setBackground] = useState('Dark luxury ambient restaurant background');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [price, setPrice] = useState(249);
  const [isVeg, setIsVeg] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');

  // Generation State
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generationError, setGenerationError] = useState('');
  const [savingImage, setSavingImage] = useState(false);

  // Description Generation State
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [aiDescriptionData, setAiDescriptionData] = useState(null);

  // Canva Workflow State
  const [showCanvaModal, setShowCanvaModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const styleOptions = [
    'Premium Restaurant Photography',
    'Artisanal Gourmet Food Styling',
    'Macro Close-up Culinary Shot',
    'Rustic Stone Table Setting',
    'Cinematic Moody Food Studio'
  ];

  const backgroundOptions = [
    'Dark luxury ambient restaurant background',
    'Polished dark marble countertop with subtle bokeh',
    'Warm rustic oak timber dining table',
    'Modern fine-dining restaurant bokeh',
    'Clean minimalist studio background'
  ];

  const canvaWorkflows = [
    {
      title: 'Pizza Festival Poster & Banner',
      desc: 'Eye-catching Italian woodfired pizza promotional flyers and social banners',
      url: 'https://www.canva.com/templates/?query=pizza+restaurant+poster',
      icon: '🍕'
    },
    {
      title: 'Cool Drinks & Summer Beverages',
      desc: 'Vibrant chilled drinks, cocktails and smoothie board designs',
      url: 'https://www.canva.com/templates/?query=drinks+cocktail+summer+menu',
      icon: '🥤'
    },
    {
      title: 'Chips & Crunchy Snacks Flyer',
      desc: 'Crispy fries, loaded nachos and snack combo promotions',
      url: 'https://www.canva.com/templates/?query=french+fries+fast+food+banner',
      icon: '🍟'
    },
    {
      title: 'Food Poster & Billboard',
      desc: 'Print-ready high-resolution promotional poster for restaurant display',
      url: 'https://www.canva.com/create/food-posters/',
      icon: '🖼️'
    },
    {
      title: 'Instagram Post & Story',
      desc: 'Square & portrait graphics optimized for social feeds and reels',
      url: 'https://www.canva.com/create/instagram-posts/',
      icon: '📱'
    },
    {
      title: 'Special Offer & Discount Banner',
      desc: 'Promotional graphics for 20-50% off deals, seasonal sales & combos',
      url: 'https://www.canva.com/create/banners/',
      icon: '🏷️'
    },
    {
      title: 'Digital & Print Menu Card',
      desc: 'Artisanal menu layout showcasing dish name, pricing and ingredients',
      url: 'https://www.canva.com/create/restaurant-menus/',
      icon: '📜'
    },
    {
      title: 'Festival & Holiday Campaign',
      desc: 'Festival promotion templates for Diwali, Eid, Christmas & New Year',
      url: 'https://www.canva.com/templates/?query=food+festival+promotion',
      icon: '🎉'
    }
  ];

  // Fetch categories and products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=50')
        ]);

        if (catRes.data?.success && catRes.data.categories?.length) {
          setCategories(catRes.data.categories);
          setCategory(catRes.data.categories[0].name);
        }
        if (prodRes.data?.success && prodRes.data.products?.length) {
          setExistingProducts(prodRes.data.products);
        }
      } catch (err) {
        console.warn('Initial data load failed:', err);
      }
    };
    fetchData();
  }, []);

  // When admin selects an existing product
  const handleProductSelect = (id) => {
    setSelectedProductId(id);
    if (!id) return;
    const found = existingProducts.find(p => p._id === id);
    if (found) {
      setFoodName(found.name);
      setDescription(found.description || '');
      setPrice(found.price || 249);
      setIsVeg(found.isVeg || false);
      if (found.category?.name) setCategory(found.category.name);
      if (found.thumbnail || found.image) setGeneratedImage(found.thumbnail || found.image);
    }
  };

  // 1. Generate Food Image via Gemini API
  const handleGenerateImage = async () => {
    if (!foodName.trim()) {
      toast.error('Please enter a food name.');
      return;
    }

    setGeneratingImage(true);
    setGenerationError('');

    try {
      const res = await api.post('/v1/ai/generate-image', {
        foodName: foodName.trim(),
        category,
        description,
        style,
        background,
        aspectRatio
      });

      if (res.data?.success && (res.data.imageUrl || res.data.dataUrl)) {
        setGeneratedImage(res.data.imageUrl || res.data.dataUrl);
        setGeneratedPrompt(res.data.prompt || '');
        toast.success('Food image generated with Gemini!');
      } else {
        throw new Error(res.data?.message || 'Image generation unavailable. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Image generation unavailable. Please try again.';
      setGenerationError(msg);
      toast.error(msg);
    } finally {
      setGeneratingImage(false);
    }
  };

  // 2. Generate Food Description via Gemini API
  const handleGenerateDescription = async () => {
    if (!foodName.trim()) {
      toast.error('Please enter a food name first.');
      return;
    }

    setGeneratingDesc(true);

    try {
      const res = await api.post('/v1/ai/generate-description', {
        foodName: foodName.trim(),
        category,
        description
      });

      if (res.data?.success && res.data.data) {
        const d = res.data.data;
        setAiDescriptionData(d);
        if (d.shortDescription) setDescription(d.shortDescription);
        if (d.isVeg !== undefined) setIsVeg(d.isVeg);
        toast.success('Generated gastronomic description & nutrition facts!');
      } else {
        throw new Error('Description generation failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not generate food description.');
    } finally {
      setGeneratingDesc(false);
    }
  };

  // 3. Save Image & Associate with Product in MongoDB
  const handleSaveImage = async () => {
    if (!generatedImage) {
      toast.error('No generated image to save.');
      return;
    }

    setSavingImage(true);

    try {
      const payload = {
        productId: selectedProductId || undefined,
        imageUrl: generatedImage,
        foodName: foodName.trim(),
        category,
        description,
        price,
        isVeg,
        ingredients: aiDescriptionData?.ingredients || [],
        nutrition: aiDescriptionData?.nutrition || undefined,
        spiceLevel: aiDescriptionData?.spiceLevel || 'none'
      };

      const res = await api.post('/v1/ai/save-image', payload);

      if (res.data?.success) {
        toast.success(`Image saved and linked to "${foodName}" in MongoDB!`);
        // Refresh product list
        const refreshed = await api.get('/products?limit=50');
        if (refreshed.data?.success) {
          setExistingProducts(refreshed.data.products);
        }
      } else {
        throw new Error(res.data?.message || 'Failed to save image in database.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save image.');
    } finally {
      setSavingImage(false);
    }
  };

  // Copy details for Canva
  const handleCopyForCanva = () => {
    const textToCopy = `Food: ${foodName}\nPrice: ₹${price}\nDescription: ${description}\nImage: ${window.location.origin}${generatedImage || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    toast.success('Food details & image link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Open Canva Destination
  const handleOpenCanva = (destinationUrl) => {
    handleCopyForCanva();
    window.open(destinationUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin" className="text-xs font-bold text-gray-400 hover:text-purple-600 flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h1 className="font-display font-black text-3xl text-dark-900 tracking-tight">
                AI FOOD STUDIO
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Gemini-powered food photography, automated menu copywriting & Canva design workflows.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCanvaModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            <Palette className="w-4 h-4" />
            <span>Design in Canva</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Parameters & Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display font-bold text-dark-900 text-base flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-purple-600" />
                <span>Food Item Specifications</span>
              </h3>
              <span className="text-[11px] text-gray-400 font-semibold">Gemini Food Engine</span>
            </div>

            {/* Optional: Link with existing product */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Link to Existing Menu Dish (Optional)
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="input text-xs"
              >
                <option value="">-- Create As New Dish --</option>
                {existingProducts.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} (₹{p.price})
                  </option>
                ))}
              </select>
            </div>

            {/* 1-Click Creative Presets */}
            <div className="bg-purple-50/60 rounded-2xl p-3 border border-purple-100">
              <label className="text-xs font-bold text-purple-900 block mb-2 flex items-center justify-between">
                <span>⚡ 1-Click Creative Presets</span>
                <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wide">Gemini & Canva Ready</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setFoodName('Farmhouse Loaded Supreme Pizza');
                    setCategory('Pizza');
                    setDescription('Hand-tossed crust with bubbling mozzarella, fresh basil, button mushrooms, black olives, and sweet corn');
                    setStyle('Artisanal Gourmet Food Styling');
                    setBackground('Rustic Stone Table Setting');
                    setPrice(399);
                    setIsVeg(true);
                    toast.success('Loaded Gourmet Pizza Preset!');
                  }}
                  className="p-1.5 rounded-xl bg-white hover:bg-purple-100/70 text-purple-950 border border-purple-200/80 text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                >
                  <span>🍕</span> <span>Pizza</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFoodName('Sparkling Mint Lime Mojito Cooler');
                    setCategory('Beverages');
                    setDescription('Tall frosted condensation glass with crushed ice, fresh spearmint, lime wheel, and rising sparkling soda bubbles');
                    setStyle('Macro Close-up Culinary Shot');
                    setBackground('Polished dark marble countertop with subtle bokeh');
                    setPrice(149);
                    setIsVeg(true);
                    toast.success('Loaded Cool Drinks Preset!');
                  }}
                  className="p-1.5 rounded-xl bg-white hover:bg-cyan-100/70 text-cyan-950 border border-cyan-200/80 text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                >
                  <span>🥤</span> <span>Cool Drinks</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFoodName('Peri-Peri Golden Crinkle Cut Fries');
                    setCategory('Fries & Sides');
                    setDescription('Deep-ridged golden potato fries tossed in fiery African bird eye peri-peri seasoning with warm cheese dip and herbs');
                    setStyle('Premium Restaurant Photography');
                    setBackground('Dark luxury ambient restaurant background');
                    setPrice(129);
                    setIsVeg(true);
                    toast.success('Loaded Chips & Fries Preset!');
                  }}
                  className="p-1.5 rounded-xl bg-white hover:bg-amber-100/70 text-amber-950 border border-amber-200/80 text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                >
                  <span>🍟</span> <span>Chips & Fries</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFoodName('Triple Smash Cheddar Monster Burger');
                    setCategory('Burgers');
                    setDescription('Ultra-crisp smashed beef patties with caramelized lacy edges, double melted cheddar, and secret house sauce');
                    setStyle('Cinematic Moody Food Studio');
                    setBackground('Warm rustic oak timber dining table');
                    setPrice(399);
                    setIsVeg(false);
                    toast.success('Loaded Gourmet Burger Preset!');
                  }}
                  className="p-1.5 rounded-xl bg-white hover:bg-rose-100/70 text-rose-950 border border-rose-200/80 text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                >
                  <span>🍔</span> <span>Burger</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFoodName('Crunchy Golden Fried Chicken (6 Pc)');
                    setCategory('Fried Chicken');
                    setDescription('Extra crunchy golden drumsticks with 11 secret herbs and spices with creamy buttermilk dipping sauce');
                    setStyle('Premium Restaurant Photography');
                    setBackground('Dark luxury ambient restaurant background');
                    setPrice(399);
                    setIsVeg(false);
                    toast.success('Loaded Fried Chicken Preset!');
                  }}
                  className="p-1.5 rounded-xl bg-white hover:bg-orange-100/70 text-orange-950 border border-orange-200/80 text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                >
                  <span>🍗</span> <span>Chicken</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFoodName('Warm Molten Belgian Choco Lava Cake');
                    setCategory('Desserts');
                    setDescription('Decadent dark chocolate molten cake with flowing liquid Belgian ganache center and vanilla gelato scoop');
                    setStyle('Artisanal Gourmet Food Styling');
                    setBackground('Modern fine-dining restaurant bokeh');
                    setPrice(149);
                    setIsVeg(true);
                    toast.success('Loaded Molten Dessert Preset!');
                  }}
                  className="p-1.5 rounded-xl bg-white hover:bg-pink-100/70 text-pink-950 border border-pink-200/80 text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                >
                  <span>🍰</span> <span>Dessert</span>
                </button>
              </div>
            </div>

            {/* Food Name */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Food Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Chicken Biryani, Truffle Burger, Stonebaked Pizza"
                className="input text-xs"
              />
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input text-xs"
                >
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Biryani">Biryani</option>
                  <option value="Specialties">Specialties</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input text-xs"
                />
              </div>
            </div>

            {/* Diet & Veg Toggle */}
            <div className="flex items-center justify-between p-3 bg-cream-50 rounded-2xl border border-gray-100">
              <span className="text-xs font-bold text-dark-900">Dietary Classification:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsVeg(true)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                    isVeg ? 'bg-green-600 text-white border-green-600 shadow-xs' : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  Pure Veg
                </button>
                <button
                  type="button"
                  onClick={() => setIsVeg(false)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                    !isVeg ? 'bg-red-600 text-white border-red-600 shadow-xs' : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  Non-Veg
                </button>
              </div>
            </div>

            {/* Image Style & Background */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Image Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="input text-xs"
                >
                  {styleOptions.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Background Setting</label>
                <select
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="input text-xs"
                >
                  {backgroundOptions.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Image Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {['1:1', '4:3', '16:9'].map(ar => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => setAspectRatio(ar)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      aspectRatio === ar
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-dark-700 border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    {ar} {ar === '1:1' ? '(Square)' : ar === '4:3' ? '(Standard)' : '(Wide)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">Food Description & Notes</label>
                <button
                  type="button"
                  disabled={generatingDesc}
                  onClick={handleGenerateDescription}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 disabled:opacity-50"
                >
                  {generatingDesc ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>Generate Description</span>
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Aromatic basmati rice, tender chicken, saffron, fried onions, and authentic royal spices..."
                className="input text-xs"
              />
            </div>

            {/* Action Button: Generate Image */}
            <button
              type="button"
              disabled={generatingImage}
              onClick={handleGenerateImage}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-500 hover:from-purple-700 hover:to-brand-600 disabled:opacity-50 text-white font-black text-sm shadow-md hover:shadow-brand transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              {generatingImage ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Food Photography with Gemini...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Generate Food Image</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Preview & Canva Actions */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Generated Image Preview Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display font-bold text-dark-900 text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-500" />
                <span>AI Image Preview</span>
              </h3>
              {generatedImage && (
                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Ready to Assign
                </span>
              )}
            </div>

            {/* Canvas / Image Display */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-cream-100 border border-gray-200/80 flex items-center justify-center">
              {generatingImage ? (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center animate-bounce-soft">
                    <Sparkles className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-900 text-sm">Rendering Gourmet Photography...</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs">
                      Gemini is generating hyper-realistic food textures, studio lighting, and presentation.
                    </p>
                  </div>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt={foodName}
                  className="w-full h-full object-cover"
                />
              ) : generationError ? (
                <div className="p-6 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="font-bold text-dark-900 text-sm">Image generation unavailable. Please try again.</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    {generationError}
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center space-y-2 text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-xs font-semibold">Enter food details on the left and click "Generate Food Image".</p>
                </div>
              )}

              {/* Veg / Non-veg badge overlay if image present */}
              {generatedImage && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-1.5 rounded-lg shadow-sm border border-gray-200">
                  <div className={`w-3.5 h-3.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                </div>
              )}
            </div>

            {/* Action Bar for Generated Image */}
            {generatedImage && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={generatingImage}
                    onClick={handleGenerateImage}
                    className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-dark-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>

                  <button
                    type="button"
                    disabled={savingImage}
                    onClick={handleSaveImage}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    {savingImage ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Save to Menu / Dish</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCanvaModal(true)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  <span>Design in Canva (Food Posters, Banners, Social)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* AI Structured Culinary Preview */}
          {aiDescriptionData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-purple-100 shadow-card space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="font-display font-bold text-dark-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI Generated Culinary Profile</span>
                </h4>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  Gemini Structured
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {aiDescriptionData.detailedDescription && (
                  <div>
                    <span className="text-gray-400 font-bold block mb-0.5">DETAILED DESCRIPTION:</span>
                    <p className="text-dark-800 leading-relaxed">{aiDescriptionData.detailedDescription}</p>
                  </div>
                )}

                {aiDescriptionData.ingredients?.length > 0 && (
                  <div>
                    <span className="text-gray-400 font-bold block mb-1">KEY INGREDIENTS:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiDescriptionData.ingredients.map((ing, i) => (
                        <span key={i} className="bg-gray-100 text-dark-800 px-2.5 py-0.5 rounded-lg text-[11px] font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {aiDescriptionData.tasteProfile && (
                  <div>
                    <span className="text-gray-400 font-bold block mb-0.5">TASTE PROFILE:</span>
                    <p className="text-dark-800 font-medium">{aiDescriptionData.tasteProfile}</p>
                  </div>
                )}

                {aiDescriptionData.nutrition && (
                  <div>
                    <span className="text-gray-400 font-bold block mb-1">NUTRITIONAL ESTIMATE:</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="p-2 bg-cream-50 rounded-xl border border-gray-100">
                        <span className="text-gray-400 block text-[9px]">CALORIES</span>
                        <span className="font-bold text-dark-900">{aiDescriptionData.nutrition.calories} kcal</span>
                      </div>
                      <div className="p-2 bg-cream-50 rounded-xl border border-gray-100">
                        <span className="text-gray-400 block text-[9px]">PROTEIN</span>
                        <span className="font-bold text-dark-900">{aiDescriptionData.nutrition.protein}g</span>
                      </div>
                      <div className="p-2 bg-cream-50 rounded-xl border border-gray-100">
                        <span className="text-gray-400 block text-[9px]">CARBS</span>
                        <span className="font-bold text-dark-900">{aiDescriptionData.nutrition.carbs}g</span>
                      </div>
                      <div className="p-2 bg-cream-50 rounded-xl border border-gray-100">
                        <span className="text-gray-400 block text-[9px]">FAT</span>
                        <span className="font-bold text-dark-900">{aiDescriptionData.nutrition.fat}g</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </div>

      </div>

      {/* Canva Creative Studio Modal */}
      <AnimatePresence>
        {showCanvaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCanvaModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-100 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    C
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xl text-dark-900">
                      Canva Creative Design Studio
                    </h3>
                    <p className="text-xs text-gray-500">
                      Turn "{foodName}" into promotional campaigns, banners, and menus.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCanvaModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-dark-900"
                >
                  ✕
                </button>
              </div>

              {/* Clipboard auto copy helper */}
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-teal-900">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Clicking any template copies the food specs & image link to your clipboard.</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyForCanva}
                  className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shrink-0"
                >
                  {copiedLink ? 'Copied!' : 'Copy Info'}
                </button>
              </div>

              {/* Design Template Destinations */}
              <div className="space-y-2.5">
                {canvaWorkflows.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpenCanva(item.url)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-bold text-dark-900 text-xs group-hover:text-teal-700 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>

              {/* Safe Fallback Action */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenCanva('https://www.canva.com/templates/?query=restaurant+food+delivery')}
                  className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>Open in Canva (Browse All Food Templates)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowCanvaModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-dark-800 text-xs font-bold hover:bg-gray-200"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AIFoodStudio;
