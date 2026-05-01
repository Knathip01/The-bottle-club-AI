'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/wine_banner.png" 
          alt="Wine Cellar" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center text-white">
        <p className="text-primary-300 font-medium tracking-widest uppercase mb-4 opacity-90">
          {t('hero.welcome')}
        </p>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-lg max-w-4xl mx-auto whitespace-pre-line">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          {t('hero.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="#products" 
            className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-none font-medium transition-all hover:-translate-y-1 w-full sm:w-auto"
          >
            {t('hero.cta_all')}
          </Link>
          <Link 
            href="#" 
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-none font-medium transition-all w-full sm:w-auto"
          >
            {t('hero.cta_more')}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex items-center justify-center gap-8 md:gap-16 border-t border-white/20 pt-8 max-w-3xl mx-auto">
          <div className="text-center">
            <strong className="block text-3xl md:text-4xl font-serif font-bold mb-1">500+</strong>
            <span className="text-sm text-stone-300 font-light uppercase tracking-wider">{t('hero.stats.items')}</span>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <strong className="block text-3xl md:text-4xl font-serif font-bold mb-1">50+</strong>
            <span className="text-sm text-stone-300 font-light uppercase tracking-wider">{t('hero.stats.brands')}</span>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <strong className="block text-3xl md:text-4xl font-serif font-bold mb-1">10K+</strong>
            <span className="text-sm text-stone-300 font-light uppercase tracking-wider">{t('hero.stats.customers')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
