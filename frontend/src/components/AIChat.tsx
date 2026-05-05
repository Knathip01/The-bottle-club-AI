'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, ChevronDown, Sparkles } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'สวัสดีค่ะ! ดิฉันคือผู้ช่วย AI ของ The Bottle Club ยินดีที่ได้บริการค่ะ คุณสามารถสอบถามเกี่ยวกับสินค้า ราคา หรือให้แนะนำสินค้าที่คุ้มที่สุดได้เลยค่ะ',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        const response = await fetch(`${API_BASE_URL}/wines`);
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
    }, 1000);
  };

  const generateAIResponse = (query: string, productList: Product[]): string => {
    const q = query.toLowerCase();
    
    if (productList.length === 0) {
      return 'ขออภัยค่ะ ขณะนี้ระบบขัดข้องในการดึงข้อมูลสินค้า กรุณาลองใหม่อีกครั้งภายหลังนะคะ';
    }

    // 1. Cheapest products
    if (q.includes('ถูกสุด') || q.includes('ราคาถูก') || q.includes('cheap')) {
      const sorted = [...productList].sort((a, b) => a.price - b.price);
      const cheapest = sorted[0];
      return `สินค้าที่ราคาถูกที่สุดตอนนี้คือ "${cheapest.name}" ราคาเพียง ฿${cheapest.price.toLocaleString()} ค่ะ มีสินค้าในสต็อก ${cheapest.stock} ชิ้น สนใจรับไปลองสักขวดไหมคะ?`;
    }

    // 2. Most expensive
    if (q.includes('แพงสุด') || q.includes('ดีที่สุด') || q.includes('expensive')) {
      const sorted = [...productList].sort((a, b) => b.price - a.price);
      const expensive = sorted[0];
      return `สินค้าพรีเมียมที่สุดของเราคือ "${expensive.name}" ราคา ฿${expensive.price.toLocaleString()} ค่ะ เป็นสินค้าคุณภาพเยี่ยมที่คอไวน์ไม่ควรพลาดนะคะ`;
    }

    // 3. List products
    if (q.includes('มีอะไรบ้าง') || q.includes('สินค้า') || q.includes('รายการ') || q.includes('list')) {
      const top5 = productList.slice(0, 5);
      let list = 'รายการสินค้าแนะนำของเรามีดังนี้ค่ะ:\n';
      top5.forEach((p, i) => {
        list += `${i + 1}. ${p.name} - ฿${p.price.toLocaleString()}\n`;
      });
      if (productList.length > 5) list += `...และสินค้าอื่นๆ อีก ${productList.length - 5} รายการค่ะ`;
      return list;
    }

    // 4. Price inquiry for specific product
    const foundProduct = productList.find(p => q.includes(p.name.toLowerCase()));
    if (foundProduct) {
      return `"${foundProduct.name}" ราคาอยู่ที่ ฿${foundProduct.price.toLocaleString()} ค่ะ ตอนนี้มีของพร้อมส่งนะคะ`;
    }

    // 5. General help / Recommendation
    if (q.includes('แนะนำ') || q.includes('recommend')) {
      const random = productList[Math.floor(Math.random() * productList.length)];
      return `วันนี้ขอแนะนำ "${random.name}" ค่ะ ราคา ฿${random.price.toLocaleString()} เป็นสินค้าที่ลูกค้าหลายท่านชื่นชอบมากค่ะ`;
    }

    return 'ขออภัยค่ะ ดิฉันอาจจะยังไม่เข้าใจคำถามของคุณ คุณสามารถถามเกี่ยวกับ "สินค้าที่มี", "ราคาสินค้า", หรือ "สินค้าที่ราคาถูกที่สุด" ได้เลยค่ะ';
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#8b0000] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
      >
        {isOpen ? <X size={24} /> : (
          <div className="relative">
            <MessageSquare size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#8b0000] rounded-full animate-pulse"></span>
          </div>
        )}
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-16 bg-white text-stone-800 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-wider border border-stone-100">
            สอบถามน้อง AI ได้ที่นี่!
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#8b0000] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles size={20} className="text-yellow-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">The Bottle Club AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  <span className="text-[10px] opacity-80 uppercase font-medium">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.sender === 'user' ? 'bg-stone-300' : 'bg-[#8b0000]/10 text-[#8b0000]'
                  }`}>
                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
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
              { label: 'สินค้าทั้งหมด', query: 'มีสินค้าอะไรบ้าง' },
              { label: 'ถูกที่สุด', query: 'อันไหนถูกสุด' },
              { label: 'แนะนำสินค้า', query: 'แนะนำสินค้าหน่อย' }
            ].map((btn) => (
              <button 
                key={btn.label}
                onClick={() => {
                  setInput(btn.query);
                  // We'll trigger the send after a tiny timeout to ensure state update or just call handleSend
                }}
                className="whitespace-nowrap px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-[10px] font-bold transition-colors border border-stone-200"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-200 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์ข้อความของคุณ..."
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
