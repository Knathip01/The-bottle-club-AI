import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth-utils';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { Edit2, Plus, FileText } from 'lucide-react';

export default function AccountPage() {
  return (
    <main className="min-h-screen flex flex-col bg-stone-50">
      <MainHeader />

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-8">
          HOME / MY ACCOUNT
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <AccountPageContent />
        </div>
      </div>

      <Footer />
    </main>
  );
}

async function AccountPageContent() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const { user } = session;

  return (
    <>
      <AccountSidebar user={user} />

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-xl font-bold mb-8">บัญชีผู้ใช้</h1>

        {/* Section: Account Info */}
        <div className="bg-white border border-stone-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-wider">ข้อมูลส่วนตัว</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-bold text-stone-900 mb-4 uppercase">ข้อมูลส่วนตัว</h4>
              <p className="text-xs text-stone-600 mb-1">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-stone-600 mb-6">{user.email}</p>
              
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-[10px] font-bold uppercase hover:bg-stone-50 transition-colors">
                  <Edit2 size={12} /> แก้ไข
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-[10px] font-bold uppercase hover:bg-stone-50 transition-colors">
                  เปลี่ยนรหัสผ่าน
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-900 mb-4 uppercase">จดหมายข่าว</h4>
              <p className="text-xs text-stone-600 mb-4">คุณยังไม่ได้สมัครรับจดหมายข่าวของเรา</p>
              
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 border-stone-300 rounded focus:ring-0 accent-stone-900" />
                <span className="text-xs text-stone-500 group-hover:text-stone-900 transition-colors">สมัครสมาชิกจดหมายข่าว</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section: Address Book */}
        <div className="bg-white border border-stone-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-wider">สมุดที่อยู่ <Link href="/account/addresses" className="text-[10px] text-stone-400 ml-2 font-normal hover:underline cursor-pointer">จัดการที่อยู่</Link></h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-bold text-stone-900 mb-4 uppercase tracking-wide">ที่อยู่สำหรับออกใบเสร็จ / ใบกำกับภาษี</h4>
              <p className="text-xs text-stone-400 mb-6 italic">คุณยังไม่มีข้อมูลที่อยู่สำหรับออกใบเสร็จ</p>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-[10px] font-bold uppercase hover:bg-stone-50 transition-colors">
                <Edit2 size={12} /> แก้ไขที่อยู่
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-900 mb-4 uppercase tracking-wide">ที่อยู่จัดส่งเริ่มต้น</h4>
              <p className="text-xs text-stone-400 mb-6 italic">คุณยังไม่ได้เลือกที่อยู่จัดส่งหลัก</p>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-[10px] font-bold uppercase hover:bg-stone-50 transition-colors">
                <Edit2 size={12} /> แก้ไขที่อยู่
              </button>
            </div>
          </div>
        </div>

        {/* Section: Document Registration */}
        <div className="bg-white border border-stone-200 p-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-wider">เอกสารการลงทะเบียน</h3>
          </div>
          
          <div className="bg-[#f9f9f9] p-6 border border-stone-100">
            <h4 className="text-xs font-bold text-stone-900 mb-6">เอกสารดังต่อไปนี้ :</h4>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="bg-stone-200 p-1.5 rounded-full"><FileText size={14} className="text-stone-600" /></div>
                <span className="text-xs text-stone-600 font-medium">ใบอนุญาตจำหน่ายสุรา ประเภท 1 และ/หรือ 2 (รายปี)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-stone-200 p-1.5 rounded-full"><FileText size={14} className="text-stone-600" /></div>
                <span className="text-xs text-stone-600 font-medium">หนังสือรับรองบริษัท / ห้างหุ้นส่วนจำกัด (หจก.) / สำเนาบัตรประชาชน (บุคคลธรรมดา)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-stone-200 p-1.5 rounded-full"><FileText size={14} className="text-stone-600" /></div>
                <span className="text-xs text-stone-600 font-medium">ใบจดทะเบียนภาษีมูลค่าเพิ่ม (ภพ.20) (ถ้ามี)</span>
              </li>
            </ul>

            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="ไม่ได้เลือกไฟล์ใด" 
                  className="flex-1 border border-stone-300 px-4 py-2 text-xs bg-white focus:outline-none"
                  readOnly 
                />
                <button className="bg-stone-200 hover:bg-stone-300 px-6 py-2 text-xs font-bold transition-colors">
                  เลือกไฟล์
                </button>
              </div>
              
              <button className="w-fit flex items-center gap-2 border-2 border-stone-900 px-6 py-3 text-xs font-bold uppercase hover:bg-stone-900 hover:text-white transition-all">
                <Plus size={16} /> เลือกไฟล์อื่นเพิ่มเติม
              </button>
            </div>
            
            <p className="text-[10px] text-stone-400 mt-4 leading-relaxed">
              คุณต้องอัปโหลดไฟล์หนังสือรับรองบริษัท / ห้างหุ้นส่วนจำกัด (หจก.) / สำเนาบัตรประชาชน (บุคคลธรรมดา) 
              ใบอนุญาตจำหน่ายสุรา ประเภท 1 และ/หรือ 2 (รายปี) และใบจดทะเบียนภาษีมูลค่าเพิ่ม
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
