import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot, User, RefreshCw, Flame, ThumbsUp, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm Chef Nova, your personal Foodova culinary assistant. Looking for our 24 handcrafted burgers, spicy chicken options, or deals under ₹300?",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const promptChips = [
    '🍔 Show all 24 Burgers',
    'Best spicy chicken burgers',
    'Pure veg burgers under ₹250',
    'Monster Double Decker combos',
    'Desserts under ₹150'
  ];

  // Text to speech for Chef Nova
  const speakNova = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  };

  // Toggle voice recognition
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = navigator.language || 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast('Listening to your food question...', { icon: '🎙️' });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      setIsListening(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText = null) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const res = await api.post('/ai/chat', {
        message: textToSend,
        conversationHistory: history
      });

      if (res.data?.success && res.data.response) {
        const reply = res.data.response;
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: reply,
            provider: res.data.provider,
            time: new Date()
          }
        ]);
        speakNova(reply);
      } else {
        throw new Error('Empty AI response');
      }
    } catch (err) {
      const fallbackReply = "I recommend trying our Premium Veg Royale Burger (₹249) or Spicy Fiesta Chicken Burger (₹279)! We have 24 gourmet burgers freshly grilled.";
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: fallbackReply,
          time: new Date()
        }
      ]);
      speakNova(fallbackReply);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden h-[540px]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-brand-500 p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-display font-bold text-sm tracking-tight">Chef Nova AI</h4>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">Voice Enabled</span>
              </div>
              <p className="text-[11px] text-purple-100">Smart Taste Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              title={ttsEnabled ? 'Mute AI voice' : 'Enable AI voice'}
              className={`p-1.5 rounded-xl transition-colors ${ttsEnabled ? 'bg-white/20 text-yellow-300' : 'bg-white/10 text-white/50'}`}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-purple-50/60 border-b border-purple-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {promptChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="text-[11px] font-semibold text-purple-700 bg-white hover:bg-purple-100 px-3 py-1 rounded-full border border-purple-200 shrink-0 transition-colors shadow-xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-cream-50/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                  msg.sender === 'user' 
                    ? 'bg-brand-500 text-white' 
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[78%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-brand-500 text-white rounded-tr-none font-medium'
                    : 'bg-white text-dark-900 border border-purple-50 rounded-tl-none font-normal'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 p-2.5 rounded-2xl w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Chef Nova is crafting recommendations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Mic Button */}
        <div className="p-3 bg-white border-t border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              className={`p-2.5 rounded-2xl transition-all shadow-xs ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse shadow-md' 
                  : 'bg-gray-100 hover:bg-purple-100 text-purple-700'
              }`}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening... speak now' : 'Ask about calories, burgers, combos...'}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-100 text-xs text-dark-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-300 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-gray-600">
            <span>Powered by Gemini AI • Voice enabled</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/menu?category=burgers');
              }}
              className="hover:text-purple-600 font-semibold"
            >
              See all 24 Burgers →
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistant;
