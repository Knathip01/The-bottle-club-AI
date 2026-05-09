'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, ShieldCheck, Sparkles, Cpu, Zap, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { loginWithProvider } from '@/lib/auth-client';

export default function MembersOnlyBarrier() {
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const hasSpoken = useRef(false);
  
  const title = t('members_only.title');
  const desc = t('members_only.desc');
  const loginText = t('auth.login');
  const registerText = t('auth.register');

  const speakGreeting = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const message = t('members_only.greeting');
      const utterance = new SpeechSynthesisUtterance(message);
      
      // Ensure voices are loaded
      const speak = () => {
        const voices = window.speechSynthesis.getVoices();
        
        // Map app language to speech synthesis language codes
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
        const voice = voices.find(v => v.lang.startsWith(language) || v.lang.includes(targetLang));
        
        if (voice) {
          utterance.voice = voice;
        }
        
        utterance.lang = targetLang;
        utterance.rate = 0.95;
        utterance.pitch = 1.05;

        utterance.onstart = () => {
          setIsSpeaking(true);
          hasSpoken.current = true;
        };
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        speak();
      } else {
        window.speechSynthesis.onvoiceschanged = speak;
      }
    }
  }, [language, t]);

  // Effect for Auto-play
  useEffect(() => {
    // 1. Try to speak every 6s to ensure the full message completes
    const interval = setInterval(() => {
      speakGreeting();
    }, 6000);

    // 2. Workaround for browser autoplay block: Listen for first interaction
    const handleFirstInteraction = () => {
      speakGreeting();
      // Remove listeners once interacted
      document.removeEventListener('mousedown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('mousedown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('scroll', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    };
  }, [speakGreeting]);

  return (
    <section className="relative bg-stone-950 px-4 py-20 md:py-32 overflow-hidden" id="products">
      {/* AI Futuristic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#a11a1a]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-transparent to-stone-950"></div>
      </div>

      <div className="container relative mx-auto z-10">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[3rem] border border-white/10 bg-stone-900/40 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          <div className="relative px-6 py-10 text-center text-white md:px-16 md:py-16">
            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="relative">
              {/* Badge & Voice Indicator */}
              <div className="mx-auto mb-8 flex flex-col items-center gap-4">
               
                
                <div 
                  className={`flex items-center gap-3 px-6 py-2.5 rounded-full border transition-all duration-700 ${
                    isSpeaking 
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]' 
                    : 'bg-white/5 border-white/10 text-stone-500'
                  }`}
                >
                  <div className="flex gap-1 items-center h-4">
                    <span className={`w-0.5 bg-current transition-all duration-300 ${isSpeaking ? 'animate-[bounce_0.6s_infinite] h-full' : 'h-1'}`}></span>
                    <span className={`w-0.5 bg-current transition-all duration-300 ${isSpeaking ? 'animate-[bounce_0.8s_infinite] h-3' : 'h-1'}`}></span>
                    <span className={`w-0.5 bg-current transition-all duration-300 ${isSpeaking ? 'animate-[bounce_0.5s_infinite] h-full' : 'h-1'}`}></span>
                    <span className={`w-0.5 bg-current transition-all duration-300 ${isSpeaking ? 'animate-[bounce_0.7s_infinite] h-4' : 'h-1'}`}></span>
                  </div>
                  
                </div>
              </div>

              <div className="mx-auto mb-10 relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-[#a11a1a] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
                <div 
                  onClick={() => { speakGreeting(); }}
                  className={`relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-stone-950 border text-white shadow-2xl transition-all duration-500 cursor-pointer hover:scale-110 active:scale-95 overflow-hidden ${isSpeaking ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.5)]' : 'border-white/10'}`}
                >
                  <Image 
                    src="/logos/Thebottleclub.jpg" 
                    alt="The Bottle Club" 
                    fill
                    className={`object-cover transition-opacity duration-500 ${isSpeaking ? 'opacity-80' : 'opacity-100'}`}
                  />
                  <div className={`absolute -top-1 -right-1 h-4 w-4 rounded-full animate-ping z-10 ${isSpeaking ? 'bg-blue-500' : 'bg-[#a11a1a]'}`}></div>
                </div>
                <p className="mt-4 text-[9px] font-bold text-stone-600 uppercase tracking-widest">{t('ai.name')} Voice</p>
              </div>

              <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight md:text-6xl bg-gradient-to-b from-white via-white to-stone-500 bg-clip-text text-transparent">
                {title}
              </h2>
              
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-400 md:text-xl font-medium">
                {desc}
              </p>

              <div className="mx-auto mt-12 flex w-full max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
                <Link 
                  href="/login" 
                  className="group relative flex min-h-14 w-full flex-1 items-center justify-center overflow-hidden rounded-2xl bg-white px-8 py-4 text-center text-sm font-black text-stone-950 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-500/10 to-blue-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {loginText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/register" 
                  className="flex min-h-14 w-full flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-center text-sm font-black text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
                >
                  {registerText}
                </Link>
              </div>

              <div className="relative mx-auto my-10 flex w-full max-w-md items-center justify-center">
                <div className="border-t border-white/5 w-full absolute"></div>
                <span className="relative z-10 bg-stone-900/80 px-6 py-1 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">
                  {t('members_only.or_connect')}
                </span>
              </div>

              <div className="mx-auto grid max-w-md grid-cols-1 gap-4 sm:grid-cols-2">
                {/* LINE - Futuristic style */}
                <button 
                  onClick={() => loginWithProvider('line')}
                  className="group relative flex min-h-14 items-center justify-center overflow-hidden rounded-2xl border border-[#06C755]/20 bg-[#06C755]/5 p-4 text-[#06C755] transition-all duration-500 hover:bg-[#06C755] hover:text-white hover:shadow-[0_0_30px_rgba(6,199,85,0.3)] active:scale-[0.96]"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="w-7 h-7 bg-[#06C755] text-white flex items-center justify-center rounded-xl font-black text-[14px] mr-3 shadow-lg group-hover:bg-white group-hover:text-[#06C755] transition-colors duration-300">L</div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] z-10">LINE</span>
                </button>

                {/* Google - Futuristic style */}
                <button 
                  onClick={() => loginWithProvider('google')}
                  className="group relative flex min-h-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-stone-300 transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.96]"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="w-7 h-7 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-500">
                    <svg width="20" height="20" viewBox="0 0 18 18">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                      <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.173.282-1.712V4.956H.957a9.023 9.023 0 000 8.088l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.482 0 2.443 2.017.957 4.956L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] z-10">GOOGLE </span>
                </button>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
