'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, X, Send, Bot, User, ChevronDown, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

export default function AIChat() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with translated greeting
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: t('ai.greeting'),
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  }, [language, t]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Fetch products for the AI to "know" about them
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://possimon.onrender.com';
        const response = await fetch(`${API_BASE_URL}/api/wines/wines`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('AI Chat failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  const speakMessage = useCallback((text: string) => {
    if (!isSpeakingEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const langMap: Record<string, string> = {
      th: 'th-TH',
      en: 'en-US',
      fr: 'fr-FR',
      zh: 'zh-CN',
      ja: 'ja-JP',
      es: 'es-ES',
      de: 'de-DE',
      ko: 'ko-KR',
      it: 'it-IT',
      ru: 'ru-RU',
      pt: 'pt-PT',
      vi: 'vi-VN',
      ar: 'ar-SA',
      hi: 'hi-IN',
      id: 'id-ID',
      tr: 'tr-TR',
      nl: 'nl-NL',
      pl: 'pl-PL',
      sv: 'sv-SE',
      da: 'da-DK',
      no: 'nb-NO',
      fi: 'fi-FI',
      ms: 'ms-MY',
      he: 'he-IL',
      el: 'el-GR'
    };

    const targetLang = langMap[language] || 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(language) || v.lang.includes(targetLang));
    
    if (voice) utterance.voice = voice;
    utterance.lang = targetLang;
    utterance.rate = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }, [language, isSpeakingEnabled]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const responseText = generateAIResponse(currentInput, products);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      speakMessage(responseText);
    }, 1000);
  };

  const generateAIResponse = (query: string, productList: Product[]): string => {
    const q = query.toLowerCase();
    
    if (productList.length === 0) {
      return t('ai.error_fetch');
    }

    // Dynamic Keyword detection using translations
    const checkKeyword = (key: string) => {
      const keywords = t(key).split(',');
      return keywords.some(kw => q.includes(kw.trim().toLowerCase()));
    };

    const isCheap = checkKeyword('ai.keyword.cheap');
    const isExpensive = checkKeyword('ai.keyword.expensive');
    const isList = checkKeyword('ai.keyword.list');
    const isRecommend = checkKeyword('ai.keyword.recommend');

    // 1. Cheapest products
    if (isCheap) {
      const sorted = [...productList].sort((a, b) => a.price - b.price);
      const cheapest = sorted[0];
      return t('ai.cheapest_response')
        .replace('{name}', cheapest.name)
        .replace('{price}', cheapest.price.toLocaleString())
        .replace('{stock}', cheapest.stock.toString());
    }

    // 2. Most expensive
    if (isExpensive) {
      const sorted = [...productList].sort((a, b) => b.price - a.price);
      const expensive = sorted[0];
      return t('ai.expensive_response')
        .replace('{name}', expensive.name)
        .replace('{price}', expensive.price.toLocaleString());
    }

    // 3. List products
    if (isList) {
      const top5 = productList.slice(0, 5);
      let response = t('ai.list_response') + '\n';
      top5.forEach((p, i) => {
        response += `${i + 1}. ${p.name} - ฿${p.price.toLocaleString()}\n`;
      });
      if (productList.length > 5) {
        response += t('ai.list_more').replace('{count}', (productList.length - 5).toString());
      }
      return response;
    }

    // 4. Price inquiry for specific product
    const foundProduct = productList.find(p => q.includes(p.name.toLowerCase()));
    if (foundProduct) {
      return t('ai.product_response')
        .replace('{name}', foundProduct.name)
        .replace('{price}', foundProduct.price.toLocaleString());
    }

    // 5. General help / Recommendation
    if (isRecommend) {
      const random = productList[Math.floor(Math.random() * productList.length)];
      return t('ai.recommend_response')
        .replace('{name}', random.name)
        .replace('{price}', random.price.toLocaleString());
    }

    return t('ai.unknown_response');
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    
    const padding = 20;
    const minX = -(window.innerWidth - 80);
    const minY = -(window.innerHeight - 80);
    
    const limitedX = Math.min(Math.max(newX, minX), 0);
    const limitedY = Math.min(Math.max(newY, minY), 0);

    if (Math.abs(limitedX - position.x) > 1 || Math.abs(limitedY - position.y) > 1) {
      hasMovedRef.current = true;
      setPosition({ x: limitedX, y: limitedY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={() => {
          if (!hasMovedRef.current) setIsOpen(!isOpen);
        }}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
          touchAction: 'none'
        }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#8b0000] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 group overflow-hidden border-2 border-white cursor-move select-none ${isDragging ? 'scale-110 shadow-red-900/40 opacity-90' : ''}`}
      >
        {isOpen ? <X size={24} /> : (
          <div className="relative w-full h-full pointer-events-none">
            <img 
              src="/logos/Thebottleclub.jpg" 
              alt="AI" 
              className="w-full h-full object-cover"
            />
            <span className="absolute top-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse z-10"></span>
          </div>
        )}
        
        {/* Tooltip */}
        {!isOpen && !isDragging && (
          <div className="absolute right-16 bg-white text-stone-800 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-wider border border-stone-100">
            {t('ai.tooltip')}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="bg-[#8b0000] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full overflow-hidden border-2 border-white/20">
                <img 
                  src="/logos/Thebottleclub.jpg" 
                  alt="The Bottle Club AI" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">{t('ai.name')}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  <span className="text-[10px] opacity-80 uppercase font-medium">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSpeakingEnabled(!isSpeakingEnabled);
                  if (isSpeakingEnabled) window.speechSynthesis.cancel();
                }}
                className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
                title={isSpeakingEnabled ? "Mute" : "Unmute"}
              >
                {isSpeakingEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
                <ChevronDown size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center ${
                    msg.sender === 'user' ? 'bg-stone-300' : 'bg-white border border-stone-100 shadow-sm'
                  }`}>
                    {msg.sender === 'user' ? <User size={14} /> : (
                      <img 
                        src="/logos/Thebottleclub.jpg" 
                        alt="AI" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#8b0000] text-white rounded-tr-none' 
                      : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                    <div className={`text-[9px] mt-1 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                  <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-2 flex gap-2 overflow-x-auto no-scrollbar bg-white border-t border-stone-100">
            {[
              { label: t('ai.quick_all'), query: 'list' },
              { label: t('ai.quick_cheap'), query: 'cheap' },
              { label: t('ai.quick_recommend'), query: 'recommend' }
            ].map((btn) => (
              <button 
                key={btn.label}
                onClick={() => {
                  setInput(btn.label);
                  // Trigger handleSend via form submission simulation
                  setTimeout(() => {
                    const form = document.getElementById('chat-form') as HTMLFormElement;
                    if (form) {
                       const event = new Event('submit', { cancelable: true, bubbles: true });
                       form.dispatchEvent(event);
                    }
                  }, 10);
                }}
                className="whitespace-nowrap px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-[10px] font-bold transition-colors border border-stone-200"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form id="chat-form" onSubmit={handleSend} className="p-4 bg-white border-t border-stone-200 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('ai.placeholder')}
              className="flex-1 bg-stone-100 border-none rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-[#8b0000] focus:bg-white transition-all outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 bg-[#8b0000] text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-red-800 transition-colors shadow-lg shadow-red-900/20"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
