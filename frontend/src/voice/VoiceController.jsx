import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Send,
  HelpCircle,
  Sparkles,
  Pizza,
  Coffee,
  ShoppingBag,
  Film,
  CreditCard,
  UserCheck,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BURGERS_DATA, OTHER_PRODUCTS_DATA } from '../data/mockData';

const ALL_PRODUCTS = [...BURGERS_DATA, ...OTHER_PRODUCTS_DATA];

export const VoiceController = ({ isActive, onClose }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAction, setLastAction] = useState('Voice assistant ready. Say or click any command!');
  const [confirmationPending, setConfirmationPending] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [manualCommand, setManualCommand] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [activeTab, setActiveTab] = useState('popular'); // 'popular' | 'food' | 'cart' | 'auth'

  const recognitionRef = useRef(null);
  const isStartingRef = useRef(false);
  const restartTimerRef = useRef(null);
  const audioIntervalRef = useRef(null);
  const navigate = useNavigate();
  const { items, addItem, updateQuantity, clearCart, applyCoupon } = useCart();
  const { logout, user } = useAuth();

  // Speak aloud via Web Speech API Text-to-Speech
  const speakResponse = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (naturalVoice) utterance.voice = naturalVoice;
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (!isActive) {
      cleanupRecognition();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      toast('Speech recognition not supported in this browser. Use voice terminal below.', { icon: '🎙️' });
      return;
    }

    setSpeechSupported(true);
    initRecognition(SpeechRecognition);

    return () => {
      cleanupRecognition();
    };
  }, [isActive]);

  const initRecognition = (SpeechRecognition) => {
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';

      recognition.onstart = () => {
        isStartingRef.current = false;
        setListening(true);
        startAudioWave();
      };

      recognition.onresult = (event) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript;
          } else {
            interimStr += event.results[i][0].transcript;
          }
        }

        const heard = (finalStr || interimStr).trim();
        if (heard) {
          setTranscript(heard);
          if (finalStr) {
            handleVoiceCommand(finalStr.toLowerCase().trim());
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('Voice recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Microphone blocked. Please allow mic access in your browser or use the input box below.');
          setListening(false);
        }
      };

      recognition.onend = () => {
        setListening(false);
        stopAudioWave();
        if (isActive && !isStartingRef.current) {
          restartTimerRef.current = setTimeout(() => {
            try {
              isStartingRef.current = true;
              recognition.start();
            } catch (e) {
              isStartingRef.current = false;
            }
          }, 400);
        }
      };

      try {
        isStartingRef.current = true;
        recognition.start();
        recognitionRef.current = recognition;
        toast.success('Voice active! Say "Show pizza", "Add double burger", or "Checkout".');
      } catch (err) {
        console.warn('Failed initial speech start:', err);
        isStartingRef.current = false;
      }
    } catch (err) {
      console.warn('SpeechRecognition init error:', err);
      setSpeechSupported(false);
    }
  };

  const cleanupRecognition = () => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    stopAudioWave();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }
    setListening(false);
  };

  const startAudioWave = () => {
    stopAudioWave();
    audioIntervalRef.current = setInterval(() => {
      setAudioLevel(Math.floor(Math.random() * 80) + 20);
    }, 150);
  };

  const stopAudioWave = () => {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    setAudioLevel(0);
  };

  // Helper to extract quantity words ('two', 'three', '2', etc.)
  const parseQuantityAndProduct = (query) => {
    let quantity = 1;
    let clean = query.replace(/^(add|order|buy|get|put)\s+/i, '').trim();

    const numberWords = {
      'one': 1, 'a': 1, 'an': 1,
      'two': 2, '2': 2, 'double': 1,
      'three': 3, '3': 3,
      'four': 4, '4': 4,
      'five': 5, '5': 5
    };

    const firstWord = clean.split(' ')[0];
    if (numberWords[firstWord] && clean.split(' ').length > 1) {
      quantity = numberWords[firstWord];
      clean = clean.replace(new RegExp(`^${firstWord}\\s+`, 'i'), '').trim();
    }

    // Match product in catalog
    let matched = null;
    // 1. Exact name match or substring
    matched = ALL_PRODUCTS.find(p => p.name.toLowerCase().includes(clean));
    if (!matched) {
      // 2. Keyword tokens
      const tokens = clean.split(' ').filter(t => t.length > 2);
      for (const token of tokens) {
        const found = ALL_PRODUCTS.find(p => 
          p.name.toLowerCase().includes(token) || 
          (p.category && (typeof p.category === 'string' ? p.category : p.category.name).toLowerCase().includes(token))
        );
        if (found) {
          matched = found;
          break;
        }
      }
    }
    if (!matched) matched = ALL_PRODUCTS[0];

    return { product: matched, quantity };
  };

  // Comprehensive Voice Intent Parser - Controls Entire Website From Start To Finish
  const handleVoiceCommand = (cmd) => {
    const command = cmd.toLowerCase().trim();
    if (!command) return;

    setTranscript(command);

    // Confirmation handler for critical actions (Logout, Place Order)
    if (confirmationPending) {
      if (command.includes('yes') || command.includes('confirm') || command.includes('proceed') || command.includes('ok') || command.includes('sure')) {
        confirmationPending.action();
        setLastAction(`Confirmed: ${confirmationPending.title}`);
        speakResponse(`Confirmed! ${confirmationPending.title}`);
        toast.success(`Confirmed: ${confirmationPending.title}`);
        setConfirmationPending(null);
        return;
      } else if (command.includes('no') || command.includes('cancel') || command.includes('stop') || command.includes('never mind')) {
        setLastAction('Action cancelled.');
        speakResponse('Action cancelled.');
        toast('Action cancelled');
        setConfirmationPending(null);
        return;
      }
    }

    // ── 1. AUTHENTICATION & ACCOUNT LIFECYCLE ──────────────────────────
    if (command.includes('sign in as customer') || command.includes('login customer') || command.includes('demo customer')) {
      navigate('/login');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('foodova:quick-login-customer'));
      }, 100);
      const msg = 'Logging you in as Customer demo account!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('sign in as admin') || command.includes('login admin') || command.includes('demo admin')) {
      navigate('/login');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('foodova:quick-login-admin'));
      }, 100);
      const msg = 'Logging you in as Admin administrator account!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command === 'login' || command === 'sign in' || command.includes('open login') || command.includes('go to login')) {
      navigate('/login');
      const msg = 'Opening sign in page!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('register') || command.includes('create account') || command.includes('sign up') || command.includes('new account')) {
      navigate('/register');
      const msg = 'Opening account creation page!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('forgot password') || command.includes('reset password') || command.includes('lost password')) {
      navigate('/forgot-password');
      const msg = 'Opening password reset page to send your email OTP!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('profile') || command.includes('my profile') || command.includes('my account') || command.includes('settings')) {
      navigate('/profile');
      const msg = 'Opening your profile and saved addresses!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('logout') || command.includes('sign out') || command.includes('log off')) {
      setConfirmationPending({
        title: 'Sign out of your FOODOVA account',
        action: () => {
          logout();
          navigate('/');
        }
      });
      const msg = 'Are you sure you want to sign out? Say YES to confirm or NO to cancel.';
      setLastAction(msg);
      speakResponse(msg);
      return;
    }

    // ── 2. ADMIN DASHBOARD & CONTROLS ──────────────────────────────────
    if (command.includes('admin orders') || command.includes('manage orders')) {
      navigate('/admin/orders');
      const msg = 'Opening Admin orders management table!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('admin products') || command.includes('manage products') || command.includes('manage menu')) {
      navigate('/admin/products');
      const msg = 'Opening Admin menu and products catalog!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('admin users') || command.includes('manage users')) {
      navigate('/admin/users');
      const msg = 'Opening Admin users directory!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('admin panel') || command.includes('admin dashboard') || command === 'admin') {
      navigate('/admin');
      const msg = 'Opening FOODOVA Admin Dashboard!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    // ── 3. ORDERS HISTORY & LIVE TRACKING ──────────────────────────────
    if (
      command.includes('my order') || 
      command.includes('my orders') || 
      command.includes('show order') || 
      command.includes('show orders') || 
      command.includes('track') || 
      command.includes('where is my food') ||
      command === 'orders' ||
      command === 'order status'
    ) {
      navigate('/orders');
      const msg = 'Opening your orders history and live delivery tracking!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    // ── 4. 4K BURGER REVEAL VIDEO & STUDIO ─────────────────────────────
    if (command.includes('play video') || command.includes('watch video') || command.includes('burger video') || command.includes('reveal video')) {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 380, behavior: 'smooth' });
        window.dispatchEvent(new CustomEvent('foodova:play-video'));
      }, 150);
      const msg = 'Playing the 4K Cinematic Burger Reveal Video!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('pause video') || command.includes('stop video')) {
      window.dispatchEvent(new CustomEvent('foodova:pause-video'));
      const msg = 'Paused the reveal video.';
      setLastAction(msg);
      speakResponse(msg);
      return;
    }

    if (command.includes('mute video') || command.includes('unmute video') || command.includes('video sound') || command.includes('audio video')) {
      window.dispatchEvent(new CustomEvent('foodova:toggle-video-mute'));
      const msg = 'Toggled video audio!';
      setLastAction(msg);
      speakResponse(msg);
      return;
    }

    if (command.includes('next video') || command.includes('change video') || command.includes('another burger')) {
      window.dispatchEvent(new CustomEvent('foodova:next-video'));
      const msg = 'Switched to next gourmet reveal shot!';
      setLastAction(msg);
      speakResponse(msg);
      return;
    }

    if (command.includes('food studio') || command.includes('ai studio') || command.includes('generate burger') || command.includes('studio')) {
      navigate('/menu');
      const msg = 'Opening Menu & Gourmet Food Studio!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    // ── 5. CATEGORY BROWSING ───────────────────────────────────────────
    if (command.includes('pizza') || command.includes('pizzas')) {
      navigate('/menu?category=pizza');
      const msg = 'Showing our 8 Gourmet Artisan Pizzas!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (
      command.includes('drink') || 
      command.includes('drinks') || 
      command.includes('beverage') || 
      command.includes('beverages') || 
      command.includes('mojito') || 
      command.includes('cooler') ||
      command.includes('slush') ||
      command.includes('coke')
    ) {
      navigate('/menu?category=beverages');
      const msg = 'Opening 8 Refreshing Cool Drinks & Mocktails!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (
      command.includes('chip') || 
      command.includes('chips') || 
      command.includes('fry') || 
      command.includes('fries') || 
      command.includes('snack') || 
      command.includes('snacks') ||
      command.includes('nachos')
    ) {
      navigate('/menu?category=fries-sides');
      const msg = 'Opening 8 Crunchy Chips, Golden Fries & Sides!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('burger') || command.includes('burgers')) {
      navigate('/menu?category=burgers');
      const msg = 'Showing our 24 delicious handcrafted burgers!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('chicken') || command.includes('wings') || command.includes('bucket')) {
      navigate('/menu?category=fried-chicken');
      const msg = 'Showing Crispy Fried Chicken & Strips!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('combo') || command.includes('combos') || command.includes('meal') || command.includes('deals')) {
      navigate('/menu?category=combos');
      const msg = 'Opening Feast Combos and Value Meals!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('dessert') || command.includes('desserts') || command.includes('sweet') || command.includes('lava') || command.includes('cake')) {
      navigate('/menu?category=desserts');
      const msg = 'Opening Molten Desserts & Sweet Treats!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    // ── 6. DIETARY & SEARCH FILTERS ────────────────────────────────────
    if (command.includes('vegetarian') || command.includes('veg only') || command.includes('show veg') || command.includes('pure veg')) {
      navigate('/menu?category=burgers&veg=true');
      const msg = 'Filtered 100% vegetarian dishes!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('non veg') || command.includes('non vegetarian') || command.includes('all food')) {
      navigate('/menu?category=burgers');
      const msg = 'Displaying complete delicious menu!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.startsWith('search') || command.startsWith('find')) {
      const query = command.replace(/^(search|find)\s+/i, '').trim();
      navigate(`/menu?search=${encodeURIComponent(query)}`);
      const msg = `Searching menu for "${query}"!`;
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    // ── 7. CART ACTIONS ────────────────────────────────────────────────
    if (command.includes('clear cart') || command.includes('empty cart')) {
      clearCart();
      const msg = 'Your shopping cart has been emptied.';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('cart') || command.includes('my cart') || command.includes('show cart') || command.includes('view cart')) {
      navigate('/cart');
      const msg = `Opening your shopping cart with ${items.length} items!`;
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('increase quantity') || command.includes('add one more') || command.includes('more quantity')) {
      if (items.length > 0) {
        const last = items[items.length - 1];
        updateQuantity(last.id, last.quantity + 1);
        const msg = `Increased ${last.name} to ${last.quantity + 1}!`;
        setLastAction(msg);
        speakResponse(msg);
        toast.success(msg);
      } else {
        const msg = 'Your cart is currently empty.';
        setLastAction(msg);
        speakResponse(msg);
      }
      return;
    }

    if (command.includes('decrease quantity') || command.includes('remove one') || command.includes('less quantity')) {
      if (items.length > 0) {
        const last = items[items.length - 1];
        if (last.quantity > 1) {
          updateQuantity(last.id, last.quantity - 1);
          const msg = `Decreased ${last.name} to ${last.quantity - 1}.`;
          setLastAction(msg);
          speakResponse(msg);
          toast.success(msg);
        } else {
          toast('Quantity is already 1. Say "clear cart" to empty.');
        }
      }
      return;
    }

    if (command.includes('apply coupon') || command.includes('use coupon') || command.includes('discount code') || command.includes('foodova50')) {
      applyCoupon('FOODOVA50');
      const msg = 'Applied 20% discount coupon FOODOVA50!';
      setLastAction(msg);
      speakResponse(msg);
      return;
    }

    // ── 8. CHECKOUT & PAYMENT SELECTION ────────────────────────────────
    if (command.includes('cash on delivery') || command === 'cod' || command.includes('pay cod')) {
      window.dispatchEvent(new CustomEvent('foodova:select-payment', { detail: 'cod' }));
      const msg = 'Selected Cash on Delivery payment!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('online payment') || command.includes('pay online') || command.includes('card payment') || command.includes('upi')) {
      window.dispatchEvent(new CustomEvent('foodova:select-payment', { detail: 'online' }));
      const msg = 'Selected Online Payment method!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    if (command.includes('place order') || command.includes('confirm order')) {
      if (window.location.pathname !== '/checkout') {
        navigate('/checkout');
        const msg = 'Navigating to checkout. Say "CONFIRM ORDER" or "YES" to place your order!';
        setLastAction(msg);
        speakResponse(msg);
        toast.success(msg);
      } else {
        setConfirmationPending({
          title: 'Place your food order now',
          action: () => {
            window.dispatchEvent(new CustomEvent('foodova:place-order'));
          }
        });
        const msg = 'Are you ready to place this order? Say YES to confirm or NO to cancel.';
        setLastAction(msg);
        speakResponse(msg);
      }
      return;
    }

    if (command.includes('checkout') || command.includes('proceed to checkout') || command.includes('pay now')) {
      navigate('/checkout');
      const msg = 'Proceeding directly to checkout!';
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    // ── 9. SMART ADD TO CART (E.g. "Add 2 Double Truffle", "Add Pepperoni Pizza", "Add Mojito")
    if (command.startsWith('add') || command.startsWith('buy') || command.startsWith('order') || command.includes('add to cart')) {
      const { product, quantity } = parseQuantityAndProduct(command);
      addItem(product, quantity);
      const msg = `Added ${quantity > 1 ? `${quantity}x ` : ''}${product.name} (₹${product.price * quantity}) to your cart!`;
      setLastAction(msg);
      speakResponse(msg);
      toast.success(msg);
      return;
    }

    // ── 10. PAGE NAVIGATION & GENERAL UTILITIES ────────────────────────
    if (command.includes('home') || command.includes('main page') || command === 'go home') {
      navigate('/');
      const msg = 'Returning to FOODOVA home page!';
      setLastAction(msg);
      speakResponse(msg);
      return;
    }

    if (command.includes('menu') || command.includes('all items') || command === 'open menu') {
      navigate('/menu');
      const msg = 'Opening our complete food menu!';
      setLastAction(msg);
      speakResponse(msg);
      return;
    }

    if (command.includes('scroll down') || command === 'down') {
      window.scrollBy({ top: 500, behavior: 'smooth' });
      setLastAction('Scrolled down');
      return;
    }

    if (command.includes('scroll up') || command === 'up') {
      window.scrollBy({ top: -500, behavior: 'smooth' });
      setLastAction('Scrolled up');
      return;
    }

    if (command.includes('top') || command.includes('scroll to top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLastAction('Scrolled to top');
      return;
    }

    if (command.includes('bottom') || command.includes('scroll to bottom')) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      setLastAction('Scrolled to bottom');
      return;
    }

    if (command.includes('go back') || command === 'back') {
      navigate(-1);
      setLastAction('Navigated back');
      return;
    }

    if (command.includes('refresh') || command.includes('reload')) {
      window.location.reload();
      return;
    }

    if (command.includes('close') || command.includes('exit voice') || command.includes('hide voice')) {
      speakResponse('Closing voice assistant.');
      onClose();
      return;
    }

    if (command.includes('help') || command.includes('commands') || command.includes('what can i say')) {
      const msg = 'You can ask me to: Show pizza, Show drinks, Add burger, Open cart, Checkout, Select cash on delivery, Place order, Sign in, or Play video!';
      setLastAction(msg);
      speakResponse(msg);
      toast(msg, { icon: '💡', duration: 5000 });
      return;
    }

    // Default Fallback
    const fallbackMsg = `Recognized "${command}". Try "Show pizza", "Add double burger", "Open cart", "Checkout", or "Place order".`;
    setLastAction(fallbackMsg);
    toast(fallbackMsg, { icon: '🎙️' });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCommand.trim()) return;
    handleVoiceCommand(manualCommand);
    setManualCommand('');
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        className="fixed bottom-6 left-4 sm:left-6 z-50 w-88 sm:w-100 bg-dark-900/95 backdrop-blur-xl text-white rounded-3xl shadow-2xl border border-brand-500/50 p-4 select-none overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              listening 
                ? 'bg-brand-500 text-white shadow-brand animate-pulse' 
                : 'bg-dark-800 text-gray-400'
            }`}>
              {listening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-brand-400">
                  Full Website Voice AI
                </span>
                <span className={`w-2 h-2 rounded-full ${listening ? 'bg-emerald-400 animate-ping' : 'bg-gray-500'}`} />
              </div>
              <span className="text-[10px] text-gray-400 block">
                {listening ? 'Listening... Speak any website command' : 'Tap mic or click chips below'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              title={ttsEnabled ? 'Mute Speech Voice' : 'Enable Speech Voice'}
              className={`p-1.5 rounded-xl transition-colors ${
                ttsEnabled ? 'bg-brand-500/20 text-brand-400' : 'bg-dark-800 text-gray-500'
              }`}
            >
              {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-dark-800 hover:bg-rose-500/30 text-gray-300 hover:text-rose-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Wave / Microphone Status Area */}
        <div className="my-3 p-3 rounded-2xl bg-dark-950 border border-dark-800 flex flex-col items-center justify-center text-center">
          
          {/* Animated Wave Bars */}
          <div className="flex items-center justify-center gap-1.5 h-8 mb-2">
            {[30, 60, 90, 45, 80, 50, 70, 35, 55, 75].map((height, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: listening ? [10, Math.max(8, (height * (audioLevel || 45)) / 100), 10] : 6,
                  backgroundColor: listening ? '#FF6B35' : '#4B5563'
                }}
                transition={{ 
                  duration: 0.35, 
                  repeat: Infinity, 
                  delay: i * 0.04,
                  ease: 'easeInOut' 
                }}
                className="w-1.5 rounded-full"
              />
            ))}
          </div>

          {/* Transcript / Action Status */}
          <p className="text-xs font-bold text-gray-100 line-clamp-2 px-1">
            {transcript ? `"${transcript}"` : lastAction}
          </p>

          {/* Confirmation Prompt Banner */}
          {confirmationPending && (
            <div className="mt-2 p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-[11px] text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Say <b>"YES"</b> to confirm or <b>"NO"</b> to cancel</span>
            </div>
          )}
        </div>

        {/* Category Tabs for Quick Commands */}
        <div className="flex items-center gap-1 mb-2 border-b border-dark-800 pb-1.5">
          {[
            { id: 'popular', label: '⚡ Popular' },
            { id: 'food', label: '🍕 Food' },
            { id: 'cart', label: '🛒 Cart & Pay' },
            { id: 'auth', label: '👤 Account' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Voice Command Chips (Categorized & Scrollable) */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
            {activeTab === 'popular' && [
              { label: '🍕 Show Pizza', cmd: 'show pizza' },
              { label: '🥤 Cool Drinks', cmd: 'show drinks' },
              { label: '🍟 Chips & Fries', cmd: 'show fries' },
              { label: '🎬 Play Video', cmd: 'play video' },
              { label: '➕ Add Truffle', cmd: 'add truffle burger' },
              { label: '💳 Checkout', cmd: 'checkout' },
              { label: '💵 Pay COD', cmd: 'cash on delivery' },
              { label: '📦 My Orders', cmd: 'my orders' }
            ].map(item => (
              <button
                key={item.cmd}
                onClick={() => handleVoiceCommand(item.cmd)}
                className="text-[10px] font-bold bg-dark-800 hover:bg-brand-500 hover:text-white text-gray-300 px-2 py-1 rounded-lg shrink-0 transition-all border border-dark-700 hover:border-brand-400 active:scale-95"
              >
                {item.label}
              </button>
            ))}

            {activeTab === 'food' && [
              { label: '🍔 24 Burgers', cmd: 'show burgers' },
              { label: '🍕 8 Pizzas', cmd: 'show pizza' },
              { label: '🥤 8 Cool Drinks', cmd: 'show drinks' },
              { label: '🍟 8 Chips & Fries', cmd: 'show fries' },
              { label: '🍗 Fried Chicken', cmd: 'show chicken' },
              { label: '🍱 Combos', cmd: 'show combos' },
              { label: '🍰 Desserts', cmd: 'show desserts' },
              { label: '🌱 Pure Veg', cmd: 'pure veg' }
            ].map(item => (
              <button
                key={item.cmd}
                onClick={() => handleVoiceCommand(item.cmd)}
                className="text-[10px] font-bold bg-dark-800 hover:bg-brand-500 hover:text-white text-gray-300 px-2 py-1 rounded-lg shrink-0 transition-all border border-dark-700 hover:border-brand-400 active:scale-95"
              >
                {item.label}
              </button>
            ))}

            {activeTab === 'cart' && [
              { label: '🛒 Open Cart', cmd: 'open cart' },
              { label: '➕ More Qty', cmd: 'increase quantity' },
              { label: '➖ Less Qty', cmd: 'decrease quantity' },
              { label: '🎟️ Coupon 20%', cmd: 'apply coupon' },
              { label: '💳 Checkout', cmd: 'checkout' },
              { label: '💵 COD Payment', cmd: 'cash on delivery' },
              { label: '🚀 Place Order', cmd: 'place order' },
              { label: '🗑️ Clear Cart', cmd: 'clear cart' }
            ].map(item => (
              <button
                key={item.cmd}
                onClick={() => handleVoiceCommand(item.cmd)}
                className="text-[10px] font-bold bg-dark-800 hover:bg-brand-500 hover:text-white text-gray-300 px-2 py-1 rounded-lg shrink-0 transition-all border border-dark-700 hover:border-brand-400 active:scale-95"
              >
                {item.label}
              </button>
            ))}

            {activeTab === 'auth' && [
              { label: '🍔 Demo Customer', cmd: 'sign in as customer' },
              { label: '👑 Demo Admin', cmd: 'sign in as admin' },
              { label: '🔑 Sign In', cmd: 'login' },
              { label: '📝 Create Account', cmd: 'create account' },
              { label: '📬 Forgot Password', cmd: 'forgot password' },
              { label: '👤 Profile', cmd: 'profile' },
              { label: '📊 Admin Panel', cmd: 'admin panel' },
              { label: '🚪 Sign Out', cmd: 'logout' }
            ].map(item => (
              <button
                key={item.cmd}
                onClick={() => handleVoiceCommand(item.cmd)}
                className="text-[10px] font-bold bg-dark-800 hover:bg-brand-500 hover:text-white text-gray-300 px-2 py-1 rounded-lg shrink-0 transition-all border border-dark-700 hover:border-brand-400 active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Voice Terminal Input */}
        <form onSubmit={handleManualSubmit} className="relative flex items-center">
          <input
            type="text"
            value={manualCommand}
            onChange={(e) => setManualCommand(e.target.value)}
            placeholder="Speak or type (e.g. show pizza, checkout, place order)..."
            className="w-full bg-dark-950 border border-dark-700 rounded-2xl py-2 pl-3 pr-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 p-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition-colors"
            title="Execute voice command"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>

      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceController;
