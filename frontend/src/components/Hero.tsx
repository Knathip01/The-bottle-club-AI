'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Clock3, ShieldCheck, Sparkles } from 'lucide-react';

export default function Hero() {
  const { language, t } = useLanguage();

  const copy = {
    welcome: t('hero.welcome'),
    title: t('hero.title'),
    subtitle: t('hero.subtitle'),
    primary: t('hero.cta_all'),
    secondary: t('hero.cta_more'),
  };

  const serviceBadges = [
    { label: t('hero.service.delivery'), icon: Clock3 },
    { label: t('hero.service.curated'), icon: Sparkles },
    { label: t('hero.service.secure'), icon: ShieldCheck },
  ];

  return (
    <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-stone-950 text-white sm:min-h-[760px]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/wine_banner.png"
          alt="The Bottle Club wine selection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,.62),rgba(12,10,9,.38)_42%,rgba(12,10,9,.86))]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-stone-50 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] flex-col justify-end px-4 pb-8 pt-28 sm:min-h-[760px] sm:px-6 sm:pb-14 lg:px-12">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/85 shadow-2xl backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,.85)]" />
            {copy.welcome}
          </div>

          <h1 className="max-w-[12ch] text-5xl font-black leading-[0.95] tracking-normal text-white drop-shadow-2xl sm:text-7xl lg:text-8xl">
            {copy.title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-stone-100 sm:text-xl sm:leading-8">
            {copy.subtitle}
          </p>

          <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
            <Link
              href="#products"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-extrabold text-stone-950 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-stone-100 active:scale-[0.98]"
            >
              {copy.primary}
              <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
            </Link>
            <Link
              href="#wine-categories"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-4 text-sm font-extrabold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/18 active:scale-[0.98]"
            >
              {copy.secondary}
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-3xl">
          {serviceBadges.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm font-semibold text-white/90 backdrop-blur-xl"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-stone-950">
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-3xl border border-white/12 bg-stone-950/30 text-center backdrop-blur-xl sm:max-w-xl">
          <div className="p-4">
            <strong className="block text-2xl font-black sm:text-3xl">500+</strong>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300">
              {t('hero.stats.items')}
            </span>
          </div>
          <div className="border-x border-white/12 p-4">
            <strong className="block text-2xl font-black sm:text-3xl">50+</strong>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300">
              {t('hero.stats.brands')}
            </span>
          </div>
          <div className="p-4">
            <strong className="block text-2xl font-black sm:text-3xl">10K+</strong>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300">
              {t('hero.stats.customers')}
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 right-4 hidden w-[min(34vw,360px)] lg:block">
          <div className="relative aspect-[3/4]">
            <Image
              src="/images/wine_hero.png"
              alt=""
              fill
              sizes="360px"
              className="object-contain drop-shadow-[0_32px_55px_rgba(0,0,0,.55)]"
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 h-px bg-white/10" />
    </section>
  );
}
