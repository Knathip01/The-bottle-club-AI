import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col bg-stone-100">
      <MainHeader />
      
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md mb-4 text-xs text-stone-500 uppercase tracking-widest text-center md:text-left">
          HOME / เข้าสู่ระบบ
        </div>
        <LoginForm />
      </div>

      <Footer />
    </main>
  );
}
