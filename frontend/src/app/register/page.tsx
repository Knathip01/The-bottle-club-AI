import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col bg-stone-50">
      <MainHeader />
      
      <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-2xl mb-4 text-xs text-stone-500 uppercase tracking-widest">
          HOME / สมัครสมาชิก
        </div>
        <RegisterForm />
      </div>

      <Footer />
    </main>
  );
}
