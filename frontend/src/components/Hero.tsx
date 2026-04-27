import Link from 'next/link';

export default function Hero() {
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
          ยินดีต้อนรับสู่
        </p>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
          คัดสรรไวน์<br />
          <em className="text-primary-400 not-italic font-light">ระดับพรีเมียม</em><br />
          เพื่อคุณโดยเฉพาะ
        </h1>
        <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          ไวน์นำเข้าคุณภาพเยี่ยมจากทั่วโลก จัดส่งถึงบ้านคุณภายใน 24 ชั่วโมง
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="#products" 
            className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-none font-medium transition-all hover:-translate-y-1 w-full sm:w-auto"
          >
            ดูไวน์ทั้งหมด
          </Link>
          <Link 
            href="#" 
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-none font-medium transition-all w-full sm:w-auto"
          >
            เรียนรู้เพิ่มเติม
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex items-center justify-center gap-8 md:gap-16 border-t border-white/20 pt-8 max-w-3xl mx-auto">
          <div className="text-center">
            <strong className="block text-3xl md:text-4xl font-serif font-bold mb-1">500+</strong>
            <span className="text-sm text-stone-300 font-light uppercase tracking-wider">รายการไวน์</span>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <strong className="block text-3xl md:text-4xl font-serif font-bold mb-1">50+</strong>
            <span className="text-sm text-stone-300 font-light uppercase tracking-wider">แบรนด์ชั้นนำ</span>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <strong className="block text-3xl md:text-4xl font-serif font-bold mb-1">10K+</strong>
            <span className="text-sm text-stone-300 font-light uppercase tracking-wider">ลูกค้าพึงพอใจ</span>
          </div>
        </div>
      </div>
    </section>
  );
}
